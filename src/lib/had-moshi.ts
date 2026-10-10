/**
 * 模擬試験 第1回の固定ペーパー定義(作成中)。
 * 練習問題 160問がそろってから、scratchpad の gen-moshi-new.mjs で出題リストを生成して差し替える。
 */
import { getAllHadQuestions, type HadQuestionData } from "./had-questions";

export const HAD_MOSHI_TIME_LIMIT_MIN = 90;
export const HAD_MOSHI_PASS_COUNT = 42;

export const HAD_MOSHI_1_SLUGS: string[] = [];

export async function getHadMoshi1Questions(): Promise<HadQuestionData[]> {
  const all = await getAllHadQuestions();
  const bySlug = new Map(all.map((q) => [q.slug, q]));
  return HAD_MOSHI_1_SLUGS.flatMap((s) => {
    const q = bySlug.get(s);
    return q ? [q] : [];
  });
}
