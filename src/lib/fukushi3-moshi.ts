import { getAllFukushi3Questions, type Fukushi3QuestionData } from "./fukushi3-questions";

/**
 * 福祉住環境コーディネーター3級 模擬試験 第1回の固定ペーパー定義。
 *
 * 本試験仕様(東京商工会議所の受験案内 https://kentei.tokyo-cci.or.jp/fukushi/exam-info/ を 2026-11-12 に確認):
 * IBT/CBT の多肢選択式・90分・100点満点70点以上で合格。**問題数と配点は公表されていない**ため、
 * 本模試の50問という構成は当サイト独自のもので、本試験の出題数を示すものではない。
 * 時間(90分)と合否基準(100点満点・70点)だけを本試験に合わせている(eco-moshi.ts と同じ考え方)。
 *
 * 構成: 4肢択一50問 × 各2点 = 100点満点 / 70点(35問正解)で合格判定。
 * 全員が同じ問題を同じ順序で解く固定問題(選定・並びは決定的)。
 * 選定は6分野(各20問)から8〜9問ずつ。公式テキストの章の順に並べ、正解の位置が偏らないように選んでいる
 * (正解位置は 1:12 / 2:13 / 3:13 / 4:12、難易度は A:24 / B:24 / C:2)。
 */
export const FUKUSHI3_MOSHI_TIME_LIMIT_MIN = 90;
export const FUKUSHI3_MOSHI_PASS_COUNT = 35;
export const FUKUSHI3_MOSHI_PASS_POINTS = 70;
const FUKUSHI3_MOSHI_POINTS_PER_QUESTION = 2;

const FUKUSHI3_MOSHI_1_SLUGS: string[] = [
  // 暮らしやすい生活環境（8問）
  "fukushi3-001", // A 高齢化率と超高齢社会
  "fukushi3-003", // B 少子化と合計特殊出生率
  "fukushi3-005", // A 高齢者の家庭内事故
  "fukushi3-008", // A 福祉住環境コーディネーターの役割
  "fukushi3-011", // A 要支援と要介護の区分
  "fukushi3-013", // B 居宅サービス計画（ケアプラン）
  "fukushi3-016", // A 介護保険の住宅改修費
  "fukushi3-018", // B 福祉用具の貸与と購入費の支給
  // 健康と障害のとらえ方（8問）
  "fukushi3-021", // A 生理的老化と病的老化
  "fukushi3-023", // A 加齢に伴う聴覚の変化
  "fukushi3-026", // B フレイルとサルコペニア
  "fukushi3-028", // B 介護が必要となった主な原因
  "fukushi3-031", // A ADLとIADL
  "fukushi3-033", // B 片麻痺・対麻痺・四肢麻痺
  "fukushi3-036", // A 内部障害
  "fukushi3-039", // B 高齢者の転倒と骨折
  // バリアフリーとユニバーサルデザイン（8問）
  "fukushi3-041", // A 障害のある人をとりまく4つのバリア
  "fukushi3-043", // A ユニバーサルデザインの考え方
  "fukushi3-046", // B 国際障害者年
  "fukushi3-048", // B 共用品の例
  "fukushi3-051", // B 歩行器・歩行車・シルバーカー
  "fukushi3-053", // B 移乗や段差の移動に使う用具
  "fukushi3-055", // B 排泄に使う福祉用具
  "fukushi3-058", // B 視覚・聴覚を補う用具
  // 住まいの整備の基本技術（9問）
  "fukushi3-061", // A 床の段差の解消
  "fukushi3-062", // C スロープの勾配と水平距離
  "fukushi3-065", // B 手すりの直径
  "fukushi3-068", // A 引き戸と開き戸
  "fukushi3-071", // B 廊下の幅と車いす
  "fukushi3-073", // A 収納の計画
  "fukushi3-075", // B 高齢者に配慮した色彩
  "fukushi3-078", // B 住宅用火災警報器
  "fukushi3-079", // B 住宅改修を進めるときの留意点
  // 生活行為別の住まいの整備（9問）
  "fukushi3-081", // A アプローチの整備
  "fukushi3-083", // A 上がりがまちと式台
  "fukushi3-085", // A 寝室の階と階段の安全
  "fukushi3-088", // B トイレの介助スペース
  "fukushi3-090", // B トイレの縦手すりの位置
  "fukushi3-092", // B 浴槽の縁の高さ
  "fukushi3-094", // A 浴室の設備
  "fukushi3-097", // A 加熱調理器の安全
  "fukushi3-100", // C 幼い子どもの家庭内事故の予防
  // 安心できる住生活とまちづくり（8問）
  "fukushi3-101", // A 同居・隣居・近居
  "fukushi3-103", // B 高齢者住まい法
  "fukushi3-106", // A シルバーハウジング
  "fukushi3-108", // A 特別養護老人ホーム
  "fukushi3-111", // A バリアフリー法の成り立ち
  "fukushi3-113", // A 福祉のまちづくり条例
  "fukushi3-115", // B 住宅セーフティネット制度
  "fukushi3-118", // B 建築協定
];

interface Fukushi3MoshiQuestion extends Fukushi3QuestionData {
  points: number;
}

/**
 * 固定ペーパーの50問を FUKUSHI3_MOSHI_1_SLUGS の順序どおりに返す。
 * 問題ファイルが見つからないものは黙って落とすのではなくビルドを落とす
 * (問題番号の付け替えなどで模試が静かに短くなる事故を防ぐため)。
 */
export async function getFukushi3Moshi1(): Promise<Fukushi3MoshiQuestion[]> {
  const all = await getAllFukushi3Questions();
  const bySlug = new Map(all.map((q) => [q.slug, q]));
  return FUKUSHI3_MOSHI_1_SLUGS.map((slug) => {
    const q = bySlug.get(slug);
    if (!q) {
      throw new Error(`[fukushi3-moshi] 模試の問題が見つかりません: ${slug}`);
    }
    return { ...q, points: FUKUSHI3_MOSHI_POINTS_PER_QUESTION };
  });
}
