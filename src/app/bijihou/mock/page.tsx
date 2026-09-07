import { getAllBijihouQuestions } from "@/lib/bijihou-questions";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import MockExam, { type MockQuestion } from "@/app/kashikin/mock/MockExam";

/**
 * ビジネス実務法務検定3級 の本番形式テスト。2026-09-07 追加。
 *
 * この面は7資格にしか無く、残り7資格では「無料でまとめて解ける」という
 * このサイトの差別化を自ら削っていた。出題・採点・分野別正答率・送客までは
 * 共通の MockExam が持っているので、資格ごとに要るのは問題の供給と合格ラインだけ。
 *
 * passPct の根拠: 100点中70点(70%)= BIJIHOU_MOSHI_PASS_COUNT(50問中35問)
 * (既定値の60%のままにすると、合格ラインに届いていない点数に
 *  「合格ラインは超えています」と誤った安心を出してしまう)
 */

export const metadata: Metadata = pageMetadata({
  path: "/bijihou/mock/",
  title: "ビジネス実務法務検定3級 本番形式テスト｜採点・苦手分野判定つき",
  description:
    "ビジネス実務法務検定3級のオリジナル問題からランダム20問を出題。最後に得点と苦手分野を自動判定し、弱点を重点的に復習できます。登録不要・無料。",
});

export default async function BijihouMockPage() {
  const all = await getAllBijihouQuestions();
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
        <a href="/bijihou/">ビジネス実務法務検定3級</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">本番形式テスト</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">本番形式テスト</h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-kashikin)" }}></div>

      <p className="text-xs text-[color:var(--c-text-sub)] mb-5">
        本試験と同じ90分・100点満点70点合格の条件で腕試しするなら
        <a href="/bijihou/moshi/" className="underline hover:no-underline">模擬試験 第1回（無料）</a>へ。
      </p>

      <MockExam
        exam="bijihou"
        examLabel="ビジネス実務法務検定3級"
        questionPathPrefix="/bijihou/q/"
        questions={questions}
        size={20}
        passPct={70}
      />
    </div>
  );
}
