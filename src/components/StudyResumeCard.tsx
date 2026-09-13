"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EXAM_LIST, loadProgress } from "@/lib/study-progress";
import { daysUntil, listUpcomingExamDates } from "@/lib/growth/exam-date";

/**
 * 「前回の続き」カード。localStorage の学習履歴に未克服の誤答があるときだけ、
 * 誤答数の多い資格を添えて /study/ (誤答の解き直し)へ誘導する。
 * 履歴が無い初訪問者には何も出さない(サーバーレンダリング時も非表示)。
 *
 * 2026-09-13: 試験日を設定した資格があれば、残り日数と「今日の3問」の行を足す。
 * 誤答が無くても試験日があれば出す(戻ってくる理由を毎日ひとつ置く)。
 */
export default function StudyResumeCard() {
  const [stat, setStat] = useState<{ total: number; topName: string; topCount: number } | null>(null);
  const [upcoming, setUpcoming] = useState<{ exam: string; name: string; days: number } | null>(null);

  useEffect(() => {
    const progress = loadProgress();
    const perExam = EXAM_LIST.map((e) => ({ name: e.name, count: progress[e.slug].wrong.length }))
      .filter((e) => e.count > 0)
      .sort((a, b) => b.count - a.count);
    const total = perExam.reduce((sum, e) => sum + e.count, 0);
    if (total > 0) setStat({ total, topName: perExam[0].name, topCount: perExam[0].count });
    const next = listUpcomingExamDates()[0];
    if (next) {
      const name = EXAM_LIST.find((e) => e.slug === next.exam)?.name ?? "";
      setUpcoming({ exam: next.exam, name, days: daysUntil(next.entry.ymd) });
    }
  }, []);

  if (!stat && !upcoming) return null;

  if (!stat && upcoming) {
    return (
      <section className="mb-12">
        <Link href={`/today/?exam=${upcoming.exam}`} className="card block p-5 no-underline transition hover:shadow-md" style={{ borderColor: "var(--c-accent)" }}>
          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[color:var(--c-text-sub)] mb-1">今日の3問</p>
              <p className="text-[15px] font-bold text-[color:var(--c-ink)] font-serif">
                {upcoming.name}の試験日まで{upcoming.days === 0 ? "本日" : `あと ${upcoming.days} 日`}
              </p>
              <p className="text-xs text-[color:var(--c-text-sub)] mt-1">3問だけ解いて終わりにできます。</p>
            </div>
            <span className="shrink-0 text-sm" style={{ color: "var(--c-accent)" }}>解く →</span>
          </div>
        </Link>
      </section>
    );
  }
  if (!stat) return null;

  return (
    <section className="mb-12">
      <Link
        href="/study/"
        className="card block p-5 no-underline transition hover:shadow-md"
        style={{ borderColor: "var(--c-accent)" }}
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[color:var(--c-text-sub)] mb-1">前回の続き</p>
            <p className="text-[15px] font-bold text-[color:var(--c-ink)] font-serif">
              間違えたままの問題が {stat.total} 問あります
            </p>
            <p className="text-xs text-[color:var(--c-text-sub)] mt-1">
              いちばん多いのは {stat.topName}（{stat.topCount}問）。学習記録から解き直せます。
              {upcoming && (
                <>
                  {" "}
                  {upcoming.name}の試験日まで{upcoming.days === 0 ? "本日" : `あと ${upcoming.days} 日`}。
                </>
              )}
            </p>
          </div>
          <span className="shrink-0 text-sm" style={{ color: "var(--c-accent)" }}>
            解き直す →
          </span>
        </div>
      </Link>
    </section>
  );
}
