/**
 * 福祉住環境コーディネーター検定試験® 3級（fukushi3）の問題データ読み込み。
 * wlc-questions.ts と同じ構造。src/content/fukushi3/*.md が唯一の出典。
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const FUKUSHI3_DIR = path.join(process.cwd(), "src/content/fukushi3");

export interface Fukushi3QuestionData {
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

export function getAllFukushi3Slugs(): string[] {
  if (!fs.existsSync(FUKUSHI3_DIR)) return [];
  return fs.readdirSync(FUKUSHI3_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getFukushi3Question(slug: string): Promise<Fukushi3QuestionData | null> {
  const filePath = path.join(FUKUSHI3_DIR, `${slug}.md`);
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

let _allCache: Fukushi3QuestionData[] | null = null;
export async function getAllFukushi3Questions(): Promise<Fukushi3QuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllFukushi3Slugs();
  const questions = await Promise.all(slugs.map(getFukushi3Question));
  _allCache = questions.filter((q): q is Fukushi3QuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getFukushi3QuestionsByField(field: string): Promise<Fukushi3QuestionData[]> {
  const all = await getAllFukushi3Questions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
