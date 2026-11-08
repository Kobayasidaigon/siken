import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";

/**
 * 特定商取引法に基づく表記。2026-09-09 新設。
 *
 * 第2回模試を有料販売していた間は、販売価格・支払方法・返品の扱いなどを載せていた。
 * 2026-11-08 に第2回模試を無料化し、販売している商品がなくなったため、その旨だけを載せる。
 * 古いリンクから来た人が迷わないようページは残し、検索結果には出さない。
 * 有料の商品を再開するときは git の履歴(2026-11-08 以前)から元の表記を戻すこと。
 */
export const metadata: Metadata = pageMetadata({
  path: "/tokushoho/",
  title: "特定商取引法に基づく表記",
  description: "シカクモンでは現在、有料で販売している商品はありません。",
  noindex: true,
});

export default function Page() {
  return (
    <div className="max-w-2xl pb-16">
      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-5 font-serif">
        特定商取引法に基づく表記
      </h1>
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-4">
        シカクモンでは現在、有料で販売している商品はありません。練習問題・模擬試験（第1回・第2回）はすべて無料でご利用いただけます。
      </p>
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed">
        以前に第2回模擬試験をご購入いただいた方で、ご不明な点がある場合は
        <a href="/contact/" className="underline hover:no-underline">お問い合わせフォーム</a>
        よりご連絡ください。
      </p>
    </div>
  );
}
