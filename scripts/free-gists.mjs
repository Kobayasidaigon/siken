#!/usr/bin/env node
// 無料問題集の「正解として確定している事実」を分野ごとに一覧する。
// 第2回を書くときに、すでに無料で答えが出ている論点を避けるための下調べ用。
//   node scripts/free-gists.mjs <certId> [分野名 ...]
import fs from "node:fs";
import path from "node:path";
const [cert, ...fields] = process.argv.slice(2);
const dir = path.join("src/content", cert === "kashikin" ? "questions" : cert);
const rows = [];
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md"))) {
  const src = fs.readFileSync(path.join(dir, f), "utf8");
  const fd = (src.match(/^field:\s*"?([^"\n]+?)"?\s*$/m) || [])[1] ?? "";
  const ca = Number((src.match(/^correctAnswer:\s*(\d)/m) || [])[1]);
  const cm = src.match(/^choices:\n([\s\S]*?)^correctAnswer:/m);
  const chs = cm ? [...cm[1].matchAll(/^\s*-\s*"([\s\S]*?)"\s*$/gm)].map((m) => m[1]) : [];
  if (!chs[ca - 1]) continue;
  if (fields.length && !fields.includes(fd)) continue;
  rows.push({ fd, slug: f.replace(/\.md$/, ""), ans: chs[ca - 1].replace(/。$/, "") });
}
rows.sort((a, b) => a.fd.localeCompare(b.fd) || a.slug.localeCompare(b.slug));
let cur = "";
for (const r of rows) {
  if (r.fd !== cur) { cur = r.fd; console.log(`\n## ${cur}`); }
  console.log(`- ${r.ans.slice(0, 58)}`);
}
