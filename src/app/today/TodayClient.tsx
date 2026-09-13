"use client";

import { useEffect, useState } from "react";
import { EXAM_LIST, loadProgress, type ExamSlug } from "@/lib/study-progress";
import DailyThreeCard from "@/components/growth/DailyThreeCard";
import { listUpcomingExamDates, primaryExam } from "@/lib/growth/exam-date";
import { formatYmdJa } from "@/lib/exam-dates";

const EXAM_SLUGS = new Set<string>(EXAM_LIST.map((e) => e.slug));

export default function TodayClient({ slugsByExam }: { slugsByExam: Record<ExamSlug, string[]> }) {
  const [exam, setExam] = useState<ExamSlug | null>(null);
  const [mounted, setMounted] = useState(false);
  const [dates, setDates] = useState<{ exam: ExamSlug; ymd: string }[]>([]);

  useEffect(() => {
    // 優先順: ?exam= → 試験日を設定した直近の資格 → いちばん解いている資格
    let pick: ExamSlug | null = null;
    try {
      const q = new URLSearchParams(window.location.search).get("exam");
      if (q && EXAM_SLUGS.has(q)) pick = q as ExamSlug;
    } catch {
      /* noop */
    }
    if (!pick) pick = primaryExam();
    if (!pick) {
      const p = loadProgress();
      let best: { slug: ExamSlug; n: number } | null = null;
      for (const e of EXAM_LIST) {
        const n = p[e.slug].wrong.length + p[e.slug].correct.length;
        if (n > 0 && (!best || n > best.n)) best = { slug: e.slug, n };
      }
      pick = best?.slug ?? null;
    }
    setExam(pick);
    setDates(listUpcomingExamDates().map((d) => ({ exam: d.exam, ymd: d.entry.ymd })));
    setMounted(true);
  }, []);

  const info = exam ? EXAM_LIST.find((e) => e.slug === exam) : null;

  return (
    <div className="pb-16">
      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">今日の3問</h1>
      <p className="text-sm text-[color:var(--c-text-sub)] leading-relaxed mb-6 max-w-2xl">
        前回間違えた問題 → あと1回正解で金になる問題 → まだ解いていない問題、の順に3問だけ出します。
        3問で終わります。試験日を設定した資格の分が出ます。
      </p>

      {!mounted ? (
        <p className="text-sm text-[color:var(--c-text-sub)]">読み込み中...</p>
      ) : exam && info ? (
        <>
          <DailyThreeCard exam={exam} examName={info.name} allSlugs={slugsByExam[exam] ?? []} placement="today" className="mb-6" />
          {dates.length > 1 && (
            <p className="text-xs text-[color:var(--c-text-sub)] mb-6">
              ほかの資格:{" "}
              {dates
                .filter((d) => d.exam !== exam)
                .map((d) => (
                  <a key={d.exam} href={`/today/?exam=${d.exam}`} className="underline mr-3">
                    {EXAM_LIST.find((e) => e.slug === d.exam)?.name}（{formatYmdJa(d.ymd)}）
                  </a>
                ))}
            </p>
          )}
          <p className="text-xs text-[color:var(--c-text-sub)]">
            <a href={info.topPath} className="underline">
              {info.name}のトップへ
            </a>
            {" ・ "}
            <a href="/study/" className="underline">
              学習履歴
            </a>
          </p>
        </>
      ) : (
        <section className="card p-6">
          <p className="text-sm text-[color:var(--c-text-sub)] leading-relaxed mb-4">
            まだ解いた問題がありません。資格のトップページで「この回を受ける」を押して試験日を決めるか、
            問題を1問解くと、翌日からここに今日の3問が出ます。
          </p>
          <a href="/" className="btn-accent">
            資格を選ぶ →
          </a>
        </section>
      )}
    </div>
  );
}
