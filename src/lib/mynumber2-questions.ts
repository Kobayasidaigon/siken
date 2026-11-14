/**
 * マイナンバー実務検定2級（mynumber2）の問題データ読み込み。
 * wlc-questions.ts と同じ構造。src/content/mynumber2/*.md が唯一の出典。
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const MYNUMBER2_DIR = path.join(process.cwd(), "src/content/mynumber2");

export interface Mynumber2QuestionData {
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

export function getAllMynumber2Slugs(): string[] {
  if (!fs.existsSync(MYNUMBER2_DIR)) return [];
  return fs.readdirSync(MYNUMBER2_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getMynumber2Question(slug: string): Promise<Mynumber2QuestionData | null> {
  const filePath = path.join(MYNUMBER2_DIR, `${slug}.md`);
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

let _allCache: Mynumber2QuestionData[] | null = null;
export async function getAllMynumber2Questions(): Promise<Mynumber2QuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllMynumber2Slugs();
  const questions = await Promise.all(slugs.map(getMynumber2Question));
  _allCache = questions.filter((q): q is Mynumber2QuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getMynumber2QuestionsByField(field: string): Promise<Mynumber2QuestionData[]> {
  const all = await getAllMynumber2Questions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
