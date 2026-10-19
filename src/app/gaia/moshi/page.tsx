import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getGaiaMoshi1Questions, GAIA_MOSHI_PASS_COUNT, GAIA_MOSHI_TIME_LIMIT_MIN } from "@/lib/gaia-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/gaia/moshi/",
  title: "生成AIアドバイザー認定試験 模擬試験 第1回・1級形式（無料）｜100問・120分・合否判定つき",
  description:
    "生成AIアドバイザー認定試験（1級）の無料模擬試験。本試験と同じ100問・4択・120分で受験でき、70%の合否判定と課題別の弱点分析を確認できます。",
});

export default async function GaiaMoshiPage() {
  const all = await getGaiaMoshi1Questions();
  // 問題数が多いためページ重量対策で詳解は同梱せず、結果画面から各問題ページへ誘導する
  const questions: MoshiQuestion[] = all.map((q) => ({
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
        <a href="/gaia/">生成AIアドバイザー</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回（1級形式）</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（1級形式）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        1級の本試験と同じ<strong>100問・4択・120分・合格基準70%</strong>で受験できる無料の模擬試験です。全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。2級の範囲は1級と同じ（難易度が基礎中心）なので、2級対策の腕試しにも使えます。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　100問（4択）　8課題とAI事業者ガイドライン等から出題（公式は課題別の問題数を公表していないため、当サイトの想定配分）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　120分（自動採点）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　70%以上（100問中70問）。課題別の最低点の記載はない</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="gaia"
        round={1}
        sessionKey="shikakumon-gaia-moshi1-v1"
        questions={questions}
        timeLimitMin={GAIA_MOSHI_TIME_LIMIT_MIN}
        passCount={GAIA_MOSHI_PASS_COUNT}
        passLabel="70%（100問中70問）以上"
        choiceLabel="4択"
        questionPathPrefix="/gaia/q/"
        topPath="/gaia/"
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本模試は当サイト編集部が作成したオリジナル問題で構成しており、公式問題・サンプル問題の転載ではありません。課題ごとの問題数・配点は協会が公表していないため、均等配点・総合70%で判定します。協会は難易度により合格基準を調整する場合があると案内しています。2級の形式を試したい方は<a href="/gaia/moshi-2kyu/" className="underline hover:no-underline">2級形式の模擬試験（50問・60分）</a>へ。
        1問ずつじっくり学びたい方は<a href="/gaia/" className="underline hover:no-underline">練習問題</a>へ。
      </p>
    </div>
  );
}
