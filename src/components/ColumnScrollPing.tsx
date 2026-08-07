"use client";

import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";

/**
 * コラム記事の読了近似(75%スクロール到達)をGA4へ一度だけ送る(column_scroll_75)。
 * 「文字だけ記事の途中離脱」改善の効果を article 別に測るための計測。
 * GA4拡張計測のscroll(90%)より手前の到達を取り、記事間で比較できるようにする。
 */
export default function ColumnScrollPing({ slug }: { slug: string }) {
  useEffect(() => {
    let fired = false;
    const onScroll = () => {
      if (fired) return;
      const doc = document.documentElement;
      const depth = (window.scrollY + window.innerHeight) / doc.scrollHeight;
      if (depth >= 0.75) {
        fired = true;
        try {
          sendGAEvent("event", "column_scroll_75", { article: slug });
        } catch {
          /* GA未ロードでも何もしない */
        }
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // 記事が短く初期表示で75%を超えているケース
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);
  return null;
}
