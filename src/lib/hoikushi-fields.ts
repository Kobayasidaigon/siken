/**
 * 保育士試験（筆記）の分野定義。唯一の出典。
 * had-fields.ts と同じ形で、資格トップ・分野ページ・問題ページの3か所が同じ配列を読む。
 * task は本試験の科目・課題との対応(表示用)。仕様の出典と確認日は docs/new-certs-2026-10-review.md を参照。
 */

export interface HoikushiField {
  /** URL に使う分野スラッグ。/hoikushi/field/<slug>/ */
  slug: string;
  /** 問題 md の field と完全一致させる値 */
  name: string;
  /** 本試験の科目・課題(表示用) */
  task: string;
  desc: string;
}

export const HOIKUSHI_FIELDS: HoikushiField[] = [
  {
    slug: "shinri",
    name: "保育の心理学",
    task: "科目「保育の心理学」（20問・100点・60分）",
    desc: "発達の理論と段階、愛着、認知・言語・社会性の発達、学習理論、発達の評価、子どもの生活と発達の課題、保護者・家族への理解",
  },
  {
    slug: "genri",
    name: "保育原理",
    task: "科目「保育原理」（20問・100点・60分）",
    desc: "保育所保育指針の総則と目標、養護と教育の一体性、保育の内容と計画・評価、保育の歴史と思想、保育士の専門性と倫理",
  },
  {
    slug: "kateifukushi",
    name: "子ども家庭福祉",
    task: "科目「子ども家庭福祉」（20問・100点・60分）",
    desc: "児童福祉法・児童の権利、子ども家庭福祉の歴史と制度、子ども・子育て支援、母子保健、児童虐待防止、ひとり親・障害児の支援",
  },
  {
    slug: "shakaifukushi",
    name: "社会福祉",
    task: "科目「社会福祉」（20問・100点・60分）",
    desc: "社会福祉の理念と歴史、社会保障制度、福祉の法律と実施体制、相談援助の原則と技術、利用者の保護、地域福祉",
  },
  {
    slug: "kyoiku",
    name: "教育原理",
    task: "科目「教育原理」（10問・50点・30分）",
    desc: "教育の理念と歴史、教育制度と法規、教育課程と幼児教育の要領・要録、教育方法と評価、教育思想家",
  },
  {
    slug: "yogo",
    name: "社会的養護",
    task: "科目「社会的養護」（10問・50点・30分）",
    desc: "社会的養護の理念と歴史、施設養護と家庭養護の体系、児童養護施設などの運営と援助、里親・ファミリーホーム、被措置児童の権利擁護",
  },
  {
    slug: "hoken",
    name: "子どもの保健",
    task: "科目「子どもの保健」（20問・100点・60分）",
    desc: "子どもの発育・発達と評価、感染症と予防接種、事故防止と安全管理、病気の症状と対応、保健計画と健康観察、アレルギー、母子保健",
  },
  {
    slug: "shokuiku",
    name: "子どもの食と栄養",
    task: "科目「子どもの食と栄養」（20問・100点・60分）",
    desc: "栄養素の機能と食事摂取基準、乳幼児期の栄養と離乳食、食育の推進、食物アレルギーへの対応、調理と衛生、特別な配慮を要する子どもの食",
  },
  {
    slug: "jissyu",
    name: "保育実習理論",
    task: "科目「保育実習理論」（20問・100点・60分）",
    desc: "保育の表現技術に関する基礎知識（音楽・造形・言語）。文字で出題できる範囲に限り、楽典・造形材料・児童文化財などの理論を扱う",
  },
];

/** 分野名 → スラッグ。問題ページのパンくずで使う */
export const HOIKUSHI_FIELD_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(
  HOIKUSHI_FIELDS.map((f) => [f.name, f.slug])
);

export function hoikushiFieldBySlug(slug: string): HoikushiField | undefined {
  return HOIKUSHI_FIELDS.find((f) => f.slug === slug);
}
