import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getBijihou2Moshi1Questions, BIJIHOU2_MOSHI_PASS_COUNT, BIJIHOU2_MOSHI_TIME_LIMIT_MIN } from "@/lib/bijihou2-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

// 2026-09-05 新設。資格トップの「模擬試験を受ける」が存在しないこのURLを指していて404だった。
// 模試の結果画面は全CTA設置面で最も転換率が高い(moshi_result)ため、受け皿を用意する。
export const metadata: Metadata = pageMetadata({
  path: "/bijihou2/moshi/",
  title: "ビジネス実務法務検定2級 模擬試験 第1回（無料）｜本番形式50問・90分・70点合格判定",
  description:
    "ビジネス実務法務検定2級の無料模擬試験。本試験(IBT/CBT)と同じ90分・100点満点・70点合格の基準で受験でき、終了後に合格判定・分野別の弱点分析・全問の詳しい解説を確認できます。",
});

export default async function Bijihou2MoshiPage() {
  const all = await getBijihou2Moshi1Questions();
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
        <a href="/bijihou2/">ビジネス実務法務検定2級</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（本番形式）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験（IBT/CBT）と同じ<strong>90分・100点満点・70点以上で合格</strong>の基準で受験できる無料の模擬試験です。
        公式テキストの全10章から均等に出題した<strong>4肢択一50問（各2点）</strong>で構成しています。
        全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。
        終了後は合格判定・分野別の弱点分析・全問の詳しい解説つき。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　50問×2点＝100点満点（4肢択一）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{BIJIHOU2_MOSHI_TIME_LIMIT_MIN}分（自動採点）＝本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　70点以上（{BIJIHOU2_MOSHI_PASS_COUNT}問/50問）＝本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="bijihou2"
        round={1}
        sessionKey="shikakumon-bijihou2-moshi1-v1"
        questions={questions}
        timeLimitMin={BIJIHOU2_MOSHI_TIME_LIMIT_MIN}
        passCount={BIJIHOU2_MOSHI_PASS_COUNT}
        passLabel="70点（50問中35問）以上"
        choiceLabel="4肢択一"
        questionPathPrefix="/bijihou2/q/"
        topPath="/bijihou2/"
        pointsPerQuestion={2}
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本試験（IBT/CBT）の問題数・出題形式の内訳・配点は公式には公開されていないため、本模試は時間（90分）と
        採点基準（100点満点・70点合格）に準拠しつつ、50問構成（均等2点）としています。
        当サイト編集部が作成したオリジナル問題で、実際の過去問題の転載ではありません。
        合格判定はあくまで学習の目安です。1問ずつじっくり学びたい方は
        <a href="/bijihou2/" className="underline hover:no-underline">練習問題200問</a>へ、
        3級から固めたい方は<a href="/bijihou/moshi/" className="underline hover:no-underline">3級の模擬試験</a>へ。
      </p>
    </div>
  );
}
