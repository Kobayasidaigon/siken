export interface QuestionData {
  slug: string;          // e.g. "19-01" (第19回 問1)
  examNumber: number;    // 試験回 (19)
  questionNumber: number;// 問番号 (1)
  year: string;          // "令和6年度"
  field: string;         // "貸金業法"
  title: string;         // 記事タイトル
  description: string;   // メタディスクリプション
  questionText: string;  // 問題文
  choices: string[];     // 選択肢
  correctAnswer: number; // 正解番号 (1-4)
  difficulty: "A" | "B" | "C"; // 難易度
  content: string;       // 解説本文 (HTML)
}

export interface ExamSummary {
  examNumber: number;
  year: string;
  date: string;          // "2024年11月17日"
  applicants: number;
  passRate: string;      // "32.5%"
  passingScore: string;  // "30/50"
  questionCount: number;
}

export interface FieldInfo {
  slug: string;          // "kashikingyouhou"
  name: string;          // "貸金業法"
  description: string;
  questionCount: number;
}
