/**
 * 資格別の転職エージェント比較ページ(/<資格>/tenshoku/)がある資格の一覧。2026-11-14 追加。
 *
 * クライアント部品(模試の結果面・合格報告フォーム)からも引くので、JSON を読み込まない
 * 小さなファイルに分けてある。資格を足すときは src/data/tenshoku/<資格>.json と
 * src/app/<資格>/tenshoku/page.tsx を作り、ここに1行足す(lib/tenshoku.ts の DATA にも)。
 */
import type { ExamSlug } from "./study-progress";

export const TENSHOKU_EXAMS: readonly ExamSlug[] = ["chintai"];

export function tenshokuPath(exam: string | undefined): string | null {
  if (!exam) return null;
  return (TENSHOKU_EXAMS as readonly string[]).includes(exam) ? `/${exam}/tenshoku/` : null;
}
