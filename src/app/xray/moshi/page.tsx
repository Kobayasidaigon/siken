import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getXrayMoshi1Questions, XRAY_MOSHI_PASS_COUNT, XRAY_MOSHI_TIME_LIMIT_MIN, XRAY_MOSHI_SECTIONS } from "@/lib/xray-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/xray/moshi/",
  title: "エックス線作業主任者 模擬試験 第1回（無料）｜40問・240分・科目別40%と合計60%の判定つき",
  description:
    "エックス線作業主任者の無料模擬試験。本試験と同じ40問（各科目10問）・240分・五肢択一で受験でき、科目ごとの足切り（40%）と合計60点の合否判定、分野別の弱点分析を確認できます。",
});

/** 科目ごとの1問あたり配点(協会公表の科目別満点を問題数で割った当サイトの換算) */
const POINTS_BY_FIELD: Record<string, number> = {"エックス線の管理":3,"関係法令":2,"エックス線の測定":2.5,"生体に与える影響":2.5};

export default async function XrayMoshiPage() {
  const all = await getXrayMoshi1Questions();
  // 問題数が多いためページ重量対策で詳解は同梱せず、結果画面から各問題ページへ誘導する
  const questions: MoshiQuestion[] = all.map((q) => ({
    slug: q.slug,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    field: q.field,
    points: POINTS_BY_FIELD[q.field],
  }));

  return (
    <div className="theme-pii pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/xray/">エックス線作業主任者</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験と同じ<strong>40問（4科目×10問）・240分・五肢択一</strong>で受験できる無料の模擬試験です。全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　40問（五肢択一）　エックス線の管理10問→関係法令10問→エックス線の測定10問→生体に与える影響10問</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　240分（本試験の全科目受験と同じ・自動採点）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">配点</span>　管理 1問3点／関係法令 1問2点／測定・生体 1問2.5点（計100点）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　科目ごとに4問以上（満点の40%）、かつ合計60点以上</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="xray"
        round={1}
        sessionKey="shikakumon-xray-moshi1-v1"
        questions={questions}
        timeLimitMin={XRAY_MOSHI_TIME_LIMIT_MIN}
        passCount={XRAY_MOSHI_PASS_COUNT}
        passLabel="合計60点以上（100点満点）かつ各科目4問以上（満点の40%）"
        choiceLabel="五肢択一"
        questionPathPrefix="/xray/q/"
        topPath="/xray/"
        sections={XRAY_MOSHI_SECTIONS}
        passPoints={60}
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本模試は当サイト編集部が作成したオリジナル問題で構成しており、実際の公表問題の転載ではありません。1問ごとの配点は協会が公表している科目別の満点（管理30点・法令20点・測定25点・生体25点）を問題数で割った当サイト独自の換算です。合否判定は学習の目安です。法令は2026年10月19日時点の施行内容に基づきます。
        1問ずつじっくり学びたい方は<a href="/xray/" className="underline hover:no-underline">練習問題</a>へ。
      </p>
    </div>
  );
}
