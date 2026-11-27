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
  /^(.+?)(?:に関する|についての)(?:次の)?記述(?:のうち|として)、?(?:その内容が)?(?:最も)?(適切な|不適切な|適切でない|正しい|誤っている)もの(?:はどれか|を1つ選びなさい)/;
/** 「Xの説明として、最も適切なものはどれか」の形。2026-11-27 追加。topic は「Xの説明」にする */
const STEM_DESC =
  /^([^。\n]{2,40}?)の(説明|特徴|記述)として、?(?:最も)?(適切な|不適切な|適切でない|正しい|誤っている)ものはどれか/;
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
  const re = /^#### 選択肢(\d)[^\n→]*→\s*(✅|❌)[^\n]*\n([\s\S]*?)(?=^#{2,4} |(?![\s\S]))/gm;
  const out = new Map<number, { mark: string; text: string }>();
  for (const m of body.matchAll(re)) out.set(Number(m[1]), { mark: m[2], text: plain(m[3]) });
  return out.size ? out : null;
}

/** 肢ごとの見出しが無い問題の、「## 解説」直下の本文 */
function leadExplain(body: string): string {
  const m = body.match(/## 解説\s*\n([\s\S]*?)(?=^### |(?![\s\S]))/m);
  return m ? plain(m[1]) : "";
}

/**
 * 肢ごとの見出しが無い問題で、「## 解説」の本文が全部の肢の正誤を番号つきで言っているか。2026-11-27 追加。
 * 例「正解は2。…1は誤り。…3は誤り。…4は誤り。」。正解の肢は「正解はN」で足りる。
 * 言っていない肢が1つでもある問題は○×にしない(「最も適切」の問題で、ほかの肢が本当に誤りかを
 * 解説で確かめられないため。分からないものは出さない)。
 */
const V_FALSE = "誤り|誤っている|誤る|不適切|適切でない|妥当でない|正しくない|該当しない";
const V_TRUE = "正しい|適切である|適切|妥当|該当する";
function leadVerifies(body: string, choiceCount: number, correct: number, negative: boolean): boolean {
  for (let n = 1; n <= choiceCount; n++) {
    const d = `[${n}${String.fromCharCode(0xff10 + n)}]`;
    const re = new RegExp(`(?:^|[。\\s（(「、]|選択肢|肢)${d}(?:は|が|も|の記述は|について(?:は)?)[、]?[^。]{0,30}?(${V_FALSE}|${V_TRUE})`, "g");
    const verdicts = [...body.matchAll(re)].map((m) => !new RegExp(`^(?:${V_FALSE})$`).test(m[1]));
    const expected = negative ? n !== correct : n === correct;
    if (verdicts.length === 0) {
      // 正解の肢は「正解はN」と書いてあればよい
      if (n === correct && new RegExp(`正解は(?:選択肢)?\\**${d}`).test(body)) continue;
      return false;
    }
    if (verdicts.some((v) => v !== expected)) return false;
  }
  return true;
}

const cache = new Map<string, OxItem[]>();

export function buildOxItems(exam: string): OxItem[] {
  const hit = cache.get(exam);
  if (hit) return hit;
  // 貸金業務取扱主任者だけ、問題の置き場所が src/content/questions(歴史的な名前)
  const dir = path.join(process.cwd(), "src/content", exam === "kashikin" ? "questions" : exam);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort() : [];
  const items: OxItem[] = [];
  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf-8"));
    const qt = String(data.questionText ?? "");
    const m1 = STEM.exec(qt);
    const m2 = m1 ? null : STEM_DESC.exec(qt);
    if (!m1 && !m2) continue;
    const topic = m1 ? m1[1].trim() : `${m2![1].trim()}の${m2![2]}`;
    const polarity = m1 ? m1[2] : m2![3];
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
    const negative = NEGATIVE.has(polarity);
    if (!per && !leadVerifies(content, choices.length, correct, negative)) continue;
    choices.forEach((statement, i) => {
      const num = i + 1;
      const isAnswer = num === correct;
      items.push({
        id: `${slug}-${num}`,
        field: String(data.field ?? ""),
        topic,
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

/** 問題ページの「○×で解く」に渡す形。○×にできない問題は null */
export type QuestionOx = { topic: string; items: { statement: string; answer: boolean }[] };

export function getQuestionOx(exam: string, slug: string): QuestionOx | null {
  const items = buildOxItems(exam).filter((i) => i.sourceSlug === slug).sort((a, b) => a.choiceNo - b.choiceNo);
  if (!items.length) return null;
  return { topic: items[0].topic, items: items.map((i) => ({ statement: i.statement, answer: i.answer })) };
}
