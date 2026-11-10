import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

/**
 * 分野ページの「要点」本文(src/content/field-guides/<資格>/<分野slug>.md)。2026-11-10 追加。
 *
 * 背景: AdSense の審査で「有用性の低いコンテンツ」とされた。分野ページは説明1行と
 * 問題へのリンク一覧だけで、そのページにしかない文章がほとんど無かった。
 * そこで、分野ごとに要点・ひっかけ・覚え方を書いたものだけを検索に出し、
 * 本文が無い分野ページは noindex にして sitemap からも外す(scripts/generate-sitemap.js が同じファイルの有無を見る)。
 *
 * 貸金業務取扱主任者の分野ページは /field/<slug>/ だが、ファイルは field-guides/kashikin/<slug>.md に置く。
 * 本文を足すときは、問題データにある事実と公式資料で確かめた事実だけを書き、出典と確認日を本文の最後に添えること。
 */

const GUIDES_DIR = path.join(process.cwd(), "src/content/field-guides");

export interface FieldGuide {
  /** 本文の HTML(markdown から変換) */
  html: string;
  /** 最後に中身を見直した日(YYYY-MM-DD)。front matter の updatedAt */
  updatedAt: string;
}

function guidePath(exam: string, slug: string): string {
  return path.join(GUIDES_DIR, exam, `${slug}.md`);
}

/** その分野ページに要点の本文があるか。メタデータ(noindex の判定)で使う */
export function hasFieldGuide(exam: string, slug: string): boolean {
  return fs.existsSync(guidePath(exam, slug));
}

export async function getFieldGuide(exam: string, slug: string): Promise<FieldGuide | null> {
  const p = guidePath(exam, slug);
  if (!fs.existsSync(p)) return null;
  const { data, content } = matter(fs.readFileSync(p, "utf-8"));
  const processed = await remark().use(remarkGfm).use(html, { sanitize: false }).process(content);
  // updatedAt は引用符つきの文字列で書く。引用符なしだと YAML が日付型に変えるので、その場合も YYYY-MM-DD に戻す
  const u = data.updatedAt;
  const updatedAt = typeof u === "string" ? u : u instanceof Date ? u.toISOString().slice(0, 10) : "";
  return { html: processed.toString(), updatedAt };
}
