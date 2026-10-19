import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const AIA_DIR = path.join(process.cwd(), "src/content/aia");

export interface AiaQuestionData {
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

export function getAllAiaSlugs(): string[] {
  if (!fs.existsSync(AIA_DIR)) return [];
  return fs.readdirSync(AIA_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getAiaQuestion(slug: string): Promise<AiaQuestionData | null> {
  const filePath = path.join(AIA_DIR, `${slug}.md`);
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

let _allCache: AiaQuestionData[] | null = null;
export async function getAllAiaQuestions(): Promise<AiaQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllAiaSlugs();
  const questions = await Promise.all(slugs.map(getAiaQuestion));
  _allCache = questions.filter((q): q is AiaQuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getAiaQuestionsByField(field: string): Promise<AiaQuestionData[]> {
  const all = await getAllAiaQuestions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
