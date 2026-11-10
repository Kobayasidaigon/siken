import SiteLink from "@/components/SiteLink";
import { getAllChizai2Questions } from "@/lib/chizai2-questions";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import MockExam, { type MockQuestion } from "@/app/kashikin/mock/MockExam";

export const metadata: Metadata = pageMetadata({
  path: "/chizai2/mock/",
  // 20問を出すボタンと案内だけで、そのページにしかない文章がほとんど無いため検索に出さない(2026-11-10)
  noindex: true,
  title: "知的財産管理技能検定2級 腕試しテスト（ランダム20問）｜採点・苦手分野判定つき",
  description:
    "知的財産管理技能検定2級のオリジナル問題からランダム20問を出題。最後に得点と苦手分野を自動判定し、弱点を重点的に復習できます。",
});

export default async function Chizai2MockPage() {
  const all = await getAllChizai2Questions();
  const questions: MockQuestion[] = all.map((q) => ({
    slug: q.slug,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    field: q.field,
  }));

  return (
    <div className="theme-chizai pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <SiteLink href="/">ホーム</SiteLink><span>/</span>
        <SiteLink href="/chizai2/">知的財産管理技能検定2級</SiteLink><span>/</span>
        <span className="text-[color:var(--c-ink)]">腕試しテスト</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">腕試しテスト</h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-chizai)" }}></div>

      <p className="text-xs text-[color:var(--c-text-sub)] mb-5">
        本試験と同じ40問・60分・合否判定で解くなら
        <SiteLink href="/chizai2/moshi/" className="underline hover:no-underline">模擬試験 第1回（無料）</SiteLink>へ。
      </p>

      <MockExam
        exam="chizai2"
        examLabel="知的財産管理技能検定2級"
        questionPathPrefix="/chizai2/q/"
        questions={questions}
        size={20}
        passPct={80}
      />
    </div>
  );
}
