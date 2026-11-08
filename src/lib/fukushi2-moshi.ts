import { getAllFukushi2Questions, type Fukushi2QuestionData } from "./fukushi2-questions";

/**
 * 模擬試験 第1回の固定ペーパー定義。
 * 本試験仕様: 本試験(IBT/CBT)は90分・100点満点・70点合格で問題数は非公開。本模試は50問×2点=100点満点・70点(35問)合格として時間と採点基準に準拠。
 * 全員が同じ問題を同じ順序で解く固定問題(選定・並びは決定的)。分野構成は
 * 出題範囲の配分に合わせ、各分野の論点を等間隔サンプリングで選定している。
 * 設計思想の詳細は chizai-moshi.ts を参照。
 */
export const FUKUSHI2_MOSHI_TIME_LIMIT_MIN = 90;

// =============================================================================
// 本試験型ペーパー(○×30問+四肢択一28問=58問・100点満点)の四肢択一パート。
// IBT/CBT本試験の問題数・形式内訳は公式非公表だが、複数の受験者の体験談が
// 「○×約30問(各1点)+択一28問(2点14問・3点14問)」で一致しており、その構成に
// 合わせる。上記50問から分野バランスを保って28問を選定(2点=難易度A中心、
// 3点=B/C中心)。○×パートは fukushi2-moshi-ox.ts(模試専用・ドリル非掲載)。
// =============================================================================
export const FUKUSHI2_MOSHI_PASS_POINTS = 70; // 100点満点中70点(本試験と同じ)

const FUKUSHI2_MOSHI_1_TAKUITSU: { slug: string; points: 2 | 3 }[] = [
  // 2点×14問(基礎論点)
  { slug: "fukushi2-091", points: 2 },
  { slug: "fukushi2-133", points: 2 },
  { slug: "fukushi2-001", points: 2 },
  { slug: "fukushi2-041", points: 2 },
  { slug: "fukushi2-021", points: 2 },
  { slug: "fukushi2-099", points: 2 },
  { slug: "fukushi2-008", points: 2 },
  { slug: "fukushi2-026", points: 2 },
  { slug: "fukushi2-082", points: 2 },
  { slug: "fukushi2-142", points: 2 },
  { slug: "fukushi2-112", points: 2 },
  { slug: "fukushi2-011", points: 2 },
  { slug: "fukushi2-061", points: 2 },
  { slug: "fukushi2-121", points: 2 },
  // 3点×14問(応用論点)
  { slug: "fukushi2-065", points: 3 },
  { slug: "fukushi2-125", points: 3 },
  { slug: "fukushi2-095", points: 3 },
  { slug: "fukushi2-069", points: 3 },
  { slug: "fukushi2-129", points: 3 },
  { slug: "fukushi2-073", points: 3 },
  { slug: "fukushi2-103", points: 3 },
  { slug: "fukushi2-151", points: 3 },
  { slug: "fukushi2-078", points: 3 },
  { slug: "fukushi2-138", points: 3 },
  { slug: "fukushi2-108", points: 3 },
  { slug: "fukushi2-046", points: 3 },
  { slug: "fukushi2-156", points: 3 },
  { slug: "fukushi2-051", points: 3 },
];

export async function getFukushi2Moshi1Takuitsu(): Promise<(Fukushi2QuestionData & { points: number })[]> {
  const all = await getAllFukushi2Questions();
  const bySlug = new Map(all.map((q) => [q.slug, q]));
  return FUKUSHI2_MOSHI_1_TAKUITSU.map(({ slug, points }) => {
    const q = bySlug.get(slug);
    if (!q) throw new Error(`fukushi2-moshi: 模試の問題が見つかりません: ${slug}`);
    return { ...q, points };
  });
}
