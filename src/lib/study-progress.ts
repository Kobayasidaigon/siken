/**
 * 学習履歴をブラウザのLocalStorageで管理するヘルパー。
 * - bookmarks: 後で見直したい問題
 * - wrong: 不正解だった問題（誤答再出題用）
 * - correct: 正解だった問題（達成感の可視化用）
 *
 * すべてクライアントサイドで完結する。サーバ連携なし、ログイン不要。
 */

const STORAGE_KEY = "shikakumon-study-v1";

export type ExamSlug = "kashikin" | "pii" | "chizai" | "chizai2" | "mynumber" | "jitsumu" | "bijihou" | "fukushi2" | "bijimane" | "eco" | "bijihou2" | "itpass" | "chintai" | "kangyo";

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
  { slug: "bijihou2", name: "ビジネス実務法務検定2級", topPath: "/bijihou2/", questionPathPrefix: "/bijihou2/q/" },
  { slug: "itpass", name: "ITパスポート試験", topPath: "/itpass/", questionPathPrefix: "/itpass/q/" },
  { slug: "chintai", name: "賃貸不動産経営管理士", topPath: "/chintai/", questionPathPrefix: "/chintai/q/" },
  { slug: "kangyo", name: "管理業務主任者", topPath: "/kangyo/", questionPathPrefix: "/kangyo/q/" },
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
    bijihou2: { bookmarks: [], wrong: [], correct: [], medals: {} },
    itpass: { bookmarks: [], wrong: [], correct: [], medals: {} },
    chintai: { bookmarks: [], wrong: [], correct: [], medals: {} },
    kangyo: { bookmarks: [], wrong: [], correct: [], medals: {} },
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

/* ===================== 書き出し・読み込み ===================== */

/**
 * 学習履歴の持ち出し。2026-09-07 追加。
 *
 * 保存先は localStorage だけで、アカウントもサーバ保存も無い。つまり機種変・
 * ブラウザ変更・サイトデータの削除で全部消える。3,370問を解いた人ほど失うものが
 * 大きいのに、退避する手段が何も無かった。
 *
 * サーバに置かない方針は変えない(「サーバには送信されません」と明記して集めてきた
 * 履歴を、後から送信先のあるものに変えるべきではない)。持ち出しと復元だけを、
 * 利用者の手元のファイルで完結させる。
 */
export const PROGRESS_EXPORT_VERSION = 1;

export interface ProgressExport {
  app: "shikakumon";
  kind: "study-progress";
  version: number;
  /** 書き出した日時(ISO)。中身は使わず、利用者がファイルを見分けるための情報 */
  exportedAt: string;
  progress: AllProgress;
}

export function exportProgress(): ProgressExport {
  return {
    app: "shikakumon",
    kind: "study-progress",
    version: PROGRESS_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    progress: loadProgress(),
  };
}

/** メダルの強さ。統合するときは強いほうを残す */
const MEDAL_RANK: Record<Medal, number> = { bronze: 1, silver: 2, gold: 3 };

export type ImportMode = "merge" | "replace";

export interface ImportResult {
  ok: boolean;
  /** 失敗したときだけ入る。利用者にそのまま見せる文言 */
  error?: string;
  /** 取り込み後の合計。成功したときだけ入る */
  totals?: { attempted: number; bookmarks: number };
}

/**
 * 書き出したファイルを読み込む。
 *
 * merge: 今の履歴と統合する。解答済みの問題はメダルが強いほうを残す。
 *        別の端末で進めた分を合流させる用途。既定はこちら。
 * replace: 今の履歴を捨てて、ファイルの内容にする。
 *
 * 統合で「強いほうを残す」のは、片方で金にした問題が、もう片方の古い銅で
 * 上書きされて消えるのを防ぐため。逆(弱いほうを残す)にすると、
 * 復元するたびに進捗が後退して見える。
 */
export function importProgress(raw: unknown, mode: ImportMode = "merge"): ImportResult {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "ファイルの形式が読み取れませんでした。" };
  }
  const data = raw as Partial<ProgressExport>;
  if (data.app !== "shikakumon" || data.kind !== "study-progress") {
    return { ok: false, error: "シカクモンの学習履歴ファイルではないようです。" };
  }
  if (typeof data.version !== "number" || data.version > PROGRESS_EXPORT_VERSION) {
    return {
      ok: false,
      error: "このファイルは新しい形式です。ブラウザを再読み込みしてからお試しください。",
    };
  }
  if (typeof data.progress !== "object" || data.progress === null) {
    return { ok: false, error: "学習履歴が入っていないファイルです。" };
  }

  const incoming = data.progress as Partial<AllProgress>;
  const base = mode === "replace" ? defaultProgress() : loadProgress();

  for (const exam of Object.keys(base) as ExamSlug[]) {
    const part = incoming[exam];
    if (!part) continue;
    const cur = base[exam];
    const str = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x) => typeof x === "string") : []);

    // 正誤は「最後に解いた結果」なので、同じ問題が両方に入らないよう
    // 取り込む側を後勝ちにする(merge でも、より新しい結果を持ち込む想定)
    const inWrong = str(part.wrong);
    const inCorrect = str(part.correct);
    const incomingAll = new Set([...inWrong, ...inCorrect]);
    cur.wrong = [...cur.wrong.filter((s) => !incomingAll.has(s)), ...inWrong];
    cur.correct = [...cur.correct.filter((s) => !incomingAll.has(s)), ...inCorrect];
    cur.bookmarks = [...new Set([...cur.bookmarks, ...str(part.bookmarks)])];

    const medals = cur.medals ?? (cur.medals = {});
    const inMedals = part.medals && typeof part.medals === "object" ? part.medals : {};
    for (const [slug, m] of Object.entries(inMedals)) {
      if (m !== "bronze" && m !== "silver" && m !== "gold") continue;
      const now = medals[slug];
      if (!now || MEDAL_RANK[m] > MEDAL_RANK[now]) medals[slug] = m;
    }
  }

  saveProgress(base);
  const attempted = (Object.keys(base) as ExamSlug[]).reduce(
    (n, e) => n + base[e].wrong.length + base[e].correct.length,
    0
  );
  const bookmarks = (Object.keys(base) as ExamSlug[]).reduce((n, e) => n + base[e].bookmarks.length, 0);
  return { ok: true, totals: { attempted, bookmarks } };
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
