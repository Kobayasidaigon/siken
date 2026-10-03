"use client";

/**
 * ヘッダー(PC 表示の「Studio AI」)とフッターの Studio リンク。2026-10-03 追加。
 *
 * 背景: どちらも layout.tsx に utm 付きのトップ `/` を直書きしていて、資格のページの
 * 上でも資格と無関係なトップに着地していた(28日で header 23・footer 33 クリック)。
 * layout は server component でパスを知らないので、パスを読む部分だけをこの部品に切り出す。
 *
 * 資格のページ(判定は studio-cta.ts の certFromPath)では、問題結果・コラム末尾と同じ
 * studioCtaFor の行き先にする(資格別 LP があれば /lp/<slug>、無ければトップに ?exam=<正式名>)。
 * 資格は exam として StudioLink に渡し、studio_click / studio_cta_impression に載せる。
 * 資格でないページ(トップ・コラム一覧・学習履歴・about など)は従来どおりトップ・exam なし。
 *
 * 見た目・文言は呼び出し側(layout.tsx)が今までどおり持つ。placement と utm_content は
 * 従来と同じ header / footer をそのまま使う。
 */

import type { CSSProperties, ReactNode } from "react";
import { usePathname } from "next/navigation";
import StudioLink from "@/components/StudioLink";
import { certFromPath, studioCtaFor } from "@/lib/studio-cta";

export default function StudioNavLink({
  placement,
  className,
  style,
  children,
}: {
  /** 設置面。utm_content にも同じ値を入れる(従来の URL と同じ) */
  placement: "header" | "footer";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const exam = certFromPath(usePathname());

  return (
    <StudioLink
      href={studioCtaFor(exam, placement).href}
      placement={placement}
      exam={exam ?? undefined}
      className={className}
      style={style}
    >
      {children}
    </StudioLink>
  );
}
