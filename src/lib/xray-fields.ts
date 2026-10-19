/**
 * エックス線作業主任者免許試験の分野定義。唯一の出典。
 * had-fields.ts と同じ形で、資格トップ・分野ページ・問題ページの3か所が同じ配列を読む。
 * task は本試験の科目・課題との対応(表示用)。仕様の出典と確認日は docs/new-certs-2026-10-review.md を参照。
 */

export interface XrayField {
  /** URL に使う分野スラッグ。/xray/field/<slug>/ */
  slug: string;
  /** 問題 md の field と完全一致させる値 */
  name: string;
  /** 本試験の科目・課題(表示用) */
  task: string;
  desc: string;
}

export const XRAY_FIELDS: XrayField[] = [
  {
    slug: "kanri",
    name: "エックス線の管理",
    task: "科目「エックス線の管理に関する知識」（問1〜10・30点）",
    desc: "X線の発生と性質、X線装置の構造、減弱・半価層、遮へい計算、距離の逆二乗則、健康障害を防ぐ管理",
  },
  {
    slug: "hourei",
    name: "関係法令",
    task: "科目「関係法令」（問11〜20・20点）",
    desc: "電離則・安衛法令の管理区域、被ばく限度、線量の測定と記録、装置の措置、作業主任者の職務、健康診断と報告",
  },
  {
    slug: "sokutei",
    name: "エックス線の測定",
    task: "科目「エックス線の測定に関する知識」（問21〜30・25点）",
    desc: "線量の単位、電離箱・GM計数管・シンチレーション・半導体検出器、個人線量計、サーベイメータ、計数の統計、実効線量の算定",
  },
  {
    slug: "seitai",
    name: "生体に与える影響",
    task: "科目「エックス線の生体に与える影響に関する知識」（問31〜40・25点）",
    desc: "放射線の生物作用、確定的影響と確率的影響、組織・臓器の感受性、全身被ばくと造血器、LET・RBE・酸素効果、胎内被ばく",
  },
];

/** 分野名 → スラッグ。問題ページのパンくずで使う */
export const XRAY_FIELD_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(
  XRAY_FIELDS.map((f) => [f.name, f.slug])
);

export function xrayFieldBySlug(slug: string): XrayField | undefined {
  return XRAY_FIELDS.find((f) => f.slug === slug);
}
