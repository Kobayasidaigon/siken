import SiteLink from "@/components/SiteLink";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import {
  getIbdMoshi1Questions,
  IBD_MOSHI_PASS_COUNT,
  IBD_MOSHI_TIME_LIMIT_MIN,
} from "@/lib/ibd-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/ibd/moshi/",
  title: "インバウンド実務主任者 模擬試験 第1回（無料）｜本番形式87問・120分",
  description:
    "インバウンド実務主任者認定試験の無料模擬試験。本試験と同じ87問・120分・4肢択一で、観光総論から訪日外国人の理解と対応、集客、まちづくりまでの8分野から出題し、正答率80%の基準で判定します。分野ごとの弱点分析つき。",
});

export default async function IbdMoshiPage() {
  const all = await getIbdMoshi1Questions();
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
        <SiteLink href="/ibd/">インバウンド実務主任者</SiteLink>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（本番形式・87問）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験と同じ<strong>87問・120分・4肢択一</strong>で受験できる無料の模擬試験です。本試験の13課題をまとめた<strong>8分野から10〜11問ずつ</strong>出題し、本試験の合格基準（80%）に合わせて<strong>87問中70問以上</strong>を合格の目安として判定します。
        全員が同じ問題を同じ順序で解く固定問題なので、本番前の力試しに使えます。
      </p>

      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">出題数</span>
          　87問（観光・インバウンド総論11問・現状と動向11問・消費とビジネス11問・ニューツーリズムとまちづくり11問・訪日外国人の理解11問・対応11問・集客11問・国内旅行とアフターコロナ10問／4肢択一）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{IBD_MOSHI_TIME_LIMIT_MIN}
          分（自動採点）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　{IBD_MOSHI_PASS_COUNT}
          問以上（正答率約80%）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要
        </p>
      </div>

      <MoshiExam
        exam="ibd"
        round={1}
        sessionKey="shikakumon-ibd-moshi1-v1"
        questions={questions}
        timeLimitMin={IBD_MOSHI_TIME_LIMIT_MIN}
        passCount={IBD_MOSHI_PASS_COUNT}
        passLabel="87問中70問以上（正答率約80%）"
        choiceLabel="4肢択一"
        questionPathPrefix="/ibd/q/"
        topPath="/ibd/"
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本試験は課題13の3問が各2点の90点満点（合格72点以上）ですが、本模試は全問1点で採点しています。課題ごとの問題数も公表されていないため、当サイトの8分野からほぼ均等に出題しています。判定は学習の目安としてお使いください。当サイトが作成したオリジナル問題で構成しており、実際の過去問題の転載ではありません。
        1問ずつじっくり学びたい方は
        <SiteLink href="/ibd/" className="underline hover:no-underline">
          練習問題160問
        </SiteLink>
        へ。
      </p>
    </div>
  );
}
