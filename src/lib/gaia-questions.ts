import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const GAIA_DIR = path.join(process.cwd(), "src/content/gaia");

export interface GaiaQuestionData {
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

export function getAllGaiaSlugs(): string[] {
  if (!fs.existsSync(GAIA_DIR)) return [];
  return fs.readdirSync(GAIA_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getGaiaQuestion(slug: string): Promise<GaiaQuestionData | null> {
  const filePath = path.join(GAIA_DIR, `${slug}.md`);
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

let _allCache: GaiaQuestionData[] | null = null;
export async function getAllGaiaQuestions(): Promise<GaiaQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllGaiaSlugs();
  const questions = await Promise.all(slugs.map(getGaiaQuestion));
  _allCache = questions.filter((q): q is GaiaQuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getGaiaQuestionsByField(field: string): Promise<GaiaQuestionData[]> {
  const all = await getAllGaiaQuestions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
