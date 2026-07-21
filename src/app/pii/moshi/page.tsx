import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getPiiMoshi1Questions, PII_MOSHI_PASS_COUNT, PII_MOSHI_TIME_LIMIT_MIN } from "@/lib/pii-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/pii/moshi/",
  title: "個人情報保護士 模擬試験 第1回（無料）｜本番形式100問・150分・課題別判定つき",
  description:
    "個人情報保護士認定試験の無料模擬試験。本試験と同じ100問（課題Ⅰ50問+課題Ⅱ50問）・150分・4肢択一で受験でき、本試験と同じ「各課題70%以上」で課題別に合否判定。分野別の弱点分析つきです。",
});

export default async function PiiMoshiPage() {
  const all = await getPiiMoshi1Questions();
  // 100問のためページ重量対策で詳解は同梱せず、結果画面から各問題ページへ誘導する
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
        <a href="/pii/">個人情報保護士</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（本番形式・100問）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験と同じ<strong>100問（課題Ⅰ50問＋課題Ⅱ50問）・150分・4肢択一</strong>で受験できる無料の模擬試験です。
        合否判定も本試験と同じ<strong>「各課題70%以上」</strong>で課題ごとに行います。
        全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　100問（課題Ⅰ 50問＋課題Ⅱ 50問・4肢択一）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{PII_MOSHI_TIME_LIMIT_MIN}分（自動採点）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　各課題70%以上（各50問中35問）＝本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="pii"
        round={1}
        sessionKey="shikakumon-pii-moshi1-v1"
        questions={questions}
        timeLimitMin={PII_MOSHI_TIME_LIMIT_MIN}
        passCount={PII_MOSHI_PASS_COUNT}
        passLabel="各課題70%（各50問中35問）以上"
        choiceLabel="4肢択一"
        questionPathPrefix="/pii/q/"
        topPath="/pii/"
        sections={[
          { label: "課題Ⅰ（個人情報保護の総論）", start: 0, count: 50, passCount: 35 },
          { label: "課題Ⅱ（対策と情報セキュリティ）", start: 50, count: 50, passCount: 35 },
        ]}
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本模試は当サイト編集部が作成したオリジナル問題で構成しており、実際の過去問題の転載ではありません。
        合否判定はあくまで学習の目安です。時間を計らずに力試しをしたい方は
        <a href="/pii/mock/" className="underline hover:no-underline">本番形式テスト（ランダム20問）</a>へ、
        1問ずつじっくり学びたい方は<a href="/pii/" className="underline hover:no-underline">練習問題300問</a>へ。
      </p>
    </div>
  );
}
