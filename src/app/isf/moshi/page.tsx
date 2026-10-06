import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import {
  getIsfMoshi1Questions,
  ISF_MOSHI_PASS_COUNT,
  ISF_MOSHI_TIME_LIMIT_MIN,
} from "@/lib/isf-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/isf/moshi/",
  title: "情報・サイバーセキュリティ初級 模擬試験 第1回（無料）｜本番形式80問・60分",
  description:
    "情報・サイバーセキュリティ初級認定試験の無料模擬試験。本試験と同じ80問・60分・4肢択一、4課題から20問ずつの構成で受験でき、課題ごとに70%の基準で判定します。分野ごとの弱点分析つき。",
});

export default async function IsfMoshiPage() {
  const all = await getIsfMoshi1Questions();
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
        <a href="/isf/">情報・サイバーセキュリティ初級</a>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（本番形式・80問）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験と同じ<strong>80問・60分・4肢択一</strong>で受験できる無料の模擬試験です。出題は本試験の4課題に合わせ、
        <strong>課題Ⅰ〜Ⅳから20問ずつ</strong>。合否は<strong>各課題とも70%（20問中14問）以上</strong>で判定します。
        全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">出題数</span>
          　80問（課題Ⅰ 情報セキュリティ総論20問・課題Ⅱ 脅威と情報セキュリティ対策①20問・課題Ⅲ 脅威と情報セキュリティ対策②20問・課題Ⅳ コンピュータの一般知識20問／4肢択一）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{ISF_MOSHI_TIME_LIMIT_MIN}
          分（自動採点）＝本試験と同じ
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　{ISF_MOSHI_PASS_COUNT}
          問以上（正答率70%。各課題とも20問中14問以上）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要
        </p>
      </div>

      <MoshiExam
        exam="isf"
        round={1}
        sessionKey="shikakumon-isf-moshi1-v1"
        questions={questions}
        timeLimitMin={ISF_MOSHI_TIME_LIMIT_MIN}
        passCount={ISF_MOSHI_PASS_COUNT}
        passLabel="80問中56問以上（各課題20問中14問以上）"
        choiceLabel="4肢択一"
        questionPathPrefix="/isf/q/"
        topPath="/isf/"
        sections={[
          { label: "課題Ⅰ（情報セキュリティ総論）", start: 0, count: 20, passCount: 14 },
          { label: "課題Ⅱ（脅威と対策①）", start: 20, count: 20, passCount: 14 },
          { label: "課題Ⅲ（脅威と対策②）", start: 40, count: 20, passCount: 14 },
          { label: "課題Ⅳ（コンピュータの一般知識）", start: 60, count: 20, passCount: 14 },
        ]}
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本試験では、問題の難易度により正答率70%未満でも合格となる場合があると案内されています。本模試は調整を行わない素点判定なので、
        判定は学習の目安としてお使いください。当サイト編集部が作成したオリジナル問題で構成しており、実際の過去問題の転載ではありません。
        1問ずつじっくり学びたい方は
        <a href="/isf/" className="underline hover:no-underline">
          練習問題160問
        </a>
        へ。
      </p>
    </div>
  );
}
