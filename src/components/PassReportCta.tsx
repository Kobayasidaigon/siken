"use client";

import { useEffect, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { EXAM_SCHEDULES } from "@/lib/cta-priority";
import { formatYmdJa, justFinishedExam } from "@/lib/exam-dates";
import type { ExamSlug } from "@/lib/study-progress";

/**
 * 「受験された方は結果を教えてください」の依頼。2026-09-05 追加。
 *
 * 試験日から45日以内のときだけ出す(受験の記憶が新しく、結果待ちで再訪しやすい時期)。
 * 申込締切のカウントダウンとは出る時期が重ならない。
 *
 * クライアント側で日付を評価するのは、SSG のビルド時評価だとデプロイ間隔しだいで
 * 「まだ実施していない試験に受験おつかれさまでした」と出しかねないため
 * (AnswerReveal が cta-priority をクライアント評価しているのと同じ理由)。
 *
 * 日程データが無い資格(ITパスポート=通年CBT など)では always を渡すと常時表示できる。
 */

export default function PassReportCta({
  exam,
  examName,
  accent,
  always = false,
  className = "",
}: {
  exam: ExamSlug;
  examName: string;
  /** テーマ色。例 "var(--c-kashikin)" */
  accent: string;
  /** 日程に関係なく常に出す(通年実施の資格向け) */
  always?: boolean;
  className?: string;
}) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (always) {
      setLabel("");
      return;
    }
    const finished = justFinishedExam(EXAM_SCHEDULES[exam] ?? []);
    if (finished) setLabel(formatYmdJa(finished.date));
  }, [exam, always]);

  if (label === null) return null;

  return (
    <section className={`card p-5 ${className}`} style={{ borderLeft: `3px solid ${accent}` }}>
      <p className="text-sm font-bold text-[color:var(--c-ink)] mb-1.5 font-serif">
        {label ? `${label}に受験された方へ` : `${examName}を受験された方へ`}
      </p>
      <p className="text-xs text-[color:var(--c-text-sub)] leading-relaxed mb-3">
        出題の傾向や、当サイトの問題が実際の試験とどれくらい近かったかを教えてください。
        いただいた内容は、問題の見直しと、これから受ける方への情報として掲載します（掲載可の方のみ）。
      </p>
      <a
        href={`/goukaku-houkoku/?exam=${exam}`}
        onClick={() => {
          try {
            sendGAEvent("event", "pass_report_cta_click", { exam });
          } catch {
            /* GA未ロードでも遷移は妨げない */
          }
        }}
        className="text-sm font-medium no-underline hover:underline"
        style={{ color: accent }}
      >
        受験の結果を報告する →
      </a>
    </section>
  );
}
