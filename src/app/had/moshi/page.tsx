import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import {
  getHadMoshi1Questions,
  HAD_MOSHI_PASS_COUNT,
  HAD_MOSHI_TIME_LIMIT_MIN,
} from "@/lib/had-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/had/moshi/",
  title: "ハラスメントアドバイザー 模擬試験 第1回（無料）｜本番形式60問・90分",
  description:
    "ハラスメントアドバイザー認定試験の無料模擬試験。本試験と同じ60問・90分・4肢択一で、課題Ⅰ〜Ⅴから12問ずつから出題し、正答率70%の基準で判定します。課題ごと・分野ごとの弱点分析つき。",
});

export default async function HadMoshiPage() {
  const all = await getHadMoshi1Questions();
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
        <a href="/had/">ハラスメントアドバイザー</a>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（本番形式・60問）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験と同じ<strong>60問・90分・4肢択一</strong>で受験できる無料の模擬試験です。出題は本試験の課題に合わせ、
        <strong>課題Ⅰ〜Ⅴから12問ずつ</strong>から出題します。合否は本試験と同じ<strong>正答率70%（42問）以上</strong>で判定します。
        全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">出題数</span>
          　60問（課題Ⅰ ハラスメントの理解12問・課題Ⅱ 法的責任等12問・課題Ⅲ 雇用管理上講ずべき措置等12問・課題Ⅳ 予防・再発防止12問・課題Ⅴ 相談業務12問／4肢択一）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{HAD_MOSHI_TIME_LIMIT_MIN}
          分（自動採点）＝本試験と同じ
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　{HAD_MOSHI_PASS_COUNT}
          問以上（正答率70%）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要
        </p>
      </div>

      <MoshiExam
        exam="had"
        round={1}
        sessionKey="shikakumon-had-moshi1-v1"
        questions={questions}
        timeLimitMin={HAD_MOSHI_TIME_LIMIT_MIN}
        passCount={HAD_MOSHI_PASS_COUNT}
        passLabel="60問中42問以上（正答率70%）"
        choiceLabel="4肢択一"
        questionPathPrefix="/had/q/"
        topPath="/had/"
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本試験の課題ごとの問題数は公表されていないため、本模試は5課題から均等に出題しています。本試験では、問題の難易度により70%未満でも合格となる場合があると案内されています。本模試は調整を行わない素点判定なので、判定は学習の目安としてお使いください。当サイト編集部が作成したオリジナル問題で構成しており、実際の過去問題の転載ではありません。
        1問ずつじっくり学びたい方は
        <a href="/had/" className="underline hover:no-underline">
          練習問題160問
        </a>
        へ。
      </p>
    </div>
  );
}
