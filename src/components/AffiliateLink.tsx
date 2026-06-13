"use client";

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
 * - rel="nofollow sponsored noopener" / target="_blank" / class は従来の広告と同一。
 *   控えめ方針・A8規約に影響を与えない。
 *
 * 注意: GA4の標準レポートで course/placement を分解表示するには、GA4管理画面で
 * カスタムディメンション(course, placement)とキーイベント(affiliate_click)の
 * 登録が別途必要（コード外のGA4設定作業）。
 */

interface Props {
  href: string;
  course: string;       // 例 "pii", "kashikin", "agaroot-benri"
  placement: string;    // 例 "question_result", "course_ad", "field", "study", "column"
  className?: string;
  children: React.ReactNode;
}

export default function AffiliateLink({ href, course, placement, className = "btn-ad", children }: Props) {
  return (
    <a
      href={href}
      rel="nofollow sponsored noopener"
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
