import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import {
  getKashikinMoshi1Questions,
  KASHIKIN_MOSHI_PASS_COUNT,
  KASHIKIN_MOSHI_TIME_LIMIT_MIN,
} from "@/lib/kashikin-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

/**
 * 貸金業務取扱主任者の模擬試験 第1回。2026-09-09 新設。
 *
 * この資格だけ無料の第1回模試が無く、A8 の主力資格なのに「模試完了者が最も転換する」
 * 面が存在しない状態だった。試験は年1回11月で、申込締切前が成果の窓になる。
 */

export const metadata: Metadata = pageMetadata({
  path: "/kashikin/moshi/",
  title: "貸金業務取扱主任者 模擬試験 第1回（無料）｜本番形式50問・120分",
  description:
    "貸金業務取扱主任者の無料模擬試験。本試験と同じ四肢択一50問・120分、協会の出題区分に沿った配分で受験でき、合格ラインの30点で判定します。分野別の弱点分析つき・登録不要。",
});

export default async function KashikinMoshiPage() {
  const all = await getKashikinMoshi1Questions();
  // 50問ぶんの詳解を同梱するとページが重くなるため、結果画面から各問題ページへ誘導する
  const questions: MoshiQuestion[] = all.map((q) => ({
    slug: q.slug,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    field: q.field,
  }));

  return (
    <div className="theme-kashikin pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a>
        <span>/</span>
        <a href="/kashikin/">貸金業務取扱主任者</a>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（本番形式・50問）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験と同じ<strong>四肢択一50問・120分</strong>で受験できる無料の模擬試験です。出題の配分は
        日本貸金業協会の出題区分に沿えてあり、合否は本試験の合格ラインにならって
        <strong>50問中30問</strong>で判定します。全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">出題数</span>
          　50問（貸金業法30問・民法・民事訴訟法8問・利息制限法・出資法7問・資金需要者等の保護5問／四肢択一）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">制限時間</span>
          {KASHIKIN_MOSHI_TIME_LIMIT_MIN}分（自動採点）＝本試験と同じ
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>
          {KASHIKIN_MOSHI_PASS_COUNT}問以上（本試験の合格ラインは回により変動し、概ね30点前後）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要
        </p>
      </div>

      <MoshiExam
        exam="kashikin"
        round={1}
        sessionKey="shikakumon-kashikin-moshi1-v1"
        questions={questions}
        timeLimitMin={KASHIKIN_MOSHI_TIME_LIMIT_MIN}
        passCount={KASHIKIN_MOSHI_PASS_COUNT}
        passLabel="50問中30問以上"
        choiceLabel="四肢択一"
        questionPathPrefix="/q/"
        topPath="/kashikin/"
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本試験の出題区分は「法及び関係法令27問／貸付け及び付随取引の法令・実務15問／資金需要者等の保護5問／
        財務及び会計3問」です。当サイトは<strong>財務及び会計を収録していない</strong>ため、その3問ぶんを
        法令分野（貸金業法）に振り替えて50問に揃えています。財務会計は本試験で3問出るので、この模試の点数に
        その分は含まれません。
        <br />
        本試験の合格基準は回ごとに決まり、30点で固定されているわけではありません。ここでの判定は学習の目安です。
        当サイト編集部が作成したオリジナル問題で構成しており、実際の過去問題の転載ではありません。
        1問ずつじっくり学びたい方は
        <a href="/kashikin/" className="underline hover:no-underline">
          練習問題504問
        </a>
        へ。
      </p>
    </div>
  );
}
