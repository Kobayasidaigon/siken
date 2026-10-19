import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getHoikushiMoshi1Questions, HOIKUSHI_MOSHI_PASS_COUNT, HOIKUSHI_MOSHI_TIME_LIMIT_MIN, HOIKUSHI_MOSHI_SECTIONS } from "@/lib/hoikushi-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/hoikushi/moshi/",
  title: "保育士試験 筆記 模擬試験 第1回（無料）｜9科目160問・科目別6割の判定つき",
  description:
    "保育士試験（筆記）の無料模擬試験。本試験と同じ9科目160問（20問×7科目＋10問×2科目）・5肢で受験でき、科目ごとに満点の6割で合否を判定。教育原理と社会的養護は両方6割が条件です。",
});

export default async function HoikushiMoshiPage() {
  const all = await getHoikushiMoshi1Questions();
  // 問題数が多いためページ重量対策で詳解は同梱せず、結果画面から各問題ページへ誘導する
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
        <a href="/hoikushi/">保育士試験（筆記）</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験と同じ<strong>9科目160問（20問×7科目＋10問×2科目）・5肢</strong>の無料模擬試験です。全員が同じ問題を同じ順序で解く固定問題で、科目ごとに満点の6割を超えているかを判定します。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　160問（5肢択一）　保育の心理学→保育原理→子ども家庭福祉→社会福祉→教育原理→社会的養護→子どもの保健→子どもの食と栄養→保育実習理論</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　480分（本試験は2日間で、60分×7科目＋30分×2科目＝480分。この模試は通しで計測し、途中で閉じても続きから再開できます）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　各科目で満点の6割以上（20問科目は12問以上、10問科目は6問以上）。教育原理と社会的養護は両方必要</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="hoikushi"
        round={1}
        sessionKey="shikakumon-hoikushi-moshi1-v1"
        questions={questions}
        timeLimitMin={HOIKUSHI_MOSHI_TIME_LIMIT_MIN}
        passCount={HOIKUSHI_MOSHI_PASS_COUNT}
        passLabel="各科目で満点の6割以上（20問科目12問・10問科目6問）"
        choiceLabel="5肢択一"
        questionPathPrefix="/hoikushi/q/"
        topPath="/hoikushi/"
        sections={HOIKUSHI_MOSHI_SECTIONS}
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本試験には「正しいものを2つ選ぶ」「3つ選ぶ」問題がありますが、この模試はすべて1つ選ぶ形式に統一しています。全科目を通しで解くと長時間になるため、科目を絞って練習したい方は、トップページの分野別の問題から進めてください。本模試は当サイト編集部が作成したオリジナル問題で、公表問題の転載ではありません。法令・指針は令和8年4月1日施行分を基準にしています。
        1問ずつじっくり学びたい方は<a href="/hoikushi/" className="underline hover:no-underline">練習問題</a>へ。
      </p>
    </div>
  );
}
