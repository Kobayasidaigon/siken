import SiteLink from "@/components/SiteLink";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import {
  getJitsumuMoshi1kyuQuestions,
  JITSUMU_MOSHI_1KYU_PASS_COUNT,
  JITSUMU_MOSHI_1KYU_TIME_LIMIT_MIN,
} from "@/lib/jitsumu-moshi-1kyu";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/jitsumu/moshi-1kyu/",
  title: "個人情報保護実務検定 1級形式の模擬試験（無料）｜100問・120分・合否判定つき",
  description:
    "個人情報保護実務検定1級と同じ100問・120分・70%以上の基準で受験できる無料の模擬試験。2級と共通の範囲に、1級だけの範囲の情報システムセキュリティを加えた4肢択一100問。終了後に合否判定・分野別の弱点分析を確認できます。登録不要。",
});

export default async function JitsumuMoshi1kyuPage() {
  const all = await getJitsumuMoshi1kyuQuestions();
  // 100問のためページ重量対策で詳解は同梱せず、結果画面から各問題ページへ誘導する(2級形式の模試と同じ)
  const questions: MoshiQuestion[] = all.map((q) => ({
    slug: q.slug,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    field: q.field,
    path: q.path,
    progressExam: q.progressExam,
  }));

  return (
    <div className="theme-pii pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <SiteLink href="/">ホーム</SiteLink><span>/</span>
        <SiteLink href="/jitsumu/">個人情報保護実務検定</SiteLink><span>/</span>
        <span className="text-[color:var(--c-ink)]">1級形式の模擬試験</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験（1級形式）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        1級の本試験と同じ<strong>100問・120分・4肢択一・70%以上で合格</strong>の基準で受験できる無料の模擬試験です。
        1級と2級の範囲の違いは、課題Ⅱ第4編「情報システムセキュリティ」が1級だけに入ることです。
        この模試では、2級と共通の範囲から80問、情報システムセキュリティから20問を出題します。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　4肢択一100問＝1級本試験と同じ問題数（範囲ごとの問題数は当サイトの想定）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{JITSUMU_MOSHI_1KYU_TIME_LIMIT_MIN}分（自動採点）＝1級本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　70%以上（{JITSUMU_MOSHI_1KYU_PASS_COUNT}問/100問）＝1級本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="jitsumu"
        round={1}
        sessionKey="shikakumon-jitsumu-moshi-1kyu-v1"
        questions={questions}
        timeLimitMin={JITSUMU_MOSHI_1KYU_TIME_LIMIT_MIN}
        passCount={JITSUMU_MOSHI_1KYU_PASS_COUNT}
        passLabel="70%（100問中70問）以上"
        choiceLabel="4肢択一"
        questionPathPrefix="/jitsumu/q/"
        topPath="/jitsumu/"
        shareName="個人情報保護実務検定 1級形式"
        sharePath="/jitsumu/moshi-1kyu/"
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※1級の問題数（100問）・時間（120分）・合格基準（70%以上）と出題範囲は、全日本情報学習振興協会の試験ページと出題項目のページで確認したものです。協会は、問題の難易度により70%未満でも合格とする場合があるとしています。
        課題や編ごとの問題数は公表されていないため、80問と20問の配分は当サイトの想定です。
        情報システムセキュリティの20問は、範囲が同じ個人情報保護士の練習問題から選んでおり、解説のリンクは個人情報保護士の問題ページに移ります。
        問題はすべて当サイトで作成したオリジナルで、実際の試験問題の転載ではありません。合格判定はあくまで学習の目安です。
        2級の形式で解きたい方は<SiteLink href="/jitsumu/moshi/" className="underline hover:no-underline">2級形式の模擬試験（80問・90分）</SiteLink>へ、
        1問ずつ学びたい方は<SiteLink href="/jitsumu/" className="underline hover:no-underline">練習問題200問</SiteLink>へ。
      </p>
    </div>
  );
}
