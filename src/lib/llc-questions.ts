/**
 * 労働法務士認定試験（llc）の問題データ読み込み。
 * itpass-questions.ts と同じ構造。src/content/llc/*.md が唯一の出典。
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const LLC_DIR = path.join(process.cwd(), "src/content/llc");

export interface LlcQuestionData {
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

export function getAllLlcSlugs(): string[] {
  if (!fs.existsSync(LLC_DIR)) return [];
  return fs.readdirSync(LLC_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getLlcQuestion(slug: string): Promise<LlcQuestionData | null> {
  const filePath = path.join(LLC_DIR, `${slug}.md`);
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

let _allCache: LlcQuestionData[] | null = null;
export async function getAllLlcQuestions(): Promise<LlcQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllLlcSlugs();
  const questions = await Promise.all(slugs.map(getLlcQuestion));
  _allCache = questions.filter((q): q is LlcQuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getLlcQuestionsByField(field: string): Promise<LlcQuestionData[]> {
  const all = await getAllLlcQuestions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
