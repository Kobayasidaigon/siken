import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const CHINTAI_DIR = path.join(process.cwd(), "src/content/chintai");

export interface ChintaiQuestionData {
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

export function getAllChintaiSlugs(): string[] {
  if (!fs.existsSync(CHINTAI_DIR)) return [];
  return fs.readdirSync(CHINTAI_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getChintaiQuestion(slug: string): Promise<ChintaiQuestionData | null> {
  const filePath = path.join(CHINTAI_DIR, `${slug}.md`);
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

let _allCache: ChintaiQuestionData[] | null = null;
export async function getAllChintaiQuestions(): Promise<ChintaiQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllChintaiSlugs();
  const questions = await Promise.all(slugs.map(getChintaiQuestion));
  _allCache = questions.filter((q): q is ChintaiQuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getChintaiQuestionsByField(field: string): Promise<ChintaiQuestionData[]> {
  const all = await getAllChintaiQuestions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
