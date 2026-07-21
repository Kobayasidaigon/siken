import { getChizaiQuestion, type ChizaiQuestionData } from "./chizai-questions";

/**
 * 知的財産管理技能検定3級 模擬試験（学科相当）の固定ペーパー定義。
 *
 * /chizai/mock/（毎回ランダム20問の腕試し）と違い、模試は「全員が同じ30問を
 * 同じ順序で解く固定問題・45分・合格基準70%」の本試験フル再現。固定にするのは
 * 回として成立させるため（第2回・第3回を今後追加する前提）と、GA計測で
 * 完了率・得点分布を同一条件で比較するため。
 */

export const MOSHI_TIME_LIMIT_MIN = 45; // 本試験（学科）と同じ制限時間
export const MOSHI_PASS_COUNT = 21;     // 合格基準70% = 30問中21問

/**
 * 第1回の出題30問（この配列順 = 問1〜問30）。
 * 分野構成は本試験の出題傾向に合わせる:
 * 特許7 / 著作権7 / 商標4 / 意匠3 / 実用・種苗2 / 条約2 / 不競1 / 関連1 / 実務3。
 * 選定基準: 各分野の頻出論点を難易度A中心（A22/B6/C2）でカバー。
 * 残りの頻出論点は第2回・第3回用に温存している。
 */
export const MOSHI_1_SLUGS: string[] = [
  "chizai-001", // 特許法 A 発明の定義
  "chizai-041", // 著作権法 A 著作物の定義
  "chizai-101", // 商標法 A 商標の定義
  "chizai-081", // 意匠法 A 意匠の定義
  "chizai-143", // 実用新案 A 無審査主義
  "chizai-003", // 特許法 A 新規性の喪失
  "chizai-044", // 著作権法 A 保護期間
  "chizai-151", // 国際条約 A パリ条約の3大原則
  "chizai-105", // 商標法 B 類似判断
  "chizai-053", // 著作権法 A 同一性保持権
  "chizai-005", // 特許法 B 先願主義
  "chizai-123", // 不正競争防止法 A 営業秘密の3要件
  "chizai-091", // 意匠法 A 意匠権の存続期間
  "chizai-062", // 著作権法 A 引用の要件
  "chizai-012", // 特許法 A 出願公開の時期
  "chizai-111", // 商標法 A 商標権の存続期間
  "chizai-045", // 著作権法 B 職務著作の要件
  "chizai-021", // 特許法 A 出願審査請求
  "chizai-146", // 種苗法 B 保護対象
  "chizai-182", // 知財実務 A J-PlatPat
  "chizai-058", // 著作権法 B 翻訳権・翻案権
  "chizai-153", // 国際条約 A PCTの概要
  "chizai-090", // 意匠法 C 秘密意匠制度
  "chizai-113", // 商標法 A 不使用取消審判
  "chizai-032", // 特許法 A 差止請求権
  "chizai-132", // 関連法規 A 知的財産権と独禁法
  "chizai-071", // 著作権法 A 著作隣接権の種類
  "chizai-163", // 知財実務 A 通常実施権の特徴
  "chizai-039", // 特許法 C 職務発明
  "chizai-194", // 知財実務 B 営業秘密管理
];

export async function getMoshi1Questions(): Promise<ChizaiQuestionData[]> {
  const loaded = await Promise.all(MOSHI_1_SLUGS.map(getChizaiQuestion));
  const found = loaded.filter((q): q is ChizaiQuestionData => q !== null);
  if (found.length !== MOSHI_1_SLUGS.length) {
    const missing = MOSHI_1_SLUGS.filter((s) => !found.some((q) => q.slug === s));
    throw new Error(`chizai-moshi: 模試の問題が見つかりません: ${missing.join(", ")}`);
  }
  return found;
}
