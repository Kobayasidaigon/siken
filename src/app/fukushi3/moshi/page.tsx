import SiteLink from "@/components/SiteLink";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import {
  getFukushi3Moshi1,
  FUKUSHI3_MOSHI_PASS_COUNT,
  FUKUSHI3_MOSHI_PASS_POINTS,
  FUKUSHI3_MOSHI_TIME_LIMIT_MIN,
} from "@/lib/fukushi3-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/fukushi3/moshi/",
  title: "福祉住環境コーディネーター3級 模擬試験 第1回（無料）｜4肢択一50問・90分・70点判定",
  description:
    "福祉住環境コーディネーター3級の無料模擬試験。本試験と同じ90分・100点満点70点以上の基準で、公式テキストの章に沿った6分野から4肢択一50問を受験できます。終了後に合格判定・分野別の弱点分析・全問の解説を確認できます。登録不要。",
});

export default async function Fukushi3MoshiPage() {
  const takuitsu = await getFukushi3Moshi1();
  const questions: MoshiQuestion[] = takuitsu.map((q) => ({
    slug: q.slug,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    field: q.field,
    explanationHtml: q.content,
    points: q.points,
  }));

  return (
    <div className="theme-fukushi pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <SiteLink href="/">ホーム</SiteLink><span>/</span>
        <SiteLink href="/fukushi3/">福祉住環境コーディネーター3級</SiteLink><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験（IBT/CBT）と同じ<strong>90分・100点満点・70点以上で合格</strong>の基準で受験できる無料の模擬試験です。
        全員が同じ問題を同じ順序で解く固定問題なので、本番前の力試しに使えます。
        出題は、3級公式テキストの章に沿った6分野から8〜9問ずつ選び、章の順に並べています。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　4肢択一50問×各2点＝100点満点（当サイト独自の構成）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{FUKUSHI3_MOSHI_TIME_LIMIT_MIN}分（自動採点）＝本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　{FUKUSHI3_MOSHI_PASS_POINTS}点以上（{FUKUSHI3_MOSHI_PASS_COUNT}問正解）＝本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="fukushi3"
        round={1}
        sessionKey="shikakumon-fukushi3-moshi1-v1"
        questions={questions}
        timeLimitMin={FUKUSHI3_MOSHI_TIME_LIMIT_MIN}
        passCount={FUKUSHI3_MOSHI_PASS_COUNT}
        passLabel="70点／100点満点 以上"
        choiceLabel="4肢択一"
        questionPathPrefix="/fukushi3/q/"
        topPath="/fukushi3/"
        passPoints={FUKUSHI3_MOSHI_PASS_POINTS}
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本試験（IBT/CBT）の<strong>問題数と配点は公式には公表されていません</strong>。本模試の50問・各2点という構成は当サイト独自のもので、
        本試験の出題数や出題形式を示すものではありません。本試験に合わせているのは制限時間（90分）と合否基準（100点満点・70点以上）の2点です。
        問題はすべて当サイトで作成したオリジナルで、実際の試験問題の転載ではありません。合格判定はあくまで学習の目安です。
        時間を計らずに力試しをしたい方は
        <SiteLink href="/fukushi3/mock/" className="underline hover:no-underline">腕試しテスト（ランダム20問）</SiteLink>へ、
        1問ずつじっくり学びたい方は<SiteLink href="/fukushi3/" className="underline hover:no-underline">練習問題</SiteLink>へ。
      </p>
    </div>
  );
}
