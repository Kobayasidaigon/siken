import SiteLink from "@/components/SiteLink";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import {
  getLlcMoshi1Questions,
  LLC_MOSHI_PASS_COUNT,
  LLC_MOSHI_TIME_LIMIT_MIN,
} from "@/lib/llc-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/llc/moshi/",
  title: "労働法務士 模擬試験 第1回（無料）｜本番形式60問・150分",
  description:
    "労働法務士認定試験の無料模擬試験。本試験と同じ60問・150分・4肢択一で、労働法総論から雇用関係法・労使関係法・雇用保障法・労働紛争の解決までの8分野から出題し、正答率70%の基準で判定します。分野ごとの弱点分析つき。",
});

export default async function LlcMoshiPage() {
  const all = await getLlcMoshi1Questions();
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
        <SiteLink href="/">ホーム</SiteLink>
        <span>/</span>
        <SiteLink href="/llc/">労働法務士</SiteLink>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（本番形式・60問）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験と同じ<strong>60問・150分・4肢択一</strong>で受験できる無料の模擬試験です。本試験の出題範囲に沿った<strong>8分野から7〜8問ずつ</strong>出題し、合否は本試験と同じ<strong>正答率70%（42問）以上</strong>で判定します。
        全員が同じ問題を同じ順序で解く固定問題なので、本番前の力試しに使えます。
      </p>

      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">出題数</span>
          　60問（労働法総論7問・雇用関係法32問・労使関係法7問・雇用保障法7問・労働紛争の解決と外国人労働者7問／4肢択一）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{LLC_MOSHI_TIME_LIMIT_MIN}
          分（自動採点）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　{LLC_MOSHI_PASS_COUNT}
          問以上（正答率70%）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要
        </p>
      </div>

      <MoshiExam
        exam="llc"
        round={1}
        sessionKey="shikakumon-llc-moshi1-v1"
        questions={questions}
        timeLimitMin={LLC_MOSHI_TIME_LIMIT_MIN}
        passCount={LLC_MOSHI_PASS_COUNT}
        passLabel="60問中42問以上（正答率70%）"
        choiceLabel="4肢択一"
        questionPathPrefix="/llc/q/"
        topPath="/llc/"
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本試験の分野ごとの問題数は公表されていないため、本模試は当サイトの8分野からほぼ均等に出題しています。本試験では、問題の難易度により70%未満でも合格となる場合があると案内されています。本模試は調整を行わない素点判定なので、判定は学習の目安としてお使いください。当サイトが作成したオリジナル問題で構成しており、実際の過去問題の転載ではありません。
        1問ずつじっくり学びたい方は
        <SiteLink href="/llc/" className="underline hover:no-underline">
          練習問題160問
        </SiteLink>
        へ。
      </p>
    </div>
  );
}
