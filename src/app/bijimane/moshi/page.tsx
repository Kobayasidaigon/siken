import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import {
  getBijimaneMoshi1,
  BIJIMANE_MOSHI_PASS_COUNT,
  BIJIMANE_MOSHI_PASS_POINTS,
  BIJIMANE_MOSHI_TIME_LIMIT_MIN,
} from "@/lib/bijimane-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/bijimane/moshi/",
  title: "ビジネスマネジャー検定 模擬試験 第1回（無料）｜四肢択一50問・90分・70点判定",
  description:
    "ビジネスマネジャー検定の無料模擬試験。本試験と同じ90分・100点満点70点以上の基準で四肢択一50問を受験でき、終了後に合格判定・分野別の弱点分析・全問の詳しい解説を確認できます。登録不要。",
});

export default async function BijimaneMoshiPage() {
  const takuitsu = await getBijimaneMoshi1();
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
    <div className="theme-bijimane pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/bijimane/">ビジネスマネジャー検定</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験（IBT/CBT）と同じ<strong>90分・100点満点・70点以上で合格</strong>の基準で受験できる無料の模擬試験です。
        ビジネスマネジャー検定はIBT・CBT方式のため過去問が公開されず、本番と同じ時間・同じ合否基準で通しで解ける場がありません。
        全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。
        出題は公式テキストの4部構成に沿って10分野からまんべんなく選んでいます。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　四肢択一50問×各2点＝100点満点（当サイト独自の構成）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{BIJIMANE_MOSHI_TIME_LIMIT_MIN}分（自動採点）＝本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　{BIJIMANE_MOSHI_PASS_POINTS}点以上（{BIJIMANE_MOSHI_PASS_COUNT}問正解）＝本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="bijimane"
        round={1}
        sessionKey="shikakumon-bijimane-moshi1-v1"
        questions={questions}
        timeLimitMin={BIJIMANE_MOSHI_TIME_LIMIT_MIN}
        passCount={BIJIMANE_MOSHI_PASS_COUNT}
        passLabel="70点／100点満点 以上"
        choiceLabel="四肢択一"
        questionPathPrefix="/bijimane/q/"
        topPath="/bijimane/"
        passPoints={BIJIMANE_MOSHI_PASS_POINTS}
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本試験（IBT/CBT）の<strong>出題数は公式には公表されていません</strong>。本模試の50問という構成は当サイト独自のもので、
        本試験の出題数を示すものではありません。本試験に合わせているのは制限時間（90分）と合否基準（100点満点・70点以上）の2点です。
        また本試験には時事問題が含まれる場合がありますが、本模試には含まれません。
        問題はすべて当サイト編集部が作成したオリジナルで、実際の試験問題の転載ではありません。合格判定はあくまで学習の目安です。
        時間を計らずに力試しをしたい方は
        <a href="/bijimane/mock/" className="underline hover:no-underline">本番形式テスト（ランダム20問）</a>へ、
        1問ずつじっくり学びたい方は<a href="/bijimane/" className="underline hover:no-underline">練習問題200問</a>へ。
      </p>
    </div>
  );
}
