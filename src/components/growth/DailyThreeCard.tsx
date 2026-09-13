"use client";

/**
 * 「今日の3問」の入口。2026-09-13 追加(方針: docs/direction-2026-09.md §5-2)。
 *
 * 資格トップ・/study/・/today/ に置く。端末内の学習履歴から、その日の3問を
 * 銅→銀→未挑戦の順に決めて(lib/growth/daily.ts)、問題ページを続けて開く。
 * 解き終えた日は「完了」だけを出す。連続日数やバッジは出さない。
 *
 * 初期HTMLでは何も描かず、マウント後にだけ出す(localStorage 依存のため)。
 */

import { useEffect, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { loadProgress, type ExamSlug } from "@/lib/study-progress";
import { questionHref } from "@/lib/review-drill";
import { DAILY_SIZE, ensureDaily, startDaily, type DailyState } from "@/lib/growth/daily";
import { daysUntil, getUpcomingExamDate } from "@/lib/growth/exam-date";

interface Props {
  exam: ExamSlug;
  examName: string;
  /** その資格の全問題 slug(サーバー側で作って渡す) */
  allSlugs: string[];
  /** GA の placement。top / study / today */
  placement: string;
  /**
   * 試験日を設定したか、この資格を1問でも解いた人にだけ出す。資格トップで使う。
   * 初めて来た人にまで出すと、資格トップの「まず問題を解く」導線と競合するうえ、
   * 試験日設定の案内文(「決めると今日の3問が出ます」)と矛盾する。
   */
  requireEngagement?: boolean;
  className?: string;
}

export default function DailyThreeCard({
  exam,
  examName,
  allSlugs,
  placement,
  requireEngagement = false,
  className = "",
}: Props) {
  const [state, setState] = useState<DailyState | null>(null);
  const [examDays, setExamDays] = useState<number | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const refresh = () => {
      try {
        const progress = loadProgress()[exam];
        const e = getUpcomingExamDate(exam);
        setExamDays(e ? daysUntil(e.ymd) : null);
        const attempted = progress.wrong.length + progress.correct.length;
        if (requireEngagement && !e && attempted === 0) {
          setState(null);
          return;
        }
        setState(ensureDaily(exam, progress, allSlugs));
      } catch {
        setState(null);
      }
    };
    refresh();
    window.addEventListener("shikakumon-daily-update", refresh);
    window.addEventListener("shikakumon-exam-date-update", refresh);
    return () => {
      window.removeEventListener("shikakumon-daily-update", refresh);
      window.removeEventListener("shikakumon-exam-date-update", refresh);
    };
  }, [exam, allSlugs, requireEngagement]);

  if (!state) return null;

  function begin() {
    if (!state || starting) return;
    setStarting(true);
    const drill = startDaily(state);
    if (!drill) {
      setStarting(false);
      return;
    }
    try {
      sendGAEvent("event", "daily_start", { exam, size: state.slugs.length, placement });
    } catch {
      /* GA未ロードでも始められる */
    }
    window.location.href = questionHref(exam, state.slugs[0]);
  }

  const done = Boolean(state.doneAt);

  return (
    <section className={`card p-5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-[color:var(--c-text-sub)] mb-0.5">
            今日の{DAILY_SIZE}問
            {examDays != null && examDays >= 0 && (
              <>・試験日まで{examDays === 0 ? "本日" : `あと${examDays}日`}</>
            )}
          </p>
          <p className="text-sm font-bold text-[color:var(--c-ink)] font-serif">
            {done ? `${examName}の今日の分は解き終えました` : `${examName}を${state.slugs.length}問だけ`}
          </p>
          <p className="text-xs text-[color:var(--c-text-sub)] mt-1 leading-relaxed">
            {done
              ? "明日また別の3問が出ます。続けて解くなら学習履歴の復習ドリルへ。"
              : "前回間違えた問題から順に出ます。3問で終わります。"}
          </p>
        </div>
        {done ? (
          <a href="/study/" className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-ink)] shrink-0">
            学習履歴 →
          </a>
        ) : (
          <button type="button" onClick={begin} disabled={starting} className="btn-accent shrink-0 disabled:opacity-60">
            {starting ? "準備中…" : "解く →"}
          </button>
        )}
      </div>
    </section>
  );
}
