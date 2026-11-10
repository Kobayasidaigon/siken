import SiteLink from "@/components/SiteLink";
import { getAllShakaiQuestions } from "@/lib/shakai-questions";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import MockExam, { type MockQuestion } from "@/app/kashikin/mock/MockExam";

/**
 * 社会福祉士（共通科目）の腕試しテスト。
 *
 * passPct の根拠: 本試験の合格基準は「総得点の約60%」(試験センター公表)。
 * ただし毎年の難易度で補正され、さらに6科目群すべてで得点があることも要件になる。
 * ここでは素点60%だけを見ているので、注記でその旨を明示する。
 */

export const metadata: Metadata = pageMetadata({
  path: "/shakai/mock/",
  // 20問を出すボタンと案内だけで、そのページにしかない文章がほとんど無いため検索に出さない(2026-11-10)
  noindex: true,
  title: "社会福祉士 共通科目 腕試しテスト（ランダム20問）｜採点・苦手分野判定つき",
  description:
    "社会福祉士国家試験の共通科目のオリジナル問題からランダム20問を出題。最後に得点と苦手分野を自動判定し、弱点を重点的に復習できます。登録不要・無料。",
});

export default async function ShakaiMockPage() {
  const all = await getAllShakaiQuestions();
  const questions: MockQuestion[] = all.map((q) => ({
    slug: q.slug,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    field: q.field,
  }));

  return (
    <div className="theme-eco pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <SiteLink href="/">ホーム</SiteLink>
        <span>/</span>
        <SiteLink href="/shakai/">社会福祉士</SiteLink>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">腕試しテスト</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">腕試しテスト</h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-eco)" }}></div>

      <p className="text-xs text-[color:var(--c-text-sub)] mb-5">
        60問を通しで解いて分野別の弱点を見るなら
        <SiteLink href="/shakai/moshi/" className="underline hover:no-underline">
          模擬試験 第1回（無料）
        </SiteLink>
        へ。
      </p>

      <MockExam
        exam="shakai"
        examLabel="社会福祉士（共通科目）"
        questionPathPrefix="/shakai/q/"
        questions={questions}
        size={20}
        passPct={60}
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本試験の合格基準は総得点の約6割ですが、毎年の難易度で補正され、さらに6つの科目群すべてで
        得点があることも要件になります。ここでの判定は共通科目のランダム20問の素点だけを見たもので、
        本試験の合否を示すものではありません。
      </p>
    </div>
  );
}
