/**
 * 資格ID → 問題データの読み込み関数、の対応表。2026-09-13 追加。
 *
 * 17資格ぶんの `get<資格>Questions()` は名前も戻り値の型も別々で、
 * 「資格IDだけ分かっている場面」(コラム内の1問、今日の3問、資格トップの TOP10)から
 * 問題を引くたびに 17 本の import を並べる必要があった(/study/page.tsx がその例)。
 * ここに寄せて、共通の最小限の形(QuestionLite)で返す。
 *
 * サーバー専用。fs を触る各 *-questions.ts を束ねているので、クライアント
 * コンポーネントから import しないこと。
 */

import type { ExamSlug } from "./study-progress";
import { getAllQuestions } from "./questions";
import { getAllPiiQuestions } from "./pii-questions";
import { getAllChizaiQuestions } from "./chizai-questions";
import { getAllChizai2Questions } from "./chizai2-questions";
import { getAllMynumberQuestions } from "./mynumber-questions";
import { getAllJitsumuQuestions } from "./jitsumu-questions";
import { getAllBijihouQuestions } from "./bijihou-questions";
import { getAllFukushi2Questions } from "./fukushi2-questions";
import { getAllBijimaneQuestions } from "./bijimane-questions";
import { getAllEcoQuestions } from "./eco-questions";
import { getAllBijihou2Questions } from "./bijihou2-questions";
import { getAllItpassQuestions } from "./itpass-questions";
import { getAllChintaiQuestions } from "./chintai-questions";
import { getAllKangyoQuestions } from "./kangyo-questions";
import { getAllIsecQuestions } from "./isec-questions";
import { getAllKyoinQuestions } from "./kyoin-questions";
import { getAllShakaiQuestions } from "./shakai-questions";

export interface QuestionLite {
  slug: string;
  questionNumber: number;
  title: string;
  field: string;
  questionText: string;
  choices: string[];
  /** 1始まり */
  correctAnswer: number;
  difficulty: "A" | "B" | "C";
}

type Loader = () => Promise<QuestionLite[]>;

const LOADERS: Record<ExamSlug, Loader> = {
  kashikin: getAllQuestions,
  pii: getAllPiiQuestions,
  chizai: getAllChizaiQuestions,
  chizai2: getAllChizai2Questions,
  mynumber: getAllMynumberQuestions,
  jitsumu: getAllJitsumuQuestions,
  bijihou: getAllBijihouQuestions,
  fukushi2: getAllFukushi2Questions,
  bijimane: getAllBijimaneQuestions,
  eco: getAllEcoQuestions,
  bijihou2: getAllBijihou2Questions,
  itpass: getAllItpassQuestions,
  chintai: getAllChintaiQuestions,
  kangyo: getAllKangyoQuestions,
  isec: getAllIsecQuestions,
  kyoin: getAllKyoinQuestions,
  shakai: getAllShakaiQuestions,
};

/** その資格の全問題(問番号順)。各ローダーは内部でキャッシュしている */
export async function getQuestionsOf(exam: ExamSlug): Promise<QuestionLite[]> {
  const all = await LOADERS[exam]();
  return [...all].sort((a, b) => a.questionNumber - b.questionNumber);
}

/** 問題の title「…｜<論点>」から論点だけを取り出す(/study/ と同じ規則) */
export function topicOf(title: string): string {
  const parts = title.split("｜");
  return parts.length >= 2 ? parts[parts.length - 1].trim() : title;
}

/**
 * 文字列から安定した非負整数を作る(FNV-1a)。「このコラムにはいつも同じ1問」の
 * ように、ビルドをまたいでも同じ選択を再現したいときに使う。
 */
export function stableHash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}
