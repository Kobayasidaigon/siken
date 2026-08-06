import { getAllBijimaneQuestions } from "@/lib/bijimane-questions";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import MockExam, { type MockQuestion } from "@/app/kashikin/mock/MockExam";

export const metadata: Metadata = pageMetadata({
  path: "/bijimane/mock/",
  title: "ビジネスマネジャー検定 本番形式テスト｜採点・苦手分野判定つき",
  description:
    "ビジネスマネジャー検定のオリジナル問題からランダム20問を出題。最後に得点と苦手分野を自動判定し、弱点を重点的に復習できます。",
});

export default async function BijimaneMockPage() {
  const all = await getAllBijimaneQuestions();
  const questions: MockQuestion[] = all.map((q) => ({
    slug: q.slug,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    field: q.field,
  }));

  return (
    <div className="theme-bijimane pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/bijimane/">ビジネスマネジャー検定</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">本番形式テスト</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">本番形式テスト</h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-bijimane)" }}></div>

      <p className="text-xs text-[color:var(--c-text-sub)] mb-5">
        全200問からランダムに20問を出題します。1問ずつ解説を読みながら進めたい方は
        <a href="/bijimane/" className="underline hover:no-underline">練習問題の一覧</a>へ。
      </p>

      <MockExam
        exam="bijimane"
        examLabel="ビジネスマネジャー検定"
        questionPathPrefix="/bijimane/q/"
        questions={questions}
        size={20}
      />
    </div>
  );
}
