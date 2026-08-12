"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { studioUrl, type StudioLinkOptions } from "@/lib/studio-link";

/**
 * シカクモン Studio への送客リンク(クリック計測付き)。
 *
 * 従来 Studio へのリンクは全て素の <a> で、サイト内の他のCTA
 * (affiliate_click / next_q_click / share_click …) が全て計測されている中で
 * ここだけが無計測だった。そのため「Studio に何人送れているか」「どの面が
 * 効いているか」が一切判らず、登録が伸びない原因の切り分けができなかった。
 *
 * AffiliateLink と同じ設計で、アンカー1個だけを client island にする
 * (静的書き出しのJS増分を最小化)。
 *
 * 注意: GA4 の標準レポートで placement / exam を分解表示するには、GA4 管理画面で
 * カスタムディメンションの登録が別途必要(コード外の作業)。
 */

interface Props extends StudioLinkOptions {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export default function StudioLink({
  placement,
  exam,
  legacyMedium,
  className,
  style,
  children,
}: Props) {
  return (
    <a
      href={studioUrl({ placement, exam, legacyMedium })}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      onClick={() => {
        try {
          sendGAEvent("event", "studio_click", {
            placement,
            exam: exam ?? "unknown",
          });
        } catch {
          // GA未ロード等でも遷移は妨げない
        }
      }}
    >
      {children}
    </a>
  );
}
