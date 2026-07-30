import { getAllFukushi2Questions, type Fukushi2QuestionData } from "./fukushi2-questions";

/**
 * 模擬試験 第1回の固定ペーパー定義。
 * 本試験仕様: 本試験(IBT/CBT)は90分・100点満点・70点合格で問題数は非公開。本模試は50問×2点=100点満点・70点(35問)合格として時間と採点基準に準拠。
 * 全員が同じ問題を同じ順序で解く固定問題(選定・並びは決定的)。分野構成は
 * 出題範囲の配分に合わせ、各分野の論点を等間隔サンプリングで選定している。
 * 設計思想の詳細は chizai-moshi.ts を参照。
 */
export const FUKUSHI2_MOSHI_TIME_LIMIT_MIN = 90;
export const FUKUSHI2_MOSHI_PASS_COUNT = 35;

export const FUKUSHI2_MOSHI_1_SLUGS: string[] = [
  "fukushi2-061", // 疾患・障害別の特性 B 脳血管障害の障害特性
  "fukushi2-121", // 場所別の住環境整備 B 玄関の上がり框と式台
  "fukushi2-091", // 住環境整備の基本技術 A 段差解消の基本
  "fukushi2-065", // 疾患・障害別の特性 B 認知症となじみの環境
  "fukushi2-125", // 場所別の住環境整備 C 屋外アプローチの安全
  "fukushi2-095", // 住環境整備の基本技術 C 手すり端部の処理
  "fukushi2-069", // 疾患・障害別の特性 B 関節リウマチの症状特性
  "fukushi2-129", // 場所別の住環境整備 C 階段の勾配と滑り止め
  "fukushi2-099", // 住環境整備の基本技術 A 出入口の有効幅員
  "fukushi2-073", // 疾患・障害別の特性 C 脊髄損傷の随伴障害
  "fukushi2-133", // 場所別の住環境整備 A トイレの手すり
  "fukushi2-103", // 住環境整備の基本技術 B 滑りにくい床仕上げ
  "fukushi2-001", // 高齢社会と住環境整備 A 高齢化の現状
  "fukushi2-041", // 障害とリハビリテーション A ICFの概要
  "fukushi2-151", // 福祉用具 B 杖の種類と適応
  "fukushi2-021", // 相談援助と連携 A 福祉住環境コーディネーターの役割
  "fukushi2-078", // 疾患・障害別の特性 B COPDと動作の工夫
  "fukushi2-138", // 場所別の住環境整備 B 浴室出入口の段差解消
  "fukushi2-108", // 住環境整備の基本技術 B 段鼻の明示と視認性
  "fukushi2-008", // 高齢社会と住環境整備 A 地域包括ケアシステムの構成要素
  "fukushi2-046", // 障害とリハビリテーション C ニィリエと8つの原理
  "fukushi2-156", // 福祉用具 B 歩行車の特徴
  "fukushi2-026", // 相談援助と連携 A 住宅改修費と理由書
  "fukushi2-082", // 疾患・障害別の特性 A 変形性膝関節症と洋式生活
  "fukushi2-142", // 場所別の住環境整備 A シャワーチェア
  "fukushi2-112", // 住環境整備の基本技術 A 収納の高さ計画
  "fukushi2-011", // 高齢社会と住環境整備 A サービス付き高齢者向け住宅
  "fukushi2-051", // 障害とリハビリテーション B 廃用症候群の予防
  "fukushi2-161", // 福祉用具 C サイドレールと介助バー
  "fukushi2-031", // 相談援助と連携 B 建築関係者との連携
  "fukushi2-186", // 関連法制度・施策 A バリアフリー法の成り立ち
  "fukushi2-171", // 介護保険と住宅改修 A 保険者と被保険者
  "fukushi2-086", // 疾患・障害別の特性 B 内部障害への配慮
  "fukushi2-146", // 場所別の住環境整備 A キッチンの加熱機器
  "fukushi2-116", // 住環境整備の基本技術 B 車いす使用を前提とした床材選定
  "fukushi2-015", // 高齢社会と住環境整備 B 入浴事故の防止
  "fukushi2-055", // 障害とリハビリテーション B ユニバーサルデザインの7原則
  "fukushi2-165", // 福祉用具 A 階段昇降機と介護保険
  "fukushi2-035", // 相談援助と連携 B ニーズ把握と面接の姿勢
  "fukushi2-193", // 関連法制度・施策 B 補装具と日常生活用具
  "fukushi2-178", // 介護保険と住宅改修 A 支給対象となる住宅改修の種類
  "fukushi2-090", // 疾患・障害別の特性 C 疾患と住環境整備の組み合わせ
  "fukushi2-150", // 場所別の住環境整備 B 寝室の広さと設備
  "fukushi2-120", // 住環境整備の基本技術 C 基本寸法の横断整理
  "fukushi2-020", // 高齢社会と住環境整備 C 加齢による身体機能の変化と住環境
  "fukushi2-060", // 障害とリハビリテーション B 障害者福祉の理念の総合理解
  "fukushi2-170", // 福祉用具 A コミュニケーション機器
  "fukushi2-040", // 相談援助と連携 C 相談援助の基本的考え方
  "fukushi2-200", // 関連法制度・施策 B 制度の基準値の横断整理
  "fukushi2-185", // 介護保険と住宅改修 B ケアプランと利用者負担
];

// =============================================================================
// 本試験型ペーパー(○×30問+四肢択一28問=58問・100点満点)の四肢択一パート。
// IBT/CBT本試験の問題数・形式内訳は公式非公表だが、複数の受験者の体験談が
// 「○×約30問(各1点)+択一28問(2点14問・3点14問)」で一致しており、その構成に
// 合わせる。上記50問から分野バランスを保って28問を選定(2点=難易度A中心、
// 3点=B/C中心)。○×パートは fukushi2-moshi-ox.ts(模試専用・ドリル非掲載)。
// =============================================================================
export const FUKUSHI2_MOSHI_PASS_POINTS = 70; // 100点満点中70点(本試験と同じ)

export const FUKUSHI2_MOSHI_1_TAKUITSU: { slug: string; points: 2 | 3 }[] = [
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

export async function getFukushi2Moshi1Questions(): Promise<Fukushi2QuestionData[]> {
  const all = await getAllFukushi2Questions();
  const bySlug = new Map(all.map((q) => [q.slug, q]));
  const found = FUKUSHI2_MOSHI_1_SLUGS.flatMap((s) => {
    const q = bySlug.get(s);
    return q ? [q] : [];
  });
  if (found.length !== FUKUSHI2_MOSHI_1_SLUGS.length) {
    const missing = FUKUSHI2_MOSHI_1_SLUGS.filter((s) => !bySlug.has(s));
    throw new Error(`fukushi2-moshi: 模試の問題が見つかりません: ${missing.join(", ")}`);
  }
  return found;
}
