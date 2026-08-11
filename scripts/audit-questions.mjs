#!/usr/bin/env node
// =============================================================================
// 問題データの機械監査。prebuild で実行し、閾値を超えたらビルドを落とす。
//
//   node scripts/audit-questions.mjs          … 監査(違反があれば exit 1)
//   node scripts/audit-questions.mjs --report … 数値だけ出して常に exit 0
//
// 【なぜ必要か】
// 2026-08 に、AI生成した問題へ人もAIも気づけない系統的な欠陥が3種類見つかった。
//   - 正解が全問1番目に固定されていた(305問)
//   - 正解肢だけが極端に長く「長い方を選べば当たる」状態(3サイト計1,900問超)
//   - 解説が選択肢の位置に言及し、シャッフルすると破綻する(396問)
// いずれも「読んでも気づけず、測って初めて分かる」種類のもの。だから目視や
// レビューではなく、ビルドを止める検査として常設する。
//
// 本体シカクモンは選択肢をシャッフルせず、解説が「選択肢N→❌」形式を前提とする
// ため、位置言及は違反として扱わない(正解位置と長さの偏りだけを見る)。
// =============================================================================

import fs from "node:fs";
import path from "node:path";

const REPORT_ONLY = process.argv.includes("--report");

// ---- 閾値(超えたらビルドを落とす) -------------------------------------------
const LIMITS = {
  // 正解肢が「次に長い肢」より何文字以上長いものを是正対象とみなすか
  GAP_CHARS: 20,
  // 是正対象が全体の何%を超えたら違反とするか
  GAP_RATIO_PCT: 2,
  // 正解位置が1箇所に偏ってよい上限(%)。4択の理論値は25%
  ANSWER_POS_PCT: 45,
  // 設問文の重複件数の上限
  DUP_MAX: 0,
};

function readMarkdownQuestions(root) {
  const items = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name !== "columns") walk(p);
        continue;
      }
      if (!e.name.endsWith(".md")) continue;
      const src = fs.readFileSync(p, "utf8");
      const fm = src.match(/^---\n([\s\S]*?)\n---/);
      if (!fm) continue;
      const y = fm[1];
      const q = (y.match(/questionText: "((?:[^"\\]|\\.)*)"/) || [])[1];
      const ca = (y.match(/correctAnswer: (\d+)/) || [])[1];
      if (!q || !ca) continue;
      const cm = y.match(/choices:\n([\s\S]*?)(?:\n[a-zA-Z]|$)/);
      const choices = cm
        ? [...cm[1].matchAll(/^\s*- "((?:[^"\\]|\\.)*)"/gm)].map((m) => m[1])
        : [];
      items.push({ id: path.relative(root, p), q, choices, answer: Number(ca) - 1 });
    }
  };
  walk(root);
  return items;
}

const items = readMarkdownQuestions("src/content");
if (!items.length) {
  console.error("audit-questions: 問題が1件も読めなかった(パス誤り?)");
  process.exit(1);
}

const violations = [];
const pos = [0, 0, 0, 0, 0];
let longest = 0;
const overGap = [];
const seen = new Map();
const dups = [];
let shape = 0;

for (const it of items) {
  const { choices: ch, answer: a } = it;
  if (!Array.isArray(ch) || ch.length < 2 || !(a >= 0 && a < ch.length)) {
    shape++;
    continue;
  }
  if (a < pos.length) pos[a]++;
  const lens = ch.map((c) => String(c).length);
  if (lens[a] === Math.max(...lens)) {
    longest++;
    const gap = lens[a] - Math.max(...lens.filter((_, i) => i !== a));
    if (gap >= LIMITS.GAP_CHARS) overGap.push({ id: it.id, gap });
  }
  const key = String(it.q).replace(/[（）()「」、。・,.\s]/g, "");
  if (seen.has(key)) dups.push(`${it.id} ⇔ ${seen.get(key)}`);
  else seen.set(key, it.id);
}

const n = items.length;
const pct = (x) => Math.round((x / n) * 1000) / 10;
const maxPos = Math.max(...pos);
const maxPosPct = pct(maxPos);
const gapPct = pct(overGap.length);

console.log(`\n[問題監査] ${n}問`);
console.log(`  最長肢=正解        : ${longest}問 (${pct(longest)}%)  ※4択の理論値25%`);
console.log(`  正解肢が${LIMITS.GAP_CHARS}字以上長い: ${overGap.length}問 (${gapPct}%)  [上限 ${LIMITS.GAP_RATIO_PCT}%]`);
console.log(`  正解位置の最大偏り : ${maxPosPct}%  [上限 ${LIMITS.ANSWER_POS_PCT}%]`);
console.log(`  設問文の重複       : ${dups.length}件  [上限 ${LIMITS.DUP_MAX}件]`);
if (shape) console.log(`  形式不正           : ${shape}件`);

if (shape > 0) violations.push(`形式不正が${shape}件`);
if (gapPct > LIMITS.GAP_RATIO_PCT)
  violations.push(`正解肢が${LIMITS.GAP_CHARS}字以上長い問題が${overGap.length}問(${gapPct}%) — 上限${LIMITS.GAP_RATIO_PCT}%`);
if (maxPosPct > LIMITS.ANSWER_POS_PCT)
  violations.push(`正解位置が${maxPosPct}%に偏っている — 上限${LIMITS.ANSWER_POS_PCT}%`);
if (dups.length > LIMITS.DUP_MAX)
  violations.push(`設問文の重複が${dups.length}件 — 上限${LIMITS.DUP_MAX}件`);

if (violations.length) {
  console.log("\n違反:");
  violations.forEach((v) => console.log("  - " + v));
  if (overGap.length) {
    console.log(`\n  差が大きい上位5件:`);
    overGap.sort((a, b) => b.gap - a.gap).slice(0, 5).forEach((o) => console.log(`    ${o.id} (+${o.gap}字)`));
  }
  if (dups.length) {
    console.log(`\n  重複の例(先頭5件):`);
    dups.slice(0, 5).forEach((d) => console.log("    " + d));
  }
}

if (REPORT_ONLY) process.exit(0);
if (violations.length) {
  console.error("\naudit-questions: 違反があるためビルドを中止します");
  console.error("(閾値の見直しが妥当な場合は scripts/audit-questions.mjs の LIMITS を変更してください)\n");
  process.exit(1);
}
console.log("  → 監査OK\n");
