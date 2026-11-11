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
  // 正解が「ただ1つの」最長の選択肢である割合の上限(%)。4択の理論値は25%前後。
  // 同じ長さの肢が並ぶ場合(「a 正 b 誤 …」の組合せ問題など)は長さが手がかりにならないので数えない。
  // 2026-11-11 に協会6資格を直して全体25.2%。悪化させない歯止めで、問題を直すたびに下げていく(ラチェット)。
  LONGEST_PCT: 26,
  // 資格ごとの上限(%)。1資格だけ偏っていても全体の割合には表れにくいので別に見る。
  // 2026-11-11 時点の最大は bijihou の37.5%。
  LONGEST_EXAM_PCT: 37.5,
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
      const rel = path.relative(root, p);
      items.push({ id: rel, exam: path.dirname(rel), q, choices, answer: Number(ca) - 1 });
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
const byExam = {};
let shape = 0;

for (const it of items) {
  const { choices: ch, answer: a } = it;
  if (!Array.isArray(ch) || ch.length < 2 || !(a >= 0 && a < ch.length)) {
    shape++;
    continue;
  }
  if (a < pos.length) pos[a]++;
  const lens = ch.map((c) => String(c).length);
  const ex = (byExam[it.exam] ??= { n: 0, longest: 0 });
  ex.n++;
  const gap = lens[a] - Math.max(...lens.filter((_, i) => i !== a));
  if (gap > 0) {
    longest++;
    ex.longest++;
    if (gap >= LIMITS.GAP_CHARS) overGap.push({ id: it.id, gap });
  }
  // 資格が違えば同じ設問文でも問題ない(同一利用者が両方を見ることはない)。
  // 同じ資格の中での重複だけを違反とする。試験はディレクトリで分かれている。
  const key = it.exam + "\u0000" + String(it.q).replace(/[（）()「」、。・,.\s]/g, "");
  if (seen.has(key)) dups.push(`${it.id} ⇔ ${seen.get(key)}`);
  else seen.set(key, it.id);
}

const n = items.length;
const pct = (x) => Math.round((x / n) * 1000) / 10;
const examRate = (v) => Math.round((v.longest / v.n) * 1000) / 10;
const maxPos = Math.max(...pos);
const maxPosPct = pct(maxPos);
const gapPct = pct(overGap.length);

console.log(`\n[問題監査] ${n}問`);
console.log(`  最長肢=正解        : ${longest}問 (${pct(longest)}%)  [上限 ${LIMITS.LONGEST_PCT}%] ※4択の理論値25%前後、同じ長さの肢がある問題は数えない`);
console.log(`  正解肢が${LIMITS.GAP_CHARS}字以上長い: ${overGap.length}問 (${gapPct}%)  [上限 ${LIMITS.GAP_RATIO_PCT}%]`);
console.log(`  正解位置の最大偏り : ${maxPosPct}%  [上限 ${LIMITS.ANSWER_POS_PCT}%]`);
console.log(`  設問文の重複(同資格内): ${dups.length}件  [上限 ${LIMITS.DUP_MAX}件]`);
if (shape) console.log(`  形式不正           : ${shape}件`);
if (process.argv.includes("--by-exam")) {
  console.log("\n  資格別の 最長肢=正解 の割合(高い順):");
  Object.entries(byExam)
    .map(([k, v]) => [k, v.n, examRate(v)])
    .sort((a, b) => b[2] - a[2])
    .forEach(([k, n, r]) => console.log(`    ${String(k).padEnd(12)} ${String(r).padStart(5)}%  (${n}問)`));
}

if (shape > 0) violations.push(`形式不正が${shape}件`);
if (gapPct > LIMITS.GAP_RATIO_PCT)
  violations.push(`正解肢が${LIMITS.GAP_CHARS}字以上長い問題が${overGap.length}問(${gapPct}%) — 上限${LIMITS.GAP_RATIO_PCT}%`);
if (maxPosPct > LIMITS.ANSWER_POS_PCT)
  violations.push(`正解位置が${maxPosPct}%に偏っている — 上限${LIMITS.ANSWER_POS_PCT}%`);
if (pct(longest) > LIMITS.LONGEST_PCT)
  violations.push(`正解=最長肢が${pct(longest)}% — 上限${LIMITS.LONGEST_PCT}%(長さで当たる問題を増やさないこと)`);
for (const [k, v] of Object.entries(byExam)) {
  if (v.n >= 50 && examRate(v) > LIMITS.LONGEST_EXAM_PCT)
    violations.push(`${k} の正解=最長肢が${examRate(v)}% — 資格ごとの上限${LIMITS.LONGEST_EXAM_PCT}%`);
}
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
