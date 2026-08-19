/**
 * サイト全体の問題数・コラム数の集計。
 *
 * 【なぜ必要か】
 * トップ/レイアウト/about の description に問題数を手書きしていたため、
 * 増設のたびに実態とずれた。実際 2026-08 の増設5コミット(+166問)のあと、
 * 表示は 2,404 問のまま実数は 2,570 問になっていた(姉妹サイト Studio の
 * 紹介文にもその古い数字が転記されていた)。
 *
 * 問題は src/content/<資格>/*.md が1ファイル1問で、公開フィルタも無い。
 * つまりファイル数がそのまま公開問題数なので、数えれば済む。
 * ビルド時に一度だけ評価されるサーバ側モジュールとして置く。
 *
 * 資格を増やしたら EXAM_DIRS に足すこと。ここだけ更新すれば
 * 各ページの description は自動で追従する。
 */
import fs from "fs";
import path from "path";

/** 問題ファイルを置いているディレクトリ(src/content 配下)。貸金だけ歴史的に questions。 */
export const EXAM_DIRS = [
  "questions",
  "pii",
  "chizai",
  "chizai2",
  "mynumber",
  "jitsumu",
  "bijihou",
  "fukushi2",
  "bijimane",
  "eco",
] as const;

function countMarkdown(dir: string): number {
  const d = path.join(process.cwd(), "src/content", dir);
  if (!fs.existsSync(d)) return 0;
  return fs.readdirSync(d).filter((f) => f.endsWith(".md")).length;
}

let cache: { exams: number; questions: number; columns: number } | null = null;

/** 公開中の資格数・問題数・コラム数。 */
export function siteTotals() {
  if (cache) return cache;
  cache = {
    exams: EXAM_DIRS.length,
    questions: EXAM_DIRS.reduce((n, d) => n + countMarkdown(d), 0),
    columns: countMarkdown("columns"),
  };
  return cache;
}

/** description 等に埋める用の桁区切り文字列(例: "2,570")。 */
export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}
