import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import { QuestionData } from "./types";

const QUESTIONS_DIR = path.join(process.cwd(), "src/content/questions");

export function getAllQuestionSlugs(): string[] {
  if (!fs.existsSync(QUESTIONS_DIR)) return [];
  return fs
    .readdirSync(QUESTIONS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export async function getQuestion(slug: string): Promise<QuestionData | null> {
  const filePath = path.join(QUESTIONS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const processed = await remark().use(remarkGfm).use(html, { sanitize: false }).process(content);

  return {
    slug,
    examNumber: data.examNumber || 0,
    questionNumber: data.questionNumber || 0,
    year: data.year || "",
    field: data.field || "",
    title: data.title || "",
    description: data.description || "",
    questionText: data.questionText || "",
    choices: data.choices || [],
    correctAnswer: data.correctAnswer || 0,
    difficulty: data.difficulty || "B",
    content: processed.toString(),
  };
}

let _allCache: QuestionData[] | null = null;
export async function getAllQuestions(): Promise<QuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllQuestionSlugs();
  const questions = await Promise.all(slugs.map(getQuestion));
  _allCache = questions.filter((q): q is QuestionData => q !== null);
  return _allCache;
}

export async function getQuestionsByExam(examNumber: number): Promise<QuestionData[]> {
  const all = await getAllQuestions();
  return all
    .filter((q) => q.examNumber === examNumber)
    .sort((a, b) => a.questionNumber - b.questionNumber);
}

export async function getQuestionsByField(field: string): Promise<QuestionData[]> {
  const all = await getAllQuestions();
  return all
    .filter((q) => q.field === field)
    .sort((a, b) => a.questionNumber - b.questionNumber);
}

/**
 * 指定slugの問題が、同じ分野内で何番目の問題かを返す（1始まり）。
 * 該当なしの場合は null。
 */
export async function getFieldIndex(slug: string): Promise<{ index: number; total: number; field: string } | null> {
  const q = await getQuestion(slug);
  if (!q || !q.field) return null;
  const fieldQuestions = await getQuestionsByField(q.field);
  const index = fieldQuestions.findIndex((x) => x.slug === slug);
  if (index === -1) return null;
  return { index: index + 1, total: fieldQuestions.length, field: q.field };
}

export function getExamNumbers(): number[] {
  const slugs = getAllQuestionSlugs();
  const exams = new Set(slugs.map((s) => parseInt(s.split("-")[0])));
  return Array.from(exams).sort((a, b) => b - a);
}

export function getFields(): string[] {
  return [
    "貸金業法",
    "利息制限法・出資法",
    "民法・民事訴訟法",
    "資金需要者等の保護",
  ];
}
