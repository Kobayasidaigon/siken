import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import {
  getItpassMoshi1Questions,
  ITPASS_MOSHI_PASS_COUNT,
  ITPASS_MOSHI_TIME_LIMIT_MIN,
  ITPASS_MOSHI_SECTIONS,
} from "@/lib/itpass-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

// 2026-09-05 新設。資格トップの「模擬試験を受ける」が存在しないこのURLを指していて404だった。
// 模試の結果画面は全CTA設置面で最も転換率が高い(moshi_result)ため、受け皿を用意する。
export const metadata: Metadata = pageMetadata({
  path: "/itpass/moshi/",
  title: "ITパスポート 模擬試験 第1回（無料）｜本番形式100問・120分・分野別判定つき",
  description:
    "ITパスポート試験の無料模擬試験。本試験と同じ100問・120分・4肢択一、出題配分（ストラテジ35問・マネジメント20問・テクノロジ45問）で受験でき、総合と分野別の両方で合否を判定。弱点分野の分析つきです。",
});

export default async function ItpassMoshiPage() {
  const all = await getItpassMoshi1Questions();
  // 100問のためページ重量対策で詳解は同梱せず、結果画面から各問題ページへ誘導する(pii/moshi と同じ)
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
        <a href="/itpass/">ITパスポート</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（本番形式・100問）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験と同じ<strong>100問・120分・4肢択一</strong>、IPA公表の出題配分
        （<strong>ストラテジ系35問・マネジメント系20問・テクノロジ系45問</strong>）で受験できる無料の模擬試験です。
        合否判定も本試験にならい、<strong>総合と分野別の両方</strong>で行います。
        全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　100問（ストラテジ系35問・マネジメント系20問・テクノロジ系45問・4肢択一）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{ITPASS_MOSHI_TIME_LIMIT_MIN}分（自動採点）＝本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　総合{ITPASS_MOSHI_PASS_COUNT}問以上、かつ分野別にストラテジ11問・マネジメント6問・テクノロジ14問以上（本試験の「総合600点・分野別各300点」を正答率で近似）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="itpass"
        round={1}
        sessionKey="shikakumon-itpass-moshi1-v1"
        questions={questions}
        timeLimitMin={ITPASS_MOSHI_TIME_LIMIT_MIN}
        passCount={ITPASS_MOSHI_PASS_COUNT}
        passLabel="総合60問以上かつ分野別（ストラテジ11問・マネジメント6問・テクノロジ14問）以上"
        choiceLabel="4肢択一"
        questionPathPrefix="/itpass/q/"
        topPath="/itpass/"
        sections={ITPASS_MOSHI_SECTIONS}
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本試験の評価点はIRT（項目応答理論）で算出され、100問のうち採点対象は92問（8問は今後の出題のための評価用）です。
        本模試は正答数による近似判定で、総合600点を60問、分野別300点を各分野の30%として扱っています。
        当サイト編集部が作成したオリジナル問題で構成しており、実際の過去問題の転載ではありません。
        合否判定はあくまで学習の目安です。1問ずつじっくり学びたい方は
        <a href="/itpass/" className="underline hover:no-underline">練習問題200問</a>へ。
      </p>
    </div>
  );
}
