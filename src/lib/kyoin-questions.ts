/**
 * 教員採用試験・教職教養（kyoin）の問題データ読み込み。
 * itpass-questions.ts と同じ構造。src/content/kyoin/*.md が唯一の出典。
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const KYOIN_DIR = path.join(process.cwd(), "src/content/kyoin");

export interface KyoinQuestionData {
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

export function getAllKyoinSlugs(): string[] {
  if (!fs.existsSync(KYOIN_DIR)) return [];
  return fs.readdirSync(KYOIN_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getKyoinQuestion(slug: string): Promise<KyoinQuestionData | null> {
  const filePath = path.join(KYOIN_DIR, `${slug}.md`);
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

let _allCache: KyoinQuestionData[] | null = null;
export async function getAllKyoinQuestions(): Promise<KyoinQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllKyoinSlugs();
  const questions = await Promise.all(slugs.map(getKyoinQuestion));
  _allCache = questions.filter((q): q is KyoinQuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getKyoinQuestionsByField(field: string): Promise<KyoinQuestionData[]> {
  const all = await getAllKyoinQuestions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
