import { EXAM_LIST, type ExamProgress, type ExamSlug, type Medal } from "./study-progress";

/**
 * 復習ドリル。2026-09-07 追加。
 *
 * メダル制(銅・銀・金)は前からあるのに、「金にする」ための出口が無かった。
 * /study/ は誤答のリンクが並ぶだけで、そこから連続して解き直す手段が無く、
 * 1問解くたびに一覧へ戻る操作が要る。再訪の主動機になりうる仕組みが、
 * 一覧の表示で止まっていた。
 *
 * 設計:
 *   出題順は 銅(前回間違えた) → 銀(あと1回正解で金) → 未挑戦。
 *   Ping-t の「金にする」と同じ順序で、いちばん取り返しやすいものから出す。
 *
 *   問題そのものは既存の問題ページ(/…/q/<slug>/)をそのまま使い、
 *   ここが持つのは「解く順番」だけにした。専用の連続演習UIを作ると、
 *   解説・メダル記録・広告の出し方を二重に持つことになるうえ、
 *   全14資格3,370問の本文をクライアントに送る必要が出る。
 *
 *   現在位置は保存しない。今いる問題の slug が並びの何番目かを毎回引き直す。
 *   戻る操作・リロード・途中で別の問題に飛んでも壊れないのと、
 *   カーソルの保存漏れで進まなくなる事故を作らないため。
 */

const DRILL_KEY = "shikakumon-drill-v1";

/** 1回のドリルの問題数。1駅ぶんの移動で終わる量に収める */
export const DRILL_SIZE = 20;

/** ドリルを作れる最小問題数。これ未満なら誘わない */
export const DRILL_MIN = 5;

export interface DrillState {
  exam: ExamSlug;
  /** 解く順に並んだ問題 slug */
  slugs: string[];
  /** 開始時刻(ms)。古いドリルを黙って捨てるのに使う */
  startedAt: number;
}

/** 開始から この日数 を過ぎたドリルは無かったことにする */
const DRILL_TTL_DAYS = 7;

export interface DrillCandidates {
  bronze: string[];
  silver: string[];
  unseen: string[];
}

/**
 * ドリルの母集団を数える。
 *
 * メダルの意味は study-progress.ts の recordResult のとおり:
 *   銅=前回間違えた / 銀=1回正解した / 金=連続正解でマスター / エントリ無し=未挑戦
 * 金は出さない。金を崩す出題は、マスターしたという表示と矛盾する。
 */
export function drillCandidates(progress: ExamProgress, allSlugs: string[]): DrillCandidates {
  const medals: Record<string, Medal> = progress.medals ?? {};
  const bronze: string[] = [];
  const silver: string[] = [];
  const unseen: string[] = [];
  for (const slug of allSlugs) {
    const m = medals[slug];
    if (m === "bronze") bronze.push(slug);
    else if (m === "silver") silver.push(slug);
    else if (!m) unseen.push(slug);
  }
  return { bronze, silver, unseen };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 出題順を組む。銅→銀→未挑戦の順に、足りない分を次の層から補う。
 *
 * 層の中はシャッフルする。毎回同じ問題から始まると、2回目以降のドリルが
 * 同じ並びの繰り返しになるため。層をまたぐ並べ替えはしない(順序が意味を持つ)。
 */
export function buildDrillQueue(c: DrillCandidates, size = DRILL_SIZE): string[] {
  const out: string[] = [];
  for (const group of [c.bronze, c.silver, c.unseen]) {
    if (out.length >= size) break;
    out.push(...shuffle(group).slice(0, size - out.length));
  }
  return out;
}

export function loadDrill(): DrillState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRILL_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Partial<DrillState>;
    if (!s || typeof s.exam !== "string" || !Array.isArray(s.slugs) || s.slugs.length === 0) return null;
    if (!EXAM_LIST.some((e) => e.slug === s.exam)) return null;
    const startedAt = typeof s.startedAt === "number" ? s.startedAt : 0;
    if (Date.now() - startedAt > DRILL_TTL_DAYS * 86400000) {
      localStorage.removeItem(DRILL_KEY);
      return null;
    }
    return { exam: s.exam as ExamSlug, slugs: s.slugs.filter((x) => typeof x === "string"), startedAt };
  } catch {
    return null;
  }
}

export function startDrill(exam: ExamSlug, slugs: string[]): DrillState | null {
  if (typeof window === "undefined" || slugs.length === 0) return null;
  const state: DrillState = { exam, slugs, startedAt: Date.now() };
  try {
    localStorage.setItem(DRILL_KEY, JSON.stringify(state));
  } catch {
    /* 保存できない環境(プライベートモード等)でも、この回のドリルは動かせる */
  }
  return state;
}

export function endDrill(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(DRILL_KEY);
  } catch {
    /* 消せなくても TTL で消える */
  }
}

/** 問題ページの URL。EXAM_LIST の questionPathPrefix が唯一の出典 */
export function questionHref(exam: ExamSlug, slug: string): string {
  const prefix = EXAM_LIST.find((e) => e.slug === exam)?.questionPathPrefix ?? "/";
  return `${prefix}${slug}/`;
}

export interface DrillPosition {
  /** 1始まりの現在位置 */
  position: number;
  total: number;
  /** 次の問題の URL。最後の問題なら null */
  nextHref: string | null;
}

/**
 * 今開いている問題が、進行中のドリルの何番目かを返す。
 * ドリルが無い・資格が違う・その問題が並びに無い場合は null。
 */
export function drillPositionOf(
  state: DrillState | null,
  exam: ExamSlug | undefined,
  slug: string | undefined
): DrillPosition | null {
  if (!state || !exam || !slug || state.exam !== exam) return null;
  const i = state.slugs.indexOf(slug);
  if (i < 0) return null;
  const next = state.slugs[i + 1];
  return {
    position: i + 1,
    total: state.slugs.length,
    nextHref: next ? questionHref(exam, next) : null,
  };
}
