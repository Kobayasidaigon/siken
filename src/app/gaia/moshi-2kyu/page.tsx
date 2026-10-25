import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getGaiaMoshi2kyuQuestions, GAIA_MOSHI_2KYU_TIME_LIMIT_MIN, GAIA_MOSHI_2KYU_PASS_COUNT } from "@/lib/gaia-moshi-2kyu";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/gaia/moshi-2kyu/",
  title: "生成AIアドバイザー認定試験 模擬試験・2級形式（無料）｜50問・60分・合否判定つき",
  description:
    "生成AIアドバイザー認定試験（2級）の無料模擬試験。50問（○×と4択の混在）・60分で受験でき、70%の合否判定と課題別の弱点分析を確認できます。",
});

export default async function GaiaMoshi2kyuPage() {
  const all = await getGaiaMoshi2kyuQuestions();
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
        <a href="/gaia/">生成AIアドバイザー</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験（2級形式）</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験（2級形式）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        2級の本試験と同じ<strong>50問（○×と4択の混在）・60分・合格基準70%</strong>の形式で受験できる無料の模擬試験です。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　50問　○×30問＋4択20問（2級の○×と4択の内訳は協会が公表していないため、当サイトの想定）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　60分（自動採点）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　70%以上（50問中35問）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="gaia"
        round={1}
        sessionKey="shikakumon-gaia-moshi-2kyu-v1"
        questions={questions}
        timeLimitMin={GAIA_MOSHI_2KYU_TIME_LIMIT_MIN}
        passCount={GAIA_MOSHI_2KYU_PASS_COUNT}
        passLabel="70%（50問中35問）以上"
        choiceLabel="○×・4択"
        questionPathPrefix="/gaia/q/"
        topPath="/gaia/"
        sharePath="/gaia/moshi-2kyu/"
        shareName="生成AIアドバイザー 2級形式"
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本模試は当サイト編集部が作成したオリジナル問題で、公式のサンプル問題の転載ではありません。○×は1つ目の選択肢が「○ 正しい」、2つ目が「× 誤り」です。1級形式（100問・120分）は<a href="/gaia/moshi/" className="underline hover:no-underline">こちら</a>。
        1問ずつじっくり学びたい方は<a href="/gaia/" className="underline hover:no-underline">練習問題</a>へ。
      </p>
    </div>
  );
}
