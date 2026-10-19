import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const DXA_DIR = path.join(process.cwd(), "src/content/dxa");

export interface DxaQuestionData {
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

export function getAllDxaSlugs(): string[] {
  if (!fs.existsSync(DXA_DIR)) return [];
  return fs.readdirSync(DXA_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getDxaQuestion(slug: string): Promise<DxaQuestionData | null> {
  const filePath = path.join(DXA_DIR, `${slug}.md`);
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

let _allCache: DxaQuestionData[] | null = null;
export async function getAllDxaQuestions(): Promise<DxaQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllDxaSlugs();
  const questions = await Promise.all(slugs.map(getDxaQuestion));
  _allCache = questions.filter((q): q is DxaQuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getDxaQuestionsByField(field: string): Promise<DxaQuestionData[]> {
  const all = await getAllDxaQuestions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
