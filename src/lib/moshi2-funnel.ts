/**
 * 第2回模試(有料)の販売ファネルで共有する小物。クライアントから import してよい
 * (有料の問題データには触れない)。
 *
 * 【なぜ作ったか】2026-09-20 の改修で、結果画面のオファーを判定別(未達/あと一歩/合格圏)に
 * 出し分けるようになった。判定の閾値・試験日までの残り日数・GA4 への送り方が
 * Moshi2Offer / Moshi2TopLink / Moshi2Gate でばらばらだと、あとで数字を読むときに
 * 「どの verdict がどの条件か」が追えなくなるので、ここに1本化する。
 * ドリル3サイト(setsubi/kintore/eisei)の src/lib/moshi2-funnel.ts と同じ関数名にしてある。
 */

import {
  BIJIHOU_EXAMS,
  BIJIMANE_EXAMS,
  CHIZAI_EXAMS,
  ECO_EXAMS,
  FUKUSHI2_EXAMS,
  JITSUMU_EXAMS,
  MYNUMBER_EXAMS,
  PII_EXAMS,
  daysUntilYmd,
  nextExam,
  type UpcomingExam,
} from "./exam-dates";
import type { ExamSlug } from "./study-progress";

export type Moshi2Verdict = "fail" | "near" | "pass";

/** 第1回の結果画面が Moshi2Offer に渡す要約。単位は資格によって問数/点数が変わる */
export type Moshi2ResultSummary = {
  passed: boolean;
  /** 合格ラインまでの不足。合格ライン以上なら 0 以下(課題別基準で落ちた場合に起こる) */
  gap: number;
  /** gap と passLine の単位 */
  unit: "問" | "点";
  /** 合格ライン(問数または点数) */
  passLine: number;
  /** 判定帯の幅を決める母数(総問数または満点) */
  scale: number;
  /** いちばん正答率が低かった分野(全問正解なら undefined) */
  worstCategory?: string;
  worstPct?: number;
};

/**
 * 判定。「あと一歩」は不足が母数の1割(最低2)以内。
 * 総合点は足りているのに課題別基準で落ちた場合(gap<=0 かつ不合格)も「あと一歩」に入れる。
 */
export function moshi2Verdict(r: Pick<Moshi2ResultSummary, "passed" | "gap" | "scale">): Moshi2Verdict {
  if (r.passed) return "pass";
  const band = Math.max(2, Math.ceil(r.scale * 0.1));
  return r.gap <= band ? "near" : "fail";
}

/**
 * 第2回を売っている資格の試験日リスト。exam-dates.ts の定数を slug で引けるようにしただけ。
 * 第2回を売っていない資格(kashikin 等)はここに要らない。
 */
const EXAMS_BY_SLUG: Partial<Record<ExamSlug, UpcomingExam[]>> = {
  pii: PII_EXAMS,
  jitsumu: JITSUMU_EXAMS,
  mynumber: MYNUMBER_EXAMS,
  bijihou: BIJIHOU_EXAMS,
  bijimane: BIJIMANE_EXAMS,
  chizai: CHIZAI_EXAMS,
  chizai2: CHIZAI_EXAMS,
  eco: ECO_EXAMS,
  fukushi2: FUKUSHI2_EXAMS,
};

/**
 * 今日以降で最も近い試験日までの残り日数(当日=0)。日程が無ければ null で、
 * 呼び出し側は行ごと出さない。exam-dates.ts と同じ JST 基準。
 */
export function daysToNextExam(certId: string): number | null {
  const exams = EXAMS_BY_SLUG[certId as ExamSlug];
  if (!exams) return null;
  const e = nextExam(exams);
  return e ? daysUntilYmd(e.date) : null;
}

/**
 * GA4 へ送る。`beacon` を付けると gtag に transport_type: 'beacon' を渡し、直後に
 * ページ遷移しても送信が打ち切られにくくなる(checkout 開始のように遷移直前に送る用)。
 */
export function trackMoshi2(name: string, params?: Record<string, unknown>, opts?: { beacon?: boolean }) {
  if (typeof window === "undefined") return;
  const p = opts?.beacon ? { ...params, transport_type: "beacon" } : params;
  const g = gtagOf();
  if (g) {
    g("event", name, p);
    return;
  }
  // gtag.js は layout で lazyOnload 読込のため、ハイドレーション直後(販売ページの表示など)は
  // まだ window.gtag が無い。`gtag?.()` で捨てると moshi2_page_view がほぼ全件落ちるので、
  // 溜めておいて現れたら順に送る(最長30秒。それでも来なければ諦める)。
  pending.push([name, p]);
  if (flushTimer != null) return;
  const started = Date.now();
  flushTimer = window.setInterval(() => {
    const g2 = gtagOf();
    if (g2) for (const [n, pp] of pending.splice(0)) g2("event", n, pp);
    if (g2 || Date.now() - started > 30_000) {
      window.clearInterval(flushTimer!);
      flushTimer = null;
    }
  }, 300);
}

type Gtag = (...args: unknown[]) => void;
const pending: [string, Record<string, unknown> | undefined][] = [];
let flushTimer: number | null = null;

function gtagOf(): Gtag | undefined {
  const w = window as unknown as { gtag?: Gtag };
  return typeof w.gtag === "function" ? w.gtag : undefined;
}
