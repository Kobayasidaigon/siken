"use client";

import { useEffect, useRef } from "react";
import { sendGAEvent } from "@next/third-parties/google";

/**
 * A8アフィリエイトリンクの共通アンカー（クリック計測付き）。
 *
 * 目的: どの資格・どの配置(placement)のリンクが押されたかをGA4で可視化する。
 * A8自体はクリックを資格別/配置別に分解できないため、自前のGA4イベントで
 * 「どの面が踏まれやすいか」を相対比較する土台にする。
 *
 * 設計方針(監査の検証指示):
 * - 広告コンポーネント全体をclient化せず、アンカー1個だけをclient islandにする
 *   (静的書き出しのHTML/JS増分を最小化。コピーはサーバ側で描画されたまま)。
 * - rel="nofollow sponsored noopener noreferrer" / target="_blank" / class は従来の広告と同一。
 *   控えめ方針・A8規約に影響を与えない。
 *
 * 注意: GA4の標準レポートで course/placement を分解表示するには、GA4管理画面で
 * カスタムディメンション(course, placement)とキーイベント(affiliate_click)の
 * 登録が別途必要（コード外のGA4設定作業）。
 *
 * 表示計測(cta_impression) — 2026-08-12追加:
 * ドリル3サイトは QuizApp.tsx の CtaImpression で表示回数を測っているが、本体だけ
 * 実装が無く、GA4で cta_impression が28日0件だった(設備4件・衛生2件は記録あり)。
 * このため換金の99%を担う本体だけ CTR が算出できなかった。
 * アンカー自身を IntersectionObserver で監視し、50%以上見えたら一度だけ送る。
 * DOMは1要素も足していない(ラッパを増やすとCTAのレイアウトが動くため)。
 */

interface Props {
  href: string;
  course: string;       // 例 "pii", "kashikin", "agaroot-benri"
  placement: string;    // 例 "question_result", "course_ad", "field", "study", "column"
  className?: string;
  children: React.ReactNode;
}

export default function AffiliateLink({ href, course, placement, className = "btn-ad", children }: Props) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || fired.current || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (fired.current || !entries.some((e) => e.isIntersecting)) return;
        fired.current = true;
        io.disconnect();
        try {
          sendGAEvent("event", "cta_impression", { course, placement });
        } catch {
          // GA未ロード等でも表示は妨げない
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [course, placement]);

  return (
    <a
      ref={ref}
      href={href}
      rel="nofollow sponsored noopener noreferrer"
      target="_blank"
      className={className}
      onClick={() => {
        try {
          sendGAEvent("event", "affiliate_click", { course, placement });
        } catch {
          // GA未ロード等でも遷移は妨げない
        }
      }}
    >
      {children}
    </a>
  );
}
