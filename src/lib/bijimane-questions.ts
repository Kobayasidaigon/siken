import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const BIJIMANE_DIR = path.join(process.cwd(), "src/content/bijimane");

export interface BijimaneQuestionData {
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

export function getAllBijimaneSlugs(): string[] {
  if (!fs.existsSync(BIJIMANE_DIR)) return [];
  return fs
    .readdirSync(BIJIMANE_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export async function getBijimaneQuestion(slug: string): Promise<BijimaneQuestionData | null> {
  const filePath = path.join(BIJIMANE_DIR, `${slug}.md`);
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

let _allCache: BijimaneQuestionData[] | null = null;
export async function getAllBijimaneQuestions(): Promise<BijimaneQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllBijimaneSlugs();
  const questions = await Promise.all(slugs.map(getBijimaneQuestion));
  _allCache = questions
    .filter((q): q is BijimaneQuestionData => q !== null)
    .sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getBijimaneQuestionsByField(field: string): Promise<BijimaneQuestionData[]> {
  const all = await getAllBijimaneQuestions();
  return all
    .filter((q) => q.field === field)
    .sort((a, b) => a.questionNumber - b.questionNumber);
}
