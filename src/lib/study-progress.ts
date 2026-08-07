/**
 * 学習履歴をブラウザのLocalStorageで管理するヘルパー。
 * - bookmarks: 後で見直したい問題
 * - wrong: 不正解だった問題（誤答再出題用）
 * - correct: 正解だった問題（達成感の可視化用）
 *
 * すべてクライアントサイドで完結する。サーバ連携なし、ログイン不要。
 */

const STORAGE_KEY = "shikakumon-study-v1";

export type ExamSlug = "kashikin" | "pii" | "chizai" | "chizai2" | "mynumber" | "jitsumu" | "bijihou" | "fukushi2" | "bijimane" | "eco";

export const EXAM_LIST: { slug: ExamSlug; name: string; topPath: string; questionPathPrefix: string }[] = [
  { slug: "kashikin", name: "貸金業務取扱主任者", topPath: "/kashikin/", questionPathPrefix: "/q/" },
  { slug: "pii", name: "個人情報保護士", topPath: "/pii/", questionPathPrefix: "/pii/q/" },
  { slug: "chizai", name: "知的財産管理技能検定3級", topPath: "/chizai/", questionPathPrefix: "/chizai/q/" },
  { slug: "chizai2", name: "知的財産管理技能検定2級", topPath: "/chizai2/", questionPathPrefix: "/chizai2/q/" },
  { slug: "mynumber", name: "マイナンバー実務検定3級", topPath: "/mynumber/", questionPathPrefix: "/mynumber/q/" },
  { slug: "jitsumu", name: "個人情報保護実務検定", topPath: "/jitsumu/", questionPathPrefix: "/jitsumu/q/" },
  { slug: "bijihou", name: "ビジネス実務法務検定3級", topPath: "/bijihou/", questionPathPrefix: "/bijihou/q/" },
  { slug: "fukushi2", name: "福祉住環境コーディネーター2級", topPath: "/fukushi2/", questionPathPrefix: "/fukushi2/q/" },
  { slug: "bijimane", name: "ビジネスマネジャー検定", topPath: "/bijimane/", questionPathPrefix: "/bijimane/q/" },
  { slug: "eco", name: "eco検定(環境社会検定試験)", topPath: "/eco/", questionPathPrefix: "/eco/q/" },
];

export type Medal = "bronze" | "silver" | "gold";

export interface ExamProgress {
  bookmarks: string[];
  wrong: string[];
  correct: string[];
  // 問題ごとのメダル状態（連続正解でマスタリー管理）。後方互換のため optional。
  // 未挑戦=エントリ無し / 不正解=bronze / 正解=silver / silverの状態で再度正解=gold
  medals?: Record<string, Medal>;
}

export type AllProgress = Record<ExamSlug, ExamProgress>;

function defaultProgress(): AllProgress {
  return {
    kashikin: { bookmarks: [], wrong: [], correct: [], medals: {} },
    pii: { bookmarks: [], wrong: [], correct: [], medals: {} },
    chizai: { bookmarks: [], wrong: [], correct: [], medals: {} },
    chizai2: { bookmarks: [], wrong: [], correct: [], medals: {} },
    mynumber: { bookmarks: [], wrong: [], correct: [], medals: {} },
    jitsumu: { bookmarks: [], wrong: [], correct: [], medals: {} },
    bijihou: { bookmarks: [], wrong: [], correct: [], medals: {} },
    fukushi2: { bookmarks: [], wrong: [], correct: [], medals: {} },
    bijimane: { bookmarks: [], wrong: [], correct: [], medals: {} },
    eco: { bookmarks: [], wrong: [], correct: [], medals: {} },
  };
}

export function loadProgress(): AllProgress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as Partial<AllProgress>;
    const merged = defaultProgress();
    for (const key of Object.keys(merged) as ExamSlug[]) {
      const part = parsed[key];
      if (part) {
        merged[key] = {
          bookmarks: Array.isArray(part.bookmarks) ? part.bookmarks : [],
          wrong: Array.isArray(part.wrong) ? part.wrong : [],
          correct: Array.isArray(part.correct) ? part.correct : [],
          // 旧データに medals が無くても安全に補完（後方互換）
          medals: part.medals && typeof part.medals === "object" ? part.medals : {},
        };
      }
    }
    return merged;
  } catch {
    return defaultProgress();
  }
}

function saveProgress(p: AllProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    window.dispatchEvent(new Event("shikakumon-progress-update"));
  } catch {
    /* quota exceeded etc — silently ignore */
  }
}

export function isBookmarked(exam: ExamSlug, slug: string): boolean {
  return loadProgress()[exam].bookmarks.includes(slug);
}

export function toggleBookmark(exam: ExamSlug, slug: string): boolean {
  const p = loadProgress();
  const list = p[exam].bookmarks;
  const idx = list.indexOf(slug);
  if (idx >= 0) {
    list.splice(idx, 1);
    saveProgress(p);
    return false;
  } else {
    list.push(slug);
    saveProgress(p);
    return true;
  }
}

export function recordResult(exam: ExamSlug, slug: string, correct: boolean): void {
  const p = loadProgress();
  p[exam].correct = p[exam].correct.filter((s) => s !== slug);
  p[exam].wrong = p[exam].wrong.filter((s) => s !== slug);
  if (correct) {
    p[exam].correct.push(slug);
  } else {
    p[exam].wrong.push(slug);
  }
  // メダル遷移: 不正解→bronze / 正解は silver、すでに silver(以上)なら gold へ昇格。
  // 「連続正解で金」のマスタリー（gold に到達したら間違えるまで維持）。
  const medals = p[exam].medals ?? (p[exam].medals = {});
  if (!correct) {
    medals[slug] = "bronze";
  } else {
    medals[slug] = medals[slug] === "silver" || medals[slug] === "gold" ? "gold" : "silver";
  }
  saveProgress(p);
}

/** 資格ごとのメダル枚数を集計（未挑戦は数えない）。 */
export function medalCounts(progress: ExamProgress): { bronze: number; silver: number; gold: number } {
  const counts = { bronze: 0, silver: 0, gold: 0 };
  const medals = progress.medals ?? {};
  for (const m of Object.values(medals)) counts[m]++;
  return counts;
}

export function clearProgress(exam?: ExamSlug): void {
  if (!exam) {
    saveProgress(defaultProgress());
    return;
  }
  const p = loadProgress();
  p[exam] = { bookmarks: [], wrong: [], correct: [], medals: {} };
  saveProgress(p);
}
