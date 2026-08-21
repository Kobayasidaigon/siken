// =============================================================================
// 模擬試験 第2回の問題型。
//
// 第1回は無料問題集(src/content/**)からスラッグで選ぶ「編成」だが、第2回は
// 第1回・ドリル・個別問題ページのいずれにも存在しない完全な書き下ろしを、この
// 型でファイル内に直接持つ。src/content に置かないのは、無料で読める問題を
// そのまま有料の第2回に混ぜないため(混ぜると商品として成立しない)。
//
// 既存の模試専用問題(*-moshi-ox.ts の OxQuestion)と同じ発想で、個別問題ページを
// 持たないため MoshiExam には noLink: true で渡す。
// =============================================================================

export type Moshi2Question = {
  /** 例 "chizai-m2-01"。資格ごとに連番で、欠番・重複を作らない。 */
  id: string;
  /** 第1回・無料問題集と同じ分野名を使う(弱点分析の集計単位がずれるため)。 */
  field: string;
  questionText: string;
  choices: string[];
  /** 1始まり。MoshiExam / 無料問題集の correctAnswer と同じ規約。 */
  correctAnswer: number;
  difficulty: "A" | "B" | "C";
  /** プレーンテキストの解説。選択肢の番号ではなく内容に言及する。 */
  explain: string;
};

/** ○×(二肢択一)を含む試験の第2回用。既存 OxQuestion と同じ形。 */
export type Moshi2OxQuestion = {
  id: string;
  field: string;
  statement: string;
  /** true = 正しい記述(○) */
  answer: boolean;
  explain: string;
};
