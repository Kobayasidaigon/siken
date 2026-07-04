/**
 * 問題ページの構造化データ(Quiz/Question)とパンくず(BreadcrumbList)を
 * 全6資格で共通生成するヘルパー。
 *
 * Google の教育系リッチリザルト(practice problems)の要件:
 * - Question.eduQuestionType: "Multiple choice"
 * - Question.learningResourceType: "Practice problem"
 * - Question.text: 問題文全文
 * - acceptedAnswer / suggestedAnswer は元の選択肢順の position を持つ
 * - 解説は acceptedAnswer.comment ({"@type":"Comment"}) に載せる
 */

const BASE_URL = "https://shikakumon.com";

type QuizQuestion = {
  title: string;
  questionText: string;
  choices: string[];
  correctAnswer: number; // 1始まり
  difficulty: "A" | "B" | "C";
  content?: string; // 解説本文(HTML)
};

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function quizJsonLd(opts: { q: QuizQuestion; examName: string; path: string }) {
  const { q, examName } = opts;
  const answers = q.choices.map((text, i) => ({
    "@type": "Answer" as const,
    text,
    position: i,
  }));
  const explanation = q.content ? stripHtml(q.content).slice(0, 500) : "";
  const acceptedAnswer: Record<string, unknown> = { ...answers[q.correctAnswer - 1] };
  if (explanation) {
    acceptedAnswer.comment = { "@type": "Comment", text: explanation };
  }
  return {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: q.title,
    url: `${BASE_URL}${opts.path}`,
    inLanguage: "ja",
    about: { "@type": "Thing", name: examName },
    educationalAlignment: [
      {
        "@type": "AlignmentObject",
        alignmentType: "educationalSubject",
        targetName: examName,
      },
    ],
    educationalLevel: q.difficulty === "A" ? "beginner" : q.difficulty === "B" ? "intermediate" : "advanced",
    hasPart: [
      {
        "@type": "Question",
        eduQuestionType: "Multiple choice",
        learningResourceType: "Practice problem",
        name: q.title,
        text: q.questionText,
        acceptedAnswer,
        suggestedAnswer: answers.filter((_, i) => i !== q.correctAnswer - 1),
      },
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${BASE_URL}${it.path}`,
    })),
  };
}

/**
 * 問題ページの <title> を「トピック先頭」に組み替える。
 * 「【問1】貸金業務取扱主任者 練習問題｜貸金業の登録制度の基本」
 * → 「貸金業の登録制度の基本｜貸金業務取扱主任者 練習問題 問1」
 * SERPで切り捨てられる末尾ではなく先頭に固有キーワードを置くための変換で、
 * H1(q.title)や学習履歴のトピック抽出(「｜」区切りの末尾)はそのまま。
 */
export function questionPageTitle(rawTitle: string, examShortName: string): string {
  const parts = rawTitle.split("｜");
  const numMatch = rawTitle.match(/【問(\d+)】/);
  if (parts.length >= 2 && numMatch) {
    const topic = parts[parts.length - 1].trim();
    return `${topic}｜${examShortName} 練習問題 問${numMatch[1]}`;
  }
  return rawTitle;
}

/**
 * meta description に問題文の冒頭を連結して一意化する。
 * (pii/mynumber/jitsumu 系はトピック単位で同一 description が最大10問
 *  使い回されており、重複解消のため問題固有のテキストを含める)
 */
export function questionPageDescription(desc: string, questionText: string): string {
  const head = questionText.replace(/\s+/g, " ").trim().slice(0, 55);
  const sep = /[。.]$/.test(desc) ? "" : "。";
  return `${desc}${sep}問題「${head}…」`;
}
