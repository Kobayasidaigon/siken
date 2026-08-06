import { getAllBijimaneQuestions, type BijimaneQuestionData } from "./bijimane-questions";

/**
 * ビジネスマネジャー検定 模擬試験 第1回の固定ペーパー定義。
 *
 * 本試験仕様(東京商工会議所・2026-08-06確認): IBT/CBTの多肢選択式・90分・
 * 100点満点70点以上で合格。**出題数は公式に公表されていない**ため、本模試の
 * 50問という構成は当サイト独自のもので、本試験の出題数を示すものではない。
 * 時間(90分)と合否基準(100点満点・70点)だけを本試験に合わせている。
 *
 * 構成: 四肢択一50問 × 各2点 = 100点満点 / 70点(35問正解)で合格判定。
 * 全員が同じ問題を同じ順序で解く固定問題(選定・並びは決定的)。
 * 選定は各分野の問題数比に応じた等間隔サンプリングで、並びは分野が連続しない
 * ようラウンドロビンにしている(本試験同様、分野をまたいで頭を切り替える練習)。
 */
export const BIJIMANE_MOSHI_TIME_LIMIT_MIN = 90;
export const BIJIMANE_MOSHI_PASS_COUNT = 35;
export const BIJIMANE_MOSHI_PASS_POINTS = 70;
export const BIJIMANE_MOSHI_POINTS_PER_QUESTION = 2;

export const BIJIMANE_MOSHI_1_SLUGS: string[] = [
  "bijimane-003", // マネジャーの役割と心構え A マネジャーの部下育成の役割
  "bijimane-022", // マネジャー自身のマネジメントとコミュニケーション A 業務の優先順位づけ
  "bijimane-049", // 部下のマネジメントとリーダーシップ A 部下との信頼関係と期待の伝え方
  "bijimane-073", // 人材育成と人事考課 A 育成目標設定の前提
  "bijimane-093", // チームのマネジメントと企業組織論 B チーム内のコンフリクトへの対応
  "bijimane-107", // 経営計画・事業計画と戦略 B 経営計画と事業計画の位置づけ
  "bijimane-126", // 業務のマネジメントと問題解決 A PDCAのCheckが形骸化する問題
  "bijimane-149", // マーケティング・イノベーションと財務の基礎 B キャッシュフロー計算書と資金繰り
  "bijimane-165", // リスクマネジメントの考え方と職場のリスク A リスクの分析と優先順位づけ
  "bijimane-187", // 業務・組織・事故災害のリスクマネジメント B 製品・サービスの不具合への初動対応
  "bijimane-007", // マネジャーの役割と心構え A グローバル化とマネジャーの視点
  "bijimane-026", // マネジャー自身のマネジメントとコミュニケーション C 経験学習の考え方
  "bijimane-053", // 部下のマネジメントとリーダーシップ B 口数少ない部下から話を引き出す関わり方
  "bijimane-077", // 人材育成と人事考課 A 指導スタイルの使い分け
  "bijimane-098", // チームのマネジメントと企業組織論 B 事業部制組織の特徴
  "bijimane-111", // 経営計画・事業計画と戦略 B 外部環境と内部環境の切り分け
  "bijimane-130", // 業務のマネジメントと問題解決 A 仮説を立てて検証する進め方
  "bijimane-153", // マーケティング・イノベーションと財務の基礎 B 市場調査で陥りやすい思い込みを避ける姿勢
  "bijimane-169", // リスクマネジメントの考え方と職場のリスク A コンプライアンスの考え方
  "bijimane-191", // 業務・組織・事故災害のリスクマネジメント B 反社会的勢力への対応
  "bijimane-011", // マネジャーの役割と心構え A 公正な評価姿勢
  "bijimane-030", // マネジャー自身のマネジメントとコミュニケーション B 自己管理と自己啓発の実践
  "bijimane-057", // 部下のマネジメントとリーダーシップ B PM理論の考え方
  "bijimane-081", // 人材育成と人事考課 A 人事考課を行う狙い
  "bijimane-102", // チームのマネジメントと企業組織論 B 指揮命令系統の一元化
  "bijimane-115", // 経営計画・事業計画と戦略 C クロスSWOTの掛け合わせ
  "bijimane-134", // 業務のマネジメントと問題解決 B 目標を部下と共有する意味
  "bijimane-157", // マーケティング・イノベーションと財務の基礎 B プロダクトライフサイクルの導入期
  "bijimane-174", // リスクマネジメントの考え方と職場のリスク B 名ばかり管理職の問題
  "bijimane-195", // 業務・組織・事故災害のリスクマネジメント B サプライチェーンにかかわるリスク
  "bijimane-015", // マネジャーの役割と心構え A 部下との距離感
  "bijimane-034", // マネジャー自身のマネジメントとコミュニケーション B 傾聴の姿勢
  "bijimane-061", // 部下のマネジメントとリーダーシップ A 動機づけの基本的な考え方
  "bijimane-085", // 人材育成と人事考課 B 特定の印象に引きずられる評価のゆがみ
  "bijimane-119", // 経営計画・事業計画と戦略 A 市場細分化（セグメンテーション）の目的
  "bijimane-137", // 業務のマネジメントと問題解決 A 進捗管理の頻度と粒度
  "bijimane-161", // マーケティング・イノベーションと財務の基礎 B イノベーションと発明の違い
  "bijimane-178", // リスクマネジメントの考え方と職場のリスク B セクシュアルハラスメントの防止
  "bijimane-199", // 業務・組織・事故災害のリスクマネジメント A 感染症の流行に対するマネジャーの姿勢
  "bijimane-019", // マネジャーの役割と心構え C 任せることと丸投げの違い
  "bijimane-037", // マネジャー自身のマネジメントとコミュニケーション B フィードバックの伝え方
  "bijimane-065", // 部下のマネジメントとリーダーシップ B 目標設定と意欲の関係
  "bijimane-089", // 人材育成と人事考課 C 期末効果
  "bijimane-123", // 経営計画・事業計画と戦略 B PPM（プロダクト・ポートフォリオ・マネジメント）の考え方
  "bijimane-141", // 業務のマネジメントと問題解決 B 成果の検証における視点
  "bijimane-182", // リスクマネジメントの考え方と職場のリスク B メンタルヘルス対策における予防の段階
  "bijimane-041", // マネジャー自身のマネジメントとコミュニケーション B 上司へのトラブル報告
  "bijimane-069", // 部下のマネジメントとリーダーシップ C 勤務形態が多様なチームの運営
  "bijimane-145", // 業務のマネジメントと問題解決 C 問題解決の基本手順
  "bijimane-045", // マネジャー自身のマネジメントとコミュニケーション C 社外との交渉に臨む姿勢
];

export interface BijimaneMoshiQuestion extends BijimaneQuestionData {
  points: number;
}

/**
 * 固定ペーパーの50問を BIJIMANE_MOSHI_1_SLUGS の順序どおりに返す。
 * 問題ファイルが見つからないものは黙って落とすのではなくビルドを落とす
 * (問題番号の付け替えなどで模試が静かに短くなる事故を防ぐため)。
 */
export async function getBijimaneMoshi1(): Promise<BijimaneMoshiQuestion[]> {
  const all = await getAllBijimaneQuestions();
  const bySlug = new Map(all.map((q) => [q.slug, q]));
  return BIJIMANE_MOSHI_1_SLUGS.map((slug) => {
    const q = bySlug.get(slug);
    if (!q) {
      throw new Error(`[bijimane-moshi] 模試の問題が見つかりません: ${slug}`);
    }
    return { ...q, points: BIJIMANE_MOSHI_POINTS_PER_QUESTION };
  });
}
