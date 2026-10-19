import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getTouhanMoshi1Questions, TOUHAN_MOSHI_PASS_COUNT, TOUHAN_MOSHI_TIME_LIMIT_MIN, TOUHAN_MOSHI_SECTIONS } from "@/lib/touhan-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/touhan/moshi/",
  title: "登録販売者 模擬試験 第1回（無料）｜120問・240分・総合7割と章別の判定つき",
  description:
    "登録販売者試験の無料模擬試験。本試験と同じ120問（第1〜5章を20・20・40・20・20問）・240分・5肢択一で受験でき、総合7割（84点）と各章の足切りで合否を判定します。",
});

export default async function TouhanMoshiPage() {
  const all = await getTouhanMoshi1Questions();
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
        <a href="/touhan/">登録販売者</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験と同じ<strong>120問（20・20・40・20・20問）・240分・5肢択一</strong>の無料模擬試験です。全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　120問（5肢択一）　第1章20問→第2章20問→第3章40問→第4章20問→第5章20問</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　240分（本試験の午前120分＋午後120分の合計。通しで計測し、途中で閉じても続きから再開できます）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　合計84点以上（7割）、かつ各章の得点率が3.5割以上（第1・2・4・5章は7問以上、第3章は14問以上）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="touhan"
        round={1}
        sessionKey="shikakumon-touhan-moshi1-v1"
        questions={questions}
        timeLimitMin={TOUHAN_MOSHI_TIME_LIMIT_MIN}
        passCount={TOUHAN_MOSHI_PASS_COUNT}
        passLabel="合計84点以上（7割）かつ各章3.5割以上"
        choiceLabel="5肢択一"
        questionPathPrefix="/touhan/q/"
        topPath="/touhan/"
        sections={TOUHAN_MOSHI_SECTIONS}
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本模試は当サイト編集部が作成したオリジナル問題で、実際の公表問題の転載ではありません。章別の足切りは東京都などの3.5割を基準にしています（県により4割のところがあります）。午前・午後に入る章は都道府県で異なるため、この模試は章の順に出題します。合否判定は学習の目安です。法令・制度は2026年10月時点の内容です。
        1問ずつじっくり学びたい方は<a href="/touhan/" className="underline hover:no-underline">練習問題</a>へ。
      </p>
    </div>
  );
}
