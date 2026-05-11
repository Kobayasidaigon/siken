import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const CHIZAI_DIR = path.join(process.cwd(), "src/content/chizai");

export interface ChizaiQuestionData {
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

export function getAllChizaiSlugs(): string[] {
  if (!fs.existsSync(CHIZAI_DIR)) return [];
  return fs
    .readdirSync(CHIZAI_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export async function getChizaiQuestion(slug: string): Promise<ChizaiQuestionData | null> {
  const filePath = path.join(CHIZAI_DIR, `${slug}.md`);
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

let _allCache: ChizaiQuestionData[] | null = null;
export async function getAllChizaiQuestions(): Promise<ChizaiQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllChizaiSlugs();
  const questions = await Promise.all(slugs.map(getChizaiQuestion));
  _allCache = questions
    .filter((q): q is ChizaiQuestionData => q !== null)
    .sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getChizaiQuestionsByField(field: string): Promise<ChizaiQuestionData[]> {
  const all = await getAllChizaiQuestions();
  return all
    .filter((q) => q.field === field)
    .sort((a, b) => a.questionNumber - b.questionNumber);
}

/**
 * 指定slugの問題が、同じ分野内で何番目の問題かを返す（1始まり）。
 */
export async function getChizaiFieldIndex(slug: string): Promise<{ index: number; total: number; field: string } | null> {
  const q = await getChizaiQuestion(slug);
  if (!q || !q.field) return null;
  const fieldQuestions = await getChizaiQuestionsByField(q.field);
  const index = fieldQuestions.findIndex((x) => x.slug === slug);
  if (index === -1) return null;
  return { index: index + 1, total: fieldQuestions.length, field: q.field };
}

export function getChizaiFields(): string[] {
  return ["特許法", "著作権法", "意匠法", "商標法", "不正競争防止法", "関連法規", "実用新案法・種苗法", "国際条約", "知財実務"];
}
