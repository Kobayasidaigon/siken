import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const TOUHAN_DIR = path.join(process.cwd(), "src/content/touhan");

export interface TouhanQuestionData {
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

export function getAllTouhanSlugs(): string[] {
  if (!fs.existsSync(TOUHAN_DIR)) return [];
  return fs.readdirSync(TOUHAN_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getTouhanQuestion(slug: string): Promise<TouhanQuestionData | null> {
  const filePath = path.join(TOUHAN_DIR, `${slug}.md`);
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

let _allCache: TouhanQuestionData[] | null = null;
export async function getAllTouhanQuestions(): Promise<TouhanQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllTouhanSlugs();
  const questions = await Promise.all(slugs.map(getTouhanQuestion));
  _allCache = questions.filter((q): q is TouhanQuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getTouhanQuestionsByField(field: string): Promise<TouhanQuestionData[]> {
  const all = await getAllTouhanQuestions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
