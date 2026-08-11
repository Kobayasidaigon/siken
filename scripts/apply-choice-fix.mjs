#!/usr/bin/env node
// =============================================================================
// 選択肢の書き換え結果を問題マークダウンへ適用する。
//
//   node scripts/apply-choice-fix.mjs <fixed-*.json のあるディレクトリ>
//
// 「正解肢だけが極端に長い」状態を是正するために誤答肢を肉付けした結果を、
// フロントマターの choices: へ差し戻す。安全側に倒すため、次の条件を満たすもの
// だけを適用する:
//   - site が "siken" で、ファイルが存在する
//   - 選択肢が4つあり、互いに重複せず、空でない
//   - correctAnswer(1始まり) が入力の answer(0始まり) と一致する
//   - その位置の文字列(正解肢)が元と完全一致している
//     ＝ 正解肢が書き換えられていない。正解が変わる事故を機械的に防ぐ
//   - 選択肢の順序が保たれている(本体は解説が「選択肢N→❌」形式で位置を参照する
//     ため、順序が変わると解説が破綻する。正解肢の位置一致で担保する)
// =============================================================================

import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2];
if (!dir) {
  console.error("使い方: node scripts/apply-choice-fix.mjs <fixed-*.json のあるディレクトリ>");
  process.exit(1);
}

const ROOT = "src/content";
const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const unesc = (s) => s.replace(/\\"/g, '"').replace(/\\\\/g, "\\");

const stats = { input: 0, applied: 0, skipMissing: 0, skipAnswerChanged: 0, skipShape: 0, skipNoop: 0 };
const rejected = [];

for (const f of fs.readdirSync(dir).filter((f) => /^fixed-\d+\.json$/.test(f)).sort()) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  for (const r of data.results ?? []) {
    if (r.site !== "siken") continue;
    stats.input++;

    const file = path.join(ROOT, r.id);
    if (!fs.existsSync(file)) { stats.skipMissing++; rejected.push(`${r.id}: ファイルが無い`); continue; }

    if (!Array.isArray(r.choices) || r.choices.length !== 4 ||
        r.choices.some((c) => typeof c !== "string" || !c.trim()) ||
        new Set(r.choices).size !== 4) {
      stats.skipShape++; rejected.push(`${r.id}: 選択肢の形式不正`); continue;
    }

    const src = fs.readFileSync(file, "utf8");
    const fm = src.match(/^---\n([\s\S]*?)\n---/);
    if (!fm) { stats.skipShape++; rejected.push(`${r.id}: フロントマターが読めない`); continue; }

    const cm = fm[1].match(/choices:\n((?:\s*- "(?:[^"\\]|\\.)*"\n?)+)/);
    const ca = (fm[1].match(/correctAnswer: (\d+)/) || [])[1];
    if (!cm || !ca) { stats.skipShape++; rejected.push(`${r.id}: choices/correctAnswer が読めない`); continue; }

    const orig = [...cm[1].matchAll(/^\s*- "((?:[^"\\]|\\.)*)"/gm)].map((m) => unesc(m[1]));
    const answer = Number(ca) - 1;
    if (orig.length !== 4) { stats.skipShape++; rejected.push(`${r.id}: 元の選択肢が4つでない`); continue; }

    if (Number(r.answer) !== answer) {
      stats.skipAnswerChanged++; rejected.push(`${r.id}: answerが元と違う`); continue;
    }
    // 正解肢そのものが書き換えられていないことを保証する
    if (r.choices[answer] !== orig[answer]) {
      stats.skipAnswerChanged++; rejected.push(`${r.id}: 正解肢の本文が書き換えられている`); continue;
    }
    if (r.choices.every((c, i) => c === orig[i])) { stats.skipNoop++; continue; }

    const block = "choices:\n" + r.choices.map((c) => `  - "${esc(c)}"`).join("\n") + "\n";
    const newFm = fm[1].slice(0, cm.index) + block + fm[1].slice(cm.index + cm[0].length);
    fs.writeFileSync(file, `---\n${newFm}\n---` + src.slice(fm[0].length));
    stats.applied++;
  }
}

console.log("=== 適用結果(本体シカクモン) ===");
console.log(`入力:${stats.input}件 → 適用:${stats.applied}件`);
console.log(`除外 → ファイル無し:${stats.skipMissing} / 正解が変わる:${stats.skipAnswerChanged} / 形式不正:${stats.skipShape} / 変更なし:${stats.skipNoop}`);
if (rejected.length) {
  console.log("--- 除外の内訳(先頭10件) ---");
  rejected.slice(0, 10).forEach((r) => console.log("  " + r));
}
