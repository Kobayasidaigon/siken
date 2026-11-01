/**
 * 民法法務士認定試験の分野定義。唯一の出典。
 * had-fields.ts と同じ形で、資格トップ・分野ページ・問題ページの3か所が同じ配列を読む。
 *
 * task は本試験の出題範囲（課題・編）。2026-10-31 に協会の公式ページ(https://www.joho-gakushu.or.jp/ccc/)で確認した出題内容に沿って、
 * 当サイトで8分野に分けた（1分野20問の予定）。
 */

export interface CccField {
  /** URL に使う分野スラッグ。/ccc/field/<slug>/ */
  slug: string;
  /** 問題 md の field と完全一致させる値 */
  name: string;
  /** 本試験の出題範囲（表示用） */
  task: string;
  desc: string;
}

export const CCC_FIELDS: CccField[] = [
  {
    slug: "sousoku1",
    name: "民法総則①（人・法律行為・意思表示）",
    task: "民法総則",
    desc: "権利能力・意思能力・行為能力、制限行為能力者、意思表示（心裡留保・虚偽表示・錯誤・詐欺・強迫）、公序良俗",
  },
  {
    slug: "sousoku2",
    name: "民法総則②（代理・無効と取消し・時効）",
    task: "民法総則",
    desc: "代理と表見代理・無権代理、無効と取消し、条件と期限、期間の計算、取得時効・消滅時効と時効の完成猶予・更新",
  },
  {
    slug: "bukken",
    name: "物権（物権変動・所有権・占有権・担保物権）",
    task: "物権",
    desc: "不動産・動産の物権変動と対抗要件、即時取得、所有権・共有、相隣関係、占有権、地上権・地役権、抵当権・質権・留置権の基本",
  },
  {
    slug: "saiken1",
    name: "債権総論①（債権の効力・債務不履行・保証）",
    task: "債権総論",
    desc: "特定物・種類債権、履行の強制、債務不履行と損害賠償、債権者代位権・詐害行為取消権、連帯債務、保証・連帯保証・個人根保証",
  },
  {
    slug: "saiken2",
    name: "債権総論②（債権譲渡・弁済・相殺）",
    task: "債権総論",
    desc: "債権譲渡と譲渡制限特約、債務引受・契約上の地位の移転、弁済・第三者弁済・弁済による代位、相殺、更改・免除・混同",
  },
  {
    slug: "keiyaku",
    name: "債権各論①（契約）",
    task: "債権各論",
    desc: "契約の成立、同時履行・危険負担・解除、定型約款、売買と契約不適合責任、贈与、消費貸借・使用貸借・賃貸借、請負・委任・寄託",
  },
  {
    slug: "houtei",
    name: "債権各論②（事務管理・不当利得・不法行為）",
    task: "債権各論",
    desc: "事務管理、不当利得と不法原因給付、一般の不法行為の要件、使用者責任・工作物責任・共同不法行為、損害賠償の範囲と過失相殺",
  },
  {
    slug: "kazoku",
    name: "親族・相続",
    task: "親族・相続",
    desc: "婚姻の成立と効力・離婚、親子、相続人と相続分、遺産分割、相続の承認と放棄、遺言、配偶者居住権、遺留分",
  },
];

/** 分野名 → スラッグ。問題ページのパンくずで使う */
export const CCC_FIELD_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(
  CCC_FIELDS.map((f) => [f.name, f.slug])
);

export function cccFieldBySlug(slug: string): CccField | undefined {
  return CCC_FIELDS.find((f) => f.slug === slug);
}
