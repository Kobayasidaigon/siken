import type { Metadata } from "next";

/**
 * ページごとに canonical / openGraph / title / description を一括設定するヘルパー。
 * 各ページの `export const metadata` または `generateMetadata` の戻り値で利用する。
 */
export function pageMetadata(opts: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: {
      canonical: opts.path,
    },
    openGraph: {
      url: opts.path,
      title: opts.title,
      description: opts.description,
    },
  };
}
