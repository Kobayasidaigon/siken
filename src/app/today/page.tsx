import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { EXAM_LIST, type ExamSlug } from "@/lib/study-progress";
import { getQuestionsOf } from "@/lib/question-registry";
import TodayClient from "./TodayClient";

/**
 * 「今日の3問」の面。2026-09-13 追加(方針: docs/direction-2026-09.md §5-2)。
 *
 * 試験日を設定した資格(無ければ ?exam= か、いちばん解いている資格)の今日の3問を出す。
 * Studio からの毎朝のメール／プッシュはこの URL(/today/?exam=<資格>)に戻す。
 * localStorage 依存の個人ページなので noindex。
 */
export const metadata: Metadata = pageMetadata({
  path: "/today/",
  title: "今日の3問",
  description: "前回間違えた問題から順に、今日の3問を出します。試験日を設定した資格の分が出ます。",
  noindex: true,
});

export default async function TodayPage() {
  const entries = await Promise.all(
    EXAM_LIST.map(async (e) => {
      const qs = await getQuestionsOf(e.slug);
      return [e.slug, qs.map((q) => q.slug)] as const;
    })
  );
  const slugsByExam = Object.fromEntries(entries) as Record<ExamSlug, string[]>;
  return <TodayClient slugsByExam={slugsByExam} />;
}
