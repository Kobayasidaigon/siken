/**
 * DXパスポート試験の分野定義。唯一の出典。
 * isec-fields.ts と同じ形で、資格トップ・分野ページ・問題ページの3か所が同じ配列を読む。
 *
 * task は本試験の課題。本試験は第1課題「DXの現状」(3章)・第2課題「DXの技術」(5章)の構成
 * （協会の試験ページ。2026-10-06 に検索結果経由で確認、本文は未照合）で、当サイトは1章を1分野・20問で並べている。
 * 各分野の20問は、本試験の比率に合わせて2択10問・4択10問。
 */

export interface DxpField {
  /** URL に使う分野スラッグ。/dxp/field/<slug>/ */
  slug: string;
  /** 問題 md の field と完全一致させる値 */
  name: string;
  /** 本試験の課題（表示用） */
  task: string;
  desc: string;
}

export const DXP_FIELDS: DxpField[] = [
  {
    slug: "soron",
    name: "DX総論",
    task: "第1課題",
    desc: "DXの定義、デジタイゼーション・デジタライゼーションとの違い、DXレポートと「2025年の崖」、レガシーシステム、デジタルガバナンス・コード、DX推進指標、DX認定制度、Society 5.0",
  },
  {
    slug: "gyoshu",
    name: "業種別DXビジネスの現状",
    task: "第1課題",
    desc: "金融のフィンテックとキャッシュレス決済、小売のOMOとEC、製造のスマートファクトリー、物流・医療・農業・交通（MaaS）・建設のDX、行政のデジタル化、教育のGIGAスクール構想",
  },
  {
    slug: "kigyo",
    name: "DX企業とビジネスモデル",
    task: "第1課題",
    desc: "プラットフォームビジネスとネットワーク効果、エコシステム、サブスクリプション、フリーミアム、シェアリングエコノミー、ロングテール、デジタルディスラプション、代表的なデジタル企業の事業",
  },
  {
    slug: "ai",
    name: "AI",
    task: "第2課題",
    desc: "AIの定義と歴史、機械学習（教師あり・教師なし・強化学習）、ディープラーニング、画像認識と自然言語処理、生成AIと大規模言語モデル、ハルシネーション、AIの倫理と事業者ガイドライン",
  },
  {
    slug: "bigdata",
    name: "ビッグデータ",
    task: "第2課題",
    desc: "ビッグデータの特徴（3V・5V）、構造化・非構造化データ、データの収集と分析、データサイエンティスト、BI、データウェアハウスとデータレイク、オープンデータ、匿名加工情報",
  },
  {
    slug: "iot",
    name: "IoT",
    task: "第2課題",
    desc: "IoTの構成、センサーとアクチュエータ、エッジコンピューティング、5Gの特徴、LPWA、M2M、デジタルツイン、スマートホーム、産業IoT、IoT機器のセキュリティ",
  },
  {
    slug: "cloud",
    name: "クラウド",
    task: "第2課題",
    desc: "クラウドコンピューティングの定義と5つの特徴、SaaS・PaaS・IaaS、パブリック・プライベート・ハイブリッド、オンプレミスとの違い、仮想化とコンテナ、責任共有モデル、SLA、ISMAP",
  },
  {
    slug: "security",
    name: "情報セキュリティ",
    task: "第2課題",
    desc: "機密性・完全性・可用性、マルウェアとランサムウェア、標的型攻撃とフィッシング、多要素認証、暗号化、ゼロトラスト、サプライチェーン攻撃、インシデント対応、DXとセキュリティ投資",
  },
];

/** 分野名 → スラッグ。問題ページのパンくずで使う */
export const DXP_FIELD_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(
  DXP_FIELDS.map((f) => [f.name, f.slug])
);

export function dxpFieldBySlug(slug: string): DxpField | undefined {
  return DXP_FIELDS.find((f) => f.slug === slug);
}
