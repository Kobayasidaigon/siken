/**
 * マイナンバー実務検定1級の分野定義。唯一の出典。
 *
 * 協会の出題内容のページ(https://www.joho-gakushu.or.jp/nns/naiyou.php、2026-11-14 確認)では、
 * 1級は2級の出題項目に加えて「行政機関等編ガイドライン」と「金融業務ガイドライン」が範囲に入る。
 * 2級と同じ範囲の問題は /mynumber2/ にあるので、このページには1級だけの2分野を置き、
 * 2級の6分野へは案内する(同じ問題を2か所に置かない)。
 */

interface Mynumber1Field {
  /** URL に使う分野スラッグ。/mynumber1/field/<slug>/ */
  slug: string;
  /** 問題 md の field と完全一致させる値 */
  name: string;
  /** 協会の出題項目（表示用） */
  task: string;
  desc: string;
}

export const MYNUMBER1_FIELDS: Mynumber1Field[] = [
  {
    slug: "gyousei",
    name: "行政機関等編ガイドライン",
    task: "1級のみ",
    desc: "ガイドラインの位置付けと対象、番号法と条例、条例による独自利用と庁内連携、「利用」と「提供」の区別、第19条の提供事由、委託と再委託、情報提供ネットワークシステムの仕組み",
  },
  {
    slug: "kinyu",
    name: "金融業務ガイドライン",
    task: "1級のみ",
    desc: "金融機関の個人番号関係事務、顧客番号としての利用の禁止、激甚災害時の利用、保険代理店への委託、提供を求める時期、グループ会社との関係、収集・保管と廃棄、株式等振替制度",
  },
];

/** 分野名 → スラッグ。問題ページのパンくずで使う */
export const MYNUMBER1_FIELD_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(
  MYNUMBER1_FIELDS.map((f) => [f.name, f.slug])
);

export function mynumber1FieldBySlug(slug: string): Mynumber1Field | undefined {
  return MYNUMBER1_FIELDS.find((f) => f.slug === slug);
}
