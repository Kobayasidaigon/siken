import SiteLink from "@/components/SiteLink";
import { getAllCacQuestions } from "@/lib/cac-questions";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import MockExam, { type MockQuestion } from "@/app/kashikin/mock/MockExam";

/**
 * 会社法法務士認定試験の腕試しテスト。
 *
 * passPct の根拠: 本試験の合格基準が「70%以上」(協会の試験ページ)なので 70 を渡す。既定の60%だと、届いていない点数に誤った安心を出してしまう。
 */

export const metadata: Metadata = pageMetadata({
  path: "/cac/mock/",
  // 20問を出すボタンと案内だけで、そのページにしかない文章がほとんど無いため検索に出さない(2026-11-10)
  noindex: true,
  title: "会社法法務士 腕試しテスト（ランダム20問）｜採点・苦手分野判定つき",
  description:
    "会社法法務士認定試験のオリジナル問題からランダム20問を出題。最後に得点と苦手分野を自動判定し、弱点を重点的に復習できます。登録不要・無料。",
});

export default async function CacMockPage() {
  const all = await getAllCacQuestions();
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
        <SiteLink href="/cac/">会社法法務士</SiteLink>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">腕試しテスト</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">腕試しテスト</h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-pii)" }}></div>

      <p className="text-xs text-[color:var(--c-text-sub)] mb-5">
        本試験と同じ60問・150分で解くなら
        <SiteLink href="/cac/moshi/" className="underline hover:no-underline">
          模擬試験 第1回（無料）
        </SiteLink>
        へ。
      </p>

      <MockExam
        exam="cac"
        examLabel="会社法法務士認定試験"
        questionPathPrefix="/cac/q/"
        questions={questions}
        size={20}
        passPct={70}
      />
    </div>
  );
}
