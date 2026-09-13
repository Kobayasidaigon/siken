"use client";

/**
 * 「みんなの正答率」。2026-09-13 追加(方針: docs/direction-2026-09.md §5-3)。
 *
 * 答え合わせの直後にだけ出す(解く前に見せると答えの当たりを付けさせてしまう)。
 * 出典は /api/question-stats/(Studio の集計の代理)。n が 30 未満・未集計・
 * 取得失敗のときは何も出ない。
 *
 * 文言の決まり(§7): 「出題予想」は書かない。正答率が低い問題は
 * 「本番で差がつく論点」と言う。
 */

import { useEffect, useState } from "react";
import type { ExamSlug } from "@/lib/study-progress";
import { MIN_SAMPLE } from "@/lib/growth/stats-config";

interface Props {
  exam: ExamSlug;
  slug: string;
  /** 答え合わせ済みか。true になってから取得する */
  revealed: boolean;
  /** この人の正誤(選択なしは null) */
  correct: boolean | null;
}

type Stat = { n: number; rate: number };

/** 「差がつく論点」とみなす正答率の上限 */
const HARD_RATE = 50;

export default function AccuracyBadge({ exam, slug, revealed, correct }: Props) {
  const [stat, setStat] = useState<Stat | null>(null);

  useEffect(() => {
    if (!revealed) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/question-stats/?exam=${encodeURIComponent(exam)}&slugs=${encodeURIComponent(slug)}`);
        if (!res.ok) return;
        const data = (await res.json()) as { stats?: Record<string, Stat> };
        const s = data.stats?.[slug];
        if (!cancelled && s && typeof s.n === "number" && typeof s.rate === "number" && s.n >= MIN_SAMPLE) setStat(s);
      } catch {
        /* 取れなければ出さない */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [exam, slug, revealed]);

  if (!stat) return null;

  const hard = stat.rate < HARD_RATE;
  return (
    <p className="text-xs text-[color:var(--c-text-sub)] mt-2">
      みんなの正答率 <strong className="text-[color:var(--c-ink)]">{stat.rate}%</strong>（{stat.n}人）
      {hard && (
        <span>
          。正答率が低い＝本番で差がつく論点です
          {correct === true ? "。ここで正解できているのは強みです" : ""}
        </span>
      )}
    </p>
  );
}
