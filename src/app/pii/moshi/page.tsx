import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getPiiMoshi1Kadai2Questions, PII_MOSHI_PASS_COUNT, PII_MOSHI_TIME_LIMIT_MIN } from "@/lib/pii-moshi";
import { PII_MOSHI1_KADAI1, type PiiMoshi1Question } from "@/lib/pii-moshi1-kadai1";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/pii/moshi/",
  title: "個人情報保護士 模擬試験 第1回（無料）｜本試験型100問・150分・課題別判定つき",
  description:
    "個人情報保護士認定試験の無料模擬試験。本試験と同じ100問（課題Ⅰ50問+課題Ⅱ50問）・150分・4肢択一。課題Ⅰは受験した方の報告をもとに、長めの記述の正誤を見分ける問題や事例問題で本試験に近づけています。合否は本試験と同じ「各課題70%以上」で課題別に判定し、分野別の弱点分析つきです。",
});

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** 結果画面の解説: 総合解説のあとに、4 つの記述それぞれの正誤と理由を並べる */
function kadai1ExplanationHtml(q: PiiMoshi1Question): string {
  const items = q.choices
    .map((c, i) => `<li>${escapeHtml(c)}<br />→ ${escapeHtml(q.choiceNotes[i] ?? "")}</li>`)
    .join("");
  return `<p>${escapeHtml(q.explain)}</p><ul>${items}</ul>`;
}

export default async function PiiMoshiPage() {
  const kadai2 = await getPiiMoshi1Kadai2Questions();
  const questions: MoshiQuestion[] = [
    // 課題Ⅰ: 本試験型の模試専用問題。個別問題ページが無いので解説を同梱する
    ...PII_MOSHI1_KADAI1.map((q) => ({
      slug: q.id,
      questionText: q.questionText,
      choices: q.choices,
      correctAnswer: q.correctAnswer,
      field: q.field,
      explanationHtml: kadai1ExplanationHtml(q),
      noLink: true,
    })),
    // 課題Ⅱ: 練習問題。ページ重量対策で詳解は同梱せず、結果画面から各問題ページへ誘導する
    ...kadai2.map((q) => ({
      slug: q.slug,
      questionText: q.questionText,
      choices: q.choices,
      correctAnswer: q.correctAnswer,
      field: q.field,
    })),
  ];

  return (
    <div className="theme-pii pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/pii/">個人情報保護士</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（本試験型・100問）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験と同じ<strong>100問（課題Ⅰ50問＋課題Ⅱ50問）・150分・4肢択一</strong>で受験できる無料の模擬試験です。
        合否判定も本試験と同じ<strong>「各課題70%以上」</strong>で課題ごとに行います。
        全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。
      </p>
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        課題Ⅰは、本試験を受けた方から「模試より本試験の方が文章量が多く、難しかった」と報告をいただき、
        本試験に近い形に作り直しました（2026年9月）。<strong>長めの記述の正誤を見分ける問題</strong>や
        <strong>事業者の場面にあてはめる事例問題</strong>が中心で、法律の条文だけでなく、法の背景や改正の経緯、
        ガイドライン・認証制度も出題します。読む量が多いので、時間配分の確認にもお使いください。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　100問（課題Ⅰ 50問＋課題Ⅱ 50問・4肢択一）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{PII_MOSHI_TIME_LIMIT_MIN}分（自動採点）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　各課題70%以上（各50問中35問）＝本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="pii"
        round={1}
        // 課題Ⅰの問題を入れ替えたので、途中保存の解答が新しい問題に当たらないようキーを変える
        sessionKey="shikakumon-pii-moshi1-v2"
        questions={questions}
        timeLimitMin={PII_MOSHI_TIME_LIMIT_MIN}
        passCount={PII_MOSHI_PASS_COUNT}
        passLabel="各課題70%（各50問中35問）以上"
        choiceLabel="4肢択一"
        questionPathPrefix="/pii/q/"
        topPath="/pii/"
        sections={[
          { label: "課題Ⅰ（個人情報保護の総論）", start: 0, count: 50, passCount: 35 },
          { label: "課題Ⅱ（対策と情報セキュリティ）", start: 50, count: 50, passCount: 35 },
        ]}
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本模試は当サイト編集部が作成したオリジナル問題で構成しており、実際の過去問題の転載ではありません。
        課題Ⅰの解説は受験後の結果画面で、課題Ⅱの解説は各問題のページで確認できます。
        本試験では、問題の難易度により正答率70%未満でも合格となる場合があると公式に案内されています(本模試は70%固定で判定)。
        合否判定はあくまで学習の目安です。時間を計らずに力試しをしたい方は
        <a href="/pii/mock/" className="underline hover:no-underline">本番形式テスト（ランダム20問）</a>へ、
        1問ずつじっくり学びたい方は<a href="/pii/" className="underline hover:no-underline">練習問題300問</a>へ。
      </p>
    </div>
  );
}
