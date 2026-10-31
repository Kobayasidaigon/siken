/**
 * インバウンド実務主任者認定試験の分野定義。唯一の出典。
 * had-fields.ts と同じ形で、資格トップ・分野ページ・問題ページの3か所が同じ配列を読む。
 *
 * task は本試験の出題範囲（課題・編）。2026-10-31 に協会の公式ページ(https://www.joho-gakushu.or.jp/ibd/)で確認した出題内容に沿って、
 * 当サイトで8分野に分けた（1分野20問の予定）。
 */

export interface IbdField {
  /** URL に使う分野スラッグ。/ibd/field/<slug>/ */
  slug: string;
  /** 問題 md の field と完全一致させる値 */
  name: string;
  /** 本試験の出題範囲（表示用） */
  task: string;
  desc: string;
}

export const IBD_FIELDS: IbdField[] = [
  {
    slug: "kankou",
    name: "観光総論・インバウンド総論",
    task: "課題1・2",
    desc: "観光の定義と観光立国推進基本法、観光立国推進基本計画、インバウンドとアウトバウンド、観光庁とJNTOの役割、旅行業法・旅館業法の基本",
  },
  {
    slug: "doukou",
    name: "インバウンドの現状と動向",
    task: "課題3",
    desc: "訪日外国人旅行者数と国・地域別の内訳、旅行消費額、地方への分散、受入環境の整備、ビザ緩和と航空路線",
  },
  {
    slug: "shouhi",
    name: "インバウンドと消費・ビジネス",
    task: "課題4・5",
    desc: "免税制度、キャッシュレス決済、買物・飲食・宿泊の消費動向、越境EC、MICE、インバウンド向けの商品・サービス開発",
  },
  {
    slug: "newtourism",
    name: "ニューツーリズムとまちづくり",
    task: "課題6・10",
    desc: "エコツーリズム・グリーンツーリズム、文化財・食・アドベンチャーツーリズム、DMO、テーマ別観光まちづくり、オーバーツーリズム対策",
  },
  {
    slug: "rikai",
    name: "訪日外国人の理解",
    task: "課題7",
    desc: "国・地域ごとの文化・宗教・食習慣、ハラール・ベジタリアン対応、旅行スタイルの違い、情報収集の手段",
  },
  {
    slug: "taiou",
    name: "訪日外国人への対応",
    task: "課題8",
    desc: "多言語対応とやさしい日本語、ピクトグラム、Wi-Fiと決済環境、災害・急病時の対応、ユニバーサルツーリズム、接客の基本",
  },
  {
    slug: "shukyaku",
    name: "インバウンドの集客",
    task: "課題9",
    desc: "デジタルマーケティングとSNS、口コミサイト、OTA、ターゲット市場の選び方、プロモーションとJNTOの事業",
  },
  {
    slug: "kokunai",
    name: "国内旅行・アフターコロナ",
    task: "課題11〜13",
    desc: "国内旅行の動向、旅行需要の回復と新しい旅行様式、ワーケーション、持続可能な観光（サステナブルツーリズム）",
  },
];

/** 分野名 → スラッグ。問題ページのパンくずで使う */
export const IBD_FIELD_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(
  IBD_FIELDS.map((f) => [f.name, f.slug])
);

export function ibdFieldBySlug(slug: string): IbdField | undefined {
  return IBD_FIELDS.find((f) => f.slug === slug);
}
