import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const MYNUMBER_DIR = path.join(process.cwd(), "src/content/mynumber");

export interface MynumberQuestionData {
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

export function getAllMynumberSlugs(): string[] {
  if (!fs.existsSync(MYNUMBER_DIR)) return [];
  return fs
    .readdirSync(MYNUMBER_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export async function getMynumberQuestion(slug: string): Promise<MynumberQuestionData | null> {
  const filePath = path.join(MYNUMBER_DIR, `${slug}.md`);
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

export async function getAllMynumberQuestions(): Promise<MynumberQuestionData[]> {
  const slugs = getAllMynumberSlugs();
  const questions = await Promise.all(slugs.map(getMynumberQuestion));
  return questions
    .filter((q): q is MynumberQuestionData => q !== null)
    .sort((a, b) => a.questionNumber - b.questionNumber);
}

export async function getMynumberQuestionsByField(field: string): Promise<MynumberQuestionData[]> {
  const all = await getAllMynumberQuestions();
  return all
    .filter((q) => q.field === field)
    .sort((a, b) => a.questionNumber - b.questionNumber);
}

export function getMynumberFields(): string[] {
  return ["番号法の概要", "個人番号カード・利用", "特定個人情報保護", "事業者の取扱い", "法人番号・罰則・実務"];
}
