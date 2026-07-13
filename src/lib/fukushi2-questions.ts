import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const FUKUSHI2_DIR = path.join(process.cwd(), "src/content/fukushi2");

export interface Fukushi2QuestionData {
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

export function getAllFukushi2Slugs(): string[] {
  if (!fs.existsSync(FUKUSHI2_DIR)) return [];
  return fs
    .readdirSync(FUKUSHI2_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export async function getFukushi2Question(slug: string): Promise<Fukushi2QuestionData | null> {
  const filePath = path.join(FUKUSHI2_DIR, `${slug}.md`);
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

let _allCache: Fukushi2QuestionData[] | null = null;
export async function getAllFukushi2Questions(): Promise<Fukushi2QuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllFukushi2Slugs();
  const questions = await Promise.all(slugs.map(getFukushi2Question));
  _allCache = questions
    .filter((q): q is Fukushi2QuestionData => q !== null)
    .sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getFukushi2QuestionsByField(field: string): Promise<Fukushi2QuestionData[]> {
  const all = await getAllFukushi2Questions();
  return all
    .filter((q) => q.field === field)
    .sort((a, b) => a.questionNumber - b.questionNumber);
}

export function getFukushi2Fields(): string[] {
  return ["高齢社会と住環境整備", "相談援助と連携", "障害とリハビリテーション", "疾患・障害別の特性", "住環境整備の基本技術", "場所別の住環境整備", "福祉用具", "介護保険と住宅改修", "関連法制度・施策"];
}
