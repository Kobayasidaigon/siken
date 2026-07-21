import { getAllChizai2Questions, type Chizai2QuestionData } from "./chizai2-questions";

/**
 * 模擬試験 第1回の固定ペーパー定義。
 * 本試験仕様: 学科40問・60分・4肢択一・合格基準80%(32問)。
 * 全員が同じ問題を同じ順序で解く固定問題(選定・並びは決定的)。分野構成は
 * 出題範囲の配分に合わせ、各分野の論点を等間隔サンプリングで選定している。
 * 設計思想の詳細は chizai-moshi.ts を参照。
 */
export const CHIZAI2_MOSHI_TIME_LIMIT_MIN = 60;
export const CHIZAI2_MOSHI_PASS_COUNT = 32;

export const CHIZAI2_MOSHI_1_SLUGS: string[] = [
  "chizai2-001", // 特許法 C 特許要件(産業上利用可能性)
  "chizai2-041", // 著作権法 C 著作物性
  "chizai2-005", // 特許法 B 先願主義
  "chizai2-045", // 著作権法 B 著作者
  "chizai2-010", // 特許法 C 出願公開
  "chizai2-050", // 著作権法 B 著作者人格権（公表権）
  "chizai2-014", // 特許法 B 補正
  "chizai2-054", // 著作権法 B 著作財産権（公衆送信権）
  "chizai2-018", // 特許法 B 国内優先権
  "chizai2-077", // 商標法 B 商標登録要件(3条:識別力)
  "chizai2-023", // 特許法 B 特許権の効力
  "chizai2-059", // 著作権法 B 権利制限（私的使用のための複製）
  "chizai2-082", // 商標法 B 不登録事由(4条)
  "chizai2-027", // 特許法 B 通常実施権・当然対抗
  "chizai2-063", // 著作権法 C 権利制限（障害者のための複製）
  "chizai2-088", // 商標法 A 商標の類否(結合商標)
  "chizai2-105", // 意匠法 B 意匠登録要件（工業上利用可能性）
  "chizai2-031", // 特許法 B 共有
  "chizai2-067", // 著作権法 B 保護期間（著作隣接権）
  "chizai2-093", // 商標法 A 商標権の効力
  "chizai2-111", // 意匠法 B 関連意匠
  "chizai2-125", // 不正競争防止法 B 周知表示混同惹起
  "chizai2-141", // 国際条約 B パリ条約（内国民待遇）
  "chizai2-036", // 特許法 A 侵害・生産方法の推定
  "chizai2-072", // 著作権法 C 共有著作権
  "chizai2-099", // 商標法 B 地域団体商標
  "chizai2-118", // 意匠法 B 秘密意匠
  "chizai2-156", // 実用新案法・種苗法 B 実用新案法（無審査主義・基礎的要件）
  "chizai2-133", // 不正競争防止法 B 営業秘密（秘密管理性）
  "chizai2-148", // 国際条約 C PCT（国際公開）
  "chizai2-182", // 知財実務 B ライセンス契約
  "chizai2-040", // 特許法 B 先使用権
  "chizai2-076", // 著作権法 A 譲渡・著作者人格権（事例）
  "chizai2-104", // 商標法 B 侵害と救済
  "chizai2-124", // 意匠法 B 先願
  "chizai2-167", // 実用新案法・種苗法 B 種苗法（権利の制限・消尽・名称）
  "chizai2-140", // 不正競争防止法 A 救済（刑事罰・消滅時効）
  "chizai2-155", // 国際条約 A 国際条約（横断）
  "chizai2-175", // 関連法規 B 弁理士法（特定侵害訴訟代理業務）
  "chizai2-200", // 知財実務 B 知財の評価・活用
];

export async function getChizai2Moshi1Questions(): Promise<Chizai2QuestionData[]> {
  const all = await getAllChizai2Questions();
  const bySlug = new Map(all.map((q) => [q.slug, q]));
  const found = CHIZAI2_MOSHI_1_SLUGS.flatMap((s) => {
    const q = bySlug.get(s);
    return q ? [q] : [];
  });
  if (found.length !== CHIZAI2_MOSHI_1_SLUGS.length) {
    const missing = CHIZAI2_MOSHI_1_SLUGS.filter((s) => !bySlug.has(s));
    throw new Error(`chizai2-moshi: 模試の問題が見つかりません: ${missing.join(", ")}`);
  }
  return found;
}
