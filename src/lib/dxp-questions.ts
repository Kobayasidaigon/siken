/**
 * DXパスポート試験（dxp）の問題データ読み込み。
 * itpass-questions.ts と同じ構造。src/content/dxp/*.md が唯一の出典。
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const DXP_DIR = path.join(process.cwd(), "src/content/dxp");

export interface DxpQuestionData {
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

export function getAllDxpSlugs(): string[] {
  if (!fs.existsSync(DXP_DIR)) return [];
  return fs.readdirSync(DXP_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getDxpQuestion(slug: string): Promise<DxpQuestionData | null> {
  const filePath = path.join(DXP_DIR, `${slug}.md`);
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

let _allCache: DxpQuestionData[] | null = null;
export async function getAllDxpQuestions(): Promise<DxpQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllDxpSlugs();
  const questions = await Promise.all(slugs.map(getDxpQuestion));
  _allCache = questions.filter((q): q is DxpQuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getDxpQuestionsByField(field: string): Promise<DxpQuestionData[]> {
  const all = await getAllDxpQuestions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
