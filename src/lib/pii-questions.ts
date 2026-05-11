import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const PII_DIR = path.join(process.cwd(), "src/content/pii");

export interface PiiQuestionData {
  slug: string;
  questionNumber: number;
  title: string;
  description: string;
  field: string;
  questionText: string;
  choices: string[];
  correctAnswer: number;
  difficulty: "A" | "B" | "C";
  content: string;
}

export function getAllPiiSlugs(): string[] {
  if (!fs.existsSync(PII_DIR)) return [];
  return fs
    .readdirSync(PII_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export async function getPiiQuestion(slug: string): Promise<PiiQuestionData | null> {
  const filePath = path.join(PII_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const processed = await remark().use(remarkGfm).use(html, { sanitize: false }).process(content);

  return {
    slug,
    questionNumber: data.questionNumber || 0,
    title: data.title || "",
    description: data.description || "",
    field: data.field || "",
    questionText: data.questionText || "",
    choices: data.choices || [],
    correctAnswer: data.correctAnswer || 0,
    difficulty: data.difficulty || "B",
    content: processed.toString(),
  };
}

let _allCache: PiiQuestionData[] | null = null;
export async function getAllPiiQuestions(): Promise<PiiQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllPiiSlugs();
  const questions = await Promise.all(slugs.map(getPiiQuestion));
  _allCache = questions
    .filter((q): q is PiiQuestionData => q !== null)
    .sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getPiiQuestionsByField(field: string): Promise<PiiQuestionData[]> {
  const all = await getAllPiiQuestions();
  return all
    .filter((q) => q.field === field)
    .sort((a, b) => a.questionNumber - b.questionNumber);
}

/**
 * 指定slugの問題が、同じ分野内で何番目の問題かを返す（1始まり）。
 */
export async function getPiiFieldIndex(slug: string): Promise<{ index: number; total: number; field: string } | null> {
  const q = await getPiiQuestion(slug);
  if (!q || !q.field) return null;
  const fieldQuestions = await getPiiQuestionsByField(q.field);
  const index = fieldQuestions.findIndex((x) => x.slug === slug);
  if (index === -1) return null;
  return { index: index + 1, total: fieldQuestions.length, field: q.field };
}

export function getPiiFields(): string[] {
  return ["個人情報保護法", "マイナンバー法", "情報セキュリティ"];
}
