/**
 * 福祉住環境コーディネーター検定試験® 3級の分野定義。唯一の出典。
 * wlc-fields.ts と同じ形で、資格トップ・分野ページ・問題ページの3か所が同じ配列を読む。
 *
 * task は公式テキストの章。出題範囲は「3級公式テキスト（改訂7版）に該当する知識と、それを理解した上での応用力」で、
 * 章の見出しは 2026-11-12 に東京商工会議所の公式テキストのページ
 * (https://kentei.tokyo-cci.or.jp/fukushi/support/official-text.html)で確認した。
 * 第4章は範囲が広いので、当サイトで「基本技術」と「生活行為別」の2分野に分けた（全6分野・1分野20問）。
 */

interface Fukushi3Field {
  /** URL に使う分野スラッグ。/fukushi3/field/<slug>/ */
  slug: string;
  /** 問題 md の field と完全一致させる値 */
  name: string;
  /** 公式テキストの章（表示用） */
  task: string;
  desc: string;
}

export const FUKUSHI3_FIELDS: Fukushi3Field[] = [
  {
    slug: "kurashi",
    name: "暮らしやすい生活環境",
    task: "第1章",
    desc: "少子高齢社会と高齢者の暮らし、家庭内事故と日本の住まいの課題、福祉住環境コーディネーターの役割、介護保険制度と障害者福祉のあらまし",
  },
  {
    slug: "kenko",
    name: "健康と障害のとらえ方",
    task: "第2章",
    desc: "老化と高齢者の心身の特性、健康寿命と介護予防、廃用症候群、国際生活機能分類（ICF）、障害の種類と生活上の不自由",
  },
  {
    slug: "ud",
    name: "バリアフリーとユニバーサルデザイン",
    task: "第3章",
    desc: "バリアフリーとユニバーサルデザインの考え方、4つのバリア、共用品、つえ・車椅子・特殊寝台・入浴や排泄の用具などの福祉用具",
  },
  {
    slug: "kihon",
    name: "住まいの整備の基本技術",
    task: "第4章",
    desc: "段差の解消、床材、手すり、建具、通路や出入口の幅、家具と収納、色彩と照明、冷暖房、非常時の備え",
  },
  {
    slug: "basho",
    name: "生活行為別の住まいの整備",
    task: "第4章",
    desc: "外出（アプローチ・玄関）、屋内移動（廊下・階段）、排泄（トイレ）、入浴（浴室）、調理と洗濯、就寝（寝室）の場面ごとの整備",
  },
  {
    slug: "machi",
    name: "安心できる住生活とまちづくり",
    task: "第5章",
    desc: "高齢期の住まい方、住宅施策（住生活基本法・高齢者住まい法・サービス付き高齢者向け住宅）、高齢者向けの住まいと施設、バリアフリー法とまちづくり",
  },
];

/** 分野名 → スラッグ。問題ページのパンくずで使う */
export const FUKUSHI3_FIELD_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(
  FUKUSHI3_FIELDS.map((f) => [f.name, f.slug])
);

export function fukushi3FieldBySlug(slug: string): Fukushi3Field | undefined {
  return FUKUSHI3_FIELDS.find((f) => f.slug === slug);
}
