/**
 * 情報・サイバーセキュリティ管理士認定試験の分野定義。唯一の出典。
 *
 * 他の資格（itpass など）は資格トップ・分野ページ・問題ページの3か所に
 * 同じ分野表を手書きで複製しており、片方だけ直すと分野名がずれる形になっている。
 * この資格では最初から1か所にまとめ、3ページとも同じ配列を読む。
 *
 * task は本試験の課題番号。本試験は4課題構成（協会の試験内容ページ）で、
 * 当サイトは1課題を2分野に割って、1分野あたり25問で並べている。
 */

export interface IsecField {
  /** URL に使う分野スラッグ。/isec/field/<slug>/ */
  slug: string;
  /** 問題 md の field と完全一致させる値 */
  name: string;
  /** 本試験の課題（表示用） */
  task: string;
  desc: string;
}

export const ISEC_FIELDS: IsecField[] = [
  {
    slug: "soron",
    name: "情報セキュリティの基礎と管理",
    task: "課題Ⅰ",
    desc: "機密性・完全性・可用性の3要素、情報資産の分類、リスクアセスメントとリスク対応の4分類、ISMS（JIS Q 27001）、情報セキュリティポリシーの3階層、プライバシーマーク、監査と教育、BCP",
  },
  {
    slug: "hoki",
    name: "情報セキュリティ関連法規",
    task: "課題Ⅰ",
    desc: "不正アクセス禁止法、サイバーセキュリティ基本法、個人情報保護法とマイナンバー法、著作権法、不正競争防止法の営業秘密、刑法のウイルス作成罪、電子署名法、プロバイダ責任制限法",
  },
  {
    slug: "kyoui",
    name: "脅威と脆弱性",
    task: "課題Ⅱ",
    desc: "人的・物理的・技術的脅威の分類、ソーシャルエンジニアリング、内部不正と不正のトライアングル、マルウェアの種類とランサムウェア、パスワードクラック、CVE・CVSSと脆弱性管理、ゼロデイ攻撃",
  },
  {
    slug: "taisaku",
    name: "情報セキュリティ対策",
    task: "課題Ⅱ",
    desc: "入退室管理とゾーニング、職務分掌と最小権限、認証の3要素と多要素認証、共通鍵暗号と公開鍵暗号、デジタル署名とPKI、SSL/TLS、バックアップの3-2-1ルール、ログ管理とデータの廃棄",
  },
  {
    slug: "cyber",
    name: "サイバー攻撃と防御",
    task: "課題Ⅲ",
    desc: "標的型攻撃と水飲み場型攻撃、ビジネスメール詐欺、DDoS、SQLインジェクション、XSS・CSRF、中間者攻撃、DNSキャッシュポイズニング、ファイアウォールとIDS・IPS・WAF、ゼロトラスト",
  },
  {
    slug: "incident",
    name: "インシデント対応とクラウド・IoT",
    task: "課題Ⅲ",
    desc: "インシデント対応の手順とCSIRT、証拠保全とフォレンジック、個人情報保護委員会への報告、クラウドの責任共有モデル、テレワークとBYOD、MDM、IoT機器のリスク、生成AIの業務利用",
  },
  {
    slug: "network",
    name: "ネットワークの基礎",
    task: "課題Ⅳ",
    desc: "OSI基本参照モデルとTCP/IP、IPアドレスとサブネット、NAT、DNS、ポート番号、TCPとUDP、メールのプロトコルとSPF・DKIM・DMARC、無線LANの暗号化（WPA3）、VPNとプロキシ",
  },
  {
    slug: "computer",
    name: "コンピュータの基礎",
    task: "課題Ⅳ",
    desc: "5大装置とCPU、記憶階層とキャッシュ、記憶容量の単位、2進数・16進数、文字コード、OSとファイル管理、データベースとトランザクション、RAID、MTBF・MTTRと稼働率の計算、仮想化",
  },
];

/** 分野名 → スラッグ。問題ページのパンくずで使う */
export const ISEC_FIELD_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(
  ISEC_FIELDS.map((f) => [f.name, f.slug])
);

export function isecFieldBySlug(slug: string): IsecField | undefined {
  return ISEC_FIELDS.find((f) => f.slug === slug);
}
