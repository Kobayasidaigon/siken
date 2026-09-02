import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const KANGYO_DIR = path.join(process.cwd(), "src/content/kangyo");

export interface KangyoQuestionData {
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

export function getAllKangyoSlugs(): string[] {
  if (!fs.existsSync(KANGYO_DIR)) return [];
  return fs.readdirSync(KANGYO_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getKangyoQuestion(slug: string): Promise<KangyoQuestionData | null> {
  const filePath = path.join(KANGYO_DIR, `${slug}.md`);
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

let _allCache: KangyoQuestionData[] | null = null;
export async function getAllKangyoQuestions(): Promise<KangyoQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllKangyoSlugs();
  const questions = await Promise.all(slugs.map(getKangyoQuestion));
  _allCache = questions.filter((q): q is KangyoQuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getKangyoQuestionsByField(field: string): Promise<KangyoQuestionData[]> {
  const all = await getAllKangyoQuestions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
