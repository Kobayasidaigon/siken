import SiteLink from "@/components/SiteLink";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import {
  getMynumber2Moshi1,
  MYNUMBER2_MOSHI_PASS_COUNT,
  MYNUMBER2_MOSHI_TIME_LIMIT_MIN,
} from "@/lib/mynumber2-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/mynumber2/moshi/",
  title: "マイナンバー実務検定2級 模擬試験 第1回（無料）｜60問・105分・合否判定つき",
  description:
    "マイナンバー実務検定2級の無料模擬試験。本試験と同じ60問・105分・70%以上の基準で、協会の出題項目に沿った6分野から4肢択一60問を受験できます。終了後に合格判定・分野別の弱点分析・全問の解説を確認できます。登録不要。",
});

export default async function Mynumber2MoshiPage() {
  const takuitsu = await getMynumber2Moshi1();
  const questions: MoshiQuestion[] = takuitsu.map((q) => ({
    slug: q.slug,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    field: q.field,
    explanationHtml: q.content,
  }));

  return (
    <div className="theme-pii pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <SiteLink href="/">ホーム</SiteLink><span>/</span>
        <SiteLink href="/mynumber2/">マイナンバー実務検定2級</SiteLink><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        2級の本試験と同じ<strong>60問・105分・70%以上で合格</strong>の基準で受験できる無料の模擬試験です。
        全員が同じ問題を同じ順序で解く固定問題なので、本番前の力試しに使えます。
        出題は、協会の出題項目に沿った当サイトの6分野から10問ずつ選んでいます。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　4肢択一60問＝本試験と同じ問題数（分野ごとの問題数は当サイトの想定）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{MYNUMBER2_MOSHI_TIME_LIMIT_MIN}分（自動採点）＝本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　70%以上（{MYNUMBER2_MOSHI_PASS_COUNT}問/60問）＝本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="mynumber2"
        round={1}
        sessionKey="shikakumon-mynumber2-moshi1-v1"
        questions={questions}
        timeLimitMin={MYNUMBER2_MOSHI_TIME_LIMIT_MIN}
        passCount={MYNUMBER2_MOSHI_PASS_COUNT}
        passLabel="70%（60問中42問）以上"
        choiceLabel="4肢択一"
        questionPathPrefix="/mynumber2/q/"
        topPath="/mynumber2/"
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本試験の問題数（60問）・時間（105分）・合格基準（70%以上）は、全日本情報学習振興協会の試験ページで確認したものです。協会は、問題の難易度により70%未満でも合格とする場合があるとしています。
        分野ごとの問題数は公表されていないため、本模試の6分野×10問という配分は当サイトの想定です。
        問題はすべて当サイトで作成したオリジナルで、実際の試験問題の転載ではありません。合格判定はあくまで学習の目安です。
        時間を計らずに力試しをしたい方は
        <SiteLink href="/mynumber2/mock/" className="underline hover:no-underline">腕試しテスト（ランダム20問）</SiteLink>へ、
        1問ずつじっくり学びたい方は<SiteLink href="/mynumber2/" className="underline hover:no-underline">練習問題</SiteLink>へ。
      </p>
    </div>
  );
}
