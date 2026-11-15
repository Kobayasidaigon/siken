/**
 * 資格別の転職エージェント比較ページのデータ。2026-11-14 追加(まず賃貸不動産経営管理士で型を作った)。
 *
 * - 1資格 = src/data/tenshoku/<資格>.json 1つ。ページの見出し・導入・仕事の例・比較表はすべてここから作る。
 * - エージェントのリンクは career-links.ts の CAREER_OFFERS から offerId で引く。
 *   A8 で提携していない案件は CAREER_OFFERS に無いので、JSON に書いても表示されない(載せない)。
 * - 説明は公式サイトで確かめた範囲だけ書く。確かめた日を checkedAt に入れる。
 *   比較表の印は「公式サイトに記載あり=○」「確認できない=—」の2つだけ(評判や順位で△を付けない)。
 */
import chintai from "@/data/tenshoku/chintai.json";
import { CAREER_OFFERS, type CareerOffer, type CareerOfferId } from "./career-links";
import type { ExamSlug } from "./study-progress";

export interface TenshokuAgent {
  offerId: string;
  name: string;
  company: string;
  officialUrl: string;
  industry: string; // 得意な業界
  jobs: string;     // 求人の傾向
  area: string;     // 対応地域
  fit: string[];    // 向いている人
  marks: Record<string, boolean>;
  free?: string;
}

export interface TenshokuData {
  exam: ExamSlug;
  examName: string;
  examTop: string;
  path: string;
  title: string;
  description: string;
  checkedAt: string;
  intro: string[];
  jobs: { name: string; desc: string }[];
  lawSource?: { label: string; href: string };
  columns: { key: string; label: string }[];
  agents: TenshokuAgent[];
}

const DATA: Partial<Record<ExamSlug, TenshokuData>> = {
  chintai: chintai as TenshokuData,
};

export function getTenshoku(exam: ExamSlug): TenshokuData {
  const d = DATA[exam];
  if (!d) throw new Error(`tenshoku data not found: ${exam}`);
  return d;
}

/** 提携済み(CAREER_OFFERS にリンクがある)エージェントだけを返す */
export function linkedAgents(d: TenshokuData): (TenshokuAgent & { offer: CareerOffer })[] {
  return d.agents.flatMap((a) => {
    const offer = (CAREER_OFFERS as Record<string, CareerOffer>)[a.offerId as CareerOfferId];
    return offer ? [{ ...a, offer }] : [];
  });
}
