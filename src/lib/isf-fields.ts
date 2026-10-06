/**
 * 情報・サイバーセキュリティ初級認定試験の分野定義。唯一の出典。
 * isec-fields.ts と同じ形で、資格トップ・分野ページ・問題ページの3か所が同じ配列を読む。
 *
 * task は本試験の課題番号。本試験は4課題構成（協会の試験内容ページ。2026-10-06 に検索結果経由で確認、本文は未照合）で、
 * 当サイトは1課題を2分野に割って、1分野あたり20問で並べている。
 */

export interface IsfField {
  /** URL に使う分野スラッグ。/isf/field/<slug>/ */
  slug: string;
  /** 問題 md の field と完全一致させる値 */
  name: string;
  /** 本試験の課題（表示用） */
  task: string;
  desc: string;
}

export const ISF_FIELDS: IsfField[] = [
  {
    slug: "soron",
    name: "情報セキュリティの基礎とリスク管理",
    task: "課題Ⅰ",
    desc: "情報資産、機密性・完全性・可用性と7要素、脅威・脆弱性・リスクの関係、リスクアセスメントとリスク対応、ISMSとPDCA、情報セキュリティポリシー、プライバシーマーク",
  },
  {
    slug: "hoki",
    name: "情報セキュリティ関連法規",
    task: "課題Ⅰ",
    desc: "不正アクセス禁止法、個人情報保護法、マイナンバー法、著作権法、不正競争防止法の営業秘密、刑法の不正指令電磁的記録に関する罪、電子署名法、サイバーセキュリティ基本法",
  },
  {
    slug: "jinteki",
    name: "紙媒体と社員による脅威",
    task: "課題Ⅱ",
    desc: "書類の保管・持ち出し・廃棄、FAXや郵送の誤送付、クリアデスク、内部不正と不正のトライアングル、ソーシャルエンジニアリング、退職者の権限管理、委託先の管理",
  },
  {
    slug: "setsubi",
    name: "設備・機器とモバイルの管理",
    task: "課題Ⅱ",
    desc: "入退室管理と共連れ、ゾーニング、来訪者の管理、施錠とワイヤーロック、電源と災害対策、機器の廃棄、ノートPC・スマートフォンの紛失盗難、MDM、BYOD、公衆無線LAN、テレワーク",
  },
  {
    slug: "riyou",
    name: "コンピュータ・インターネット・電子媒体の利用",
    task: "課題Ⅲ",
    desc: "パスワードと多要素認証、OS・ソフトウェアの更新、電子メールの誤送信と添付ファイル、偽サイト、SNSの利用、USBメモリなど電子媒体の管理、バックアップ、クラウドの共有設定",
  },
  {
    slug: "kogeki",
    name: "外部からの攻撃と不正プログラム",
    task: "課題Ⅲ",
    desc: "ウイルス・ワーム・トロイの木馬・ランサムウェアなどのマルウェア、フィッシング、標的型攻撃メール、ビジネスメール詐欺、DoS攻撃、パスワード攻撃、SQLインジェクション、ファイアウォールとIDS・IPS",
  },
  {
    slug: "computer",
    name: "コンピュータの基礎",
    task: "課題Ⅳ",
    desc: "CPU・メモリ・記憶装置、入出力装置、OSとアプリケーション、ファイルと拡張子、2進数と情報量の単位、文字コード、バックアップの方式、RAID、仮想化",
  },
  {
    slug: "network",
    name: "ネットワークと暗号の基礎",
    task: "課題Ⅳ",
    desc: "LANとWAN、IPアドレス、DNSとDHCP、ルータ、HTTP・HTTPS・メールのプロトコル、無線LANの暗号化、VPN、共通鍵暗号と公開鍵暗号、ハッシュ関数、デジタル署名と電子証明書",
  },
];

/** 分野名 → スラッグ。問題ページのパンくずで使う */
export const ISF_FIELD_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(
  ISF_FIELDS.map((f) => [f.name, f.slug])
);

export function isfFieldBySlug(slug: string): IsfField | undefined {
  return ISF_FIELDS.find((f) => f.slug === slug);
}
