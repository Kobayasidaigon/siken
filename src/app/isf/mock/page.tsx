import SiteLink from "@/components/SiteLink";
import { getAllIsfQuestions } from "@/lib/isf-questions";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import MockExam, { type MockQuestion } from "@/app/kashikin/mock/MockExam";

/**
 * 情報・サイバーセキュリティ初級認定試験の腕試しテスト。
 *
 * passPct の根拠: 本試験の合格基準が「正答率70%」(協会の試験内容ページ)なので 70 を渡す。
 * 既定値の60%のままにすると、合格ラインに届いていない点数に
 * 「合格ラインは超えています」と誤った安心を出してしまう。
 */

export const metadata: Metadata = pageMetadata({
  path: "/isf/mock/",
  // 20問を出すボタンと案内だけで、そのページにしかない文章がほとんど無いため検索に出さない(2026-11-10)
  noindex: true,
  title: "情報・サイバーセキュリティ初級 腕試しテスト（ランダム20問）｜採点・苦手分野判定つき",
  description:
    "情報・サイバーセキュリティ初級認定試験のオリジナル問題からランダム20問を出題。最後に得点と苦手分野を自動判定し、弱点を重点的に復習できます。登録不要・無料。",
});

export default async function IsfMockPage() {
  const all = await getAllIsfQuestions();
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
        <SiteLink href="/isf/">情報・サイバーセキュリティ初級</SiteLink>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">腕試しテスト</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">腕試しテスト</h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-pii)" }}></div>

      <p className="text-xs text-[color:var(--c-text-sub)] mb-5">
        本試験と同じ80問・60分で解くなら
        <SiteLink href="/isf/moshi/" className="underline hover:no-underline">
          模擬試験 第1回（無料）
        </SiteLink>
        へ。
      </p>

      <MockExam
        exam="isf"
        examLabel="情報・サイバーセキュリティ初級認定試験"
        questionPathPrefix="/isf/q/"
        questions={questions}
        size={20}
        passPct={70}
      />
    </div>
  );
}
