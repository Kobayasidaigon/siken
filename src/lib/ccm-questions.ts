/**
 * 企業危機・コンプライアンス管理士認定試験（ccm）の問題データ読み込み。
 * itpass-questions.ts と同じ構造。src/content/ccm/*.md が唯一の出典。
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const CCM_DIR = path.join(process.cwd(), "src/content/ccm");

export interface CcmQuestionData {
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

export function getAllCcmSlugs(): string[] {
  if (!fs.existsSync(CCM_DIR)) return [];
  return fs.readdirSync(CCM_DIR).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
}

export async function getCcmQuestion(slug: string): Promise<CcmQuestionData | null> {
  const filePath = path.join(CCM_DIR, `${slug}.md`);
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

let _allCache: CcmQuestionData[] | null = null;
export async function getAllCcmQuestions(): Promise<CcmQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllCcmSlugs();
  const questions = await Promise.all(slugs.map(getCcmQuestion));
  _allCache = questions.filter((q): q is CcmQuestionData => q !== null).sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getCcmQuestionsByField(field: string): Promise<CcmQuestionData[]> {
  const all = await getAllCcmQuestions();
  return all.filter((q) => q.field === field).sort((a, b) => a.questionNumber - b.questionNumber);
}
