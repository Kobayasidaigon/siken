/**
 * マイナンバー実務検定2級の分野定義。唯一の出典。
 * wlc-fields.ts と同じ形で、資格トップ・分野ページ・問題ページの3か所が同じ配列を読む。
 *
 * task は協会の出題内容のページ(https://www.joho-gakushu.or.jp/nns/naiyou.php、2026-11-14 確認)の出題項目。
 * 2級の出題項目は番号法の背景・概要、第1章〜第9章、附則、事業者編ガイドライン、関連法令等で、
 * 当サイトではこれを6分野にまとめた(分野の分け方は当サイト独自。協会は分野ごとの問題数を公表していない)。
 */

interface Mynumber2Field {
  /** URL に使う分野スラッグ。/mynumber2/field/<slug>/ */
  slug: string;
  /** 問題 md の field と完全一致させる値 */
  name: string;
  /** 協会の出題項目（表示用） */
  task: string;
  desc: string;
}

export const MYNUMBER2_FIELDS: Mynumber2Field[] = [
  {
    slug: "sousoku",
    name: "番号法の総則と個人番号",
    task: "番号法の背景・概要、第1章、第2章",
    desc: "番号法の目的と基本理念、用語の定義、個人番号の指定・変更・生成、利用範囲（第9条）、委託と再委託、提供の要求と求めの制限、本人確認の措置",
  },
  {
    slug: "card",
    name: "個人番号カードと本人確認",
    task: "第3章、事業者編ガイドライン（本人確認）",
    desc: "個人番号カードの記載事項と交付、届出と返納、カードの利用、カード代替電磁的記録、番号確認と身元確認、代理人からの提供、通知カードの経過措置",
  },
  {
    slug: "teikyo",
    name: "特定個人情報の提供と収集・保管",
    task: "第4章、事業者編ガイドライン（提供・収集・保管）",
    desc: "提供の制限（第19条の各号）、情報提供ネットワークシステム、収集・保管の制限、特定個人情報ファイルの作成の制限、提供を求める時期、保管と廃棄",
  },
  {
    slug: "hogo",
    name: "保護評価・個人情報保護法の特例・監督",
    task: "第5章、第6章、関連法令",
    desc: "特定個人情報保護評価、個人情報保護法の特例、漏えい等の報告、個人情報保護委員会の組織、勧告・命令、報告と立入検査",
  },
  {
    slug: "houjin",
    name: "法人番号と罰則",
    task: "第7章、第9章",
    desc: "法人番号の指定・通知・公表、特定法人情報、番号法の罰則（法定刑・国外犯・両罰規定）",
  },
  {
    slug: "guideline",
    name: "事業者編ガイドライン",
    task: "事業者編ガイドライン",
    desc: "利用目的の特定と変更、委託先の監督、安全管理措置、中小規模事業者、廃棄・削除、Q&Aの考え方",
  },
];

/** 分野名 → スラッグ。問題ページのパンくずで使う */
export const MYNUMBER2_FIELD_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(
  MYNUMBER2_FIELDS.map((f) => [f.name, f.slug])
);

export function mynumber2FieldBySlug(slug: string): Mynumber2Field | undefined {
  return MYNUMBER2_FIELDS.find((f) => f.slug === slug);
}
