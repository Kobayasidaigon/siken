import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { OxItem } from "./question-format";

/**
 * 今の4択の問題を、選択肢ごとの○×問題に分ける。2026-11-23 追加。
 *
 * 「〜に関する記述として、最も適切なものはどれか」の4択は、正解の肢が正しい記述(○)、
 * ほかの3肢が誤った記述(×)になる。「最も不適切なもの」「適切でないもの」「誤っているもの」は逆。
 * 解説で1肢ずつ確かめてある問題から作るので、新しく事実を書き足すことはしない。
 *
 * 安全のため、次のどれかに当たる問題は使わない:
 * - 問題文が「〜に関する(次の)記述のうち/として、…ものはどれか」の形でない
 *   (組合せ・計算・穴埋め・事例・「該当しないもの」など、肢だけでは意味が通らないもの)
 * - 肢ごとの解説(#### 選択肢N → ✅/❌)があるのに、✅ が正解番号の肢1つだけになっていない
 * - 肢が短すぎる(12文字未満。語句だけの肢は記述にならない)、または「上記」「いずれも」など
 *   ほかの肢を前提にした肢がある
 */

const STEM =
  /^(.+?)(?:に関する|についての)(?:次の)?記述(?:のうち|として)、?(?:最も)?(適切な|不適切な|適切でない|正しい|誤っている)ものはどれか/;
const NEGATIVE = new Set(["不適切な", "適切でない", "誤っている"]);
const DEPENDENT_CHOICE = /上記|いずれも|すべて正し|全て正し/;

/** 解説の Markdown を、画面に出す素の文章にする */
function plain(md: string): string {
  return md
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "・")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

/** 肢ごとの解説を取り出す。肢ごとの見出しが無い問題は null */
function perChoiceExplain(body: string): Map<number, { mark: string; text: string }> | null {
  const re = /^#### 選択肢(\d)\s*→\s*(✅|❌)[^\n]*\n([\s\S]*?)(?=^#{2,4} |(?![\s\S]))/gm;
  const out = new Map<number, { mark: string; text: string }>();
  for (const m of body.matchAll(re)) out.set(Number(m[1]), { mark: m[2], text: plain(m[3]) });
  return out.size ? out : null;
}

/** 肢ごとの見出しが無い問題の、「## 解説」直下の本文 */
function leadExplain(body: string): string {
  const m = body.match(/## 解説\s*\n([\s\S]*?)(?=^### |(?![\s\S]))/m);
  return m ? plain(m[1]) : "";
}

const cache = new Map<string, OxItem[]>();

export function buildOxItems(exam: string): OxItem[] {
  const hit = cache.get(exam);
  if (hit) return hit;
  const dir = path.join(process.cwd(), "src/content", exam);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort() : [];
  const items: OxItem[] = [];
  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf-8"));
    const m = STEM.exec(String(data.questionText ?? ""));
    if (!m) continue;
    const choices: string[] = Array.isArray(data.choices) ? data.choices.map(String) : [];
    const correct = Number(data.correctAnswer);
    if (choices.length < 2 || !(correct >= 1 && correct <= choices.length)) continue;
    if (choices.some((c) => c.length < 12 || DEPENDENT_CHOICE.test(c))) continue;
    const per = perChoiceExplain(content);
    if (per) {
      const marked = [...per].filter(([, v]) => v.mark === "✅").map(([k]) => k);
      if (marked.length !== 1 || marked[0] !== correct) continue;
      if (per.size !== choices.length) continue;
    }
    const lead = per ? "" : leadExplain(content);
    if (!per && !lead) continue;
    const negative = NEGATIVE.has(m[2]);
    choices.forEach((statement, i) => {
      const num = i + 1;
      const isAnswer = num === correct;
      items.push({
        id: `${slug}-${num}`,
        field: String(data.field ?? ""),
        topic: m[1].trim(),
        statement: statement.trim(),
        answer: negative ? !isAnswer : isAnswer,
        explain: per ? per.get(num)!.text : lead,
        sourceSlug: slug,
        choiceNo: num,
        sharedExplain: !per,
      });
    });
  }
  cache.set(exam, items);
  return items;
}
