import { buildOxItems } from "./ox-from-choices";
import type { InputItem, OxItem } from "./question-format";
import { BIJIHOU_KINYU } from "./kinyu/bijihou";

/**
 * 一問一答ページ(/<資格>/ichimon/)に渡すデータ。2026-11-23 追加。
 *
 * ○×は4択から作る(lib/ox-from-choices.ts)。本試験に○×が出る資格(ビジ法3級・福祉住環境2級・
 * eco検定・マイナンバー3級)から始めた。記入式は問題を手で書くので、用意できた資格だけ。
 */
export const ICHIMON_EXAMS = ["bijihou", "fukushi2", "eco", "mynumber"] as const;
export type IchimonExam = (typeof ICHIMON_EXAMS)[number];

const KINYU: Partial<Record<IchimonExam, InputItem[]>> = {
  bijihou: BIJIHOU_KINYU,
};

export function getIchimonData(exam: IchimonExam) {
  const all = buildOxItems(exam);
  const sharedExplains: Record<string, string> = {};
  const ox: (Omit<OxItem, "explain"> & { explain?: string })[] = all.map(({ explain, ...rest }) => {
    if (rest.sharedExplain) {
      sharedExplains[rest.sourceSlug] = explain;
      return rest;
    }
    return { ...rest, explain };
  });
  return { ox, sharedExplains, inputs: KINYU[exam] ?? [] };
}
