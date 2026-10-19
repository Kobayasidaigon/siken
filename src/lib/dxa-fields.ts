/**
 * DX推進アドバイザー認定試験の分野定義。唯一の出典。
 * had-fields.ts と同じ形で、資格トップ・分野ページ・問題ページの3か所が同じ配列を読む。
 * task は本試験の科目・課題との対応(表示用)。仕様の出典と確認日は docs/new-certs-2026-10-review.md を参照。
 */

export interface DxaField {
  /** URL に使う分野スラッグ。/dxa/field/<slug>/ */
  slug: string;
  /** 問題 md の field と完全一致させる値 */
  name: string;
  /** 本試験の科目・課題(表示用) */
  task: string;
  desc: string;
}

export const DXA_FIELDS: DxaField[] = [
  {
    slug: "genjo",
    name: "DXの現状",
    task: "第1課題",
    desc: "DXの定義と必要性、日本企業のDXの現状と課題、デジタルガバナンス・コード、DX認定制度、業種別のDX事例、DX白書などの調査",
  },
  {
    slug: "gijutsu",
    name: "DXの技術",
    task: "第2課題",
    desc: "AI・ビッグデータ・IoT・クラウド・5G・ブロックチェーン・RPAなどのデジタル技術、データ活用、情報セキュリティ、システム開発の考え方",
  },
  {
    slug: "tenkai",
    name: "DXの展開",
    task: "第3課題",
    desc: "DXを進める人材・組織、DXの推進体制、人材育成のスキル標準、国の政策・制度・ガイドライン",
  },
];

/** 分野名 → スラッグ。問題ページのパンくずで使う */
export const DXA_FIELD_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(
  DXA_FIELDS.map((f) => [f.name, f.slug])
);

export function dxaFieldBySlug(slug: string): DxaField | undefined {
  return DXA_FIELDS.find((f) => f.slug === slug);
}
