import { getAllGaiaQuestions, type GaiaQuestionData } from "./gaia-questions";

/** 2級形式の第1回(無料)。○×30問→4択20問。内訳は協会が公表していないため当サイトの想定。 */
export const GAIA_MOSHI_2KYU_TIME_LIMIT_MIN = 60;
export const GAIA_MOSHI_2KYU_PASS_COUNT = 35;

export const GAIA_MOSHI_2KYU_SLUGS: string[] = [
  "gaia-013", // AIの基礎理解 A ○× ラベルなしデータからの構造発見
  "gaia-015", // AIの基礎理解 B ○× 重みの調整による学習
  "gaia-017", // AIの基礎理解 B ○× 機械学習の予測の確率的性質
  "gaia-018", // AIの基礎理解 A ○× 強化学習の仕組み
  "gaia-037", // 生成AIの基礎理解 A ○× GANの生成器と識別器
  "gaia-039", // 生成AIの基礎理解 A ○× ナレッジカットオフと最新情報
  "gaia-040", // 生成AIの基礎理解 B ○× モデル規模と性能・安全性の関係
  "gaia-042", // 生成AIの基礎理解 B ○× LLMの出力は検索の抜き出しではない
  "gaia-061", // プロンプトエンジニアリング B ○× 長い会話での初期指示の保持
  "gaia-062", // プロンプトエンジニアリング A ○× 確認してほしい観点の指定
  "gaia-064", // プロンプトエンジニアリング A ○× 複数案の生成と比較
  "gaia-066", // プロンプトエンジニアリング A ○× 指示文の長さと情報の取捨選択
  "gaia-081", // 活用ケーススタディ B ○× 議事録での担当者・期限の補完
  "gaia-083", // 活用ケーススタディ B ○× 既存キャラクターを指定した画像生成
  "gaia-107", // リスクと限界・倫理・著作権・情報管理 A ○× 実在しない出典の提示
  "gaia-108", // リスクと限界・倫理・著作権・情報管理 A ○× 高性能モデルと誤出力
  "gaia-110", // リスクと限界・倫理・著作権・情報管理 B ○× 利用者の侵害責任
  "gaia-112", // リスクと限界・倫理・著作権・情報管理 C ○× 画風と表現の本質的特徴
  "gaia-113", // リスクと限界・倫理・著作権・情報管理 B ○× 仮名化と容易照合性
  "gaia-115", // リスクと限界・倫理・著作権・情報管理 B ○× 来歴情報とAI生成表示
  "gaia-117", // リスクと限界・倫理・著作権・情報管理 B ○× 学習データの記憶と出力への現れ
  "gaia-118", // リスクと限界・倫理・著作権・情報管理 A ○× 生成AIによる詐欺メール文面の高度化
  "gaia-130", // AIと人間の役割分担 B ○× AI作成の明記と確認責任
  "gaia-132", // AIと人間の役割分担 C ○× AIによる意思決定の誘導への留意
  "gaia-145", // AI導入における企業課題 A ○× トークン課金と入力の長さ
  "gaia-147", // AI導入における企業課題 B ○× 経営者の関与とリスク対策
  "gaia-159", // 最新動向・将来展望 A ○× 社会課題解決に向けた分野別の拡大
  "gaia-160", // 最新動向・将来展望 A ○× エージェントの自律性と責任の所在
  "gaia-170", // AI事業者ガイドライン・制度 B ○× 人工知能戦略本部の構成
  "gaia-172", // AI事業者ガイドライン・制度 B ○× 業務外利用者の位置づけ
  "gaia-004", // AIの基礎理解 A 4択 訓練データへの過剰適合と汎化性能
  "gaia-010", // AIの基礎理解 A 4択 回帰と分類の区別
  "gaia-022", // 生成AIの基礎理解 C 4択 従量課金の料金試算
  "gaia-028", // 生成AIの基礎理解 C 4択 取り込まれた情報と生成物の類似
  "gaia-034", // 生成AIの基礎理解 B 4択 RAGによる外部文書の検索と回答生成
  "gaia-048", // プロンプトエンジニアリング B 4択 Chain of Thoughtの説明
  "gaia-054", // プロンプトエンジニアリング B 4択 著作権リスクを下げる指定の工夫
  "gaia-060", // プロンプトエンジニアリング C 4択 複数の入力での出力検証
  "gaia-072", // 活用ケーススタディ A 4択 学習者のAIの使い方
  "gaia-078", // 活用ケーススタディ B 4択 導入効果の測定方法
  "gaia-089", // リスクと限界・倫理・著作権・情報管理 B 4択 誤情報への実務的な備え
  "gaia-095", // リスクと限界・倫理・著作権・情報管理 A 4択 類似性と依拠性の要件
  "gaia-101", // リスクと限界・倫理・著作権・情報管理 B 4択 社内の入力ルール整備
  "gaia-119", // AIと人間の役割分担 A 4択 採用選考AIと最終判断の所在
  "gaia-125", // AIと人間の役割分担 A 4択 AIリテラシー教育と共通の指針
  "gaia-135", // AI導入における企業課題 B 4択 社内文書検索型AIのアクセス制御
  "gaia-141", // AI導入における企業課題 B 4択 AIガバナンス体制の整備
  "gaia-151", // 最新動向・将来展望 C 4択 AIエージェントへの権限委譲と人の確認
  "gaia-157", // 最新動向・将来展望 B 4択 広島AIプロセスの枠組み
  "gaia-165", // AI事業者ガイドライン・制度 C 4択 透明性における説明の考え方
];

export async function getGaiaMoshi2kyuQuestions(): Promise<GaiaQuestionData[]> {
  const all = await getAllGaiaQuestions();
  const bySlug = new Map(all.map((q) => [q.slug, q]));
  const found = GAIA_MOSHI_2KYU_SLUGS.flatMap((s) => {
    const q = bySlug.get(s);
    return q ? [q] : [];
  });
  if (found.length !== GAIA_MOSHI_2KYU_SLUGS.length) {
    const missing = GAIA_MOSHI_2KYU_SLUGS.filter((s) => !bySlug.has(s));
    throw new Error(`gaia-moshi(2kyu): 模試の問題が見つかりません: ${missing.join(", ")}`);
  }
  return found;
}
