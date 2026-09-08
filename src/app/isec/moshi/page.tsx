import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import {
  getIsecMoshi1Questions,
  ISEC_MOSHI_PASS_COUNT,
  ISEC_MOSHI_TIME_LIMIT_MIN,
} from "@/lib/isec-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/isec/moshi/",
  title: "情報・サイバーセキュリティ管理士 模擬試験 第1回（無料）｜本番形式100問・120分",
  description:
    "情報・サイバーセキュリティ管理士認定試験の無料模擬試験。本試験と同じ100問・120分・4肢択一、4課題から25問ずつの構成で受験でき、正答率70%の合格基準で判定します。課題ごとの弱点分析つき。",
});

export default async function IsecMoshiPage() {
  const all = await getIsecMoshi1Questions();
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
        <a href="/">ホーム</a>
        <span>/</span>
        <a href="/isec/">情報・サイバーセキュリティ管理士</a>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（本番形式・100問）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験と同じ<strong>100問・120分・4肢択一</strong>で受験できる無料の模擬試験です。出題は本試験の4課題に合わせ、
        <strong>課題Ⅰ〜Ⅳから25問ずつ</strong>。合否は本試験と同じ<strong>正答率70%</strong>で判定します。
        全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">出題数</span>
          　100問（課題Ⅰ 情報セキュリティ総論25問・課題Ⅱ 脅威と情報セキュリティ対策25問・課題Ⅲ
          サイバーセキュリティ対策25問・課題Ⅳ コンピュータの一般知識25問／4肢択一）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{ISEC_MOSHI_TIME_LIMIT_MIN}
          分（自動採点）＝本試験と同じ
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　{ISEC_MOSHI_PASS_COUNT}
          問以上（正答率70%）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要
        </p>
      </div>

      <MoshiExam
        exam="isec"
        round={1}
        sessionKey="shikakumon-isec-moshi1-v1"
        questions={questions}
        timeLimitMin={ISEC_MOSHI_TIME_LIMIT_MIN}
        passCount={ISEC_MOSHI_PASS_COUNT}
        passLabel="100問中70問以上（正答率70%）"
        choiceLabel="4肢択一"
        questionPathPrefix="/isec/q/"
        topPath="/isec/"
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本試験の合格基準は正答率70%ですが、協会は「問題の難易度により調整し、正答率70%以下でも合格とする場合がある」と
        公表しています。本模試は調整を行わない素点判定なので、判定は学習の目安としてお使いください。
        当サイト編集部が作成したオリジナル問題で構成しており、実際の過去問題の転載ではありません。
        1問ずつじっくり学びたい方は
        <a href="/isec/" className="underline hover:no-underline">
          練習問題200問
        </a>
        へ。
      </p>
    </div>
  );
}
