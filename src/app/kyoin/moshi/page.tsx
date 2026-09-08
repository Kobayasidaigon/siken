import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getKyoinMoshi1Questions, KYOIN_MOSHI_PASS_COUNT, KYOIN_MOSHI_TIME_LIMIT_MIN } from "@/lib/kyoin-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/kyoin/moshi/",
  title: "教員採用試験 教職教養 模擬試験 第1回（無料）｜60問・60分・分野別判定つき",
  description:
    "教員採用試験の教職教養の無料模擬試験。教育法規・教育原理・教育心理・教育史・教育時事・一般教養から60問を60分で通しで解き、分野別の正答率で弱点を判定します。登録不要。",
});

export default async function KyoinMoshiPage() {
  const all = await getKyoinMoshi1Questions();
  // 詳解は同梱せず、結果画面から各問題ページへ誘導する(pii/moshi と同じ)
  const questions: MoshiQuestion[] = all.map((q) => ({
    slug: q.slug,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    field: q.field,
  }));

  return (
    <div className="theme-fukushi pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a>
        <span>/</span>
        <a href="/kyoin/">教員採用試験</a>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（教職教養・60問）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        教職教養の5分野に一般教養を加えた<strong>60問を60分</strong>で通しで解く無料の模擬試験です。
        出題は本試験の比重に合わせ、<strong>最頻出の教育法規と教育原理を多めに</strong>配分しています。
        全員が同じ問題を同じ順序で解く固定問題なので、分野別の弱点を測るのにそのまま使えます。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">出題数</span>
          　60問（教育法規16問・教育原理16問・教育心理8問・教育史8問・教育時事8問・一般教養4問／4肢択一）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{KYOIN_MOSHI_TIME_LIMIT_MIN}分（自動採点）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">目安ライン</span>　{KYOIN_MOSHI_PASS_COUNT}問（正答率70%）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要
        </p>
      </div>

      <MoshiExam
        exam="kyoin"
        round={1}
        sessionKey="shikakumon-kyoin-moshi1-v1"
        questions={questions}
        timeLimitMin={KYOIN_MOSHI_TIME_LIMIT_MIN}
        passCount={KYOIN_MOSHI_PASS_COUNT}
        passLabel="60問中42問以上（正答率70%）"
        choiceLabel="4肢択一"
        questionPathPrefix="/kyoin/q/"
        topPath="/kyoin/"
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※教員採用試験は自治体ごとに実施され、問題数・時間・配点・合格ラインがすべて異なります。
        本模試の60問・60分・7割という設定は当サイトが学習用に置いたもので、
        特定の自治体の試験形式や合格ラインを再現したものではありません。
        当サイト編集部が作成したオリジナル問題で構成しており、実際の過去問題の転載ではありません。
        1問ずつじっくり学びたい方は
        <a href="/kyoin/" className="underline hover:no-underline">
          練習問題200問
        </a>
        へ。
      </p>
    </div>
  );
}
