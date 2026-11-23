/**
 * 4択以外の問題形式(○×・記入式)のデータの形。2026-11-23 追加。
 *
 * どちらも「一問一答」ページ(/<資格>/ichimon/)で使う。ブラウザへそのまま渡すので、
 * 解説は HTML ではなく素の文章で持つ。
 */

/** ○×式。1つの記述が正しいか誤っているかを答える */
export interface OxItem {
  id: string;
  field: string;
  /** 記述の前に出す「何についての記述か」。元の4択の問題文から取る */
  topic: string;
  statement: string;
  /** true = 正しい記述(○) */
  answer: boolean;
  explain: string;
  /** 元の4択の問題。解説の全文はそちらにある */
  sourceSlug: string;
  /** 元の4択で何番の肢だったか */
  choiceNo: number;
  /** explain が肢ごとの解説ではなく、問題全体の解説(ほかの肢の話も含む)なら true */
  sharedExplain: boolean;
}

/** 記入式。空欄に入る語句を打ち込む */
export interface InputItem {
  id: string;
  field: string;
  /** 問題文。空欄は「＿＿」で書く */
  prompt: string;
  /** 正解として認める答え。先頭が正式な答えで、画面に「正解」として出す */
  answers: string[];
  /** 入力の手がかり(「漢字2文字」など)。無くてもよい */
  hint?: string;
  explain: string;
  /** 根拠にした4択の問題(解説がそこにある) */
  sourceSlug?: string;
}
