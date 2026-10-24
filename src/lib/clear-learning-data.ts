/**
 * 学習履歴の削除(/study/ の「削除」ボタン)で、一緒に消す端末内のデータ。2026-10-25 追加。
 *
 * プライバシーポリシーは「学習進捗は学習履歴ページからいつでも削除できます」と書いているが、
 * 以前の削除は学習履歴の本体(shikakumon-study-v1)だけを初期化していて、次の2つが残っていた
 * (docs/self-data-features-research.md「提案とは別に直すべき点」)。
 *   - 復習ドリル(shikakumon-drill-v1)。削除のあとも最長7日、ドリルにあった問題で「復習ドリル n / 20 問」が出続けた。
 *   - 模擬試験の途中保存(shikakumon-<資格>-moshi…。開始時刻と解答を含む。第2回の途中保存も同じ形)。
 * 第2回模試の受験権は cookie で持つので、ここで消しても受験権は消えない。
 *
 * study-progress.ts に置かないのは、review-drill.ts が study-progress.ts を読み込んでいて循環するため。
 */
import { clearProgress, type ExamSlug } from "./study-progress";
import { endDrill, loadDrill } from "./review-drill";

/** 模擬試験の途中保存のキー。資格を指定すればその資格の分だけ */
function moshiSessionKeys(exam?: ExamSlug): string[] {
  const re = exam ? new RegExp(`^shikakumon-${exam}-moshi`) : /^shikakumon-[a-z0-9]+-moshi/;
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && re.test(k)) keys.push(k);
  }
  return keys;
}

/** 学習履歴と、復習ドリル・模擬試験の途中保存を消す。資格を指定すればその資格の分だけ */
export function clearLearningData(exam?: ExamSlug): void {
  clearProgress(exam);
  if (typeof window === "undefined") return;
  if (!exam || loadDrill()?.exam === exam) endDrill();
  try {
    for (const k of moshiSessionKeys(exam)) localStorage.removeItem(k);
  } catch {
    /* 消せなくても学習履歴の本体は消えている。途中保存は制限時間を過ぎると読み込み時に捨てられる */
  }
}
