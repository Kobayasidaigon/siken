import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const BIJIHOU2_DIR = path.join(process.cwd(), "src/content/bijihou2");

export interface Bijihou2QuestionData {
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

export function getAllBijihou2Slugs(): string[] {
  if (!fs.existsSync(BIJIHOU2_DIR)) return [];
  return fs.readdirSync(BIJIHOU2_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getBijihou2Question(slug: string): Promise<Bijihou2QuestionData | null> {
  const filePath = path.join(BIJIHOU2_DIR, `${slug}.md`);
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

let _allCache: Bijihou2QuestionData[] | null = null;
export async function getAllBijihou2Questions(): Promise<Bijihou2QuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllBijihou2Slugs();
  const questions = await Promise.all(slugs.map(getBijihou2Question));
  _allCache = questions.filter((q): q is Bijihou2QuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getBijihou2QuestionsByField(field: string): Promise<Bijihou2QuestionData[]> {
  const all = await getAllBijihou2Questions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
