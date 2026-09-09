/**
 * 社会福祉士国家試験・共通科目（shakai）の問題データ読み込み。
 * itpass-questions.ts と同じ構造。src/content/shakai/*.md が唯一の出典。
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const SHAKAI_DIR = path.join(process.cwd(), "src/content/shakai");

export interface ShakaiQuestionData {
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

export function getAllShakaiSlugs(): string[] {
  if (!fs.existsSync(SHAKAI_DIR)) return [];
  return fs.readdirSync(SHAKAI_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getShakaiQuestion(slug: string): Promise<ShakaiQuestionData | null> {
  const filePath = path.join(SHAKAI_DIR, `${slug}.md`);
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

let _allCache: ShakaiQuestionData[] | null = null;
export async function getAllShakaiQuestions(): Promise<ShakaiQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllShakaiSlugs();
  const questions = await Promise.all(slugs.map(getShakaiQuestion));
  _allCache = questions.filter((q): q is ShakaiQuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getShakaiQuestionsByField(field: string): Promise<ShakaiQuestionData[]> {
  const all = await getAllShakaiQuestions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
