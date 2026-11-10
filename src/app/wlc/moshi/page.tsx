import SiteLink from "@/components/SiteLink";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import {
  getWlcMoshi1Questions,
  WLC_MOSHI_PASS_COUNT,
  WLC_MOSHI_TIME_LIMIT_MIN,
} from "@/lib/wlc-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/wlc/moshi/",
  title: "ワークライフ・コーディネーター 模擬試験 第1回（無料）｜本番形式60問・105分",
  description:
    "ワークライフ・コーディネーター認定試験の無料模擬試験。本試験と同じ60問・105分・4肢択一で、ワークライフバランスの考え方から両立支援、労働法、社会保障と税までの8分野から出題し、正答率70%を目安に判定します。分野ごとの弱点分析つき。",
});

export default async function WlcMoshiPage() {
  const all = await getWlcMoshi1Questions();
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
        <SiteLink href="/wlc/">ワークライフ・コーディネーター</SiteLink>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（本番形式・60問）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験と同じ<strong>60問・105分（10:00〜11:45）・4肢択一</strong>で受験できる無料の模擬試験です。本試験の5課題に沿った<strong>8分野から7〜8問ずつ</strong>出題します。本試験の合格基準は公表されていないため、協会のほかの認定試験と同じ<strong>正答率70%（42問）</strong>を目安に判定します。
        全員が同じ問題を同じ順序で解く固定問題なので、本番前の力試しに使えます。
      </p>

      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">出題数</span>
          　60問（ワークライフバランスの基礎8問・多様な働き方7問・健康とキャリア7問・治療と仕事の両立と障害者就労8問・子育てと介護の両立8問・働き方に関する労働法8問・雇用関係法7問・社会保障と税7問／4肢択一）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{WLC_MOSHI_TIME_LIMIT_MIN}
          分（自動採点）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　{WLC_MOSHI_PASS_COUNT}
          問以上（正答率70%を目安）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要
        </p>
      </div>

      <MoshiExam
        exam="wlc"
        round={1}
        sessionKey="shikakumon-wlc-moshi1-v1"
        questions={questions}
        timeLimitMin={WLC_MOSHI_TIME_LIMIT_MIN}
        passCount={WLC_MOSHI_PASS_COUNT}
        passLabel="60問中42問以上（正答率70%を目安）"
        choiceLabel="4肢択一"
        questionPathPrefix="/wlc/q/"
        topPath="/wlc/"
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本試験の合格基準と課題ごとの問題数は公表されていないため、本模試は当サイトの8分野からほぼ均等に出題し、正答率70%を目安に判定しています。判定は学習の目安としてお使いください。当サイトが作成したオリジナル問題で構成しており、実際の過去問題の転載ではありません。
        1問ずつじっくり学びたい方は
        <SiteLink href="/wlc/" className="underline hover:no-underline">
          練習問題160問
        </SiteLink>
        へ。
      </p>
    </div>
  );
}
