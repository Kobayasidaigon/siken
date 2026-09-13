/**
 * 回答ログの送信。2026-09-13 追加(方針: docs/direction-2026-09.md §5-3、§7)。
 *
 * 【何を送るか】
 *   qid     共通問題ID `{site}:{cert}:{qid}`。本体は site="main"。例 main:fukushi2:fukushi2-001
 *   correct 正誤
 *   mode    解いた面。question(問題ページ) / mock(本番形式) / moshi(模試) / drill(復習ドリル)
 *           / daily(今日の3問) / column(コラム内の1問)
 *   ts      解いた時刻(epoch ms)
 * 匿名IDは 1 リクエストに 1 つ(anon-id.ts)。氏名・メール・IP・UA は送らない。
 *
 * 【どこへ】
 *   同一オリジンの /api/answer-log/ に sendBeacon で送り、サーバー側が Studio の
 *   取り込みAPIへ転送する(契約は docs/growth-kit.md)。ブラウザから Studio へ直接
 *   送らないのは、CORS と共有鍵を Studio 側に持ち込まないためと、
 *   取り込み先のURLを本体の環境変数だけで切り替えられるようにするため。
 *
 * 【設計】
 *   - 1問ごとに送らず、端末内のキューに積んで 2 秒後・10件・ページ離脱時にまとめて送る。
 *   - 送信は sendBeacon(離脱時にも届く)。無ければ fetch keepalive。
 *   - 失敗しても再送しない。統計用のログで、1件の欠けが体験に影響しないため。
 *     再送キューを localStorage に置くと、その実装の不具合のほうが問題になる。
 *   - 送信は必ず try/catch。学習・採点・遷移を絶対に妨げない(GA と同じ規律)。
 */

import type { ExamSlug } from "@/lib/study-progress";
import { getAnonId, isAnswerLogEnabled } from "./anon-id";

export const ANSWER_LOG_SITE = "main";
export const ANSWER_LOG_ENDPOINT = "/api/answer-log/";
export const ANSWER_LOG_VERSION = 1;

export type AnswerMode = "question" | "mock" | "moshi" | "drill" | "daily" | "column";

export interface AnswerEvent {
  qid: string;
  exam: ExamSlug;
  slug: string;
  correct: boolean;
  mode: AnswerMode;
  ts: number;
}

export interface AnswerLogPayload {
  v: number;
  site: string;
  anon: string;
  sentAt: number;
  events: AnswerEvent[];
}

const FLUSH_DELAY_MS = 2000;
const FLUSH_AT = 10;
/** サーバー側の上限(route.ts の MAX_EVENTS)と同じ */
const MAX_BATCH = 50;

let queue: AnswerEvent[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
let listenersBound = false;

/** 共通問題ID。姉妹サイトも同じ形で送る(site 名だけ違う) */
export function questionId(exam: ExamSlug, slug: string, site = ANSWER_LOG_SITE): string {
  return `${site}:${exam}:${slug}`;
}

function bindListeners(): void {
  if (listenersBound || typeof window === "undefined") return;
  listenersBound = true;
  const onHide = () => {
    if (document.visibilityState === "hidden") flushAnswerLog();
  };
  window.addEventListener("visibilitychange", onHide);
  window.addEventListener("pagehide", () => flushAnswerLog());
}

function send(payload: AnswerLogPayload): void {
  const body = JSON.stringify(payload);
  try {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const ok = navigator.sendBeacon(ANSWER_LOG_ENDPOINT, new Blob([body], { type: "application/json" }));
      if (ok) return;
    }
  } catch {
    /* fetch へ */
  }
  try {
    void fetch(ANSWER_LOG_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    /* 送れなくても学習は妨げない */
  }
}

/** キューにある分をいま送る。離脱時・件数到達・遅延タイマーから呼ばれる */
export function flushAnswerLog(): void {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (queue.length === 0) return;
  const anon = getAnonId();
  if (!anon) {
    queue = [];
    return;
  }
  while (queue.length > 0) {
    const events = queue.splice(0, MAX_BATCH);
    send({ v: ANSWER_LOG_VERSION, site: ANSWER_LOG_SITE, anon, sentAt: Date.now(), events });
  }
}

/**
 * 1問の解答を記録する。答えを見ただけ(選択なし)は呼ばない。
 * 設定で止めている人・GPC・localStorage 不可では何もしない。
 */
export function logAnswer(exam: ExamSlug, slug: string, correct: boolean, mode: AnswerMode): void {
  try {
    if (!isAnswerLogEnabled()) return;
    if (!slug || slug.length > 80) return;
    bindListeners();
    queue.push({ qid: questionId(exam, slug), exam, slug, correct, mode, ts: Date.now() });
    if (queue.length >= FLUSH_AT) {
      flushAnswerLog();
      return;
    }
    if (!timer) timer = setTimeout(flushAnswerLog, FLUSH_DELAY_MS);
  } catch {
    /* 記録できなくても学習は妨げない */
  }
}

/** 複数問をまとめて記録する(本番形式テスト・模試の採点時) */
export function logAnswers(
  exam: ExamSlug,
  results: { slug: string; correct: boolean }[],
  mode: AnswerMode
): void {
  for (const r of results) logAnswer(exam, r.slug, r.correct, mode);
  // 採点直後は結果画面で長く留まるので、遅延させずに送っておく
  try {
    flushAnswerLog();
  } catch {
    /* 同上 */
  }
}
