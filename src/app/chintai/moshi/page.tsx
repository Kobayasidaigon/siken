import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getChintaiMoshi1Questions, CHINTAI_MOSHI_PASS_COUNT, CHINTAI_MOSHI_TIME_LIMIT_MIN } from "@/lib/chintai-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

// 2026-09-05 新設。資格トップの「模擬試験を受ける」が存在しないこのURLを指していて404だった。
// 模試の結果画面は全CTA設置面で最も転換率が高い(moshi_result)ため、受け皿を用意する。
export const metadata: Metadata = pageMetadata({
  path: "/chintai/moshi/",
  title: "賃貸不動産経営管理士 模擬試験 第1回（無料）｜本番形式50問・120分・合格点判定つき",
  description:
    "賃貸不動産経営管理士試験の無料模擬試験。本試験と同じ50問・120分・4肢択一で受験でき、令和7年度の合格基準点（50問中38点）で合否を判定。終了後に分野別の弱点分析と全問の詳しい解説を確認できます。",
});

export default async function ChintaiMoshiPage() {
  const all = await getChintaiMoshi1Questions();
  const questions: MoshiQuestion[] = all.map((q) => ({
    slug: q.slug,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    field: q.field,
    explanationHtml: q.content,
  }));

  return (
    <div className="theme-kashikin pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/chintai/">賃貸不動産経営管理士</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（本番形式）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験と同じ<strong>50問・120分・4肢択一</strong>で受験できる無料の模擬試験です。
        分野の配分は令和7年度の出題実績（賃貸住宅管理業法が最多）に寄せ、合否は<strong>令和7年度の合格基準点（50問中38点）</strong>で判定します。
        全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。
        終了後は合否判定・分野別の弱点分析・全問の詳しい解説つき。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　50問（4肢択一）　本試験の分野配分に準拠</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{CHINTAI_MOSHI_TIME_LIMIT_MIN}分（自動採点）＝本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　{CHINTAI_MOSHI_PASS_COUNT}問/50問以上（令和7年度の合格基準点。年度ごとに変動します）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="chintai"
        round={1}
        sessionKey="shikakumon-chintai-moshi1-v1"
        questions={questions}
        timeLimitMin={CHINTAI_MOSHI_TIME_LIMIT_MIN}
        passCount={CHINTAI_MOSHI_PASS_COUNT}
        passLabel="38問（50問中）以上"
        choiceLabel="4肢択一"
        questionPathPrefix="/chintai/q/"
        topPath="/chintai/"
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本模試は当サイト編集部が作成したオリジナル問題で構成しており、実際の過去問題の転載ではありません。
        本試験の合格基準点は年度ごとに決定され（令和7年度38点・令和6年度以前は35〜36点前後）、5問免除者は45問・110分での受験になります。
        合否判定はあくまで学習の目安です。1問ずつじっくり学びたい方は
        <a href="/chintai/" className="underline hover:no-underline">練習問題200問</a>へ、
        試験直前の進め方は<a href="/column/chintai-chokuzen/" className="underline hover:no-underline">直前対策コラム</a>へ。
      </p>
    </div>
  );
}
