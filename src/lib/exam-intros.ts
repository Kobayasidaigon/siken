import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

/**
 * 資格トップの「勉強の進め方」本文(src/content/exam-intros/<資格>.md)。2026-11-10 追加。
 *
 * 背景: AdSense の審査で「有用性の低いコンテンツ」とされた。東商5資格(ビジ法3級・2級、ビジマネ、eco、福祉住環境2級)の
 * トップは、分野へのリンクと「試験の概要」の表が中心で、そのページにしかない文章が少なかった。
 * そこで、試験の範囲と分野の対応・勉強の順番・取り違えやすい点を、公式資料で確かめて書いたものをトップに出す。
 *
 * 本文を足すときは、公式資料で確かめた事実だけを書き、出典と確認日を本文の最後に添えること。
 * 問題数のように変わる数字は書かない(トップの表示はデータから数えている)。
 * ファイルを置くと scripts/generate-sitemap.js がそのトップの lastmod に本文の更新日を使う。
 */

const INTROS_DIR = path.join(process.cwd(), "src/content/exam-intros");

export interface ExamIntro {
  /** 本文の HTML(markdown から変換) */
  html: string;
  /** 最後に中身を見直した日(YYYY-MM-DD)。front matter の updatedAt */
  updatedAt: string;
}

export async function getExamIntro(exam: string): Promise<ExamIntro | null> {
  const p = path.join(INTROS_DIR, `${exam}.md`);
  if (!fs.existsSync(p)) return null;
  const { data, content } = matter(fs.readFileSync(p, "utf-8"));
  const processed = await remark().use(remarkGfm).use(html, { sanitize: false }).process(content);
  // updatedAt は引用符つきの文字列で書く。引用符なしだと YAML が日付型に変えるので、その場合も YYYY-MM-DD に戻す
  const u = data.updatedAt;
  const updatedAt = typeof u === "string" ? u : u instanceof Date ? u.toISOString().slice(0, 10) : "";
  return { html: processed.toString(), updatedAt };
}
