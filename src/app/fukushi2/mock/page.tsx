import { getAllFukushi2Questions } from "@/lib/fukushi2-questions";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import MockExam, { type MockQuestion } from "@/app/kashikin/mock/MockExam";

export const metadata: Metadata = pageMetadata({
  path: "/fukushi2/mock/",
  title: "福祉住環境コーディネーター2級 本番形式テスト｜採点・苦手分野判定つき",
  description:
    "福祉住環境コーディネーター2級のオリジナル問題からランダム20問を出題。最後に得点と苦手分野を自動判定し、弱点を重点的に復習できます。",
});

export default async function Fukushi2MockPage() {
  const all = await getAllFukushi2Questions();
  const questions: MockQuestion[] = all.map((q) => ({
    slug: q.slug,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    field: q.field,
  }));

  return (
    <div className="theme-fukushi pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/fukushi2/">福祉住環境コーディネーター2級</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">本番形式テスト</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">本番形式テスト</h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-fukushi)" }}></div>

      <p className="text-xs text-[color:var(--c-text-sub)] mb-5">
        本試験と同じ90分・70点合格判定で腕試しするなら
        <a href="/fukushi2/moshi/" className="underline hover:no-underline">模擬試験 第1回（無料）</a>へ。
      </p>

      <MockExam
        exam="fukushi2"
        examLabel="福祉住環境コーディネーター2級"
        questionPathPrefix="/fukushi2/q/"
        questions={questions}
        size={20}
        passPct={70}
      />
    </div>
  );
}
