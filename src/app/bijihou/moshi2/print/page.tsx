import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import Moshi2Print from "@/components/Moshi2Print";

/**
 * 第2回模試の印刷用紙面。中身は購入者だけが /api/moshi2/[cert] から受け取る。
 * 検索結果に出す面ではないので noindex。
 */
export const metadata: Metadata = pageMetadata({
  path: "/bijihou/moshi2/print/",
  title: "ビジネス実務法務検定3級 模擬試験 第2回｜印刷用",
  description:
    "ビジネス実務法務検定3級の模擬試験 第2回を、問題・解答用紙・解説の順に A4 で印刷できます。ご購入者向けのページです。",
  noindex: true,
});

export default function Page() {
  return (
    <div className="pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a>
        <span>/</span>
        <a href="/bijihou/">ビジネス実務法務検定3級</a>
        <span>/</span>
        <a href="/bijihou/moshi2/">模擬試験 第2回</a>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">印刷用</span>
      </nav>
      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-5 font-serif print-hide">
        印刷用の紙面
      </h1>
      <Moshi2Print certId="bijihou" />
    </div>
  );
}
