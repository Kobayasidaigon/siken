import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getAiaMoshi1Questions, AIA_MOSHI_PASS_COUNT, AIA_MOSHI_TIME_LIMIT_MIN } from "@/lib/aia-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/aia/moshi/",
  title: "AI活用アドバイザー認定試験 模擬試験 第1回（無料）｜100問・105分・合否判定つき",
  description:
    "AI活用アドバイザー認定試験の無料模擬試験。本試験と同じ100問（2択48問＋4択52問）・105分で受験でき、152点満点・107点以上の合否判定、課題別の弱点分析を確認できます。",
});

/** 選択肢数ごとの1問あたり配点 */
const POINTS_BY_CHOICES: Record<number, number> = {"2":1,"4":2};

export default async function AiaMoshiPage() {
  const all = await getAiaMoshi1Questions();
  // 問題数が多いためページ重量対策で詳解は同梱せず、結果画面から各問題ページへ誘導する
  const questions: MoshiQuestion[] = all.map((q) => ({
    slug: q.slug,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    field: q.field,
    points: POINTS_BY_CHOICES[q.choices.length],
  }));

  return (
    <div className="theme-pii pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/aia/">AI活用アドバイザー</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験と同じ<strong>100問（2択48問＋4択52問）・105分・152点満点（107点以上で合格）</strong>で受験できる無料の模擬試験です。全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　100問　第1課題 AIの基礎知識・用語15＋第2課題 AIの技術15／生成AIの基礎知識10／AIプロジェクトの流れ5／企業・団体のAI導入事例35／人材・AIの導入動向10＋AIの制度・政策動向10</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　105分（自動採点）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">配点</span>　2択48問×1点＋4択52問×2点＝152点満点</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　70%以上（107点以上）。課題別の最低点の記載はない</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="aia"
        round={1}
        sessionKey="shikakumon-aia-moshi1-v1"
        questions={questions}
        timeLimitMin={AIA_MOSHI_TIME_LIMIT_MIN}
        passCount={AIA_MOSHI_PASS_COUNT}
        passLabel="70%（152点満点中107点）以上"
        choiceLabel="2択・4択"
        questionPathPrefix="/aia/q/"
        topPath="/aia/"
        passPoints={107}
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※公式の課題別問題数は、第1・第2課題を合わせて30問、第6・第7課題を合わせて20問としか読み取れず、この模試の内訳（15＋15、10＋10）は当サイトの想定です。本模試は当サイト編集部が作成したオリジナル問題で、公式問題の転載ではありません。AIの制度・事例は変化が早いため、解説の年月時点の記載を確認してください。
        1問ずつじっくり学びたい方は<a href="/aia/" className="underline hover:no-underline">練習問題</a>へ。
      </p>
    </div>
  );
}
