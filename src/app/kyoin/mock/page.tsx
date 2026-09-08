import { getAllKyoinQuestions } from "@/lib/kyoin-questions";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import MockExam, { type MockQuestion } from "@/app/kashikin/mock/MockExam";

/**
 * 教員採用試験の本番形式テスト。
 *
 * passPct の根拠: 教員採用試験は自治体ごとに実施され、合格ラインが公表されない
 * 自治体がほとんどで、全国共通の「合格点」が存在しない。倍率も自治体・校種で大きく違う。
 * そこで MockExam の既定値である 60% をそのまま使い、moshi 側の注記と同じく
 * 「学習の目安であって合否の予測ではない」と明示する。
 */

export const metadata: Metadata = pageMetadata({
  path: "/kyoin/mock/",
  title: "教員採用試験 教職教養 本番形式テスト｜採点・苦手分野判定つき",
  description:
    "教員採用試験の教職教養・一般教養のオリジナル問題からランダム20問を出題。最後に得点と苦手分野を自動判定し、弱点を重点的に復習できます。登録不要・無料。",
});

export default async function KyoinMockPage() {
  const all = await getAllKyoinQuestions();
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
        <a href="/">ホーム</a>
        <span>/</span>
        <a href="/kyoin/">教員採用試験</a>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">本番形式テスト</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">本番形式テスト</h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-fukushi)" }}></div>

      <p className="text-xs text-[color:var(--c-text-sub)] mb-5">
        60問を通しで解いて分野別の弱点を見るなら
        <a href="/kyoin/moshi/" className="underline hover:no-underline">
          模擬試験 第1回（無料）
        </a>
        へ。
      </p>

      <MockExam
        exam="kyoin"
        examLabel="教員採用試験（教職教養）"
        questionPathPrefix="/kyoin/q/"
        questions={questions}
        size={20}
        passPct={60}
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※教員採用試験は自治体ごとに実施され、合格ラインを公表していない自治体がほとんどです。
        表示される目安の6割は当サイトが置いた基準で、志望自治体の合否を示すものではありません。
      </p>
    </div>
  );
}
