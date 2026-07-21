import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getMoshi1Questions, MOSHI_PASS_COUNT, MOSHI_TIME_LIMIT_MIN } from "@/lib/chizai-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/chizai/moshi/",
  title: "知的財産管理技能検定3級 模擬試験 第1回（無料）｜本番形式30問・45分・合否判定つき",
  description:
    "知的財産管理技能検定3級（学科）の無料模擬試験。本試験と同じ30問・45分・3肢択一・合格基準70%で受験でき、終了後に合否判定・分野別の弱点分析・全問の詳しい解説を確認できます。",
});

export default async function ChizaiMoshiPage() {
  const all = await getMoshi1Questions();
  const questions: MoshiQuestion[] = all.map((q) => ({
    slug: q.slug,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    field: q.field,
    explanationHtml: q.content,
  }));

  return (
    <div className="theme-chizai pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/chizai/">知的財産管理技能検定3級</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（学科・本番形式）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-chizai)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験（学科）と同じ<strong>30問・45分・3肢択一・合格基準70%</strong>で受験できる無料の模擬試験です。
        全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。
        終了後は合否判定・分野別の弱点分析・全問の詳しい解説つき。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　30問（3肢択一）　本試験の分野構成に準拠</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{MOSHI_TIME_LIMIT_MIN}分（自動採点）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　70%以上（{MOSHI_PASS_COUNT}問/30問）＝本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="chizai"
        round={1}
        sessionKey="shikakumon-chizai-moshi1-v1"
        questions={questions}
        timeLimitMin={MOSHI_TIME_LIMIT_MIN}
        passCount={MOSHI_PASS_COUNT}
        passLabel="70%（30問中21問）以上"
        choiceLabel="3肢択一"
        questionPathPrefix="/chizai/q/"
        topPath="/chizai/"
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本模試は当サイト編集部が作成したオリジナル問題で構成しており、実際の過去問題の転載ではありません。
        合否判定はあくまで学習の目安です。時間を計らずに力試しをしたい方は
        <a href="/chizai/mock/" className="underline hover:no-underline">本番形式テスト（ランダム20問）</a>へ、
        1問ずつじっくり学びたい方は<a href="/chizai/" className="underline hover:no-underline">練習問題200問</a>へ。
      </p>
    </div>
  );
}
