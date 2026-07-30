import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getBijihouMoshi1Questions, BIJIHOU_MOSHI_PASS_COUNT, BIJIHOU_MOSHI_TIME_LIMIT_MIN } from "@/lib/bijihou-moshi";
import { BIJIHOU_OX } from "@/lib/bijihou-moshi-ox";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/bijihou/moshi/",
  title: "ビジネス実務法務検定3級 模擬試験 第1回（無料）｜本試験型○×+4択・90分・70点合格判定",
  description:
    "ビジネス実務法務検定3級の無料模擬試験。公式サンプル問題と同じ○×(二肢択一)を含む混合形式・90分・100点満点・70点合格の基準で受験でき、終了後に合格判定・分野別の弱点分析・全問の詳しい解説を確認できます。",
});

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default async function BijihouMoshiPage() {
  const all = await getBijihouMoshi1Questions();
  // 公式サンプル問題は○×(内容が正しければ①・誤っていれば②)形式。○×15問+既存4択35問の混合50問構成
  const questions: MoshiQuestion[] = [
    ...BIJIHOU_OX.map((o) => ({
      slug: o.id,
      questionText: `次の記述の内容は正しいか、誤っているか。\n\n${o.statement}`,
      choices: ["正しい", "誤っている"],
      correctAnswer: o.answer ? 1 : 2,
      field: o.field,
      explanationHtml: `<p>${escapeHtml(o.explain)}</p>`,
      noLink: true,
    })),
    ...all.slice(0, 35).map((q) => ({
      slug: q.slug,
      questionText: q.questionText,
      choices: q.choices,
      correctAnswer: q.correctAnswer,
      field: q.field,
      explanationHtml: q.content,
    })),
  ];

  return (
    <div className="theme-kashikin pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/bijihou/">ビジネス実務法務検定3級</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（本番形式）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験（IBT/CBT）と同じ<strong>90分・100点満点・70点以上で合格</strong>の基準で受験できる無料の模擬試験です。
        東商の公式サンプル問題にならい、<strong>○×(二肢択一)と4肢択一の混合形式</strong>で構成しています(50問×2点で採点)。
        全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。
        終了後は合格判定・分野別の弱点分析・全問の詳しい解説つき。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　50問×2点＝100点満点（○×15問＋4肢択一35問）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{BIJIHOU_MOSHI_TIME_LIMIT_MIN}分（自動採点）＝本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　70点以上（{BIJIHOU_MOSHI_PASS_COUNT}問/50問）＝本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="bijihou"
        round={1}
        sessionKey="shikakumon-bijihou-moshi1-v2"
        questions={questions}
        timeLimitMin={BIJIHOU_MOSHI_TIME_LIMIT_MIN}
        passCount={BIJIHOU_MOSHI_PASS_COUNT}
        passLabel="70点（50問中35問）以上"
        choiceLabel="○×+4肢択一"
        questionPathPrefix="/bijihou/q/"
        topPath="/bijihou/"
        pointsPerQuestion={2}
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本試験（IBT/CBT）の問題数・出題形式の内訳・配点は公式には公開されていないため、本模試は時間（90分）と
        採点基準（100点満点・70点合格）に準拠しつつ、公式サンプル問題(○×形式)を参考にした50問構成(均等2点)としています。
        当サイト編集部が作成したオリジナル問題で、実際の過去問題の転載ではありません。
        合格判定はあくまで学習の目安です。1問ずつじっくり学びたい方は
        <a href="/bijihou/" className="underline hover:no-underline">練習問題200問</a>へ。
      </p>
    </div>
  );
}
