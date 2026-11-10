import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import { ColumnData } from "./types";

const COLUMNS_DIR = path.join(process.cwd(), "src/content/columns");

export function getAllColumnSlugs(): string[] {
  if (!fs.existsSync(COLUMNS_DIR)) return [];
  return fs
    .readdirSync(COLUMNS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export async function getColumn(slug: string): Promise<ColumnData | null> {
  const filePath = path.join(COLUMNS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const processed = await remark().use(remarkGfm).use(html, { sanitize: false }).process(content);

  return {
    slug,
    title: data.title || "",
    description: data.description || "",
    publishedAt: data.publishedAt || "",
    updatedAt: data.updatedAt || "",
    content: decorateAffiliateLinks(processed.toString()),
  };
}

/**
 * markdown本文内のアフィリエイトリンク(もしも経由の楽天リンク等)に、
 * 規約・SEO要件の rel="nofollow sponsored" と target="_blank" を自動付与する。
 * remark-html はmd内リンクに属性を付けられないため、生成後のHTMLを後処理する。
 * 対象は af.moshimo.com / px.a8.net のみ(内部リンク・公式リンクには触れない)。
 */
function decorateAffiliateLinks(htmlStr: string): string {
  return htmlStr.replace(
    /<a href="(https?:\/\/(?:af\.moshimo\.com|px\.a8\.net)\/[^"]*)">/g,
    '<a href="$1" target="_blank" rel="nofollow sponsored noopener noreferrer">'
  );
}

/**
 * コラムの中でいちばん新しい更新日(なければ公開日)。YYYY-MM-DD。トップの「記事の最終更新」に出す。2026-11-10 追加。
 * 以前のトップは new Date() の月を「最終更新」と出していて、1時間ごとの作り直し(ISR)のたびに今月になっていた。
 * 中身を実際に直した日だけを出すため、front matter の日付だけを読む(本文の変換はしない)。
 */
export function getLatestColumnDate(): string {
  let latest = "";
  for (const slug of getAllColumnSlugs()) {
    const { data } = matter(fs.readFileSync(path.join(COLUMNS_DIR, `${slug}.md`), "utf-8"));
    const d = String(data.updatedAt || data.publishedAt || "");
    if (/^\d{4}-\d{2}-\d{2}$/.test(d) && d > latest) latest = d;
  }
  return latest;
}

export async function getAllColumns(): Promise<ColumnData[]> {
  const slugs = getAllColumnSlugs();
  const columns = await Promise.all(slugs.map(getColumn));
  return columns
    .filter((c): c is ColumnData => c !== null)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
