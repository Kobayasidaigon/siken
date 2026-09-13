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
 * その日の3問は資格ごとに端末内へ保存し、日付が変わるまで固定する。リロードや
 * 別ページ経由で戻ってきても同じ3問が出る。解き終えたら doneAt を立て、その日は
 * 「完了」を出す。資格ごとに持つのは、複数の資格を並行して解いている人が別の資格の
 * トップを開いただけで、解き終えた記録が消えないようにするため(2026-09-13 レビュー)。
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

/** v1 は資格1つぶんの単一スロットだった。v2 で資格ごとの表にした */
const KEY = "shikakumon-daily-v2";

export const DAILY_SIZE = 3;

export interface DailyState {
  /** JST の日付 YYYY-MM-DD */
  dateKey: string;
  exam: ExamSlug;
  slugs: string[];
  /** 解き終えた時刻。未完了なら無し */
  doneAt?: number;
}

type Store = Partial<Record<ExamSlug, DailyState>>;

const EXAM_SLUGS = new Set<string>(EXAM_LIST.map((e) => e.slug));

function load(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Store;
    if (!parsed || typeof parsed !== "object") return {};
    const out: Store = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (!EXAM_SLUGS.has(k) || !v || typeof v !== "object") continue;
      const s = v as Partial<DailyState>;
      if (typeof s.dateKey !== "string" || !Array.isArray(s.slugs)) continue;
      out[k as ExamSlug] = {
        dateKey: s.dateKey,
        exam: k as ExamSlug,
        slugs: s.slugs.filter((x): x is string => typeof x === "string"),
        doneAt: typeof s.doneAt === "number" ? s.doneAt : undefined,
      };
    }
    return out;
  } catch {
    return {};
  }
}

function save(store: Store, today: string): void {
  if (typeof window === "undefined") return;
  try {
    // 過ぎた日の分は持ち越さない(表が資格の数だけ増えても、古い日付は捨てる)
    const pruned: Store = {};
    for (const [k, v] of Object.entries(store)) {
      if (v && v.dateKey === today) pruned[k as ExamSlug] = v;
    }
    localStorage.setItem(KEY, JSON.stringify(pruned));
    window.dispatchEvent(new Event("shikakumon-daily-update"));
  } catch {
    /* 保存できなくても、この回の3問は動かせる */
  }
}

/** 今日の分(この資格)。日付が違えば null */
export function loadDaily(exam: ExamSlug, now: Date = new Date()): DailyState | null {
  const s = load()[exam];
  if (!s || s.dateKey !== todayYmdJst(now) || s.slugs.length === 0) return null;
  return s;
}

/**
 * 今日の3問を用意する。すでに今日の分があればそれを返す(解き終えていても返す)。
 * 母集団が空(=全問金)なら null。
 */
export function ensureDaily(
  exam: ExamSlug,
  progress: ExamProgress,
  allSlugs: string[],
  now: Date = new Date()
): DailyState | null {
  const cur = loadDaily(exam, now);
  if (cur) return cur;
  const c = drillCandidates(progress, allSlugs);
  const queue = buildDrillQueue(c, DAILY_SIZE);
  if (queue.length === 0) return null;
  const today = todayYmdJst(now);
  const state: DailyState = { dateKey: today, exam, slugs: queue };
  const store = load();
  store[exam] = state;
  save(store, today);
  return state;
}

export function markDailyDone(exam: ExamSlug, now: Date = new Date()): void {
  const s = loadDaily(exam, now);
  if (!s || s.doneAt) return;
  const store = load();
  store[exam] = { ...s, doneAt: Date.now() };
  save(store, todayYmdJst(now));
}

/**
 * 進行中のドリルが「今日の3問」そのものか。
 * 問題ページは localStorage のドリル状態(kind="daily")を見て見出しや完了を出すが、
 * 前日の3問を解き終えずに残したドリルが翌日の問題ページで拾われると、
 * 今日の分を解いていないのに「完了」にしてしまう。日付と並びが一致するときだけ本物とみなす。
 */
export function isTodaysDaily(state: DrillState | null, now: Date = new Date()): boolean {
  if (!state || state.kind !== "daily") return false;
  const today = loadDaily(state.exam, now);
  if (!today || today.slugs.length !== state.slugs.length) return false;
  return today.slugs.every((s, i) => s === state.slugs[i]);
}

/** 今日の3問を、ドリルの仕組み(kind="daily")で開始する。戻り値は最初の問題の DrillState */
export function startDaily(state: DailyState): DrillState | null {
  return startDrill(state.exam, state.slugs, "daily");
}
