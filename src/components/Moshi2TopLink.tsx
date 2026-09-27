"use client";

/**
 * 資格トップに置く第2回(有料)への導線。
 *
 * ページもAPIも動くのに、どこからもリンクしていなければ誰にも見つからない。
 * 設備サイトで実際にその状態のまま公開直前まで気づかなかったため、第1回の
 * ボタンのすぐ隣に並べる。
 *
 * 【2026-09-20】ボタンから価格を外し、文言を「本番前の最終確認」に変えた。価格が先に目に入ると
 *   価値を読む前に選別される(販売ページ到達→13秒で離脱)。価格はボタン下に小さく残す。
 *   遷移先に ?src=landing を付け、販売ページ側で結果画面経由(?src=result)と分けて数える。
 *   表示・クリックは結果画面の Moshi2Offer と同じイベント名で place だけ変えて送る。
 *
 * 配色は資格トップの theme-* が定義する --c-accent 系をそのまま使うので、
 * 資格ごとに色を書き分ける必要はない。
 */

import { useEffect, useRef } from "react";
import { moshi2ProductOf } from "@/lib/moshi2-products";
import { trackMoshi2 } from "@/lib/moshi2-funnel";
import type { ExamSlug } from "@/lib/study-progress";

export default function Moshi2TopLink({ certId, place = "cert_top" }: { certId: ExamSlug; place?: string }) {
  const p = moshi2ProductOf(certId);
  const ref = useRef<HTMLSpanElement | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || fired.current || !p || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (fired.current || !entries.some((e) => e.isIntersecting)) return;
        fired.current = true;
        trackMoshi2("moshi2_offer_impression", { cert: certId, place });
        io.disconnect();
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [certId, place, p]);

  if (!p) return null;

  return (
    <span ref={ref} className="inline-flex flex-col items-start gap-1">
      <a
        href={`/${certId}/moshi2/?src=landing`}
        onClick={() => trackMoshi2("moshi2_offer_click", { cert: certId, place })}
        className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-accent-soft)]"
        style={{ borderColor: "var(--c-border)", color: "var(--c-text)" }}
      >
        第2回模試（本番前の最終確認）→
      </a>
      <span className="text-[11px] text-[color:var(--c-text-sub)] pl-1">
        ¥{p.priceJpy.toLocaleString()}・買い切り
      </span>
    </span>
  );
}
