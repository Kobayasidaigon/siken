/**
 * 利用データ(みんなの正答率・間違えた人が多い問題)の表示条件。2026-09-13 追加。
 * 方針 §7: 統計は n>=30 まで表示しない。API の代理(/api/question-stats/)と
 * 表示部品(AccuracyBadge / HardQuestionsSection)の両方がこの値で落とす。
 */
export const MIN_SAMPLE = 30;
