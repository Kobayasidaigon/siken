/**
 * DXオフィサー認定試験の分野定義。唯一の出典。
 * had-fields.ts と同じ形で、資格トップ・分野ページ・問題ページの3か所が同じ配列を読む。
 *
 * task は本試験の出題範囲（課題・編）。2026-10-31 に協会の公式ページ(https://www.joho-gakushu.or.jp/dx/dxo/)で確認した出題内容に沿って、
 * 当サイトで8分野に分けた（1分野20問の予定）。
 */

export interface DxoField {
  /** URL に使う分野スラッグ。/dxo/field/<slug>/ */
  slug: string;
  /** 問題 md の field と完全一致させる値 */
  name: string;
  /** 本試験の出題範囲（表示用） */
  task: string;
  desc: string;
}

export const DXO_FIELDS: DxoField[] = [
  {
    slug: "souron",
    name: "DX総論",
    task: "第1課題",
    desc: "DXの定義と段階（デジタイゼーション・デジタライゼーション）、DXレポートと2025年の崖、デジタルガバナンス・コード、DX推進指標",
  },
  {
    slug: "gyoushu",
    name: "業種別DX・DX企業の現状",
    task: "第1課題",
    desc: "製造・小売・金融・物流・医療・行政のDX事例、DX銘柄とDX認定、プラットフォームビジネス、DXの成果と課題",
  },
  {
    slug: "ai",
    name: "AI",
    task: "第2課題",
    desc: "機械学習と深層学習、教師あり・なし・強化学習、生成AIと大規模言語モデル、AIの活用例とリスク、AI事業者ガイドライン",
  },
  {
    slug: "data",
    name: "ビッグデータ・IoT",
    task: "第2課題",
    desc: "ビッグデータの3V、データ分析とBI、データベース、IoTの構成要素とセンサー・通信、エッジコンピューティング、デジタルツイン",
  },
  {
    slug: "cloud",
    name: "クラウド・その他のIT技術",
    task: "第2課題",
    desc: "IaaS・PaaS・SaaS、パブリック・プライベートクラウド、5G、ブロックチェーン、RPA、ローコード、メタバース、API",
  },
  {
    slug: "marketing",
    name: "デジタルマーケティング",
    task: "第2課題",
    desc: "カスタマージャーニー、オムニチャネル、SEOとWeb広告、SNSマーケティング、CRMとMA、データドリブンマーケティング、KPI",
  },
  {
    slug: "security",
    name: "情報セキュリティ",
    task: "第2課題",
    desc: "情報セキュリティの3要素、マルウェアと標的型攻撃、ランサムウェア、ゼロトラスト、認証と暗号、サイバーセキュリティ経営ガイドライン",
  },
  {
    slug: "tenkai",
    name: "DX人材・方法論・制度",
    task: "第3課題",
    desc: "DX推進スキル標準とデジタルスキル標準、リスキリング、アジャイルとデザイン思考、PoC、DX投資促進税制、デジタル庁と関連政策",
  },
];

/** 分野名 → スラッグ。問題ページのパンくずで使う */
export const DXO_FIELD_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(
  DXO_FIELDS.map((f) => [f.name, f.slug])
);

export function dxoFieldBySlug(slug: string): DxoField | undefined {
  return DXO_FIELDS.find((f) => f.slug === slug);
}
