import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const BIJIHOU_DIR = path.join(process.cwd(), "src/content/bijihou");

export interface BijihouQuestionData {
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

export function getAllBijihouSlugs(): string[] {
  if (!fs.existsSync(BIJIHOU_DIR)) return [];
  return fs.readdirSync(BIJIHOU_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getBijihouQuestion(slug: string): Promise<BijihouQuestionData | null> {
  const filePath = path.join(BIJIHOU_DIR, `${slug}.md`);
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

let _allCache: BijihouQuestionData[] | null = null;
export async function getAllBijihouQuestions(): Promise<BijihouQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllBijihouSlugs();
  const questions = await Promise.all(slugs.map(getBijihouQuestion));
  _allCache = questions.filter((q): q is BijihouQuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getBijihouQuestionsByField(field: string): Promise<BijihouQuestionData[]> {
  const all = await getAllBijihouQuestions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
