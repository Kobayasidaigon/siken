import SiteLink from "@/components/SiteLink";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import IchimonDrill from "@/components/IchimonDrill";
import { getIchimonData } from "@/lib/ichimon";

/**
 * eco検定 の一問一答(○×・記入式)。2026-11-23 追加。
 * ○×は4択の各肢から作る(lib/ox-from-choices.ts)。中身は問題ページと重なるので、
 * 腕試しテストと同じく検索には出さない。
 */
export const metadata: Metadata = pageMetadata({
  path: "/eco/ichimon/",
  noindex: true,
  title: "eco検定 一問一答（○×）｜1問ずつ答え合わせ",
  description:
    "eco検定の練習問題の選択肢を、1つずつ○×で答える一問一答。答えるとすぐに正誤と解説が出ます。登録不要・無料。",
});

export default function EcoIchimonPage() {
  const { ox, sharedExplains, inputs } = getIchimonData("eco");
  return (
    <div className="theme-eco pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <SiteLink href="/">ホーム</SiteLink><span>/</span>
        <SiteLink href="/eco/">eco検定</SiteLink><span>/</span>
        <span className="text-[color:var(--c-ink)]">一問一答</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">一問一答（○×{inputs.length > 0 ? "・記入式" : ""}）</h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <IchimonDrill
        exam="eco"
        examLabel="eco検定"
        questionPathPrefix="/eco/q/"
        ox={ox}
        sharedExplains={sharedExplains}
        inputs={inputs}
      />
    </div>
  );
}
