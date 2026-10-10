/**
 * ハラスメントアドバイザー認定試験（had）の問題データ読み込み。
 * itpass-questions.ts と同じ構造。src/content/had/*.md が唯一の出典。
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const HAD_DIR = path.join(process.cwd(), "src/content/had");

export interface HadQuestionData {
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

export function getAllHadSlugs(): string[] {
  if (!fs.existsSync(HAD_DIR)) return [];
  return fs.readdirSync(HAD_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getHadQuestion(slug: string): Promise<HadQuestionData | null> {
  const filePath = path.join(HAD_DIR, `${slug}.md`);
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

let _allCache: HadQuestionData[] | null = null;
export async function getAllHadQuestions(): Promise<HadQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllHadSlugs();
  const questions = await Promise.all(slugs.map(getHadQuestion));
  _allCache = questions.filter((q): q is HadQuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getHadQuestionsByField(field: string): Promise<HadQuestionData[]> {
  const all = await getAllHadQuestions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
