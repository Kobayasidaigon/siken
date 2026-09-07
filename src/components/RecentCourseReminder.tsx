"use client";

import { useEffect, useState } from "react";
import AffiliateLink from "@/components/AffiliateLink";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";
import { EXAM_LIST, type ExamSlug } from "@/lib/study-progress";
import { dismissRecentCourse, loadRecentCourses, type RecentCourse } from "@/lib/recent-course";

/**
 * 「前回チェックした講座」の1行リマインド(再訪時の再クリック導線)。2026-09-05 追加。
 *
 * 背景と設計は lib/recent-course.ts を参照。表示は既存の「広告」テキスト行と同じ体裁で、
 * 枠を増やさない。exam を渡せばその資格の記録があるときだけ、渡さなければ最新の1件を出す。
 * 初訪問者・記録なし・60日経過・非表示中は何も描画しない(サーバー描画時も非表示)。
 *
 * クリックは affiliate_click(course, placement="return_*") で計測され、既存面と分けて
 * 「再訪で踏み直した数」がそのまま読める。
 */

interface Props {
  exam?: ExamSlug;
  /** GA4 の placement。return_home / return_study / return_top */
  placement: string;
  className?: string;
}

export default function RecentCourseReminder({ exam, placement, className = "" }: Props) {
  const [recent, setRecent] = useState<RecentCourse | null>(null);

  useEffect(() => {
    const list = loadRecentCourses();
    const hit = exam ? list.find((r) => r.exam === exam) : list[0];
    setRecent(hit ?? null);
  }, [exam]);

  if (!recent) return null;
  const target = EXAM_AFFILIATE[recent.exam];
  if (!target) return null;
  const examName = EXAM_LIST.find((e) => e.slug === recent.exam)?.name ?? "";

  // 前回見た種類を主リンクに、もう一方(あれば)を副リンクに
  const free = target.freeHref ? { href: target.freeHref, label: target.freeLabel ?? "無料で資料請求する", placement: `${placement}_free` } : null;
  const paid = { href: target.href, label: target.label, placement };
  const primary = recent.kind === "free" && free ? free : paid;
  const secondary = primary === paid ? free : paid;

  return (
    <aside
      className={`p-3 rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)] text-xs text-[color:var(--c-text-sub)] flex flex-wrap items-baseline gap-x-2 gap-y-1 ${className}`}
    >
      <span className="tracking-wider border border-[color:var(--c-border)] px-1.5 py-0.5 rounded text-[10px]">広告</span>
      <span>前回チェックした{examName ? `${examName}の` : ""}講座</span>
      <AffiliateLink
        href={primary.href}
        course={target.course}
        placement={primary.placement}
        className="text-blue-700 hover:underline font-medium"
      >
        {primary.label} →
      </AffiliateLink>
      {secondary && (
        <AffiliateLink
          href={secondary.href}
          course={target.course}
          placement={secondary.placement}
          className="text-blue-700 hover:underline"
        >
          {secondary.label} →
        </AffiliateLink>
      )}
      <button
        type="button"
        onClick={() => {
          dismissRecentCourse(recent.exam);
          setRecent(null);
        }}
        className="ml-auto text-[10px] text-[color:var(--c-text-sub)] underline hover:no-underline"
        aria-label="このリマインドを30日間非表示にする"
      >
        非表示
      </button>
    </aside>
  );
}
