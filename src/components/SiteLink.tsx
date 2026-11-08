import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * サイト内リンク。2026-11-08 に `<a href="/...">` から置き換えた。
 *
 * `<a>` のままだとページ移動のたびにページ全体(ヘッダー・フッター・JS)を読み直すため、
 * next/link でクライアント側の遷移にする。
 *
 * prefetch は既定で切ってある。資格トップや分野ページには1画面に数十〜数百の問題リンクが
 * 並ぶので、next/link の既定(画面に入ったリンクを先読み)のままだと、スクロールするだけで
 * スマホでも数百ページ分を取りに行ってしまう。先読みしたい導線では prefetch を明示的に渡す。
 */
export default function SiteLink({ prefetch = false, ...props }: ComponentProps<typeof Link>) {
  return <Link prefetch={prefetch} {...props} />;
}
