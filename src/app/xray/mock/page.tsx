import { getAllXrayQuestions } from "@/lib/xray-questions";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import MockExam, { type MockQuestion } from "@/app/kashikin/mock/MockExam";

/**
 * エックス線作業主任者免許試験の本番形式テスト。
 * passPct の根拠: 本試験の合格基準(合計60点以上（100点満点）かつ各科目4問以上（満点の40%）)に合わせ 60% を渡す。
 * 既定値の60%のままだと、合格ラインに届いていない点数に「合格ラインは超えています」と出てしまう。
 */

export const metadata: Metadata = pageMetadata({
  path: "/xray/mock/",
  title: "エックス線作業主任者免許試験 本番形式テスト｜採点・苦手分野判定つき",
  description:
    "エックス線作業主任者免許試験のオリジナル問題からランダム20問を出題。最後に得点と苦手分野を自動判定し、弱点を重点的に復習できます。登録不要・無料。",
});

export default async function XrayMockPage() {
  const all = await getAllXrayQuestions();
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
        <a href="/xray/">エックス線作業主任者</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">本番形式テスト</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">本番形式テスト</h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-pii)" }}></div>

      <p className="text-xs text-[color:var(--c-text-sub)] mb-5">
        本試験の問題数・時間で腕試しするなら
        <a href="/xray/moshi/" className="underline hover:no-underline">模擬試験 第1回（無料）</a>
        へ。
      </p>

      <MockExam
        exam="xray"
        examLabel="エックス線作業主任者免許試験"
        questionPathPrefix="/xray/q/"
        questions={questions}
        size={20}
        passPct={60}
      />
    </div>
  );
}
