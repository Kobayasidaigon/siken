import SiteLink from "@/components/SiteLink";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import IchimonDrill from "@/components/IchimonDrill";
import { getIchimonData } from "@/lib/ichimon";

/**
 * 福祉住環境コーディネーター2級 の一問一答(○×・記入式)。2026-11-23 追加。
 * ○×は4択の各肢から作る(lib/ox-from-choices.ts)。中身は問題ページと重なるので、
 * 腕試しテストと同じく検索には出さない。
 */
export const metadata: Metadata = pageMetadata({
  path: "/fukushi2/ichimon/",
  noindex: true,
  title: "福祉住環境コーディネーター2級 一問一答（○×・記入式）｜1問ずつ答え合わせ",
  description:
    "福祉住環境コーディネーター2級の練習問題の選択肢を、1つずつ○×で答える一問一答と、用語を打ち込んで答える記入式。答えるとすぐに正誤と解説が出ます。登録不要・無料。",
});

export default function Fukushi2IchimonPage() {
  const { ox, sharedExplains, inputs } = getIchimonData("fukushi2");
  return (
    <div className="theme-fukushi pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <SiteLink href="/">ホーム</SiteLink><span>/</span>
        <SiteLink href="/fukushi2/">福祉住環境コーディネーター2級</SiteLink><span>/</span>
        <span className="text-[color:var(--c-ink)]">一問一答</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">一問一答（○×{inputs.length > 0 ? "・記入式" : ""}）</h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <IchimonDrill
        exam="fukushi2"
        examLabel="福祉住環境コーディネーター2級"
        questionPathPrefix="/fukushi2/q/"
        ox={ox}
        sharedExplains={sharedExplains}
        inputs={inputs}
      />
    </div>
  );
}
