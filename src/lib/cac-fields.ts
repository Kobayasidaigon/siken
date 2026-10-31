/**
 * 会社法法務士認定試験の分野定義。唯一の出典。
 * had-fields.ts と同じ形で、資格トップ・分野ページ・問題ページの3か所が同じ配列を読む。
 *
 * task は本試験の出題範囲（課題・編）。2026-10-31 に協会の公式ページ(https://www.joho-gakushu.or.jp/cac/)で確認した出題内容に沿って、
 * 当サイトで8分野に分けた（1分野20問の予定）。
 */

export interface CacField {
  /** URL に使う分野スラッグ。/cac/field/<slug>/ */
  slug: string;
  /** 問題 md の field と完全一致させる値 */
  name: string;
  /** 本試験の出題範囲（表示用） */
  task: string;
  desc: string;
}

export const CAC_FIELDS: CacField[] = [
  {
    slug: "setsuritsu",
    name: "総則・設立",
    task: "第1編・第2編第1章",
    desc: "会社の種類と商号、発起設立と募集設立、定款の記載事項、変態設立事項、設立時役員、払込みと設立の登記、発起人の責任",
  },
  {
    slug: "kabushiki",
    name: "株式・新株予約権",
    task: "第2編第2章・第3章",
    desc: "株主平等の原則、種類株式、株式の譲渡と譲渡制限、自己株式、株式の併合・分割、単元株、募集株式の発行、新株予約権",
  },
  {
    slug: "soukai",
    name: "機関①（株主総会）",
    task: "第2編第4章",
    desc: "機関設計のルール、株主総会の権限と招集、株主提案権、議決権の行使、決議の種類と要件、決議の取消し・無効・不存在",
  },
  {
    slug: "yakuin",
    name: "機関②（取締役・監査役・委員会）",
    task: "第2編第4章",
    desc: "取締役と取締役会、代表取締役、競業・利益相反取引、役員の責任と株主代表訴訟、監査役・会計参与・会計監査人、監査等委員会・指名委員会等",
  },
  {
    slug: "keisan",
    name: "計算・定款変更・事業譲渡",
    task: "第2編第5章〜第7章",
    desc: "計算書類と承認、資本金と準備金、剰余金の配当と分配可能額、定款の変更、事業譲渡、株主の権利と少数株主権",
  },
  {
    slug: "saihen",
    name: "組織再編",
    task: "第5編",
    desc: "組織変更、吸収合併・新設合併、会社分割、株式交換・株式移転・株式交付、反対株主の株式買取請求、債権者保護手続、簡易・略式手続",
  },
  {
    slug: "mochibun",
    name: "持分会社・社債",
    task: "第3編・第4編",
    desc: "合名会社・合資会社・合同会社、社員の責任と持分、業務執行、社債の発行、社債管理者・社債権者集会",
  },
  {
    slug: "kaisan",
    name: "解散・清算・外国会社・雑則",
    task: "第2編第8章・第9章・第6編・第7編",
    desc: "解散の事由、清算人と清算手続、特別清算、外国会社、会社の訴え、登記、公告",
  },
];

/** 分野名 → スラッグ。問題ページのパンくずで使う */
export const CAC_FIELD_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(
  CAC_FIELDS.map((f) => [f.name, f.slug])
);

export function cacFieldBySlug(slug: string): CacField | undefined {
  return CAC_FIELDS.find((f) => f.slug === slug);
}
