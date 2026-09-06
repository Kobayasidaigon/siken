/**
 * 答え合わせ直後 CTA の優先順位決定。
 *
 * 背景 (2026-08-18):
 *   問題ページの解答後には「シカクモン Studio 送客」と「講座アフィリ (courseAd)」の
 *   2 つの CTA があり、これまで常に Studio が上・アフィリが下の固定順だった。
 *   90 日の実測では affiliate_click 172 / Studio 送客 約170 とほぼ互角で、
 *   どちらも捨てられない。
 *
 *   一方 exam-dates.ts に記録されているとおり、A8 の成果発生は
 *   「試験日の直前」ではなく **「申込締切の直前」に集中する** (2026-08-06 実測)。
 *   さらに申込締切を過ぎるとその回の受験は不可逆に不可能になる。
 *   Studio は月額サブスクで、試験まで日数があるほど価値を訴求しやすい。
 *
 * したがって:
 *   「アフィリが最も効く窓 (= 申込締切の直前) だけアフィリを上に出し、
 *     それ以外の期間は Studio を上に出す」
 *   のが期待値を最大化する。CTA を消すことはしない (順序だけ変える)。
 */
import type { ExamSlug } from "./study-progress";
import {
  type UpcomingExam,
  KASHIKIN_EXAMS,
  CHIZAI_EXAMS,
  FUKUSHI2_EXAMS,
  BIJIHOU_EXAMS,
  BIJIMANE_EXAMS,
  ECO_EXAMS,
  PII_EXAMS,
  MYNUMBER_EXAMS,
  JITSUMU_EXAMS,
  CHINTAI_EXAMS,
  KANGYO_EXAMS,
} from "./exam-dates";

/**
 * 資格 → 試験日程。
 * exam-dates.ts は資格ごとに別々の const を export しているだけで
 * 資格 ID との対応表が無かったため、ここで一元化する。
 * 知財2級 (chizai2) は3級と同じ日程なので CHIZAI_EXAMS を共用する。
 * ビジ法2級 (bijihou2) も同様で、東商のIBT/CBTは2級・3級を同一ウィンドウで実施する。
 */
export const EXAM_SCHEDULES: Record<ExamSlug, UpcomingExam[]> = {
  kashikin: KASHIKIN_EXAMS,
  chizai: CHIZAI_EXAMS,
  chizai2: CHIZAI_EXAMS,
  fukushi2: FUKUSHI2_EXAMS,
  bijihou: BIJIHOU_EXAMS,
  bijimane: BIJIMANE_EXAMS,
  eco: ECO_EXAMS,
  bijihou2: BIJIHOU_EXAMS,
  // ITパスポートはCBTで通年実施のため、次回試験日という概念がない
  itpass: [],
  // 賃貸不動産経営管理士(年1回11月)・管理業務主任者(年1回12月)。2026-09-05 に令和8年度の
  // 日程を登録(exam-dates.ts)。どちらも WEB 申込締切が 9/30 で、締切10日前の 9/20 から
  // 答え合わせ直後CTAが講座広告優先に切り替わる。
  chintai: CHINTAI_EXAMS,
  kangyo: KANGYO_EXAMS,
  pii: PII_EXAMS,
  mynumber: MYNUMBER_EXAMS,
  jitsumu: JITSUMU_EXAMS,
};

/**
 * 「申込締切が迫っている」とみなす日数。
 * ExamCountdown.tsx の URGENT_DAYS と同じ値にしてあり、
 * 「カウントダウンが赤くなる時期 = アフィリを上に出す時期」で一致させる。
 */
export const APPLY_URGENT_DAYS = 10;

export type CtaPhase =
  /** 申込受付中で締切が迫っている (アフィリ優先) */
  | "apply_urgent"
  /** 申込受付中だが締切までまだ余裕がある */
  | "apply_open"
  /** 申込開始前 (まだ申し込めない) */
  | "pre_apply"
  /** 申込締切後〜試験日 (もう申し込めない) */
  | "post_apply"
  /** 日程データが無い / 予定が尽きた */
  | "unknown";

export type CtaPriority = {
  /** 上に出す CTA */
  primary: "apply" | "studio";
  phase: CtaPhase;
  /** apply_urgent のときの締切までの残り日数 (それ以外は null) */
  daysLeft: number | null;
};

/** "YYYY-MM-DD" を JST 0 時の epoch ms として解釈する。 */
function ymdMs(ymd: string): number {
  return Date.parse(`${ymd}T00:00:00+09:00`);
}

/** 基準時刻の JST 当日 0 時 (epoch ms)。 */
function todayStartMs(now: Date): number {
  const jst = now.toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
  return ymdMs(jst);
}

/**
 * 答え合わせ直後 CTA の優先順位を決める。
 *
 * @param exam 資格。未指定なら日程が引けないので studio 優先
 * @param now  基準時刻 (テスト・検証で固定するため注入可能)
 */
export function decideCtaPriority(
  exam: ExamSlug | null | undefined,
  now: Date = new Date()
): CtaPriority {
  const schedule = exam ? EXAM_SCHEDULES[exam] : undefined;
  if (!schedule || schedule.length === 0) {
    return { primary: "studio", phase: "unknown", daysLeft: null };
  }

  const today = todayStartMs(now);

  // 締切が今日以降の回のうち、締切が最も近いもの
  let nearest: UpcomingExam | null = null;
  for (const e of schedule) {
    if (!e.applyEnd) continue;
    if (ymdMs(e.applyEnd) < today) continue;
    if (!nearest || ymdMs(e.applyEnd) < ymdMs(nearest.applyEnd!)) nearest = e;
  }

  if (!nearest) {
    // 締切が全て過ぎている。試験日が残っていれば「締切後」、無ければ不明。
    const examLeft = schedule.some((e) => ymdMs(e.date) >= today);
    return {
      primary: "studio",
      phase: examLeft ? "post_apply" : "unknown",
      daysLeft: null,
    };
  }

  // 受付開始前は、まだ申し込めないので促さない
  if (nearest.applyStart && ymdMs(nearest.applyStart) > today) {
    return { primary: "studio", phase: "pre_apply", daysLeft: null };
  }

  const daysLeft = Math.max(
    0,
    Math.floor((ymdMs(nearest.applyEnd!) - today) / 86400000)
  );
  if (daysLeft <= APPLY_URGENT_DAYS) {
    return { primary: "apply", phase: "apply_urgent", daysLeft };
  }
  return { primary: "studio", phase: "apply_open", daysLeft: null };
}
