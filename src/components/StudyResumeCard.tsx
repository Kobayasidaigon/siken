"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EXAM_LIST, loadProgress } from "@/lib/study-progress";

/**
 * 「前回の続き」カード。localStorage の学習履歴に未克服の誤答があるときだけ、
 * 誤答数の多い資格を添えて /study/ (誤答の解き直し)へ誘導する。
 * 履歴が無い初訪問者には何も出さない(サーバーレンダリング時も非表示)。
 */
export default function StudyResumeCard() {
  const [stat, setStat] = useState<{ total: number; topName: string; topCount: number } | null>(null);

  useEffect(() => {
    const progress = loadProgress();
    const perExam = EXAM_LIST.map((e) => ({ name: e.name, count: progress[e.slug].wrong.length }))
      .filter((e) => e.count > 0)
      .sort((a, b) => b.count - a.count);
    const total = perExam.reduce((sum, e) => sum + e.count, 0);
    if (total > 0) setStat({ total, topName: perExam[0].name, topCount: perExam[0].count });
  }, []);

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
