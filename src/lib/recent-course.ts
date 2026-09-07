/**
 * 「前回チェックした講座」の記録(端末内 localStorage・個人情報なし)。2026-09-05 追加。
 *
 * 背景: A8 の成果は「記事を読んで即決」ではなく、18〜47日後に戻ってきて申し込む人が
 * 出している(実測)。一方で Safari の ITP は A8 のクッキーを最長7日で消すため、
 * Safari 経由の長期成果はほぼ計上されない。メディア側でクッキーの寿命は延ばせないので、
 * 「戻ってきた人にもう一度リンクを踏んでもらい、クッキーを張り直す」のがこちらでできる対策。
 *
 * AffiliateLink のクリック時に資格と種類(無料/有料/申込/書籍)を記録し、再訪時に
 * トップ・学習履歴・その資格のトップで RecentCourseReminder が1行だけ静かに出す。
 * 60日で自然消滅。「非表示」を押した資格は30日出さない。
 */

import { EXAM_LIST, type ExamSlug } from "./study-progress";

const KEY = "shikakumon-recent-course-v1";
const TTL_MS = 60 * 24 * 60 * 60 * 1000;
const DISMISS_MS = 30 * 24 * 60 * 60 * 1000;

export type RecentKind = "free" | "paid" | "apply" | "book";

export interface RecentCourse {
  exam: ExamSlug;
  kind: RecentKind;
  ts: number;
  dismissedUntil?: number;
}

type Store = Partial<Record<ExamSlug, RecentCourse>>;

const EXAM_SLUGS = new Set<string>(EXAM_LIST.map((e) => e.slug));

function isExamSlug(s: string): s is ExamSlug {
  return EXAM_SLUGS.has(s);
}

function load(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Store;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function save(store: Store): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* quota 超過やプライベートモードでは黙って諦める */
  }
}

/** placement の接尾辞から種類を判定(FreeLeadCTA は "_free"、協会申込は "_apply"、書籍は "_book") */
export function kindFromPlacement(placement: string): RecentKind {
  if (placement.endsWith("_free") || placement.endsWith("_lead")) return "free";
  if (placement.endsWith("_apply")) return "apply";
  if (placement.endsWith("_book")) return "book";
  return "paid";
}

/**
 * アフィリリンクのクリックを記録する。course が資格IDでないもの(agaroot-takken 等の
 * 隣接オファー)は対象外。既存の記録は上書き(最後に見た種類を覚える)。非表示指定は引き継ぐ。
 */
export function recordCourseClick(course: string, placement: string): void {
  if (!isExamSlug(course)) return;
  const store = load();
  const prev = store[course];
  store[course] = {
    exam: course,
    kind: kindFromPlacement(placement),
    ts: Date.now(),
    dismissedUntil: prev?.dismissedUntil,
  };
  save(store);
}

/** 期限内かつ非表示中でない記録を新しい順に返す */
export function loadRecentCourses(now: number = Date.now()): RecentCourse[] {
  const store = load();
  return Object.values(store)
    .filter((r): r is RecentCourse => Boolean(r) && isExamSlug(r!.exam))
    .filter((r) => now - r.ts < TTL_MS)
    .filter((r) => !r.dismissedUntil || r.dismissedUntil < now)
    .sort((a, b) => b.ts - a.ts);
}

/** その資格のリマインドを30日間出さない */
export function dismissRecentCourse(exam: ExamSlug): void {
  const store = load();
  const prev = store[exam];
  if (!prev) return;
  store[exam] = { ...prev, dismissedUntil: Date.now() + DISMISS_MS };
  save(store);
}
