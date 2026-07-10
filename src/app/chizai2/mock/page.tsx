import { getAllChizai2Questions } from "@/lib/chizai2-questions";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import MockExam, { type MockQuestion } from "@/app/kashikin/mock/MockExam";

export const metadata: Metadata = pageMetadata({
  path: "/chizai2/mock/",
  title: "知的財産管理技能検定2級 本番形式テスト｜採点・苦手分野判定つき",
  description:
    "知的財産管理技能検定2級のオリジナル問題からランダム20問を出題。最後に得点と苦手分野を自動判定し、弱点を重点的に復習できます。",
});

export default async function Chizai2MockPage() {
  const all = await getAllChizai2Questions();
  const questions: MockQuestion[] = all.map((q) => ({
    slug: q.slug,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    field: q.field,
  }));

  return (
    <div className="theme-chizai pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/chizai2/">知的財産管理技能検定2級</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">本番形式テスト</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">本番形式テスト</h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-chizai)" }}></div>

      <MockExam
        exam="chizai2"
        examLabel="知的財産管理技能検定2級"
        questionPathPrefix="/chizai2/q/"
        questions={questions}
        size={20}
      />
    </div>
  );
}
