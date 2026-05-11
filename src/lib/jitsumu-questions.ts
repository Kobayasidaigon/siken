import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const JITSUMU_DIR = path.join(process.cwd(), "src/content/jitsumu");

export interface JitsumuQuestionData {
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

export function getAllJitsumuSlugs(): string[] {
  if (!fs.existsSync(JITSUMU_DIR)) return [];
  return fs.readdirSync(JITSUMU_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getJitsumuQuestion(slug: string): Promise<JitsumuQuestionData | null> {
  const filePath = path.join(JITSUMU_DIR, `${slug}.md`);
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

let _allCache: JitsumuQuestionData[] | null = null;
export async function getAllJitsumuQuestions(): Promise<JitsumuQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllJitsumuSlugs();
  const questions = await Promise.all(slugs.map(getJitsumuQuestion));
  _allCache = questions.filter((q): q is JitsumuQuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getJitsumuQuestionsByField(field: string): Promise<JitsumuQuestionData[]> {
  const all = await getAllJitsumuQuestions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
