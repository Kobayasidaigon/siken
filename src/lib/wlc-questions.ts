/**
 * ワークライフ・コーディネーター認定試験（wlc）の問題データ読み込み。
 * itpass-questions.ts と同じ構造。src/content/wlc/*.md が唯一の出典。
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const WLC_DIR = path.join(process.cwd(), "src/content/wlc");

export interface WlcQuestionData {
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

export function getAllWlcSlugs(): string[] {
  if (!fs.existsSync(WLC_DIR)) return [];
  return fs.readdirSync(WLC_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getWlcQuestion(slug: string): Promise<WlcQuestionData | null> {
  const filePath = path.join(WLC_DIR, `${slug}.md`);
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

let _allCache: WlcQuestionData[] | null = null;
export async function getAllWlcQuestions(): Promise<WlcQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllWlcSlugs();
  const questions = await Promise.all(slugs.map(getWlcQuestion));
  _allCache = questions.filter((q): q is WlcQuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getWlcQuestionsByField(field: string): Promise<WlcQuestionData[]> {
  const all = await getAllWlcQuestions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
