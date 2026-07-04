import type { Metadata } from "next";

/**
 * ページごとに canonical / openGraph / title / description を一括設定するヘルパー。
 * 各ページの `export const metadata` または `generateMetadata` の戻り値で利用する。
 *
 * 注意: Next.js の metadata はトップレベルフィールド単位の浅いマージのため、
 * ページ側で openGraph を定義すると layout 側の siteName/locale/type/images が
 * 丸ごと消える。ここで毎回フル指定して全ページの OG を揃える。
 */
export function pageMetadata(opts: {
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
}): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: {
      canonical: opts.path,
    },
    ...(opts.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      locale: "ja_JP",
      siteName: "シカクモン",
      url: opts.path,
      title: opts.title,
      description: opts.description,
      images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "シカクモン - 資格試験の練習問題" }],
    },
  };
}
