"use client";

/**
 * 試験日・申込締切をカレンダーに入れる一行。カウントダウンの下に置く。
 * 2026-09-07 追加。
 *
 * 再接触チャネルがこのサイトには1本も無かった。申込締切は A8 の成果が集中する
 * タイミングなので、その前日に思い出してもらえるかどうかが直接効く。
 * メールを預かる代わりに、利用者自身のカレンダーに入れてもらう
 * (設計の理由は lib/calendar-link.ts のコメント)。
 *
 * 見た目はカウントダウンの補助情報として、既存の注記と同じ級数・色に収める。
 * 予定の中身にアフィリエイトリンクは入れない。
 */

import { sendGAEvent } from "@next/third-parties/google";
import { SITE } from "@/lib/site";
import { googleCalendarUrl, icsText, type CalendarEvent } from "@/lib/calendar-link";
import { formatYmdJa } from "@/lib/exam-dates";

export default function ExamCalendarLinks({
  examName,
  kind,
  ymd,
  label,
  path,
  placement,
}: {
  /** 資格の正式名称。予定のタイトルに使う */
  examName: string;
  kind: "apply" | "exam";
  /** 対象日 YYYY-MM-DD */
  ymd: string;
  /** 回次の呼び名。例「2026年11月」 */
  label: string;
  /** シカクモンの該当ページのパス。例 "/chintai/" */
  path: string;
  placement: string;
}) {
  const title =
    kind === "apply" ? `${examName} ${label} 申込締切` : `${examName} ${label} 試験日`;
  const details =
    kind === "apply"
      ? "この日を過ぎると、この回は受験できません。申込は各試験の公式サイトから行ってください。"
      : "試験日です。持ち物と会場を前日までに確認しておいてください。";

  const event: CalendarEvent = {
    title,
    ymd,
    details,
    url: `${SITE.url}${path}`,
    uidKey: `${path.replace(/\//g, "")}-${kind}-${ymd.replace(/-/g, "")}`,
  };

  function track(target: string) {
    try {
      sendGAEvent("event", "calendar_add", { kind, target, placement });
    } catch {
      /* GA未ロードでもカレンダー登録は妨げない */
    }
  }

  function downloadIcs() {
    try {
      const blob = new Blob([icsText(event, new Date())], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${event.uidKey}.ics`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      track("ics");
    } catch {
      /* 生成できない環境では Google カレンダー側を使ってもらう */
    }
  }

  return (
    <p className="mt-3 pt-3 border-t border-[color:var(--c-border)] text-xs text-[color:var(--c-text-sub)] flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span>
        {formatYmdJa(ymd)}を忘れないように
      </span>
      <a
        href={googleCalendarUrl(event)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("google")}
        className="text-blue-700 hover:underline"
      >
        Google カレンダーに追加
      </a>
      <button
        type="button"
        onClick={downloadIcs}
        className="text-blue-700 hover:underline"
      >
        カレンダーファイル（.ics）
      </button>
    </p>
  );
}
