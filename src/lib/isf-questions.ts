/**
 * 情報・サイバーセキュリティ初級認定試験（isf）の問題データ読み込み。
 * itpass-questions.ts と同じ構造。src/content/isf/*.md が唯一の出典。
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const ISF_DIR = path.join(process.cwd(), "src/content/isf");

export interface IsfQuestionData {
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

export function getAllIsfSlugs(): string[] {
  if (!fs.existsSync(ISF_DIR)) return [];
  return fs.readdirSync(ISF_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getIsfQuestion(slug: string): Promise<IsfQuestionData | null> {
  const filePath = path.join(ISF_DIR, `${slug}.md`);
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

let _allCache: IsfQuestionData[] | null = null;
export async function getAllIsfQuestions(): Promise<IsfQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllIsfSlugs();
  const questions = await Promise.all(slugs.map(getIsfQuestion));
  _allCache = questions.filter((q): q is IsfQuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getIsfQuestionsByField(field: string): Promise<IsfQuestionData[]> {
  const all = await getAllIsfQuestions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
