import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import {
  getCacMoshi1Questions,
  CAC_MOSHI_PASS_COUNT,
  CAC_MOSHI_TIME_LIMIT_MIN,
} from "@/lib/cac-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/cac/moshi/",
  title: "会社法法務士 模擬試験 第1回（無料）｜本番形式60問・165分",
  description:
    "会社法法務士認定試験の無料模擬試験。本試験と同じ60問・165分・4肢択一で、設立・株式・機関・計算から組織再編・持分会社・清算までの8分野から出題し、正答率70%の基準で判定します。分野ごとの弱点分析つき。",
});

export default async function CacMoshiPage() {
  const all = await getCacMoshi1Questions();
  // 問題数が多いためページ重量対策で詳解は同梱せず、結果画面から各問題ページへ誘導する(pii/moshi と同じ)
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
        <a href="/">ホーム</a>
        <span>/</span>
        <a href="/cac/">会社法法務士</a>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（本番形式・60問）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験と同じ<strong>60問・165分（10:00〜12:45）・4肢択一</strong>で受験できる無料の模擬試験です。会社法の条文構成に沿った<strong>8分野から6〜8問ずつ</strong>出題し、合否は本試験と同じ<strong>正答率70%（42問）以上</strong>で判定します。
        全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。
      </p>

      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">出題数</span>
          　60問（総則・設立7問・株式8問・株主総会8問・取締役等8問・計算等8問・組織再編8問・持分会社・社債7問・解散・清算等6問／4肢択一）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{CAC_MOSHI_TIME_LIMIT_MIN}
          分（自動採点）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　{CAC_MOSHI_PASS_COUNT}
          問以上（正答率70%）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要
        </p>
      </div>

      <MoshiExam
        exam="cac"
        round={1}
        sessionKey="shikakumon-cac-moshi1-v1"
        questions={questions}
        timeLimitMin={CAC_MOSHI_TIME_LIMIT_MIN}
        passCount={CAC_MOSHI_PASS_COUNT}
        passLabel="60問中42問以上（正答率70%）"
        choiceLabel="4肢択一"
        questionPathPrefix="/cac/q/"
        topPath="/cac/"
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本試験の編・章ごとの問題数は公表されていないため、本模試は当サイトの8分野からほぼ均等に出題しています。本試験では、問題の難易度により70%未満でも合格となる場合があると案内されています。本模試は調整を行わない素点判定なので、判定は学習の目安としてお使いください。当サイトが作成したオリジナル問題で構成しており、実際の過去問題の転載ではありません。
        1問ずつじっくり学びたい方は
        <a href="/cac/" className="underline hover:no-underline">
          練習問題160問
        </a>
        へ。
      </p>
    </div>
  );
}
