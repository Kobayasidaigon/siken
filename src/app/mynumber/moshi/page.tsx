import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getMynumberMoshi1Questions, MYNUMBER_MOSHI_PASS_COUNT, MYNUMBER_MOSHI_TIME_LIMIT_MIN } from "@/lib/mynumber-moshi";
import { MYNUMBER_OX } from "@/lib/mynumber-moshi-ox";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/mynumber/moshi/",
  title: "マイナンバー実務検定3級 模擬試験 第1回（無料）｜本試験型○×+4択50問・75分",
  description:
    "マイナンバー実務検定3級の無料模擬試験。本試験(公式サンプル問題)と同じ○×+4肢択一の混合形式・50問・75分・合格基準70%で受験でき、終了後に合否判定・分野別の弱点分析・全問の詳しい解説を確認できます。",
});

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default async function MynumberMoshiPage() {
  const all = await getMynumberMoshi1Questions();
  // 本試験(公式サンプル)は○×と4択の混合。○×15問+既存4択35問(分野ローテ順を維持)の50問構成
  const questions: MoshiQuestion[] = [
    ...MYNUMBER_OX.map((o) => ({
      slug: o.id,
      questionText: `次の記述は正しいか、誤っているか。\n\n${o.statement}`,
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
    <div className="theme-pii pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/mynumber/">マイナンバー実務検定3級</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（本番形式）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験と同じ<strong>50問・75分・合格基準70%</strong>で受験できる無料の模擬試験です。
        公式サンプル問題にならい、<strong>○×(二肢択一)と4肢択一の混合形式</strong>で構成しています。
        全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。
        終了後は合否判定・分野別の弱点分析・全問の詳しい解説つき。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　50問（○×15問＋4肢択一35問）　5分野から出題</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{MYNUMBER_MOSHI_TIME_LIMIT_MIN}分（自動採点）＝本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　70%以上（{MYNUMBER_MOSHI_PASS_COUNT}問/50問）＝本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="mynumber"
        round={1}
        sessionKey="shikakumon-mynumber-moshi1-v2"
        questions={questions}
        timeLimitMin={MYNUMBER_MOSHI_TIME_LIMIT_MIN}
        passCount={MYNUMBER_MOSHI_PASS_COUNT}
        passLabel="70%（50問中35問）以上"
        choiceLabel="○×+4肢択一"
        questionPathPrefix="/mynumber/q/"
        topPath="/mynumber/"
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本試験の○×と4択の出題比率は非公表のため、公式サンプル問題の構成を参考にした比率(○×15問+4択35問)としています。
        また本試験では、問題の難易度により正答率70%未満でも合格となる場合があると公式に案内されています。
        本模試は当サイト編集部が作成したオリジナル問題で構成しており、実際の過去問題の転載ではありません。
        合否判定はあくまで学習の目安です。1問ずつじっくり学びたい方は
        <a href="/mynumber/" className="underline hover:no-underline">練習問題200問</a>へ。
      </p>
    </div>
  );
}
