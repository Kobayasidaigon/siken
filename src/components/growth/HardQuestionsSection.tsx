"use client";

/**
 * 「間違えた人が多い問題 TOP10」。2026-09-13 追加(方針: docs/direction-2026-09.md §5-3)。
 *
 * 資格トップに置く。出典は /api/question-stats/?top=10(Studio の集計の代理、n>=30)。
 * データが無い間(集計が溜まるまで)は見出しごと何も出さない。
 * 「出題予想」とは書かない。「正答率が低い＝本番で差がつく論点」と言う(§7)。
 *
 * 問題の見出し(論点・分野)は API 側が問題データから付けて返す(資格トップの HTML に
 * 全問ぶんの表を埋め込まない)。
 */

import { useEffect, useState } from "react";
import type { ExamSlug } from "@/lib/study-progress";
import { MIN_SAMPLE } from "@/lib/growth/stats-config";

interface Props {
  exam: ExamSlug;
  examName: string;
  questionPathPrefix: string;
}

type Row = { slug: string; n: number; rate: number; topic: string; field: string };

export default function HardQuestionsSection({ exam, examName, questionPathPrefix }: Props) {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/question-stats/?exam=${encodeURIComponent(exam)}&top=10`);
        if (!res.ok) return;
        const data = (await res.json()) as { top?: Row[] };
        if (!cancelled && Array.isArray(data.top)) {
          setRows(
            data.top.filter(
              (r) => r && typeof r.slug === "string" && typeof r.topic === "string" && typeof r.n === "number" && r.n >= MIN_SAMPLE
            )
          );
        }
      } catch {
        /* 取れなければ出さない */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [exam]);

  if (rows.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-2 font-serif">間違えた人が多い問題</h2>
      <p className="text-xs text-[color:var(--c-text-sub)] mb-4 leading-relaxed">
        {examName}の練習問題を解いた人の正答率が低い順。正答率が低い＝本番で差がつく論点です（{MIN_SAMPLE}人以上が解いた問題だけ）。
      </p>
      <ol className="card divide-y divide-[color:var(--c-border)]">
        {rows.map((r, i) => {
          return (
            <li key={r.slug}>
              <a
                href={`${questionPathPrefix}${r.slug}/`}
                className="flex items-baseline gap-3 px-4 py-3 no-underline hover:bg-[color:var(--c-bg-alt)]"
              >
                <span className="text-xs font-bold text-[color:var(--c-text-sub)] w-5 shrink-0">{i + 1}</span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm text-[color:var(--c-text)] leading-snug">{r.topic}</span>
                  <span className="block text-xs text-[color:var(--c-text-sub)] mt-0.5">{r.field}</span>
                </span>
                <span className="text-xs text-[color:var(--c-text-sub)] shrink-0">正答率 {r.rate}%</span>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
