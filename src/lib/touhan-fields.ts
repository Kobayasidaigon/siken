/**
 * 登録販売者試験の分野定義。唯一の出典。
 * had-fields.ts と同じ形で、資格トップ・分野ページ・問題ページの3か所が同じ配列を読む。
 * task は本試験の科目・課題との対応(表示用)。仕様の出典と確認日は docs/new-certs-2026-10-review.md を参照。
 */

export interface TouhanField {
  /** URL に使う分野スラッグ。/touhan/field/<slug>/ */
  slug: string;
  /** 問題 md の field と完全一致させる値 */
  name: string;
  /** 本試験の科目・課題(表示用) */
  task: string;
  desc: string;
}

export const TOUHAN_FIELDS: TouhanField[] = [
  {
    slug: "ch1",
    name: "医薬品に共通する特性と基本的な知識",
    task: "第1章「医薬品に共通する特性と基本的な知識」（20問）",
    desc: "医薬品の定義と販売規制、副作用・相互作用、小児・高齢者・妊婦への配慮、プラセボ効果、医薬品の適正使用、サリドマイド・スモンなど薬害の歴史",
  },
  {
    slug: "ch2",
    name: "人体の働きと医薬品",
    task: "第2章「人体の働きと医薬品」（20問）",
    desc: "消化器・呼吸器・循環器・泌尿器・目・鼻・耳・皮膚・骨と筋肉・脳と神経の働き、薬の吸収・代謝・排泄、主な副作用の症状",
  },
  {
    slug: "ch3",
    name: "主な医薬品とその作用",
    task: "第3章「主な医薬品とその作用」（40問）",
    desc: "かぜ薬・解熱鎮痛薬・胃腸薬・鎮咳去痰薬・漢方・外皮用薬など主な医薬品の成分・作用・禁忌・相互作用・副作用。出題数が最も多い章",
  },
  {
    slug: "ch4",
    name: "薬事に関する法規と制度",
    task: "第4章「薬事に関する法規と制度」（20問）",
    desc: "医薬品医療機器等法、医薬品の分類と販売ルール、登録販売者の役割、販売・広告の規制、薬局・店舗販売業の許可と管理",
  },
  {
    slug: "ch5",
    name: "医薬品の適正使用と安全対策",
    task: "第5章「医薬品の適正使用と安全対策」（20問）",
    desc: "添付文書・製品表示の読み方、副作用情報の収集と報告、医薬品副作用被害救済制度、薬物乱用・依存、セルフメディケーション",
  },
];

/** 分野名 → スラッグ。問題ページのパンくずで使う */
export const TOUHAN_FIELD_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(
  TOUHAN_FIELDS.map((f) => [f.name, f.slug])
);

export function touhanFieldBySlug(slug: string): TouhanField | undefined {
  return TOUHAN_FIELDS.find((f) => f.slug === slug);
}
