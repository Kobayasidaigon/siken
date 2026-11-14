/**
 * マイナンバー実務検定1級（mynumber1）の問題データ読み込み。
 * wlc-questions.ts と同じ構造。src/content/mynumber1/*.md が唯一の出典。
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const MYNUMBER1_DIR = path.join(process.cwd(), "src/content/mynumber1");

export interface Mynumber1QuestionData {
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

export function getAllMynumber1Slugs(): string[] {
  if (!fs.existsSync(MYNUMBER1_DIR)) return [];
  return fs.readdirSync(MYNUMBER1_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getMynumber1Question(slug: string): Promise<Mynumber1QuestionData | null> {
  const filePath = path.join(MYNUMBER1_DIR, `${slug}.md`);
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

let _allCache: Mynumber1QuestionData[] | null = null;
export async function getAllMynumber1Questions(): Promise<Mynumber1QuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllMynumber1Slugs();
  const questions = await Promise.all(slugs.map(getMynumber1Question));
  _allCache = questions.filter((q): q is Mynumber1QuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getMynumber1QuestionsByField(field: string): Promise<Mynumber1QuestionData[]> {
  const all = await getAllMynumber1Questions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
