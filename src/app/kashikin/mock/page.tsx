import { getAllQuestions } from "@/lib/questions";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import MockExam, { type MockQuestion } from "./MockExam";

export const metadata: Metadata = pageMetadata({
  path: "/kashikin/mock/",
  title: "貸金業務取扱主任者 本番形式テスト｜採点・苦手分野判定つき",
  description:
    "貸金業務取扱主任者のオリジナル504問からランダム20問を出題。最後に得点と苦手分野を自動判定し、弱点を重点的に復習できます。",
});

export default async function KashikinMockPage() {
  const all = await getAllQuestions();
  // クライアントに渡すのは出題に必要な最小限のみ（解説HTMLは含めない）
  const questions: MockQuestion[] = all.map((q) => ({
    slug: q.slug,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    field: q.field,
  }));

  return (
    <div className="theme-kashikin pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/kashikin/">貸金業務取扱主任者</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">本番形式テスト</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">本番形式テスト</h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-kashikin)" }}></div>

      <MockExam
        exam="kashikin"
        examLabel="貸金業務取扱主任者"
        questionPathPrefix="/q/"
        questions={questions}
        size={20}
      />
    </div>
  );
}
