"use client";

import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { daysUntilYmd } from "@/lib/exam-dates";

/**
 * カウントダウンカードの表示をGA4へ送る(countdown_view)。
 * 「締切まであとN日のときに講座/申込クリックが伸びるか」を days_left 別に
 * 分析するための計測。日数は静的書き出しのビルド時値ではなく、閲覧時に
 * クライアントで計算し直す(鮮度のため ymd を受け取る)。
 */
export default function CountdownPing({ mode, ymd }: { mode: "apply" | "exam"; ymd: string }) {
  useEffect(() => {
    try {
      sendGAEvent("event", "countdown_view", {
        mode,
        days_left: daysUntilYmd(ymd),
        path: window.location.pathname,
      });
    } catch {
      /* GA未ロードでも表示は妨げない */
    }
  }, [mode, ymd]);
  return null;
}
