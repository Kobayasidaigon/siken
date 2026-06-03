/**
 * 学習履歴をブラウザのLocalStorageで管理するヘルパー。
 * - bookmarks: 後で見直したい問題
 * - wrong: 不正解だった問題（誤答再出題用）
 * - correct: 正解だった問題（達成感の可視化用）
 *
 * すべてクライアントサイドで完結する。サーバ連携なし、ログイン不要。
 */

const STORAGE_KEY = "shikakumon-study-v1";

export type ExamSlug = "kashikin" | "pii" | "chizai" | "mynumber" | "jitsumu" | "bijihou";

export const EXAM_LIST: { slug: ExamSlug; name: string; topPath: string; questionPathPrefix: string }[] = [
  { slug: "kashikin", name: "貸金業務取扱主任者", topPath: "/kashikin/", questionPathPrefix: "/q/" },
  { slug: "pii", name: "個人情報保護士", topPath: "/pii/", questionPathPrefix: "/pii/q/" },
  { slug: "chizai", name: "知的財産管理技能検定3級", topPath: "/chizai/", questionPathPrefix: "/chizai/q/" },
  { slug: "mynumber", name: "マイナンバー実務検定3級", topPath: "/mynumber/", questionPathPrefix: "/mynumber/q/" },
  { slug: "jitsumu", name: "個人情報保護実務検定", topPath: "/jitsumu/", questionPathPrefix: "/jitsumu/q/" },
  { slug: "bijihou", name: "ビジネス実務法務検定3級", topPath: "/bijihou/", questionPathPrefix: "/bijihou/q/" },
];

export interface ExamProgress {
  bookmarks: string[];
  wrong: string[];
  correct: string[];
}

export type AllProgress = Record<ExamSlug, ExamProgress>;

function defaultProgress(): AllProgress {
  return {
    kashikin: { bookmarks: [], wrong: [], correct: [] },
    pii: { bookmarks: [], wrong: [], correct: [] },
    chizai: { bookmarks: [], wrong: [], correct: [] },
    mynumber: { bookmarks: [], wrong: [], correct: [] },
    jitsumu: { bookmarks: [], wrong: [], correct: [] },
    bijihou: { bookmarks: [], wrong: [], correct: [] },
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
  saveProgress(p);
}

export function clearProgress(exam?: ExamSlug): void {
  if (!exam) {
    saveProgress(defaultProgress());
    return;
  }
  const p = loadProgress();
  p[exam] = { bookmarks: [], wrong: [], correct: [] };
  saveProgress(p);
}
