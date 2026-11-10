import SiteLink from "@/components/SiteLink";
import type { Metadata } from "next";
import { EXAM_LIST } from "@/lib/study-progress";

export const metadata: Metadata = {
  title: "ページが見つかりません",
  robots: { index: false, follow: true },
};

// 資格の一覧は EXAM_LIST(学習履歴と同じ表)から出す。以前は6資格だけを手で並べていて、
// 資格を増やしても 404 の案内には出てこなかった(2026-11-10)
export default function NotFound() {
  return (
    <div className="pb-16 pt-8">
      <p className="text-xs text-[color:var(--c-text-sub)] mb-2">404 Not Found</p>
      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-4 font-serif">
        ページが見つかりません
      </h1>
      <p className="text-sm text-[color:var(--c-text-sub)] leading-relaxed mb-6">
        お探しのページは移動または削除された可能性があります。
        下の資格の一覧から、目的の資格の練習問題をお探しください。
      </p>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm mb-8">
        <li><SiteLink href="/" className="text-blue-700 hover:underline">ホーム</SiteLink></li>
        <li><SiteLink href="/hajimete/" className="text-blue-700 hover:underline">はじめての方へ</SiteLink></li>
        <li><SiteLink href="/column/" className="text-blue-700 hover:underline">コラム一覧</SiteLink></li>
        <li><SiteLink href="/calendar/" className="text-blue-700 hover:underline">試験カレンダー</SiteLink></li>
      </ul>
      <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-3 font-serif">資格の一覧</h2>
      <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {EXAM_LIST.map((e) => (
          <li key={e.slug}>
            <SiteLink href={e.topPath} className="text-blue-700 hover:underline">
              {e.name}
            </SiteLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
