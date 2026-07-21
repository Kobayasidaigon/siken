import { getAllPiiQuestions } from "@/lib/pii-questions";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import MockExam, { type MockQuestion } from "@/app/kashikin/mock/MockExam";

export const metadata: Metadata = pageMetadata({
  path: "/pii/mock/",
  title: "個人情報保護士 本番形式テスト｜採点・苦手分野判定つき",
  description:
    "個人情報保護士認定試験のオリジナル問題からランダム20問を出題。最後に得点と苦手分野を自動判定し、弱点を重点的に復習できます。",
});

export default async function PiiMockPage() {
  const all = await getAllPiiQuestions();
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
        <a href="/">ホーム</a><span>/</span>
        <a href="/pii/">個人情報保護士</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">本番形式テスト</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">本番形式テスト</h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-pii)" }}></div>

      <p className="text-xs text-[color:var(--c-text-sub)] mb-5">
        本試験と同じ100問・150分・課題別判定で腕試しするなら
        <a href="/pii/moshi/" className="underline hover:no-underline">模擬試験 第1回（無料）</a>へ。
      </p>

      <MockExam
        exam="pii"
        examLabel="個人情報保護士"
        questionPathPrefix="/pii/q/"
        questions={questions}
        size={20}
      />
    </div>
  );
}
