import SiteLink from "@/components/SiteLink";
import { formatYmdJa, daysUntilYmd } from "@/lib/exam-dates";
import { type CalendarEvent, kindLabel, todayJst } from "@/lib/exam-calendar";

/**
 * 試験カレンダー(/calendar/)の出来事リスト。2026-11-01 追加。
 * 日付・種別・資格名・回次と、今日からの残り日数(過ぎたものは「終了」)を1行ずつ出す。
 * 残り日数はサーバーで計算する。layout.tsx の revalidate で1時間ごとに作り直される。
 */
const KIND_STYLE: Record<CalendarEvent["kind"], { color: string; bg: string }> = {
  applyEnd: { color: "var(--c-kashikin)", bg: "var(--c-kashikin-soft)" },
  exam: { color: "var(--c-pii)", bg: "var(--c-pii-soft)" },
  applyStart: { color: "var(--c-eco)", bg: "var(--c-eco-soft)" },
};

export default function CalendarEventList({ events, showYear = false }: { events: CalendarEvent[]; showYear?: boolean }) {
  const today = todayJst();
  return (
    <ul className="divide-y divide-[color:var(--c-border)] border-y border-[color:var(--c-border)]">
      {events.map((e) => {
        const past = e.ymd < today;
        const days = past ? null : daysUntilYmd(e.ymd);
        const style = KIND_STYLE[e.kind];
        const date = formatYmdJa(e.ymd);
        return (
          <li
            key={`${e.exam.slug}-${e.kind}-${e.ymd}-${e.round.label}`}
            className={`py-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4 ${past ? "opacity-60" : ""}`}
          >
            <span className="text-sm font-bold text-[color:var(--c-ink)] sm:w-44 shrink-0">
              {showYear ? date : date.replace(/^\d+年/, "")}
              {e.kind === "exam" && e.exam.period ? "〜" : ""}
            </span>
            <span className="flex-1 min-w-0">
              <span
                className="inline-block text-[11px] font-bold px-2 py-0.5 rounded mr-2 align-middle"
                style={{ color: style.color, background: style.bg }}
              >
                {kindLabel(e)}
              </span>
              <SiteLink href={e.exam.topPath} className="text-sm text-[color:var(--c-ink)] hover:underline">
                {e.exam.name}
              </SiteLink>
              <span className="text-xs text-[color:var(--c-text-sub)] ml-2">{e.round.label}</span>
            </span>
            <span className="text-xs text-[color:var(--c-text-sub)] shrink-0 sm:w-20 sm:text-right">
              {past ? "終了" : days === 0 ? "今日" : `あと${days}日`}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
