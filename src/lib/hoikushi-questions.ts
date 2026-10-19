import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const HOIKUSHI_DIR = path.join(process.cwd(), "src/content/hoikushi");

export interface HoikushiQuestionData {
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

export function getAllHoikushiSlugs(): string[] {
  if (!fs.existsSync(HOIKUSHI_DIR)) return [];
  return fs.readdirSync(HOIKUSHI_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getHoikushiQuestion(slug: string): Promise<HoikushiQuestionData | null> {
  const filePath = path.join(HOIKUSHI_DIR, `${slug}.md`);
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

let _allCache: HoikushiQuestionData[] | null = null;
export async function getAllHoikushiQuestions(): Promise<HoikushiQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllHoikushiSlugs();
  const questions = await Promise.all(slugs.map(getHoikushiQuestion));
  _allCache = questions.filter((q): q is HoikushiQuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getHoikushiQuestionsByField(field: string): Promise<HoikushiQuestionData[]> {
  const all = await getAllHoikushiQuestions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
