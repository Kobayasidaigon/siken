/**
 * 試験日・申込締切カレンダー(/calendar/ と /calendar/YYYY-MM/)のデータ。2026-11-01 追加。
 *
 * exam-dates.ts の各資格の日程リストから、試験日・申込受付開始・申込締切を
 * 「日付つきの出来事」に展開し、月ごとにまとめる。日付は exam-dates.ts にだけ書く。
 * ここに日付を直接書かないこと(二重管理になり、片方だけ直して食い違う)。
 *
 * 月別ページの URL は、データに出来事がある月だけ作る。試験が終わって exam-dates.ts から
 * 回を消すと、その月のページも消える(sitemap も scripts/generate-sitemap.js が同じファイルを
 * 読んで月を求めているので、自動で揃う)。
 */
import {
  type UpcomingExam,
  KASHIKIN_EXAMS,
  CHINTAI_EXAMS,
  KANGYO_EXAMS,
  PII_EXAMS,
  MYNUMBER_EXAMS,
  JITSUMU_EXAMS,
  CHIZAI_EXAMS,
  BIJIHOU_EXAMS,
  BIJIMANE_EXAMS,
  FUKUSHI2_EXAMS,
  ECO_EXAMS,
  ISEC_EXAMS,
  ISF_EXAMS,
  DXP_EXAMS,
  HAD_EXAMS,
  CCM_EXAMS,
  TOUHAN_EXAMS,
  HOIKUSHI_EXAMS,
  GAIA_EXAMS,
  DXA_EXAMS,
  AIA_EXAMS,
  XRAY_EXAMS,
  CCC_EXAMS,
  LLC_EXAMS,
  CAC_EXAMS,
  IBD_EXAMS,
  DXO_EXAMS,
  WLC_EXAMS,
} from "./exam-dates";

export interface CalendarExam {
  slug: string;
  /** 正式名称(資格トップのカレンダー登録と同じ表記) */
  name: string;
  topPath: string;
  /** 日程コラム。無い資格は省略 */
  nitteiPath?: string;
  /** 東商IBT/CBT などの期間制。date は試験期間の初日 */
  period?: boolean;
  /** 同じ日程を別の級と共有している場合の注記。例「3級と同じ日程」 */
  note?: string;
  exams: UpcomingExam[];
}

/**
 * 掲載する資格。並びは月別ページで同じ日に複数あるときの順になる。
 * 知財2級は3級と、ビジ法2級は3級と、福祉住環境3級は2級と同じ日程リストを使う(exam-dates.ts の EXAMS_BY_SLUG と同じ)。
 * exam-dates.ts に *_EXAMS を足したら、ここにも足すこと。足し忘れると generate-sitemap.js がエラーで止まる
 * (sitemap の月はファイル中の全日付から拾うため、ここに無い資格の月が sitemap にだけ載ってしまう)。
 * 日程が空の資格(会社法法務士など)は載せても何も出ない。
 */
export const CALENDAR_EXAMS: CalendarExam[] = [
  { slug: "kashikin", name: "貸金業務取扱主任者", topPath: "/kashikin/", nitteiPath: "/column/shiken-nittei/", exams: KASHIKIN_EXAMS },
  { slug: "chintai", name: "賃貸不動産経営管理士", topPath: "/chintai/", exams: CHINTAI_EXAMS },
  { slug: "kangyo", name: "管理業務主任者", topPath: "/kangyo/", exams: KANGYO_EXAMS },
  { slug: "chizai", name: "知的財産管理技能検定3級", topPath: "/chizai/", nitteiPath: "/column/chizai-nittei/", exams: CHIZAI_EXAMS },
  { slug: "chizai2", name: "知的財産管理技能検定2級", topPath: "/chizai2/", nitteiPath: "/column/chizai2-nittei/", exams: CHIZAI_EXAMS },
  { slug: "pii", name: "個人情報保護士", topPath: "/pii/", nitteiPath: "/column/pii-nittei/", exams: PII_EXAMS },
  { slug: "jitsumu", name: "個人情報保護実務検定", topPath: "/jitsumu/", nitteiPath: "/column/jitsumu-nittei/", exams: JITSUMU_EXAMS },
  { slug: "mynumber", name: "マイナンバー実務検定3級", topPath: "/mynumber/", nitteiPath: "/column/mynumber-nittei/", exams: MYNUMBER_EXAMS },
  { slug: "had", name: "ハラスメントアドバイザー認定試験", topPath: "/had/", nitteiPath: "/column/had-nittei/", exams: HAD_EXAMS },
  { slug: "ccm", name: "企業危機・コンプライアンス管理士認定試験", topPath: "/ccm/", nitteiPath: "/column/ccm-nittei/", exams: CCM_EXAMS },
  { slug: "isec", name: "情報・サイバーセキュリティ管理士認定試験", topPath: "/isec/", nitteiPath: "/column/isec-nittei/", exams: ISEC_EXAMS },
  { slug: "isf", name: "情報・サイバーセキュリティ初級認定試験", topPath: "/isf/", nitteiPath: "/column/isf-nittei/", exams: ISF_EXAMS },
  { slug: "ccc", name: "民法法務士認定試験", topPath: "/ccc/", nitteiPath: "/column/ccc-nittei/", exams: CCC_EXAMS },
  { slug: "llc", name: "労働法務士認定試験", topPath: "/llc/", nitteiPath: "/column/llc-nittei/", exams: LLC_EXAMS },
  { slug: "cac", name: "会社法法務士認定試験", topPath: "/cac/", nitteiPath: "/column/cac-nittei/", exams: CAC_EXAMS },
  { slug: "wlc", name: "ワークライフ・コーディネーター認定試験", topPath: "/wlc/", nitteiPath: "/column/wlc-nittei/", exams: WLC_EXAMS },
  { slug: "ibd", name: "インバウンド実務主任者認定試験", topPath: "/ibd/", nitteiPath: "/column/ibd-nittei/", exams: IBD_EXAMS },
  { slug: "dxo", name: "DXオフィサー認定試験", topPath: "/dxo/", nitteiPath: "/column/dxo-nittei/", exams: DXO_EXAMS },
  { slug: "dxp", name: "DXパスポート試験", topPath: "/dxp/", nitteiPath: "/column/dxp-nittei/", exams: DXP_EXAMS },
  { slug: "dxa", name: "DX推進アドバイザー認定試験", topPath: "/dxa/", nitteiPath: "/column/dxa-nittei/", exams: DXA_EXAMS },
  { slug: "aia", name: "AI活用アドバイザー認定試験", topPath: "/aia/", nitteiPath: "/column/aia-nittei/", exams: AIA_EXAMS },
  { slug: "gaia", name: "生成AIアドバイザー認定試験", topPath: "/gaia/", nitteiPath: "/column/gaia-nittei/", exams: GAIA_EXAMS },
  { slug: "xray", name: "エックス線作業主任者免許試験", topPath: "/xray/", nitteiPath: "/column/xray-nittei/", exams: XRAY_EXAMS },
  { slug: "hoikushi", name: "保育士試験（筆記）", topPath: "/hoikushi/", nitteiPath: "/column/hoikushi-nittei/", period: true, exams: HOIKUSHI_EXAMS },
  { slug: "touhan", name: "登録販売者試験", topPath: "/touhan/", nitteiPath: "/column/touhan-nittei/", exams: TOUHAN_EXAMS },
  { slug: "bijihou", name: "ビジネス実務法務検定3級", topPath: "/bijihou/", nitteiPath: "/column/bijihou-nittei/", period: true, exams: BIJIHOU_EXAMS },
  { slug: "bijihou2", name: "ビジネス実務法務検定2級", topPath: "/bijihou2/", nitteiPath: "/column/bijihou-nittei/", period: true, exams: BIJIHOU_EXAMS },
  { slug: "bijimane", name: "ビジネスマネジャー検定", topPath: "/bijimane/", nitteiPath: "/column/bijimane-nittei/", period: true, exams: BIJIMANE_EXAMS },
  { slug: "fukushi2", name: "福祉住環境コーディネーター2級", topPath: "/fukushi2/", nitteiPath: "/column/fukushi2-nittei/", period: true, exams: FUKUSHI2_EXAMS },
  { slug: "fukushi3", name: "福祉住環境コーディネーター3級", topPath: "/fukushi3/", nitteiPath: "/column/fukushi2-nittei/", period: true, exams: FUKUSHI2_EXAMS },
  { slug: "eco", name: "eco検定（環境社会検定試験）", topPath: "/eco/", nitteiPath: "/column/eco-nittei/", period: true, exams: ECO_EXAMS },
];

export type EventKind = "applyEnd" | "exam" | "applyStart";

export interface CalendarEvent {
  kind: EventKind;
  /** YYYY-MM-DD */
  ymd: string;
  exam: CalendarExam;
  round: UpcomingExam;
}

const KIND_ORDER: Record<EventKind, number> = { applyEnd: 0, exam: 1, applyStart: 2 };

function buildEvents(): CalendarEvent[] {
  const out: CalendarEvent[] = [];
  for (const exam of CALENDAR_EXAMS) {
    for (const round of exam.exams) {
      out.push({ kind: "exam", ymd: round.date, exam, round });
      if (round.applyEnd) out.push({ kind: "applyEnd", ymd: round.applyEnd, exam, round });
      if (round.applyStart) out.push({ kind: "applyStart", ymd: round.applyStart, exam, round });
    }
  }
  return out.sort((a, b) =>
    a.ymd !== b.ymd ? (a.ymd < b.ymd ? -1 : 1) : KIND_ORDER[a.kind] - KIND_ORDER[b.kind]
  );
}

export const ALL_EVENTS: CalendarEvent[] = buildEvents();

/** "2026-11" 形式 */
export function ymOf(ymd: string): string {
  return ymd.slice(0, 7);
}

/** 出来事がある月の一覧(昇順) */
export function calendarMonths(): string[] {
  return [...new Set(ALL_EVENTS.map((e) => ymOf(e.ymd)))].sort();
}

export function eventsInMonth(ym: string): CalendarEvent[] {
  return ALL_EVENTS.filter((e) => ymOf(e.ymd) === ym);
}

/** その月のどこかで申込を受け付けている回(受付開始・締切がその月に無いものも含む) */
export function openDuringMonth(ym: string): { exam: CalendarExam; round: UpcomingExam }[] {
  const first = `${ym}-01`;
  const last = `${ym}-31`;
  const out: { exam: CalendarExam; round: UpcomingExam }[] = [];
  for (const exam of CALENDAR_EXAMS) {
    for (const round of exam.exams) {
      if (!round.applyStart || !round.applyEnd) continue;
      if (round.applyStart <= last && round.applyEnd >= first) out.push({ exam, round });
    }
  }
  return out.sort((a, b) => (a.round.applyEnd! < b.round.applyEnd! ? -1 : 1));
}

/** "2026-11" → "2026年11月" */
export function formatYmJa(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return `${y}年${m}月`;
}

/** 年度(4月始まり)。"2027-02" → 2026 */
export function fiscalYearOf(ym: string): number {
  const [y, m] = ym.split("-").map(Number);
  return m >= 4 ? y : y - 1;
}

/** JST の今日 "YYYY-MM-DD" */
export function todayJst(): string {
  return new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10);
}

export function kindLabel(e: CalendarEvent): string {
  if (e.kind === "applyEnd") return "申込締切";
  if (e.kind === "applyStart") return "申込受付開始";
  return e.exam.period ? "試験（期間の初日）" : "試験日";
}
