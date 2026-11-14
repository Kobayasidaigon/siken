import SiteLink from "@/components/SiteLink";
import { getAllMynumber1Questions } from "@/lib/mynumber1-questions";
import { getAllMynumber2Questions } from "@/lib/mynumber2-questions";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import MockExam, { type MockQuestion } from "@/app/kashikin/mock/MockExam";

/**
 * マイナンバー実務検定1級の腕試しテスト。
 *
 * passPct の根拠: 本試験の合格基準は70%以上の得点（2026-11-14 に全日本情報学習振興協会の試験ページで確認）。
 * 20問の正答率70%を目安にしている。出題は1級だけの範囲と、2級と共通の範囲の全問から。
 */

export const metadata: Metadata = pageMetadata({
  path: "/mynumber1/mock/",
  // 20問を出すボタンと案内だけで、そのページにしかない文章がほとんど無いため検索に出さない(ほかの資格の腕試しテストと同じ)
  noindex: true,
  title: "マイナンバー実務検定1級 腕試しテスト（ランダム20問）｜採点・苦手分野判定つき",
  description:
    "マイナンバー実務検定1級の範囲（2級と共通の範囲を含む）のオリジナル問題からランダム20問を出題。最後に得点と苦手分野を自動判定し、弱点を重点的に復習できます。登録不要・無料。",
});

export default async function Mynumber1MockPage() {
  // 1級だけの範囲の問題に、2級と共通の範囲の問題(/mynumber2/q/)を混ぜて出す
  const [own, shared] = await Promise.all([getAllMynumber1Questions(), getAllMynumber2Questions()]);
  const questions: MockQuestion[] = [
    ...own.map((q) => ({ slug: q.slug, questionText: q.questionText, choices: q.choices, correctAnswer: q.correctAnswer, field: q.field })),
    ...shared.map((q) => ({
      slug: q.slug,
      questionText: q.questionText,
      choices: q.choices,
      correctAnswer: q.correctAnswer,
      field: q.field,
      path: `/mynumber2/q/${q.slug}/`,
      progressExam: "mynumber2" as const,
    })),
  ];

  return (
    <div className="theme-pii pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <SiteLink href="/">ホーム</SiteLink>
        <span>/</span>
        <SiteLink href="/mynumber1/">マイナンバー実務検定1級</SiteLink>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">腕試しテスト</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">腕試しテスト</h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-pii)" }}></div>

      <p className="text-xs text-[color:var(--c-text-sub)] mb-5">
        分野ごとに1問ずつ解くなら
        <SiteLink href="/mynumber1/" className="underline hover:no-underline">
          練習問題の一覧
        </SiteLink>
        へ。
      </p>

      <MockExam
        exam="mynumber1"
        examLabel="マイナンバー実務検定1級"
        questionPathPrefix="/mynumber1/q/"
        questions={questions}
        size={20}
        passPct={70}
      />
    </div>
  );
}
