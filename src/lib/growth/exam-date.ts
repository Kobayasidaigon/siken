/**
 * 利用者が決めた「自分の試験日」。2026-09-13 追加(方針: docs/direction-2026-09.md §5-2)。
 *
 * 再訪の起点。exam-dates.ts が持つのは「公式の次回日程」で、こちらは
 * 「この人がどの回を受けるか」。試験日が決まると、残り日数・今日の3問・
 * Studio のリマインド(メール／プッシュ)の案内が出る。
 *
 * 保存先は端末内(localStorage)。個人情報ではないが、学習履歴と同じく
 * 端末の外へは送らない。Studio へは、利用者がリマインド登録のリンクを
 * 自分で踏んだときだけ、URL の引数として渡す。
 */

import type { ExamSlug } from "@/lib/study-progress";
import { EXAM_LIST } from "@/lib/study-progress";

const KEY = "shikakumon-exam-date-v1";

export type ExamDateSource = "schedule" | "custom";

export interface ExamDateEntry {
  /** YYYY-MM-DD(JST の暦日) */
  ymd: string;
  /** 公式日程のワンタップか、自分で入れた日付か */
  source: ExamDateSource;
  /** 回次の呼び名(公式日程から入れたときだけ)。例「第57回(2・3級)」 */
  label?: string;
  setAt: number;
}

type Store = Partial<Record<ExamSlug, ExamDateEntry>>;

const EXAM_SLUGS = new Set<string>(EXAM_LIST.map((e) => e.slug));
const YMD = /^\d{4}-\d{2}-\d{2}$/;

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
      const e = v as Partial<ExamDateEntry>;
      if (typeof e.ymd !== "string" || !YMD.test(e.ymd)) continue;
      out[k as ExamSlug] = {
        ymd: e.ymd,
        source: e.source === "schedule" ? "schedule" : "custom",
        label: typeof e.label === "string" ? e.label.slice(0, 40) : undefined,
        setAt: typeof e.setAt === "number" ? e.setAt : 0,
      };
    }
    return out;
  } catch {
    return {};
  }
}

function save(store: Store): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
    window.dispatchEvent(new Event("shikakumon-exam-date-update"));
    return true;
  } catch {
    return false;
  }
}

/** JST の今日を YYYY-MM-DD で */
export function todayYmdJst(now: Date = new Date()): string {
  return now.toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

/** YYYY-MM-DD までの残り日数(当日=0、過去は負) */
export function daysUntil(ymd: string, now: Date = new Date()): number {
  const target = Date.parse(`${ymd}T00:00:00+09:00`);
  const today = Date.parse(`${todayYmdJst(now)}T00:00:00+09:00`);
  return Math.round((target - today) / 86400000);
}

export function getExamDate(exam: ExamSlug): ExamDateEntry | null {
  return load()[exam] ?? null;
}

/** 過去の日付になった記録は「終わった試験」として扱い、返さない */
export function getUpcomingExamDate(exam: ExamSlug, now: Date = new Date()): ExamDateEntry | null {
  const e = getExamDate(exam);
  if (!e) return null;
  return daysUntil(e.ymd, now) >= 0 ? e : null;
}

/** 設定済みの資格を、試験日が近い順に返す(過ぎたものは除く) */
export function listUpcomingExamDates(now: Date = new Date()): { exam: ExamSlug; entry: ExamDateEntry }[] {
  const store = load();
  return (Object.keys(store) as ExamSlug[])
    .map((exam) => ({ exam, entry: store[exam]! }))
    .filter(({ entry }) => daysUntil(entry.ymd, now) >= 0)
    .sort((a, b) => a.entry.ymd.localeCompare(b.entry.ymd));
}

export function setExamDate(
  exam: ExamSlug,
  ymd: string,
  source: ExamDateSource,
  label?: string
): ExamDateEntry | null {
  if (!YMD.test(ymd)) return null;
  const store = load();
  const entry: ExamDateEntry = { ymd, source, label, setAt: Date.now() };
  store[exam] = entry;
  return save(store) ? entry : null;
}

export function clearExamDate(exam: ExamSlug): void {
  const store = load();
  if (!store[exam]) return;
  delete store[exam];
  save(store);
}

/**
 * 「いま優先している資格」。試験日を設定した資格のうち直近のもの。
 * 無ければ null(呼び出し側は学習履歴の多い資格などに落とす)。
 */
export function primaryExam(now: Date = new Date()): ExamSlug | null {
  return listUpcomingExamDates(now)[0]?.exam ?? null;
}
