/**
 * ワークライフ・コーディネーター認定試験の分野定義。唯一の出典。
 * had-fields.ts と同じ形で、資格トップ・分野ページ・問題ページの3か所が同じ配列を読む。
 *
 * task は本試験の出題範囲（課題・編）。2026-10-31 に協会の公式ページ(https://www.joho-gakushu.or.jp/wlc/)で確認した出題内容に沿って、
 * 当サイトで8分野に分けた（1分野20問の予定）。
 */

export interface WlcField {
  /** URL に使う分野スラッグ。/wlc/field/<slug>/ */
  slug: string;
  /** 問題 md の field と完全一致させる値 */
  name: string;
  /** 本試験の出題範囲（表示用） */
  task: string;
  desc: string;
}

export const WLC_FIELDS: WlcField[] = [
  {
    slug: "kiso",
    name: "労働の基礎知識とワークライフバランス",
    task: "課題1",
    desc: "ワークライフバランスの定義と憲章、働き方改革の考え方、労働時間と生産性、ダイバーシティとインクルージョン、ウェルビーイング",
  },
  {
    slug: "theme1",
    name: "テーマ別コーディネート①（多様な働き方）",
    task: "課題2",
    desc: "テレワーク、副業・兼業、フレックスタイム、短時間正社員、ジョブ型雇用、キャリア自律とリスキリング",
  },
  {
    slug: "theme2",
    name: "テーマ別コーディネート②（健康とキャリア）",
    task: "課題2",
    desc: "メンタルヘルスとストレスチェック、長時間労働の防止、健康経営、女性活躍推進、高齢者のキャリア、ハラスメントのない職場",
  },
  {
    slug: "chiryo",
    name: "治療と仕事の両立・障害者就労",
    task: "課題3",
    desc: "事業場における治療と仕事の両立支援ガイドライン、両立支援プラン、障害者雇用促進法と合理的配慮、法定雇用率、就労支援機関",
  },
  {
    slug: "ikuji",
    name: "子育て・介護と仕事の両立",
    task: "課題3",
    desc: "育児休業・産後パパ育休、子の看護等休暇、所定外労働の制限、介護休業・介護休暇、仕事と介護の両立支援、次世代育成支援対策推進法",
  },
  {
    slug: "roudouhou",
    name: "働き方に関する労働法",
    task: "課題4",
    desc: "労働時間・休日・年次有給休暇、時間外労働の上限規制、同一労働同一賃金、無期転換、労働条件の明示",
  },
  {
    slug: "koyou",
    name: "雇用関係法",
    task: "課題5",
    desc: "労働契約法、男女雇用機会均等法、労働施策総合推進法、高年齢者雇用安定法、最低賃金法",
  },
  {
    slug: "shakaihosho",
    name: "社会保障と税",
    task: "課題5",
    desc: "健康保険・厚生年金と適用拡大、雇用保険の育児休業給付・介護休業給付、傷病手当金、年金の仕組み、所得税・住民税と各種控除",
  },
];

/** 分野名 → スラッグ。問題ページのパンくずで使う */
export const WLC_FIELD_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(
  WLC_FIELDS.map((f) => [f.name, f.slug])
);

export function wlcFieldBySlug(slug: string): WlcField | undefined {
  return WLC_FIELDS.find((f) => f.slug === slug);
}
