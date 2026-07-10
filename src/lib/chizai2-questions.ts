import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const CHIZAI2_DIR = path.join(process.cwd(), "src/content/chizai2");

export interface Chizai2QuestionData {
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

export function getAllChizai2Slugs(): string[] {
  if (!fs.existsSync(CHIZAI2_DIR)) return [];
  return fs
    .readdirSync(CHIZAI2_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export async function getChizai2Question(slug: string): Promise<Chizai2QuestionData | null> {
  const filePath = path.join(CHIZAI2_DIR, `${slug}.md`);
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

let _allCache: Chizai2QuestionData[] | null = null;
export async function getAllChizai2Questions(): Promise<Chizai2QuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllChizai2Slugs();
  const questions = await Promise.all(slugs.map(getChizai2Question));
  _allCache = questions
    .filter((q): q is Chizai2QuestionData => q !== null)
    .sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getChizai2QuestionsByField(field: string): Promise<Chizai2QuestionData[]> {
  const all = await getAllChizai2Questions();
  return all
    .filter((q) => q.field === field)
    .sort((a, b) => a.questionNumber - b.questionNumber);
}

export function getChizai2Fields(): string[] {
  return ["特許法", "著作権法", "意匠法", "商標法", "不正競争防止法", "関連法規", "実用新案法・種苗法", "国際条約", "知財実務"];
}
