import SiteLink from "@/components/SiteLink";
import { getAllFukushi3Questions } from "@/lib/fukushi3-questions";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import MockExam, { type MockQuestion } from "@/app/kashikin/mock/MockExam";

/**
 * 福祉住環境コーディネーター3級の腕試しテスト。
 *
 * passPct の根拠: 本試験の合格基準は100点満点中70点以上（2026-11-12 に東京商工会議所の受験案内で確認）。
 * 本試験の問題数と配点は公表されていないので、ここでは20問の正答率70%を目安にしている。
 */

export const metadata: Metadata = pageMetadata({
  path: "/fukushi3/mock/",
  // 20問を出すボタンと案内だけで、そのページにしかない文章がほとんど無いため検索に出さない(ほかの資格の腕試しテストと同じ)
  noindex: true,
  title: "福祉住環境コーディネーター3級 腕試しテスト（ランダム20問）｜採点・苦手分野判定つき",
  description:
    "福祉住環境コーディネーター検定試験3級のオリジナル問題からランダム20問を出題。最後に得点と苦手分野を自動判定し、弱点を重点的に復習できます。登録不要・無料。",
});

export default async function Fukushi3MockPage() {
  const all = await getAllFukushi3Questions();
  const questions: MockQuestion[] = all.map((q) => ({
    slug: q.slug,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    field: q.field,
  }));

  return (
    <div className="theme-fukushi pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <SiteLink href="/">ホーム</SiteLink>
        <span>/</span>
        <SiteLink href="/fukushi3/">福祉住環境コーディネーター3級</SiteLink>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">腕試しテスト</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">腕試しテスト</h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-fukushi)" }}></div>

      <p className="text-xs text-[color:var(--c-text-sub)] mb-5">
        分野ごとに1問ずつ解くなら
        <SiteLink href="/fukushi3/" className="underline hover:no-underline">
          練習問題の一覧
        </SiteLink>
        へ。
      </p>

      <MockExam
        exam="fukushi3"
        examLabel="福祉住環境コーディネーター検定試験3級"
        questionPathPrefix="/fukushi3/q/"
        questions={questions}
        size={20}
        passPct={70}
      />
    </div>
  );
}
