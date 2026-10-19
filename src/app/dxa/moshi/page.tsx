import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getDxaMoshi1Questions, DXA_MOSHI_PASS_COUNT, DXA_MOSHI_TIME_LIMIT_MIN } from "@/lib/dxa-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/dxa/moshi/",
  title: "DX推進アドバイザー認定試験 模擬試験 第1回（無料）｜100問・105分・合否判定つき",
  description:
    "DX推進アドバイザー認定試験の無料模擬試験。本試験と同じ100問（2択35問＋4択65問）・105分で受験でき、660点満点・70%の合否判定、課題別の弱点分析を確認できます。",
});

/** 選択肢数ごとの1問あたり配点 */
const POINTS_BY_CHOICES: Record<number, number> = {"2":4,"4":8};

export default async function DxaMoshiPage() {
  const all = await getDxaMoshi1Questions();
  // 問題数が多いためページ重量対策で詳解は同梱せず、結果画面から各問題ページへ誘導する
  const questions: MoshiQuestion[] = all.map((q) => ({
    slug: q.slug,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    field: q.field,
    points: POINTS_BY_CHOICES[q.choices.length],
  }));

  return (
    <div className="theme-pii pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/dxa/">DX推進アドバイザー</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験と同じ<strong>100問（2択35問＋4択65問）・105分・合格基準70%</strong>で受験できる無料の模擬試験です。全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　100問　第1課題 DXの現状40問（2択10＋4択30）／第2課題 DXの技術50問（2択25＋4択25）／第3課題 DXの展開10問（4択10）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　105分（第22回の案内に基づく・自動採点）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">配点</span>　2択 1問4点／4択 1問8点（660点満点）。1問ごとの配点は協会が公表する2択140点・4択520点の合計を問題数で割った換算</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　70%以上（462点以上）。課題別の最低点の記載はない</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="dxa"
        round={1}
        sessionKey="shikakumon-dxa-moshi1-v1"
        questions={questions}
        timeLimitMin={DXA_MOSHI_TIME_LIMIT_MIN}
        passCount={DXA_MOSHI_PASS_COUNT}
        passLabel="70%（660点満点中462点）以上"
        choiceLabel="2択・4択"
        questionPathPrefix="/dxa/q/"
        topPath="/dxa/"
        passPoints={462}
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本模試は当サイト編集部が作成したオリジナル問題で構成しており、公式問題・サンプル問題の転載ではありません。協会は問題の難易度により合格基準を調整する場合があると案内しています。合否判定は学習の目安です。
        1問ずつじっくり学びたい方は<a href="/dxa/" className="underline hover:no-underline">練習問題</a>へ。
      </p>
    </div>
  );
}
