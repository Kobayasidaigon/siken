import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import {
  getDxpMoshi1Questions,
  DXP_MOSHI_PASS_COUNT,
  DXP_MOSHI_TIME_LIMIT_MIN,
} from "@/lib/dxp-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/dxp/moshi/",
  title: "DXパスポート試験 模擬試験 第1回（無料）｜本番形式60問・60分",
  description:
    "DXパスポート試験の無料模擬試験。本試験と同じ60問・60分、各課題30問（2択15問・4択15問）の構成で受験でき、課題ごとに70%の基準で判定します。分野ごとの弱点分析つき。",
});

export default async function DxpMoshiPage() {
  const all = await getDxpMoshi1Questions();
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
        <a href="/dxp/">DXパスポート試験</a>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（本番形式・60問）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験と同じ<strong>60問・60分</strong>で受験できる無料の模擬試験です。出題は本試験に合わせ、
        <strong>第1課題「DXの現状」30問・第2課題「DXの技術」30問</strong>（各課題とも2択15問・4択15問）。
        合否は<strong>各課題とも70%（30問中21問）以上</strong>で判定します。全員が同じ問題を同じ順序で解く固定問題です。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">出題数</span>
          　60問（第1課題 DXの現状30問・第2課題 DXの技術30問／各課題とも2択15問・4択15問）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{DXP_MOSHI_TIME_LIMIT_MIN}
          分（自動採点）＝本試験と同じ
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　{DXP_MOSHI_PASS_COUNT}
          問以上（正答率70%。各課題とも30問中21問以上）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要
        </p>
      </div>

      <MoshiExam
        exam="dxp"
        round={1}
        sessionKey="shikakumon-dxp-moshi1-v1"
        questions={questions}
        timeLimitMin={DXP_MOSHI_TIME_LIMIT_MIN}
        passCount={DXP_MOSHI_PASS_COUNT}
        passLabel="60問中42問以上（各課題30問中21問以上）"
        choiceLabel="2択・4択"
        questionPathPrefix="/dxp/q/"
        topPath="/dxp/"
        sections={[
          { label: "第1課題（DXの現状）", start: 0, count: 30, passCount: 21 },
          { label: "第2課題（DXの技術）", start: 30, count: 30, passCount: 21 },
        ]}
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本模試は問題数で判定しています。本試験の配点（2択と4択の点数の違いなど）や、難易度による合格基準の調整は反映していないので、
        判定は学習の目安としてお使いください。当サイト編集部が作成したオリジナル問題で構成しており、実際の過去問題の転載ではありません。
        1問ずつじっくり学びたい方は
        <a href="/dxp/" className="underline hover:no-underline">
          練習問題160問
        </a>
        へ。
      </p>
    </div>
  );
}
