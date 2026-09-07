/**
 * 合格報告(利用者からの受験報告)の読み込み。2026-09-05 追加。
 *
 * 【この仕組みの前提 — 絶対に守ること】
 * 掲載するのは **実在の投稿だけ**。それらしい文章を作って並べるのは景品表示法の
 * ステマ規制違反であり、このサイトの「事実の正確性」という前提も壊す。
 * 投稿は /goukaku-houkoku/ のフォーム → /api/pass-report → 運営宛メール、という
 * 経路でしか集まらない。ここ(src/content/voices/*.md)にファイルを作れるのは、
 * 運営者が実際に届いた報告を読んで、掲載可の同意があるものだけを書き写したとき。
 *
 * ファイルが1件も無い間は、一覧ページも資格トップの欄も何も描画しない
 * (columns と同じ読み方だが、0件のときの扱いだけが違う)。
 *
 * frontmatter:
 *   exam        資格ID(ExamSlug)。必須
 *   examPeriod  受験時期。"2026年11月" のように年月まで(日は書かない=個人特定を避ける)。必須
 *   result      "pass" | "fail"。必須
 *   displayName 表示名。省略時は「匿名」
 *   studyPeriod 学習期間。"3か月" など。任意
 *   score       自己申告のスコア。"50問中38点" など。任意
 *   publishedAt 掲載日 "YYYY-MM-DD"。必須(新しい順に並べる)
 *   verified    運営が本人に確認の返信をもらえたか。任意(表示の注記が変わる)
 * 本文: 投稿者のコメント(markdown)
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import type { ExamSlug } from "./study-progress";

const VOICES_DIR = path.join(process.cwd(), "src/content/voices");

export interface Voice {
  slug: string;
  exam: ExamSlug;
  examPeriod: string;
  result: "pass" | "fail";
  displayName: string;
  studyPeriod?: string;
  score?: string;
  publishedAt: string;
  verified: boolean;
  /** コメント本文(HTML) */
  content: string;
}

function getAllSlugs(): string[] {
  if (!fs.existsSync(VOICES_DIR)) return [];
  return fs
    .readdirSync(VOICES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

async function readVoice(slug: string): Promise<Voice | null> {
  const filePath = path.join(VOICES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const { data, content } = matter(fs.readFileSync(filePath, "utf-8"));
  // 必須項目が欠けている下書きは読み飛ばす(中途半端な状態で公開されないように)
  if (!data.exam || !data.examPeriod || !data.result || !data.publishedAt) return null;

  const processed = await remark().use(remarkGfm).use(html, { sanitize: false }).process(content);

  return {
    slug,
    exam: data.exam as ExamSlug,
    examPeriod: String(data.examPeriod),
    result: data.result === "fail" ? "fail" : "pass",
    displayName: data.displayName ? String(data.displayName) : "匿名",
    studyPeriod: data.studyPeriod ? String(data.studyPeriod) : undefined,
    score: data.score ? String(data.score) : undefined,
    publishedAt: String(data.publishedAt),
    verified: data.verified === true,
    content: processed.toString(),
  };
}

/** 掲載済みの合格報告を新しい順に返す。1件も無ければ空配列 */
export async function getAllVoices(): Promise<Voice[]> {
  const voices = await Promise.all(getAllSlugs().map(readVoice));
  return voices
    .filter((v): v is Voice => v !== null)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** その資格の合格報告だけを新しい順に返す */
export async function getVoicesByExam(exam: ExamSlug): Promise<Voice[]> {
  return (await getAllVoices()).filter((v) => v.exam === exam);
}

/** 掲載済みの報告が1件でもあるか(一覧ページを sitemap に載せるかの判定にも使う) */
export function hasVoices(): boolean {
  return getAllSlugs().length > 0;
}
