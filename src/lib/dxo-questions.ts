/**
 * DXオフィサー認定試験（dxo）の問題データ読み込み。
 * itpass-questions.ts と同じ構造。src/content/dxo/*.md が唯一の出典。
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const DXO_DIR = path.join(process.cwd(), "src/content/dxo");

export interface DxoQuestionData {
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

export function getAllDxoSlugs(): string[] {
  if (!fs.existsSync(DXO_DIR)) return [];
  return fs.readdirSync(DXO_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getDxoQuestion(slug: string): Promise<DxoQuestionData | null> {
  const filePath = path.join(DXO_DIR, `${slug}.md`);
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

let _allCache: DxoQuestionData[] | null = null;
export async function getAllDxoQuestions(): Promise<DxoQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllDxoSlugs();
  const questions = await Promise.all(slugs.map(getDxoQuestion));
  _allCache = questions.filter((q): q is DxoQuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getDxoQuestionsByField(field: string): Promise<DxoQuestionData[]> {
  const all = await getAllDxoQuestions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
