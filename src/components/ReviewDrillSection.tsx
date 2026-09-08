"use client";

/**
 * 復習ドリルの入口。/study/ の資格ごとのカードに出す。2026-09-07 追加。
 *
 * メダル制はあるのに「金にする」ための出口が無く、/study/ は誤答のリンクが
 * 並ぶだけだった。1問解くたびに一覧へ戻る操作が要るので、連続して解き直す
 * 動機が続かない。ここから始めると、銅→銀→未挑戦の順に20問を続けて解ける。
 *
 * 出題順の組み立てと現在位置の判定は lib/review-drill.ts。
 * 問題は既存の問題ページをそのまま使う(この部品は行き先を決めるだけ)。
 */

import { useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import type { ExamProgress, ExamSlug } from "@/lib/study-progress";
import {
  DRILL_MIN,
  DRILL_SIZE,
  buildDrillQueue,
  drillCandidates,
  questionHref,
  startDrill,
} from "@/lib/review-drill";

export default function ReviewDrillSection({
  exam,
  examName,
  progress,
  allSlugs,
}: {
  exam: ExamSlug;
  examName: string;
  progress: ExamProgress;
  /** その資格の全問題 slug。/study/ が既に持っている問題インデックスから渡す */
  allSlugs: string[];
}) {
  const [starting, setStarting] = useState(false);
  const c = drillCandidates(progress, allSlugs);
  const available = c.bronze.length + c.silver.length + c.unseen.length;
  if (available < DRILL_MIN) return null;

  const size = Math.min(DRILL_SIZE, available);

  function begin() {
    if (starting) return;
    setStarting(true);
    const queue = buildDrillQueue(c, size);
    if (queue.length === 0) {
      setStarting(false);
      return;
    }
    startDrill(exam, queue);
    try {
      sendGAEvent("event", "drill_start", {
        exam,
        size: queue.length,
        bronze: c.bronze.length,
        silver: c.silver.length,
      });
    } catch {
      /* GA未ロードでもドリルは始められる */
    }
    window.location.href = questionHref(exam, queue[0]);
  }

  return (
    <div className="mt-4 pt-4 border-t border-[color:var(--c-border)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[color:var(--c-ink)]">復習ドリル</p>
          <p className="text-xs text-[color:var(--c-text-sub)] mt-0.5 leading-relaxed">
            前回間違えた {c.bronze.length} 問 → あと1回で金になる {c.silver.length} 問 → まだ解いていない{" "}
            {c.unseen.length} 問 の順に、{size}問を続けて解きます。
          </p>
        </div>
        <button
          type="button"
          onClick={begin}
          disabled={starting}
          className="btn-accent shrink-0 disabled:opacity-60"
        >
          {starting ? "準備中…" : `${examName}を${size}問`}
        </button>
      </div>
    </div>
  );
}
