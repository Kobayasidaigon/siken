/**
 * 「今日の3問」。2026-09-13 追加(方針: docs/direction-2026-09.md §5-2)。
 *
 * 再訪の理由を毎日ひとつ作る。量は 3 問に固定する。通勤の1駅・昼休みの数分で
 * 終わる量で、「今日はやらなかった」を作りにくい。
 *
 * 出題は復習ドリル(lib/review-drill.ts)と同じ順序 — 銅(前回間違えた)→銀(あと1回で金)
 * →未挑戦 — で、同じ仕組み(DrillState, kind="daily")で問題ページを続けて開く。
 * 専用の演習画面は作らない(理由は review-drill.ts の設計コメントと同じ)。
 *
 * その日の3問は端末内に保存し、日付が変わるまで固定する。リロードや別ページ経由で
 * 戻ってきても同じ3問が出る。解き終えたら doneAt を立て、その日は「完了」を出す。
 * 連続日数のバッジや段位は作らない(docs/affiliate-growth-audit.md §5.2 の
 * 「やらないほうがよいこと」)。出すのは今日の分と、試験日までの残り日数だけ。
 *
 * プッシュ通知・メールでの毎朝の配信は Studio 側(利用者が登録した人だけ)。
 * ここは登録なしで動く端末内の版で、Studio のリマインドは「その日のこの面へ戻す」役。
 */

import type { ExamProgress, ExamSlug } from "@/lib/study-progress";
import { EXAM_LIST } from "@/lib/study-progress";
import { buildDrillQueue, drillCandidates, startDrill, type DrillState } from "@/lib/review-drill";
import { todayYmdJst } from "./exam-date";

const KEY = "shikakumon-daily-v1";

export const DAILY_SIZE = 3;

export interface DailyState {
  /** JST の日付 YYYY-MM-DD */
  dateKey: string;
  exam: ExamSlug;
  slugs: string[];
  /** 解き終えた時刻。未完了なら無し */
  doneAt?: number;
}

const EXAM_SLUGS = new Set<string>(EXAM_LIST.map((e) => e.slug));

function load(): DailyState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Partial<DailyState>;
    if (!s || typeof s.dateKey !== "string" || typeof s.exam !== "string" || !Array.isArray(s.slugs)) return null;
    if (!EXAM_SLUGS.has(s.exam)) return null;
    return {
      dateKey: s.dateKey,
      exam: s.exam as ExamSlug,
      slugs: s.slugs.filter((x): x is string => typeof x === "string"),
      doneAt: typeof s.doneAt === "number" ? s.doneAt : undefined,
    };
  } catch {
    return null;
  }
}

function save(s: DailyState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    window.dispatchEvent(new Event("shikakumon-daily-update"));
  } catch {
    /* 保存できなくても、この回の3問は動かせる */
  }
}

/** 今日の分(この資格)。日付か資格が違えば null */
export function loadDaily(exam: ExamSlug, now: Date = new Date()): DailyState | null {
  const s = load();
  if (!s || s.exam !== exam || s.dateKey !== todayYmdJst(now)) return null;
  return s;
}

/**
 * 今日の3問を用意する。すでに今日の分があればそれを返す(解き終えていても返す)。
 * 母集団が 3 問に満たない(=全問金)なら null。
 */
export function ensureDaily(
  exam: ExamSlug,
  progress: ExamProgress,
  allSlugs: string[],
  now: Date = new Date()
): DailyState | null {
  const cur = loadDaily(exam, now);
  if (cur && cur.slugs.length > 0) return cur;
  const c = drillCandidates(progress, allSlugs);
  const queue = buildDrillQueue(c, DAILY_SIZE);
  if (queue.length === 0) return null;
  const state: DailyState = { dateKey: todayYmdJst(now), exam, slugs: queue };
  save(state);
  return state;
}

export function markDailyDone(exam: ExamSlug, now: Date = new Date()): void {
  const s = loadDaily(exam, now);
  if (!s || s.doneAt) return;
  save({ ...s, doneAt: Date.now() });
}

/** 今日の3問を、ドリルの仕組み(kind="daily")で開始する。戻り値は最初の問題の DrillState */
export function startDaily(state: DailyState): DrillState | null {
  return startDrill(state.exam, state.slugs, "daily");
}
