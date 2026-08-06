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

function ymdDate(ymd: string): Date {
  return new Date(`${ymd}T00:00:00+09:00`);
}

function todayStart(): number {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t.getTime();
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

/** "2026年11月15日（日）" 形式にフォーマット。 */
export function formatYmdJa(ymd: string): string {
  const d = ymdDate(ymd);
  const w = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${w}）`;
}
