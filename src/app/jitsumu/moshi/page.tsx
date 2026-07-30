import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getJitsumuMoshi1Questions, JITSUMU_MOSHI_PASS_COUNT, JITSUMU_MOSHI_TIME_LIMIT_MIN } from "@/lib/jitsumu-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/jitsumu/moshi/",
  title: "個人情報保護実務検定 模擬試験 第1回（無料）｜2級形式80問・90分・合否判定つき",
  description:
    "個人情報保護実務検定の無料模擬試験。2級と同じ80問・90分・4肢択一・合格基準70%で受験でき、終了後に合否判定・分野別の弱点分析を確認できます。1級対策の腕試しにも。",
});

export default async function JitsumuMoshiPage() {
  const all = await getJitsumuMoshi1Questions();
  // 80問のためページ重量対策で詳解は同梱せず、結果画面から各問題ページへ誘導する
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
        <a href="/jitsumu/">個人情報保護実務検定</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（2級形式）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        2級の本試験と同じ<strong>80問・90分・4肢択一・合格基準70%</strong>で受験できる無料の模擬試験です。
        全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。
        出題内容は2級・1級の両方に通じる論点で構成しているため、1級対策の腕試しにも使えます（1級は100問・120分）。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　80問（4肢択一）　5分野から均等に出題</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{JITSUMU_MOSHI_TIME_LIMIT_MIN}分（自動採点）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　70%以上（{JITSUMU_MOSHI_PASS_COUNT}問/80問）＝2級本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="jitsumu"
        round={1}
        sessionKey="shikakumon-jitsumu-moshi1-v1"
        questions={questions}
        timeLimitMin={JITSUMU_MOSHI_TIME_LIMIT_MIN}
        passCount={JITSUMU_MOSHI_PASS_COUNT}
        passLabel="70%（80問中56問）以上"
        choiceLabel="4肢択一"
        questionPathPrefix="/jitsumu/q/"
        topPath="/jitsumu/"
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本模試は当サイト編集部が作成したオリジナル問題で構成しており、実際の過去問題の転載ではありません。
        本試験(2級)は課題Ⅰ60問:課題Ⅱ20問の配分で、課題ごとに70%以上が合格基準です(配点は非公表のため本模試は均等配点・総合70%で判定)。
        また、問題の難易度により正答率70%未満でも合格となる場合があると公式に案内されています。
        合否判定はあくまで学習の目安です。1問ずつじっくり学びたい方は
        <a href="/jitsumu/" className="underline hover:no-underline">練習問題200問</a>へ。
        上位資格を目指す方は<a href="/pii/moshi/" className="underline hover:no-underline">個人情報保護士の模擬試験</a>も。
      </p>
    </div>
  );
}
