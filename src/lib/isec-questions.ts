/**
 * 情報・サイバーセキュリティ管理士認定試験（isec）の問題データ読み込み。
 * itpass-questions.ts と同じ構造。src/content/isec/*.md が唯一の出典。
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const ISEC_DIR = path.join(process.cwd(), "src/content/isec");

export interface IsecQuestionData {
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

export function getAllIsecSlugs(): string[] {
  if (!fs.existsSync(ISEC_DIR)) return [];
  return fs.readdirSync(ISEC_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getIsecQuestion(slug: string): Promise<IsecQuestionData | null> {
  const filePath = path.join(ISEC_DIR, `${slug}.md`);
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

let _allCache: IsecQuestionData[] | null = null;
export async function getAllIsecQuestions(): Promise<IsecQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllIsecSlugs();
  const questions = await Promise.all(slugs.map(getIsecQuestion));
  _allCache = questions.filter((q): q is IsecQuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getIsecQuestionsByField(field: string): Promise<IsecQuestionData[]> {
  const all = await getAllIsecQuestions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
