import { getAllEcoQuestions } from "@/lib/eco-questions";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import MockExam, { type MockQuestion } from "@/app/kashikin/mock/MockExam";

export const metadata: Metadata = pageMetadata({
  path: "/eco/mock/",
  title: "eco検定 本番形式テスト｜採点・苦手分野判定つき",
  description:
    "eco検定（環境社会検定試験）のオリジナル問題からランダム20問を出題。最後に得点と苦手分野を自動判定し、弱点を重点的に復習できます。",
});

export default async function EcoMockPage() {
  const all = await getAllEcoQuestions();
  const questions: MockQuestion[] = all.map((q) => ({
    slug: q.slug,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    field: q.field,
  }));

  return (
    <div className="theme-eco pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/eco/">eco検定</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">本番形式テスト</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">本番形式テスト</h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-eco)" }}></div>

      <p className="text-xs text-[color:var(--c-text-sub)] mb-5">
        本試験と同じ90分・70点合格判定で腕試しするなら
        <a href="/eco/moshi/" className="underline hover:no-underline">模擬試験 第1回（無料）</a>へ。
      </p>

      <MockExam
        exam="eco"
        examLabel="eco検定（環境社会検定試験）"
        questionPathPrefix="/eco/q/"
        questions={questions}
        size={20}
        passPct={70}
      />
    </div>
  );
}
