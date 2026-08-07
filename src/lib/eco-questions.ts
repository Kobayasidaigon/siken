import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const ECO_DIR = path.join(process.cwd(), "src/content/eco");

export interface EcoQuestionData {
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

export function getAllEcoSlugs(): string[] {
  if (!fs.existsSync(ECO_DIR)) return [];
  return fs
    .readdirSync(ECO_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export async function getEcoQuestion(slug: string): Promise<EcoQuestionData | null> {
  const filePath = path.join(ECO_DIR, `${slug}.md`);
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

let _allCache: EcoQuestionData[] | null = null;
export async function getAllEcoQuestions(): Promise<EcoQuestionData[]> {
  if (_allCache) return _allCache;
  const slugs = getAllEcoSlugs();
  const questions = await Promise.all(slugs.map(getEcoQuestion));
  _allCache = questions
    .filter((q): q is EcoQuestionData => q !== null)
    .sort((a, b) => a.questionNumber - b.questionNumber);
  return _allCache;
}

export async function getEcoQuestionsByField(field: string): Promise<EcoQuestionData[]> {
  const all = await getAllEcoQuestions();
  return all
    .filter((q) => q.field === field)
    .sort((a, b) => a.questionNumber - b.questionNumber);
}

// 公式テキスト〈改訂10版〉(日本能率協会マネジメントセンター・2025年2月発行) の
// 章立てに準拠した分野区分。
// 問題番号の割当: 1=001-020 / 2=021-038 / 3=039-052 / 4=053-080 / 5=081-100 /
//                 6=101-122 / 7=123-144 / 8=145-166 / 9=167-182 / 10=183-200
export function getEcoFields(): string[] {
  return [
    "持続可能な社会と環境問題の歴史",
    "地球の基礎知識と生態系",
    "いま地球で起きていること",
    "気候変動とエネルギー",
    "生物多様性と自然共生社会",
    "循環型社会と廃棄物・3R",
    "地域の環境問題と化学物質",
    "環境政策の原則・法体系・アセスメント",
    "国際的な枠組みと条約",
    "各主体の役割(企業の環境経営・行政・市民・金融)",
  ];
}
