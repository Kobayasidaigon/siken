// 各資格の「今後の試験日・申込期間」リスト。公式発表済みの日付だけを入れる。
// nextExam() / nextApplyDeadline() が「今日以降で最も近い回」を自動選択するため、
// 試験が終わっても表示が腐らない (リストが尽きたら非表示になる)。
// 公式発表に合わせて日付を追加するだけでよい。
//
// A8実測(2026-08-06)で、成果発生は試験日でなく「申込締切の直前」に集中すると
// 判明したため applyStart/applyEnd を追加。申込期間中は資格トップの
// カウントダウンが「申込締切まであとN日」に切り替わる (ExamCountdown.tsx)。
//
// ※ static export のため new Date() はビルド時に評価される。
//   デプロイ頻度が下がると誤差が出るが、日単位の表示なので実用上問題ない。

export interface UpcomingExam {
  date: string; // "2026-11-15" (JSTでの試験日。東商IBT/CBTは試験期間の初日)
  label: string; // "第55回" など表示用
  applyStart?: string; // 申込受付の開始日。省略時は「既に受付中」として扱う
  applyEnd?: string; // 申込締切日。公式未発表の回は省略 (締切カウントダウン非表示)
}

// 出典: 日本貸金業協会 j-fsa.or.jp/chief/qualifying_exam/ (2026-08-06確認)
export const KASHIKIN_EXAMS: UpcomingExam[] = [
  { date: "2026-11-15", label: "2026年度(第21回)", applyStart: "2026-07-01", applyEnd: "2026-09-10" },
];

// 出典: 知的財産教育協会 kentei-info-ip-edu.org/exam/schedule/ (2026-08-06確認)
// 申込締切は紙/CBT共通。applyStartは早い方=紙方式(CBTのみの申込開始は第55回8/1・第56回12/1)
export const CHIZAI_EXAMS: UpcomingExam[] = [
  { date: "2026-11-15", label: "第55回", applyStart: "2026-06-19", applyEnd: "2026-10-06" },
  { date: "2027-03-07", label: "第56回", applyStart: "2026-10-21", applyEnd: "2027-01-25" },
];

// 出典: 東京商工会議所検定サイト kentei.tokyo-cci.or.jp/fukushi/ (2026-08-06確認)
// 第57回2・3級はIBT/CBT期間制(11/12〜12/3)のため試験期間初日を採用。
// ※旧データ「2026-10-22開始」はビジ法の試験期間との取り違えで誤りだったため修正済み。
export const FUKUSHI2_EXAMS: UpcomingExam[] = [
  { date: "2026-11-12", label: "第57回(2・3級)", applyStart: "2026-10-09", applyEnd: "2026-10-20" },
];

// 出典: 東京商工会議所検定サイト kentei.tokyo-cci.or.jp/houmu/ (2026-08-06確認)
// 第60回2・3級はIBT/CBT期間制(10/22〜11/9)のため試験期間初日を採用。
// 1級(12/6統一試験)は本サイトの対象外(3級ドリル)のため非掲載。
export const BIJIHOU_EXAMS: UpcomingExam[] = [
  { date: "2026-10-22", label: "第60回(2・3級)", applyStart: "2026-09-16", applyEnd: "2026-09-29" },
];

// 出典: 東京商工会議所検定サイト kentei.tokyo-cci.or.jp/bijimane/ および
// 同 exam-info/entry.html (2026-08-06確認・2ページで一致)。
// 第24回(2026年度 第2シーズン)はIBT/CBT期間制(10/22〜11/9)のため試験期間初日を採用。
// ※ビジ法第60回と全く同じ期間だが取り違えではない(東商のIBT/CBT検定は同一ウィンドウで実施)。
export const BIJIMANE_EXAMS: UpcomingExam[] = [
  { date: "2026-10-22", label: "第24回", applyStart: "2026-09-16", applyEnd: "2026-09-29" },
];

// 出典: 東京商工会議所検定サイト kentei.tokyo-cci.or.jp/eco/ (2026-08-06確認)
// 第41回(2026年度 第2シーズン)はIBT/CBT期間制(11/12〜12/3)のため試験期間初日を採用。
// ※eco検定は福祉住環境コーディネーター第57回と同じ第2ウィンドウ。
//   ビジ法・ビジマネの第1ウィンドウ(10/22〜11/9)とは別なので取り違えないこと。
export const ECO_EXAMS: UpcomingExam[] = [
  { date: "2026-11-12", label: "第41回", applyStart: "2026-10-09", applyEnd: "2026-10-20" },
];

// 出典: 全日本情報学習振興協会 令和8年度試験日程 joho-gakushu.or.jp/schedule/2026.php
// (2026-08-06確認)。申込開始日は協会が公表していないため省略(=受付中として扱う)。
export const PII_EXAMS: UpcomingExam[] = [
  { date: "2026-09-27", label: "第84回", applyEnd: "2026-08-06" },
  { date: "2026-12-13", label: "第85回", applyEnd: "2026-10-29" },
  { date: "2027-03-14", label: "第86回", applyEnd: "2027-01-28" },
];

// 出典: 同上 (2026-08-06確認)
export const MYNUMBER_EXAMS: UpcomingExam[] = [
  { date: "2026-09-27", label: "第47回", applyEnd: "2026-08-06" },
  { date: "2026-12-13", label: "第48回", applyEnd: "2026-10-29" },
  { date: "2027-03-14", label: "第49回", applyEnd: "2027-01-28" },
];

// 出典: 同上 (2026-08-06確認)
export const JITSUMU_EXAMS: UpcomingExam[] = [
  { date: "2026-11-29", label: "第71回", applyEnd: "2026-10-22" },
  { date: "2027-02-21", label: "第72回", applyEnd: "2027-01-14" },
];

// 出典: 賃貸不動産経営管理士協議会 chintaikanrishi.jp/exam/summary (令和8年度 試験実施要領)。
// 2026-09-05 に協議会の要領を引用する予備校3社(スタディング・アガルート・伊藤塾)の一致で確認。
// 申込は WEB 8/3 12:00〜9/30 23:59、郵送 8/3〜9/24 消印有効。applyEnd は WEB の締切を採用
// (郵送派は締切が6日早い点をカウントダウン文言では扱わない)。試験は年1回・13:00〜15:00。
export const CHINTAI_EXAMS: UpcomingExam[] = [
  { date: "2026-11-15", label: "令和8年度", applyStart: "2026-08-03", applyEnd: "2026-09-30" },
];

// 出典: マンション管理業協会 kanrikyo.or.jp/kanri/siken.html (令和8年度 試験案内)。
// 2026-09-05 に協会の案内を引用する予備校3社(スタディング・アガルート・TAC)の一致で確認。
// 申込は Web 8/3 10:00頃〜9/30 16:59、郵送 8/3〜8/24 消印有効。applyEnd は Web の締切を採用。
// 試験は年1回・12月第1日曜。
export const KANGYO_EXAMS: UpcomingExam[] = [
  { date: "2026-12-06", label: "令和8年度", applyStart: "2026-08-03", applyEnd: "2026-09-30" },
];

function ymdDate(ymd: string): Date {
  return new Date(`${ymd}T00:00:00+09:00`);
}

/**
 * JSTでの「今日0時」のepoch。ローカルTZの setHours(0,0,0,0) だと、UTC等の
 * ビルド環境で日付境界がJSTと最大9時間ずれ、残り日数が1日少なく表示される
 * (formatYmdJaの-1日バグと同族)。UTC+9へ平行移動してから日付を切り出す。
 */
function todayStart(): number {
  const shifted = new Date(Date.now() + 9 * 3600_000);
  return (
    Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) -
    9 * 3600_000
  );
}

/** 今日以降で最も近い試験を返す。なければ null (カウントダウン非表示)。 */
export function nextExam(exams: UpcomingExam[]): UpcomingExam | null {
  const today = todayStart();
  for (const e of exams) {
    if (ymdDate(e.date).getTime() >= today) return e;
  }
  return null;
}

/**
 * 申込受付中(applyStart〜applyEnd)の回のうち、締切が最も近いものを返す。
 * 締切未発表(applyEnd なし)の回・受付開始前の回は対象外。なければ null。
 */
export function nextApplyDeadline(exams: UpcomingExam[]): UpcomingExam | null {
  const today = todayStart();
  let best: UpcomingExam | null = null;
  for (const e of exams) {
    if (!e.applyEnd || ymdDate(e.applyEnd).getTime() < today) continue;
    if (e.applyStart && ymdDate(e.applyStart).getTime() > today) continue;
    if (!best || ymdDate(e.applyEnd).getTime() < ymdDate(best.applyEnd!).getTime()) best = e;
  }
  return best;
}

/** 指定日までの残り日数 (当日=0)。 */
export function daysUntilYmd(ymd: string): number {
  return Math.max(0, Math.floor((ymdDate(ymd).getTime() - todayStart()) / 86400000));
}

/**
 * "2026年11月15日（日）" 形式にフォーマット。
 * ローカルタイムゾーンのgetterを使うと、UTC等JST以外のビルド環境で静的生成した
 * ときに1日前の日付になる(実際に本番で試験日・締切が全て-1日表示になった)ため、
 * 文字列を直接分解しUTC固定で曜日を求める。
 */
export function formatYmdJa(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const w = ["日", "月", "火", "水", "木", "金", "土"][new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${y}年${m}月${d}日（${w}）`;
}

/**
 * トップページの資格カード用「次回試験」表示。今日以降で最も近い回を自動選択して
 * "2026年11月15日（日）" を返す(period=trueの期間制IBT/CBTは末尾に〜を付ける)。
 * リストが尽きたら fallback(開催サイクルの説明文)に落ち、手書き日付のように
 * 期限切れ表示のまま腐ることがない。
 */
export function nextExamDateLabel(
  exams: UpcomingExam[],
  opts?: { period?: boolean; suffix?: string; fallback?: string }
): string {
  const e = nextExam(exams);
  if (!e) return opts?.fallback ?? "公式サイトで最新日程を確認";
  return `${formatYmdJa(e.date)}${opts?.period ? "〜" : ""}${opts?.suffix ?? ""}`;
}
