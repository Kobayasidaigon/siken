/**
 * 「試験前の10問」。2026-10-25 追加(設計は docs/share-campaign-design.md の MVP)。
 *
 * 試験の7日前から試験日まで、その回を受ける人全員に同じ10問を出す。記録はブラウザごとに1回目だけ。
 * 結果は答えを明かさない○×の並びで X・LINE に送れ、送られた人は登録なしで同じ10問に挑める。
 * サーバーには何も保存しない。順位・見返りは付けない(docs/affiliate-growth-audit.md §5.2 の方針)。
 *
 * - イベントの一覧は src/data/shikenmae/events.json、10問のセットは src/data/shikenmae/<資格>-<YYYYMMDD>.json。
 *   セットは scripts/make-shikenmae-set.mjs で候補を出し、運営が読んで確定する。公開後は変えない。
 * - 窓の判定は日本時間。ページはビルド時に作るので、受験画面ではブラウザで判定する。
 *   入口(資格トップ・コラム)はサーバーで判定する(ISR で1時間ごとに作り直すので、ずれは最大1時間)。
 * - このファイルはクライアントからも読むので、fs を使わない。問題の読み込みは lib/shikenmae-data.ts。
 */
import EVENTS from "@/data/shikenmae/events.json";
import type { ExamSlug } from "./study-progress";
import { SHARE_HASHTAGS } from "./share-hashtags";

export const SHIKENMAE_SIZE = 10;
/** 窓は試験日の何日前から開くか(試験日を含めて8日間) */
export const SHIKENMAE_WINDOW_DAYS = 7;

export interface ShikenmaeEvent {
  exam: ExamSlug;
  examName: string;
  /** 試験日 "YYYY-MM-DD" */
  date: string;
  /** 結果画面で案内する、次の試験前の10問 */
  next?: { exam: ExamSlug; date: string };
}

export const SHIKENMAE_EVENTS = EVENTS as ShikenmaeEvent[];

export type ShikenmaePhase = "before" | "open" | "closed";

/** "2026-11-15" → "20261115"(URL に使う) */
export function dateKey(date: string): string {
  return date.replace(/-/g, "");
}

export function findShikenmae(exam: string, key: string): ShikenmaeEvent | null {
  return SHIKENMAE_EVENTS.find((e) => e.exam === exam && dateKey(e.date) === key) ?? null;
}

export function shikenmaePath(e: ShikenmaeEvent, score?: number): string {
  return `/shikenmae/${e.exam}/${dateKey(e.date)}/${score != null ? `${score}/` : ""}`;
}

/** 日本時間の今日 "YYYY-MM-DD" */
export function todayJst(nowMs: number = Date.now()): string {
  return new Date(nowMs + 9 * 3600_000).toISOString().slice(0, 10);
}

function addDays(ymd: string, days: number): string {
  const d = new Date(`${ymd}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 窓の初日 "YYYY-MM-DD" */
export function windowStart(e: ShikenmaeEvent): string {
  return addDays(e.date, -SHIKENMAE_WINDOW_DAYS);
}

export function shikenmaePhase(e: ShikenmaeEvent, nowMs: number = Date.now()): ShikenmaePhase {
  const today = todayJst(nowMs);
  if (today < windowStart(e)) return "before";
  if (today <= e.date) return "open";
  return "closed";
}

/** いま窓が開いているこの資格のイベント。無ければ null */
export function openShikenmaeFor(exam: string | undefined, nowMs: number = Date.now()): ShikenmaeEvent | null {
  if (!exam) return null;
  return SHIKENMAE_EVENTS.find((e) => e.exam === exam && shikenmaePhase(e, nowMs) === "open") ?? null;
}

/** 試験日まであと何日か(当日は0) */
export function daysToExam(e: ShikenmaeEvent, nowMs: number = Date.now()): number {
  const a = Date.parse(`${todayJst(nowMs)}T00:00:00Z`);
  const b = Date.parse(`${e.date}T00:00:00Z`);
  return Math.round((b - a) / 86400000);
}

const WEEK = ["日", "月", "火", "水", "木", "金", "土"];

/** "2026-11-15" → "11月15日（日）" */
export function mdJa(ymd: string): string {
  const d = new Date(`${ymd}T00:00:00Z`);
  return `${d.getUTCMonth() + 1}月${d.getUTCDate()}日（${WEEK[d.getUTCDay()]}）`;
}

/** "2026-11-15" → "11/15" */
export function mdSlash(ymd: string): string {
  const d = new Date(`${ymd}T00:00:00Z`);
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
}

/** 正誤の並び。5問ごとに空白を入れる(例 "○○×○○ ○○○×○") */
export function bitsText(bits: string): string {
  const marks = [...bits].map((b) => (b === "1" ? "○" : "×")).join("");
  return `${marks.slice(0, 5)} ${marks.slice(5)}`.trim();
}

export type ShareChannel = "x" | "line" | "share" | "copy";

const SITE = "https://shikakumon.com";

function shareUrl(e: ShikenmaeEvent, channel: ShareChannel, score: number | null): string {
  const base = `${SITE}${shikenmaePath(e, score ?? undefined)}`;
  const q = channel === "x" ? "utm_source=x&utm_medium=social&utm_campaign=shikenmae" : `utm_source=${channel}&utm_campaign=shikenmae`;
  return `${base}?${q}`;
}

/**
 * 送る文面。設計書の「文面」のとおり。点を載せないときは、点の無い文面と点の無いリンクにする。
 * 判定の言葉・「無料」「おすすめ」「予想」「的中」・絵文字・問題文・正解・分野名は入れない。
 */
export function shareText(
  e: ShikenmaeEvent,
  channel: ShareChannel,
  result: { score: number; bits: string } | null,
  nowMs: number = Date.now(),
): string {
  const url = shareUrl(e, channel, result ? result.score : null);
  const days = daysToExam(e, nowMs);
  const when = days > 0 ? `${mdSlash(e.date)} 試験まであと${days}日` : days === 0 ? `${mdSlash(e.date)} 試験当日` : `${mdSlash(e.date)} 試験`;
  if (channel === "x") {
    const lines = result
      ? [
          "", // 1行目は本人のひと言用に空けておく
          `${e.examName} 試験前の10問（${when}）`,
          `10問中${result.score}問${result.score === SHIKENMAE_SIZE ? "（全問正解）" : ""}`,
          bitsText(result.bits),
          "同じ10問を解けます（登録不要）",
        ]
      : ["", `${e.examName} 試験前の10問を解きました（${mdSlash(e.date)} 試験）`, "同じ10問を解けます（登録不要）"];
    if (SHARE_HASHTAGS[e.exam]) lines.push(SHARE_HASHTAGS[e.exam]);
    lines.push(url);
    return lines.join("\n");
  }
  return result
    ? `${e.examName}の試験前の10問、10問中${result.score}問でした。同じ10問を解けます（登録不要）\n${url}`
    : `${e.examName}の試験前の10問を解きました。同じ10問を解けます（登録不要）\n${url}`;
}

/** 端末内の記録(1回目だけ)。キーは "<資格>/<YYYYMMDD>" */
export const SHIKENMAE_STORAGE_KEY = "shikakumon-shikenmae-v1";

export interface ShikenmaeRecord {
  bits: string;
  score: number;
  at: number;
}

export function loadShikenmaeRecord(e: ShikenmaeEvent): ShikenmaeRecord | null {
  try {
    const all = JSON.parse(localStorage.getItem(SHIKENMAE_STORAGE_KEY) || "{}");
    const r = all[`${e.exam}/${dateKey(e.date)}`];
    if (r && typeof r.bits === "string" && typeof r.score === "number") return r;
  } catch {
    /* 読めなければ記録なし */
  }
  return null;
}

export function saveShikenmaeRecord(e: ShikenmaeEvent, r: ShikenmaeRecord): void {
  try {
    const all = JSON.parse(localStorage.getItem(SHIKENMAE_STORAGE_KEY) || "{}");
    all[`${e.exam}/${dateKey(e.date)}`] = r;
    localStorage.setItem(SHIKENMAE_STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* 保存できなくても結果は画面に出る */
  }
}

/** 学習履歴の削除(lib/clear-learning-data.ts)から呼ぶ。資格を指定すればその資格の分だけ */
export function clearShikenmaeRecords(exam?: ExamSlug): void {
  try {
    if (!exam) {
      localStorage.removeItem(SHIKENMAE_STORAGE_KEY);
      return;
    }
    const all = JSON.parse(localStorage.getItem(SHIKENMAE_STORAGE_KEY) || "{}");
    for (const k of Object.keys(all)) if (k.startsWith(`${exam}/`)) delete all[k];
    localStorage.setItem(SHIKENMAE_STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* 消せなくても学習履歴の本体は消えている */
  }
}
