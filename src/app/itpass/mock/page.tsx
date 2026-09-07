import { getAllItpassQuestions } from "@/lib/itpass-questions";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import MockExam, { type MockQuestion } from "@/app/kashikin/mock/MockExam";

/**
 * ITパスポート試験 の本番形式テスト。2026-09-07 追加。
 *
 * この面は7資格にしか無く、残り7資格では「無料でまとめて解ける」という
 * このサイトの差別化を自ら削っていた。出題・採点・分野別正答率・送客までは
 * 共通の MockExam が持っているので、資格ごとに要るのは問題の供給と合格ラインだけ。
 *
 * passPct の根拠: 総合600/1000(=素点近似で100問中60問)= ITPASS_MOSHI_PASS_COUNT
 * (既定値の60%のままにすると、合格ラインに届いていない点数に
 *  「合格ラインは超えています」と誤った安心を出してしまう)
 */

export const metadata: Metadata = pageMetadata({
  path: "/itpass/mock/",
  title: "ITパスポート試験 本番形式テスト｜採点・苦手分野判定つき",
  description:
    "ITパスポート試験のオリジナル問題からランダム20問を出題。最後に得点と苦手分野を自動判定し、弱点を重点的に復習できます。登録不要・無料。",
});

export default async function ItpassMockPage() {
  const all = await getAllItpassQuestions();
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
        <a href="/itpass/">ITパスポート試験</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">本番形式テスト</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">本番形式テスト</h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-pii)" }}></div>

      <p className="text-xs text-[color:var(--c-text-sub)] mb-5">
        本試験と同じ100問・120分で腕試しするなら
        <a href="/itpass/moshi/" className="underline hover:no-underline">模擬試験 第1回（無料）</a>へ。
      </p>

      <MockExam
        exam="itpass"
        examLabel="ITパスポート試験"
        questionPathPrefix="/itpass/q/"
        questions={questions}
        size={20}
        passPct={60}
      />
    </div>
  );
}
