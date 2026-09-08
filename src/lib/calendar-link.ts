/**
 * 試験日・申込締切をカレンダーに入れてもらうためのリンク生成。2026-09-07 追加。
 *
 * 背景: 再接触チャネルが1本も無い。LINE もプッシュ通知もメルマガも無く、
 * 試験日という最良のトリガーを exam-dates.ts に持ちながら、一度離脱した人に
 * 声を届ける手段がゼロだった。A8 の成果は申込締切の直前に集中するので、
 * その日に思い出してもらえるかどうかは、そのまま収益に効く。
 *
 * なぜメールを集めないか:
 *   このサイトは SSG + localStorage で、ユーザーのデータベースが無い。
 *   メールアドレスを集めると、特定電子メール法の表示義務・オプトインの記録・
 *   配信停止の受付・保存基盤が要る。「サーバには送信されません」と書いて
 *   学習履歴を預かってきた前提とも整合しない。
 *
 *   代わりに、利用者自身のカレンダーに入れてもらう。通知は利用者の端末が出すので、
 *   こちらは何も預からず、配信停止も相手の手元で完結する。締切の前日に
 *   アラームを付けておけば、思い出す確率はメールより高い。
 *
 * 予定の中身にアフィリエイトリンクは入れない。手元に残る予定に広告を仕込む形になり、
 * このサイトの広告の出し方から外れる。入れるのはサイトの資格ページの URL だけで、
 * そこから先は普段どおりページ上の導線を通ってもらう。
 */

/** YYYY-MM-DD → YYYYMMDD */
function compact(ymd: string): string {
  return ymd.replace(/-/g, "");
}

/** 終日予定の DTEND は「翌日」。日付をまたぐ計算はUTCで行う(ローカル時刻に依存させない) */
function nextDayCompact(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + 1));
  const p = (n: number) => String(n).padStart(2, "0");
  return `${t.getUTCFullYear()}${p(t.getUTCMonth() + 1)}${p(t.getUTCDate())}`;
}

export interface CalendarEvent {
  /** 予定のタイトル */
  title: string;
  /** 開催日 YYYY-MM-DD。終日予定として登録する */
  ymd: string;
  /** 予定の説明 */
  details: string;
  /** シカクモンの該当ページ(絶対URL) */
  url: string;
  /** UID を安定させるためのキー。同じ予定を2回入れても増えないようにする */
  uidKey: string;
}

/**
 * Google カレンダーの登録画面を開く URL。
 * 終日予定は dates=開始/終了 で、終了日は翌日を指定する仕様。
 */
export function googleCalendarUrl(e: CalendarEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${compact(e.ymd)}/${nextDayCompact(e.ymd)}`,
    details: `${e.details}\n${e.url}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** iCalendar のテキスト値のエスケープ(RFC 5545) */
function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/**
 * .ics の中身。Apple カレンダー・Outlook 用。
 *
 * 前日にアラームを1つ付ける。申込締切は「当日に気づく」では間に合わないことがあり、
 * 前日通知がこの機能の主目的にあたるため。
 * 行の区切りは CRLF でなければ読めない実装があるので、必ず \r\n で連結する。
 */
export function icsText(e: CalendarEvent, now: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  const stamp =
    `${now.getUTCFullYear()}${p(now.getUTCMonth() + 1)}${p(now.getUTCDate())}` +
    `T${p(now.getUTCHours())}${p(now.getUTCMinutes())}${p(now.getUTCSeconds())}Z`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//shikakumon//exam-schedule//JA",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.uidKey}@shikakumon.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compact(e.ymd)}`,
    `DTEND;VALUE=DATE:${nextDayCompact(e.ymd)}`,
    `SUMMARY:${esc(e.title)}`,
    `DESCRIPTION:${esc(`${e.details}\n${e.url}`)}`,
    `URL:${e.url}`,
    "TRANSP:TRANSPARENT",
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(e.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
