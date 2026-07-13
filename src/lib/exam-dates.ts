// 各資格の「今後の試験日」リスト。公式発表済みの日付だけを入れる。
// カウントダウンは nextExamDate() が「今日以降で最も近い日付」を自動選択するため、
// 試験が終わっても表示が腐らない (リストが尽きたら非表示になる)。
// 年に1回、公式発表に合わせて日付を追加するだけでよい。
//
// ※ static export のため new Date() はビルド時に評価される。
//   デプロイ頻度が下がると誤差が出るが、日単位の表示なので実用上問題ない。

export interface UpcomingExam {
  date: string; // "2026-11-15" (JST での試験日)
  label: string; // "第55回" など表示用
}

// 出典: 日本貸金業協会 (2026-07-07確認、令和8年度=第21回は公式発表済)
export const KASHIKIN_EXAMS: UpcomingExam[] = [
  { date: "2026-11-15", label: "2026年度(第21回)" },
];

// 出典: 知的財産教育協会 (第55回は日程・申込期間とも公式発表済。第56回は試験日のみ発表)
export const CHIZAI_EXAMS: UpcomingExam[] = [
  { date: "2026-07-12", label: "第54回" },
  { date: "2026-11-15", label: "第55回" },
  { date: "2027-03-07", label: "第56回" },
];

// 出典: 東京商工会議所検定サイト (2026年度スケジュール公表済。IBT/CBTの期間制のため試験期間初日を採用)
export const FUKUSHI2_EXAMS: UpcomingExam[] = [
  { date: "2026-10-22", label: "第57回(第2シーズン)" },
];

// 出典: 全日本情報学習振興協会 (第84〜86回は公式発表済)
export const PII_EXAMS: UpcomingExam[] = [
  { date: "2026-09-27", label: "第84回" },
  { date: "2026-12-13", label: "第85回" },
  { date: "2027-03-14", label: "第86回" },
];

/** 今日以降で最も近い試験を返す。なければ null (カウントダウン非表示)。 */
export function nextExam(exams: UpcomingExam[]): UpcomingExam | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (const e of exams) {
    if (new Date(`${e.date}T00:00:00+09:00`).getTime() >= today.getTime()) {
      return e;
    }
  }
  return null;
}

/** 試験日までの残り日数 (当日=0)。 */
export function daysUntil(exam: UpcomingExam): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(`${exam.date}T00:00:00+09:00`);
  return Math.max(0, Math.floor((d.getTime() - today.getTime()) / 86400000));
}

/** "2026年11月15日（日）" 形式にフォーマット。 */
export function formatExamDateJa(exam: UpcomingExam): string {
  const d = new Date(`${exam.date}T00:00:00+09:00`);
  const w = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${w}）`;
}
