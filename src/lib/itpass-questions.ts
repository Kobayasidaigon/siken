import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const ITPASS_DIR = path.join(process.cwd(), "src/content/itpass");

export interface ItpassQuestionData {
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

export function getAllItpassSlugs(): string[] {
  if (!fs.existsSync(ITPASS_DIR)) return [];
  return fs.readdirSync(ITPASS_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getItpassQuestion(slug: string): Promise<ItpassQuestionData | null> {
  const filePath = path.join(ITPASS_DIR, `${slug}.md`);
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

let _allCache: ItpassQuestionData[] | null = null;
export async function getAllItpassQuestions(): Promise<ItpassQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllItpassSlugs();
  const questions = await Promise.all(slugs.map(getItpassQuestion));
  _allCache = questions.filter((q): q is ItpassQuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getItpassQuestionsByField(field: string): Promise<ItpassQuestionData[]> {
  const all = await getAllItpassQuestions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
