import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import {
  getCcmMoshi1Questions,
  CCM_MOSHI_PASS_COUNT,
  CCM_MOSHI_TIME_LIMIT_MIN,
} from "@/lib/ccm-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/ccm/moshi/",
  title: "企業危機・コンプライアンス管理士 模擬試験 第1回（無料）｜本番形式80問・120分",
  description:
    "企業危機・コンプライアンス管理士認定試験の無料模擬試験。本試験と同じ80問・120分・4肢択一で、第1〜第6課題から出題し、正答率70%の基準で判定します。課題ごと・分野ごとの弱点分析つき。",
});

export default async function CcmMoshiPage() {
  const all = await getCcmMoshi1Questions();
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
        <a href="/ccm/">企業危機・コンプライアンス管理士</a>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（本番形式・80問）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験と同じ<strong>80問・120分・4肢択一</strong>で受験できる無料の模擬試験です。出題は本試験の課題に合わせ、
        <strong>第1〜第6課題</strong>から出題します。合否は本試験と同じ<strong>正答率70%（56問）以上</strong>で判定します。
        全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">出題数</span>
          　80問（第1課題 企業の社会的責任16問・第2課題 リスクと危機12問・第3課題 危機管理体制の構築12問・第4課題 危機管理広報12問・第5課題 企業危機各論16問・第6課題 自然災害と危機管理12問／4肢択一）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{CCM_MOSHI_TIME_LIMIT_MIN}
          分（自動採点）＝本試験と同じ
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　{CCM_MOSHI_PASS_COUNT}
          問以上（正答率70%）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要
        </p>
      </div>

      <MoshiExam
        exam="ccm"
        round={1}
        sessionKey="shikakumon-ccm-moshi1-v1"
        questions={questions}
        timeLimitMin={CCM_MOSHI_TIME_LIMIT_MIN}
        passCount={CCM_MOSHI_PASS_COUNT}
        passLabel="80問中56問以上（正答率70%）"
        choiceLabel="4肢択一"
        questionPathPrefix="/ccm/q/"
        topPath="/ccm/"
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本試験の課題ごとの問題数は公表されていないため、本模試は当サイトの分野の数に合わせて配分しています（第1・第5課題が16問、ほかは12問）。本模試は調整を行わない素点判定なので、判定は学習の目安としてお使いください。当サイト編集部が作成したオリジナル問題で構成しており、実際の過去問題の転載ではありません。
        1問ずつじっくり学びたい方は
        <a href="/ccm/" className="underline hover:no-underline">
          練習問題160問
        </a>
        へ。
      </p>
    </div>
  );
}
