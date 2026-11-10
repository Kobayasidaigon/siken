import SiteLink from "@/components/SiteLink";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import JsonLd from "@/components/JsonLd";
import CalendarEventList from "@/components/CalendarEventList";
import { formatYmdJa, nextApplyDeadline, nextExam } from "@/lib/exam-dates";
import { EXAM_LIST } from "@/lib/study-progress";
import {
  ALL_EVENTS,
  CALENDAR_EXAMS,
  calendarMonths,
  eventsInMonth,
  fiscalYearOf,
  formatYmJa,
  todayJst,
  ymOf,
} from "@/lib/exam-calendar";

/**
 * 資格試験カレンダー(年度一覧)。2026-11-01 追加。
 * 中身はすべて exam-dates.ts から組み立てる。日付を足すと自動でここと月別ページに出る。
 */
export const metadata: Metadata = pageMetadata({
  path: "/calendar/",
  title: "資格試験カレンダー｜試験日と申込締切の一覧",
  description: `シカクモンで扱う資格のうち${CALENDAR_EXAMS.length}資格の試験日・申込受付開始日・申込締切日を月別にまとめたカレンダー。個人情報保護士・知的財産管理技能検定・ビジネス実務法務検定・貸金業務取扱主任者などの次回日程を一覧で確認できます。`,
});

/** これからの申込締切を何日先まで出すか */
const DEADLINE_WINDOW_DAYS = 90;

export default function CalendarPage() {
  const today = todayJst();
  const windowEnd = new Date(Date.parse(`${today}T00:00:00Z`) + DEADLINE_WINDOW_DAYS * 86400_000)
    .toISOString()
    .slice(0, 10);
  const upcomingDeadlines = ALL_EVENTS.filter(
    (e) => e.kind === "applyEnd" && e.ymd >= today && e.ymd <= windowEnd
  );
  const currentYm = ymOf(today);

  const months = calendarMonths();
  const byFiscal = new Map<number, string[]>();
  for (const ym of months) {
    const fy = fiscalYearOf(ym);
    byFiscal.set(fy, [...(byFiscal.get(fy) ?? []), ym]);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://shikakumon.com/" },
      { "@type": "ListItem", position: 2, name: "資格試験カレンダー", item: "https://shikakumon.com/calendar/" },
    ],
  };

  return (
    <div className="pb-16">
      <JsonLd data={jsonLd} />
      <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
        <SiteLink href="/" className="hover:underline">ホーム</SiteLink> › 資格試験カレンダー
      </nav>

      <h1 className="text-2xl sm:text-3xl font-bold text-[color:var(--c-ink)] font-serif mb-3">
        資格試験カレンダー
      </h1>
      <p className="text-sm text-[color:var(--c-text-sub)] leading-relaxed mb-2">
        シカクモンで扱う{EXAM_LIST.length}資格のうち、{CALENDAR_EXAMS.length}資格の試験日・申込受付開始日・申込締切日をまとめました。
        申込締切は試験日の1〜3か月前に来るものが多く、気づいたときには締め切っていることがよくあります。
        受けたい試験の締切を先に確認しておいてください。
      </p>
      <p className="text-xs text-[color:var(--c-text-sub)] leading-relaxed mb-10">
        日程は各実施団体の発表をもとにしています。変更されることがあるため、申込の前に必ず公式サイトで確認してください。
        東京商工会議所の検定（ビジネス実務法務・ビジネスマネジャー・福祉住環境・eco検定）は試験期間の中から日時を選ぶ方式のため、期間の初日を載せています。
        ITパスポート試験（全国の会場で随時受けられる CBT 方式）、教員採用試験（自治体ごとに日程が違う）、社会福祉士（年1回2月。日程を確認中）は載せていません。
      </p>

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] font-serif mb-1">これからの申込締切</h2>
        <p className="text-xs text-[color:var(--c-text-sub)] mb-4">今日から{DEADLINE_WINDOW_DAYS}日以内に締め切る回</p>
        {upcomingDeadlines.length > 0 ? (
          <CalendarEventList events={upcomingDeadlines} showYear />
        ) : (
          <p className="text-sm text-[color:var(--c-text-sub)]">この期間に締め切る回はありません。</p>
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] font-serif mb-4">月別に見る</h2>
        {[...byFiscal.entries()].map(([fy, yms]) => (
          <div key={fy} className="mb-6 last:mb-0">
            <h3 className="text-sm font-bold text-[color:var(--c-ink)] mb-3">{fy}年度</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {yms.map((ym) => {
                const ev = eventsInMonth(ym);
                const deadlines = ev.filter((e) => e.kind === "applyEnd").length;
                const exams = ev.filter((e) => e.kind === "exam").length;
                const starts = ev.filter((e) => e.kind === "applyStart").length;
                const isCurrent = ym === currentYm;
                const past = ym < currentYm;
                return (
                  <SiteLink
                    key={ym}
                    href={`/calendar/${ym}/`}
                    className={`card p-3 no-underline block ${past ? "opacity-60" : ""}`}
                    style={isCurrent ? { borderLeft: "4px solid var(--c-kashikin)" } : undefined}
                  >
                    <p className="font-bold text-[color:var(--c-ink)] text-sm">
                      {formatYmJa(ym)}
                      {isCurrent && <span className="ml-1 text-[10px] text-[color:var(--c-kashikin)]">今月</span>}
                    </p>
                    <p className="text-xs text-[color:var(--c-text-sub)] mt-1">
                      締切 {deadlines}・試験 {exams}
                      {starts > 0 && `・受付開始 ${starts}`}
                    </p>
                  </SiteLink>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] font-serif mb-4">資格別の次回日程</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-xs text-[color:var(--c-text-sub)] border-b border-[color:var(--c-border)]">
                <th className="py-2 pr-3 font-medium">資格</th>
                <th className="py-2 pr-3 font-medium whitespace-nowrap">次回試験</th>
                <th className="py-2 font-medium whitespace-nowrap">申込締切</th>
              </tr>
            </thead>
            <tbody>
              {CALENDAR_EXAMS.map((exam) => {
                const round = nextApplyDeadline(exam.exams) ?? nextExam(exam.exams);
                return (
                  <tr key={exam.slug} className="border-b border-[color:var(--c-border)] align-top">
                    <td className="py-3 pr-3">
                      <SiteLink href={exam.topPath} className="text-[color:var(--c-ink)] hover:underline">{exam.name}</SiteLink>
                      {exam.nitteiPath && (
                        <SiteLink href={exam.nitteiPath} className="block text-xs text-[color:var(--c-text-sub)] hover:underline mt-0.5">
                          日程の詳しい解説 →
                        </SiteLink>
                      )}
                    </td>
                    <td className="py-3 pr-3 whitespace-nowrap">
                      {round ? (
                        <>
                          {formatYmdJa(round.date)}
                          {exam.period ? "〜" : ""}
                          <span className="block text-xs text-[color:var(--c-text-sub)]">{round.label}</span>
                        </>
                      ) : (
                        <span className="text-[color:var(--c-text-sub)]">未発表</span>
                      )}
                    </td>
                    <td className="py-3 whitespace-nowrap">
                      {round?.applyEnd ? (
                        <>
                          {formatYmdJa(round.applyEnd)}
                          {round.applyEnd < today && (
                            <span className="block text-xs text-[color:var(--c-text-sub)]">受付終了</span>
                          )}
                        </>
                      ) : (
                        <span className="text-[color:var(--c-text-sub)]">未発表</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
