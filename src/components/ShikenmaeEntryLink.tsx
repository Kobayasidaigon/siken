"use client";
import type { ReactNode } from "react";
import { sendGAEvent } from "@next/third-parties/google";

/** 「試験前の10問」への入口のリンク。押したことだけを GA4 に送る(shikenmae_entry_click) */
export default function ShikenmaeEntryLink({
  href,
  exam,
  placement,
  className = "font-bold text-[color:var(--c-accent,var(--c-ink))] hover:underline",
  children,
}: {
  href: string;
  exam: string;
  placement: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        try {
          sendGAEvent("event", "shikenmae_entry_click", { exam, placement });
        } catch {
          /* GA未ロードでも遷移は妨げない */
        }
      }}
    >
      {children}
    </a>
  );
}
