/**
 * 模擬試験 第1回の固定ペーパー定義(作成中)。
 * 練習問題 160問がそろってから、scratchpad の gen-moshi-new.mjs で出題リストを生成して差し替える。
 */
import { getAllCcmQuestions, type CcmQuestionData } from "./ccm-questions";

export const CCM_MOSHI_TIME_LIMIT_MIN = 120;
export const CCM_MOSHI_PASS_COUNT = 56;

export const CCM_MOSHI_1_SLUGS: string[] = [];

export async function getCcmMoshi1Questions(): Promise<CcmQuestionData[]> {
  const all = await getAllCcmQuestions();
  const bySlug = new Map(all.map((q) => [q.slug, q]));
  return CCM_MOSHI_1_SLUGS.flatMap((s) => {
    const q = bySlug.get(s);
    return q ? [q] : [];
  });
}
