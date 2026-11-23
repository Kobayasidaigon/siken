import SiteLink from "@/components/SiteLink";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import IchimonDrill from "@/components/IchimonDrill";
import { getIchimonData } from "@/lib/ichimon";

/**
 * ビジネス実務法務検定3級 の一問一答(○×・記入式)。2026-11-23 追加。
 * ○×は4択の各肢から作る(lib/ox-from-choices.ts)。中身は問題ページと重なるので、
 * 腕試しテストと同じく検索には出さない。
 */
export const metadata: Metadata = pageMetadata({
  path: "/bijihou/ichimon/",
  noindex: true,
  title: "ビジネス実務法務検定3級 一問一答（○×・記入式）｜1問ずつ答え合わせ",
  description:
    "ビジネス実務法務検定3級の練習問題の選択肢を、1つずつ○×で答える一問一答と、用語を打ち込んで答える記入式。答えるとすぐに正誤と解説が出ます。登録不要・無料。",
});

export default function BijihouIchimonPage() {
  const { ox, sharedExplains, inputs } = getIchimonData("bijihou");
  return (
    <div className="theme-kashikin pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <SiteLink href="/">ホーム</SiteLink><span>/</span>
        <SiteLink href="/bijihou/">ビジネス実務法務検定3級</SiteLink><span>/</span>
        <span className="text-[color:var(--c-ink)]">一問一答</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">一問一答（○×{inputs.length > 0 ? "・記入式" : ""}）</h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <IchimonDrill
        exam="bijihou"
        examLabel="ビジネス実務法務検定3級"
        questionPathPrefix="/bijihou/q/"
        ox={ox}
        sharedExplains={sharedExplains}
        inputs={inputs}
      />
    </div>
  );
}
