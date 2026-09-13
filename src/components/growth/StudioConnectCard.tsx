"use client";

/**
 * Studio との接続(履歴同期・毎朝のリマインド)。2026-09-13 追加。
 * 方針: docs/direction-2026-09.md §5-2「メール(=Studio登録)→ 履歴同期」。
 *
 * /study/ に置く。本体で解いた記録は匿名IDで Studio に届いているので、
 * Studio 側でその匿名IDをアカウントに結びつければ、履歴が本人のものになる。
 * このカードはその入口(リンク1本)で、本体からアカウント情報は一切渡さない。
 *
 * Studio 側の /connect ができるまで STUDIO_CONNECT_ENABLED=false で非表示。
 * 回答ログの送信を止めている人には、同期できるものが無いので出さない。
 */

import { useEffect, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import StudioLink from "@/components/StudioLink";
import { studioConnectHref } from "@/lib/studio-cta";
import { getAnonId, isAnswerLogEnabled } from "@/lib/growth/anon-id";
import { primaryExam, getUpcomingExamDate } from "@/lib/growth/exam-date";
import { STUDIO_CONNECT_ENABLED } from "@/lib/growth/flags";
import type { ExamSlug } from "@/lib/study-progress";

export default function StudioConnectCard({ className = "" }: { className?: string }) {
  const [anon, setAnon] = useState<string | null>(null);
  const [exam, setExam] = useState<ExamSlug | null>(null);
  const [examDate, setExamDate] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => {
      if (!isAnswerLogEnabled()) {
        setAnon(null);
        return;
      }
      setAnon(getAnonId());
      const e = primaryExam();
      setExam(e);
      setExamDate(e ? (getUpcomingExamDate(e)?.ymd ?? null) : null);
    };
    refresh();
    window.addEventListener("shikakumon-answer-log-setting", refresh);
    window.addEventListener("shikakumon-exam-date-update", refresh);
    return () => {
      window.removeEventListener("shikakumon-answer-log-setting", refresh);
      window.removeEventListener("shikakumon-exam-date-update", refresh);
    };
  }, []);

  if (!STUDIO_CONNECT_ENABLED || !anon) return null;

  return (
    <section className={`card p-5 ${className}`}>
      <h2 className="text-sm font-bold text-[color:var(--c-ink)] font-serif mb-1">Studio に履歴を引き継ぐ</h2>
      <p className="text-xs text-[color:var(--c-text-sub)] leading-relaxed mb-3">
        姉妹サービス「シカクモン Studio」に登録すると、ここで解いた問題の正誤が Studio
        側の復習(忘却曲線)と弱点分析に載り、毎朝の3問をメールや通知で受け取れます。
        引き継ぐのは端末の匿名IDと試験日だけで、このページの履歴そのものは送りません。
      </p>
      <StudioLink
        href={studioConnectHref(exam, "sync", { examDate, anon })}
        placement="study_sync"
        exam={exam ?? undefined}
        className="text-sm font-bold text-indigo-700 hover:underline no-underline"
        onClick={() => {
          try {
            sendGAEvent("event", "history_sync", { exam: exam ?? "none", target: "studio" });
          } catch {
            /* noop */
          }
        }}
      >
        Studio で履歴を同期する →
      </StudioLink>
    </section>
  );
}
