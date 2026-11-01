/**
 * インバウンド実務主任者認定試験（ibd）の問題データ読み込み。
 * itpass-questions.ts と同じ構造。src/content/ibd/*.md が唯一の出典。
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const IBD_DIR = path.join(process.cwd(), "src/content/ibd");

export interface IbdQuestionData {
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

export function getAllIbdSlugs(): string[] {
  if (!fs.existsSync(IBD_DIR)) return [];
  return fs.readdirSync(IBD_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getIbdQuestion(slug: string): Promise<IbdQuestionData | null> {
  const filePath = path.join(IBD_DIR, `${slug}.md`);
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

let _allCache: IbdQuestionData[] | null = null;
export async function getAllIbdQuestions(): Promise<IbdQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllIbdSlugs();
  const questions = await Promise.all(slugs.map(getIbdQuestion));
  _allCache = questions.filter((q): q is IbdQuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getIbdQuestionsByField(field: string): Promise<IbdQuestionData[]> {
  const all = await getAllIbdQuestions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
