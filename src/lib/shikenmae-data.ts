/**
 * 「試験前の10問」の問題の読み込み(サーバー側だけ)。lib/shikenmae.ts の説明を参照。
 * 対象の資格を増やすときは LOADERS に足す。
 */
import fs from "fs";
import path from "path";
import { getChintaiQuestion } from "./chintai-questions";
import { getKangyoQuestion } from "./kangyo-questions";
import { getChizaiQuestion } from "./chizai-questions";
import { dateKey, SHIKENMAE_SIZE, type ShikenmaeEvent } from "./shikenmae";

export interface ShikenmaeQuestion {
  slug: string;
  questionNumber: number;
  field: string;
  questionText: string;
  choices: string[];
  correctAnswer: number;
  /** 解説の HTML(問題ページと同じもの) */
  explanationHtml: string;
}

type Loader = (slug: string) => Promise<{
  questionNumber: number;
  field: string;
  questionText: string;
  choices: string[];
  correctAnswer: number;
  content: string;
} | null>;

const LOADERS: Record<string, Loader> = {
  chintai: getChintaiQuestion,
  kangyo: getKangyoQuestion,
  chizai: getChizaiQuestion,
};

/** 10問のセット(slug の配列)。無ければ null */
export function shikenmaeSlugs(e: ShikenmaeEvent): string[] | null {
  const file = path.join(process.cwd(), "src/data/shikenmae", `${e.exam}-${dateKey(e.date)}.json`);
  if (!fs.existsSync(file)) return null;
  const slugs = JSON.parse(fs.readFileSync(file, "utf-8"));
  return Array.isArray(slugs) && slugs.length === SHIKENMAE_SIZE ? slugs : null;
}

export async function getShikenmaeQuestions(e: ShikenmaeEvent): Promise<ShikenmaeQuestion[] | null> {
  const slugs = shikenmaeSlugs(e);
  const load = LOADERS[e.exam];
  if (!slugs || !load) return null;
  const qs = await Promise.all(slugs.map((s) => load(s)));
  if (qs.some((q) => !q)) return null;
  return qs.map((q, i) => ({
    slug: slugs[i],
    questionNumber: q!.questionNumber,
    field: q!.field,
    questionText: q!.questionText,
    choices: q!.choices,
    correctAnswer: q!.correctAnswer,
    explanationHtml: q!.content,
  }));
}

/**
 * 分野名 → 分野ページの URL。分野の対応は各資格の分野ページ(src/app/<資格>/field/[slug]/page.tsx の fieldMap)にしか
 * 無く、ページのファイルからは名前付きで書き出せないので、ビルド時にファイルを読んで取り出す。取り出せなければ空。
 */
export function shikenmaeFieldHrefs(exam: string): Record<string, string> {
  const file = path.join(process.cwd(), "src/app", exam, "field/[slug]/page.tsx");
  if (!fs.existsSync(file)) return {};
  const src = fs.readFileSync(file, "utf-8");
  const out: Record<string, string> = {};
  for (const m of src.matchAll(/"([a-z0-9-]+)":\s*\{\s*name:\s*"([^"]+)"/g)) out[m[2]] = `/${exam}/field/${m[1]}/`;
  return out;
}
