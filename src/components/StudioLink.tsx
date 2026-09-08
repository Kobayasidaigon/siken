"use client";

/**
 * シカクモン Studio への送客リンク。クリックを計測するためだけの薄い <a> ラッパー。
 * 2026-09-07 追加。
 *
 * 背景: A8 の講座リンクは AffiliateLink.tsx が affiliate_click と cta_impression を
 * 送っているのに、Studio(月額課金＝LTV が最大の収益源)への送客リンクは全箇所が
 * 素の <a> で、本体側のクリックが1件も測れていなかった。
 * cta-priority.ts は「A8 の成果」と「Studio の価値」を比べて表示順を入れ替えているが、
 * 片側は数字が存在しないまま比較していたことになる。
 *
 * Studio 側の GA と本体の GA は別プロパティなので、向こうの流入数を見ても
 * 「本体のどの面が効いているか」は分からない。placement 別に本体側で数える必要がある。
 *
 * 見た目は変えない。既存の各設置箇所の className / style をそのまま受け取り、
 * 同じ <a> を出す。計測が乗るだけで、リンクの挙動も表示も従来どおり。
 */

import type { CSSProperties, ReactNode } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import type { ExamSlug } from "@/lib/study-progress";

export default function StudioLink({
  href,
  placement,
  exam,
  className,
  style,
  children,
}: {
  href: string;
  /**
   * 設置面。**AffiliateLink.tsx と同じ語彙**を使う
   * (question_result / moshi_result / mock_result / column_footer …)。
   *
   * utm_content とは別物で、面によっては食い違う。答え合わせ直後の枠は
   * utm_content が quiz_<資格> だが placement は question_result にしている。
   * この項目の本題は「同じ枠の A8 と Studio を並べて比べられるようにする」ことで、
   * placement を資格別に散らすとその比較ができなくなるため。
   * 資格の分解は placement ではなく exam パラメータで行う。
   * utm_content 側は Studio 側の仕様(studio-cta.ts の studioCtaFor 参照)に
   * 固定されているので動かさない。
   */
  placement: string;
  /** 資格が確定している面だけ渡す(トップ・フッターなど汎用面は省略) */
  exam?: ExamSlug;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      onClick={() => {
        try {
          sendGAEvent("event", "studio_click", { placement, exam: exam ?? "none" });
        } catch {
          /* GA未ロードでも遷移は妨げない */
        }
      }}
    >
      {children}
    </a>
  );
}
