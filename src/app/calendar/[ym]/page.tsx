import SiteLink from "@/components/SiteLink";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/page-metadata";
import JsonLd from "@/components/JsonLd";
import CalendarEventList from "@/components/CalendarEventList";
import { formatYmdJa } from "@/lib/exam-dates";
import {
  calendarMonths,
  eventsInMonth,
  formatYmJa,
  openDuringMonth,
  todayJst,
} from "@/lib/exam-calendar";

/**
 * 月別の資格試験カレンダー(/calendar/2026-11/ など)。2026-11-01 追加。
 * 「2026年11月 資格試験」「11月 申込締切 資格」のような月で探す検索に答える面。
 * exam-dates.ts に出来事がある月だけ生成する(それ以外は 404)。
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return calendarMonths().map((ym) => ({ ym }));
}

export async function generateMetadata({ params }: { params: Promise<{ ym: string }> }): Promise<Metadata> {
  const { ym } = await params;
  const ev = eventsInMonth(ym);
  const names = [...new Set(ev.map((e) => e.exam.name))].slice(0, 4).join("・");
  return pageMetadata({
    path: `/calendar/${ym}/`,
    title: `${formatYmJa(ym)}の資格試験日・申込締切一覧`,
    description: `${formatYmJa(ym)}に試験日・申込締切・申込受付開始を迎える資格試験の一覧。${names}など、日付順に確認できます。`,
  });
}

export default async function CalendarMonthPage({ params }: { params: Promise<{ ym: string }> }) {
  const { ym } = await params;
  const months = calendarMonths();
  const idx = months.indexOf(ym);
  if (idx < 0) notFound();
  const prev = months[idx - 1];
  const next = months[idx + 1];

  const ev = eventsInMonth(ym);
  const deadlines = ev.filter((e) => e.kind === "applyEnd");
  const exams = ev.filter((e) => e.kind === "exam");
  const starts = ev.filter((e) => e.kind === "applyStart");
  const open = openDuringMonth(ym);
  const today = todayJst();
  const title = `${formatYmJa(ym)}の資格試験日・申込締切`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://shikakumon.com/" },
      { "@type": "ListItem", position: 2, name: "資格試験カレンダー", item: "https://shikakumon.com/calendar/" },
      { "@type": "ListItem", position: 3, name: formatYmJa(ym), item: `https://shikakumon.com/calendar/${ym}/` },
    ],
  };

  const monthNav = (
    <nav className="flex justify-between text-sm my-8">
      {prev ? <SiteLink href={`/calendar/${prev}/`} className="hover:underline">← {formatYmJa(prev)}</SiteLink> : <span />}
      <SiteLink href="/calendar/" className="hover:underline">年度一覧</SiteLink>
      {next ? <SiteLink href={`/calendar/${next}/`} className="hover:underline">{formatYmJa(next)} →</SiteLink> : <span />}
    </nav>
  );

  return (
    <div className="pb-16">
      <JsonLd data={jsonLd} />
      <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
        <SiteLink href="/" className="hover:underline">ホーム</SiteLink> ›{" "}
        <SiteLink href="/calendar/" className="hover:underline">資格試験カレンダー</SiteLink> › {formatYmJa(ym)}
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold text-[color:var(--c-ink)] font-serif mb-3">{title}</h1>
      <p className="text-sm text-[color:var(--c-text-sub)] leading-relaxed mb-2">
        {formatYmJa(ym)}は、申込締切が{deadlines.length}件、試験が{exams.length}件、申込受付の開始が{starts.length}件あります。
        資格名から練習問題のページへ進めます。
      </p>
      <p className="text-xs text-[color:var(--c-text-sub)] leading-relaxed">
        日程は各実施団体の発表をもとにしています。申込の前に必ず公式サイトで確認してください。
      </p>

      {monthNav}

      <Section title="申込締切" lead="この日を過ぎると、その回は受験できません。" events={deadlines} />
      <Section title="試験日" lead="期間制の試験（東京商工会議所の検定など）は試験期間の初日です。" events={exams} />
      <Section title="申込受付開始" events={starts} />

      {open.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-[color:var(--c-ink)] font-serif mb-1">この月に申込を受け付けている試験</h2>
          <p className="text-xs text-[color:var(--c-text-sub)] mb-4">受付期間が{formatYmJa(ym)}にかかっている回です。</p>
          <ul className="divide-y divide-[color:var(--c-border)] border-y border-[color:var(--c-border)]">
            {open.map(({ exam, round }) => (
              <li
                key={`${exam.slug}-${round.date}`}
                className={`py-3 text-sm ${round.applyEnd! < today ? "opacity-60" : ""}`}
              >
                <SiteLink href={exam.topPath} className="text-[color:var(--c-ink)] hover:underline">{exam.name}</SiteLink>
                <span className="text-xs text-[color:var(--c-text-sub)] ml-2">{round.label}</span>
                <span className="block text-xs text-[color:var(--c-text-sub)] mt-0.5">
                  申込 {formatYmdJa(round.applyStart!)}〜{formatYmdJa(round.applyEnd!)}／試験 {formatYmdJa(round.date)}
                  {exam.period ? "〜" : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {monthNav}
    </div>
  );
}

function Section({
  title,
  lead,
  events,
}: {
  title: string;
  lead?: string;
  events: ReturnType<typeof eventsInMonth>;
}) {
  if (events.length === 0) return null;
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-[color:var(--c-ink)] font-serif mb-1">{title}</h2>
      {lead && <p className="text-xs text-[color:var(--c-text-sub)] mb-4">{lead}</p>}
      <CalendarEventList events={events} />
    </section>
  );
}
