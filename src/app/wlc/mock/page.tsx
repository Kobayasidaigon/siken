import SiteLink from "@/components/SiteLink";
import { getAllWlcQuestions } from "@/lib/wlc-questions";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import MockExam, { type MockQuestion } from "@/app/kashikin/mock/MockExam";

/**
 * ワークライフ・コーディネーター認定試験の本番形式テスト。
 *
 * passPct の根拠: 本試験の合格基準は協会の試験ページに記載が見当たらない。協会のほかの認定試験と同じ70%を目安として渡している(既定の60%だと基準より甘くなるおそれがあるため)。
 */

export const metadata: Metadata = pageMetadata({
  path: "/wlc/mock/",
  title: "ワークライフ・コーディネーター 本番形式テスト｜採点・苦手分野判定つき",
  description:
    "ワークライフ・コーディネーター認定試験のオリジナル問題からランダム20問を出題。最後に得点と苦手分野を自動判定し、弱点を重点的に復習できます。登録不要・無料。",
});

export default async function WlcMockPage() {
  const all = await getAllWlcQuestions();
  const questions: MockQuestion[] = all.map((q) => ({
    slug: q.slug,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    field: q.field,
  }));

  return (
    <div className="theme-pii pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <SiteLink href="/">ホーム</SiteLink>
        <span>/</span>
        <SiteLink href="/wlc/">ワークライフ・コーディネーター</SiteLink>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">本番形式テスト</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">本番形式テスト</h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-pii)" }}></div>

      <p className="text-xs text-[color:var(--c-text-sub)] mb-5">
        本試験と同じ60問・105分で腕試しするなら
        <SiteLink href="/wlc/moshi/" className="underline hover:no-underline">
          模擬試験 第1回（無料）
        </SiteLink>
        へ。
      </p>

      <MockExam
        exam="wlc"
        examLabel="ワークライフ・コーディネーター認定試験"
        questionPathPrefix="/wlc/q/"
        questions={questions}
        size={20}
        passPct={70}
      />
    </div>
  );
}
