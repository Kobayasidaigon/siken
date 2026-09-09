/**
 * 資格 → テーマ色と試験形式の対応表。2026-09-05 に共通化。
 *
 * 資格トップの theme-* クラスが供給する CSS 変数と同じ対応にしてある。
 * カウントダウン(accent/soft)と、東商IBT/CBT の期間制表示(period)を出し分けるのに使う。
 * 以前は column/[slug]/page.tsx の中に同じ表があったので、ここに寄せた。
 */
import type { ExamSlug } from "./study-progress";

export interface ExamTheme {
  /** 主色。例 "var(--c-kashikin)" */
  accent: string;
  /** 淡色。締切間近の強調背景に使う */
  soft: string;
  /** 東商IBT/CBTの期間制試験(「試験期間の開始まで」+日付に「〜」) */
  period: boolean;
}

export const EXAM_THEME: Record<ExamSlug, ExamTheme> = {
  kashikin: { accent: "var(--c-kashikin)", soft: "var(--c-kashikin-soft)", period: false },
  chintai: { accent: "var(--c-kashikin)", soft: "var(--c-kashikin-soft)", period: false },
  kangyo: { accent: "var(--c-kashikin)", soft: "var(--c-kashikin-soft)", period: false },
  bijihou: { accent: "var(--c-kashikin)", soft: "var(--c-kashikin-soft)", period: true },
  bijihou2: { accent: "var(--c-kashikin)", soft: "var(--c-kashikin-soft)", period: true },
  pii: { accent: "var(--c-pii)", soft: "var(--c-pii-soft)", period: false },
  mynumber: { accent: "var(--c-pii)", soft: "var(--c-pii-soft)", period: false },
  jitsumu: { accent: "var(--c-pii)", soft: "var(--c-pii-soft)", period: false },
  itpass: { accent: "var(--c-pii)", soft: "var(--c-pii-soft)", period: false },
  isec: { accent: "var(--c-pii)", soft: "var(--c-pii-soft)", period: false },
  chizai: { accent: "var(--c-chizai)", soft: "var(--c-chizai-soft)", period: false },
  chizai2: { accent: "var(--c-chizai)", soft: "var(--c-chizai-soft)", period: false },
  fukushi2: { accent: "var(--c-fukushi)", soft: "var(--c-fukushi-soft)", period: true },
  // 教員採用試験は自治体ごとに日程が違うため period の概念が無い(日程データも持たない)
  kyoin: { accent: "var(--c-fukushi)", soft: "var(--c-fukushi-soft)", period: false },
  bijimane: { accent: "var(--c-bijimane)", soft: "var(--c-bijimane-soft)", period: true },
  eco: { accent: "var(--c-eco)", soft: "var(--c-eco-soft)", period: true },
  // 社会福祉士は年1回2月の統一試験。日程データは未確認のため持たない(下の kyoin と同じ)
  shakai: { accent: "var(--c-eco)", soft: "var(--c-eco-soft)", period: false },
};
