/**
 * 資格トップに置く「今日の3問」と「間違えた人が多い問題」。2026-09-13 追加。
 * 方針: docs/direction-2026-09.md §5-2・§5-3。
 *
 * 17枚の資格トップに同じ2つを置くので、資格IDと問題一覧だけを受け取る
 * サーバー部品にまとめた。名前と問題ページの接頭辞は EXAM_LIST から引く。
 * クライアントへ渡すのは slug の配列だけ(本文は渡さない)。
 */

import { EXAM_LIST, type ExamSlug } from "@/lib/study-progress";
import DailyThreeCard from "./DailyThreeCard";
import HardQuestionsSection from "./HardQuestionsSection";

export default function ExamDataSections({
  exam,
  questions,
}: {
  exam: ExamSlug;
  questions: { slug: string }[];
}) {
  const info = EXAM_LIST.find((e) => e.slug === exam);
  if (!info) return null;
  const allSlugs = questions.map((q) => q.slug);
  return (
    <>
      <DailyThreeCard exam={exam} examName={info.name} allSlugs={allSlugs} placement="top" requireEngagement className="mb-10" />
      <HardQuestionsSection exam={exam} examName={info.name} questionPathPrefix={info.questionPathPrefix} />
    </>
  );
}
