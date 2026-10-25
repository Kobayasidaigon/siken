#!/usr/bin/env node
/**
 * 「試験前の10問」の候補を選ぶ。2026-10-25 追加(docs/share-campaign-design.md の MVP)。
 *
 *   node scripts/make-shikenmae-set.mjs chintai 2026-11-15          # 候補を表示するだけ
 *   node scripts/make-shikenmae-set.mjs chintai 2026-11-15 --write  # src/data/shikenmae/chintai-20261115.json に書く
 *
 * 選び方:
 *   - 分野の問題数に比例して10問を割り当てる(10分野の資格なら各分野1問)。
 *   - 各分野で難易度Bを優先し、足りなければA→Cから補う。
 *   - 模擬試験(第1回・第2回)に出る問題は外す(模試の結果と重ならないように)。
 *   - 分野の中では、資格と試験日から決まる位置で選ぶ(同じ引数なら毎回同じ結果)。
 *   - 並びは問題番号順(分野の並びもそれに従う)。
 * 運営が問題文と解説を読んで確定してから --write する。確定したセットは公開後に変えない。
 */
import fs from "fs";
import path from "path";

const [exam, date, flag] = process.argv.slice(2);
if (!exam || !/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) {
  console.error("usage: node scripts/make-shikenmae-set.mjs <exam> <YYYY-MM-DD> [--write]");
  process.exit(1);
}

const root = process.cwd();
const dir = path.join(root, "src/content", exam);
if (!fs.existsSync(dir)) {
  console.error(`問題のディレクトリが無い: ${dir}`);
  process.exit(1);
}

function front(text, key) {
  const m = text.match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, "m"));
  return m ? m[1] : "";
}

const questions = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => {
    const t = fs.readFileSync(path.join(dir, f), "utf-8");
    return {
      slug: f.replace(/\.md$/, ""),
      n: Number(front(t, "questionNumber")) || 0,
      field: front(t, "field"),
      difficulty: front(t, "difficulty") || "B",
      text: front(t, "questionText"),
    };
  })
  .sort((a, b) => a.n - b.n);

// 模試に出る問題(lib/<exam>-moshi*.ts の slug)を外す
const moshiSlugs = new Set();
for (const f of fs.readdirSync(path.join(root, "src/lib"))) {
  if (!f.startsWith(`${exam}-moshi`)) continue;
  const t = fs.readFileSync(path.join(root, "src/lib", f), "utf-8");
  for (const m of t.matchAll(new RegExp(`"(${exam}-\\d+)"`, "g"))) moshiSlugs.add(m[1]);
}

const fields = [];
for (const q of questions) if (!fields.includes(q.field)) fields.push(q.field);

// 分野の問題数に比例して割り当てる(最大剰余法)
const SIZE = 10;
const counts = fields.map((f) => questions.filter((q) => q.field === f).length);
const total = counts.reduce((a, b) => a + b, 0);
const quota = counts.map((c) => Math.floor((c * SIZE) / total));
const rest = counts
  .map((c, i) => ({ i, r: (c * SIZE) / total - quota[i] }))
  .sort((a, b) => b.r - a.r);
for (let k = 0; quota.reduce((a, b) => a + b, 0) < SIZE; k++) quota[rest[k % rest.length].i]++;

// 資格と試験日から決まる数(同じ引数なら同じ結果)
let seed = 0;
for (const ch of `${exam}/${date}`) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;

const picked = [];
fields.forEach((f, fi) => {
  const pool = questions.filter((q) => q.field === f && !moshiSlugs.has(q.slug));
  const ordered = ["B", "A", "C"].flatMap((d) => pool.filter((q) => q.difficulty === d));
  const start = ordered.length ? (seed + fi * 7) % Math.max(1, ordered.filter((q) => q.difficulty === "B").length || ordered.length) : 0;
  const rotated = [...ordered.slice(start), ...ordered.slice(0, start)];
  picked.push(...rotated.slice(0, quota[fi]));
});
picked.sort((a, b) => a.n - b.n);

if (picked.length !== SIZE) {
  console.error(`10問そろわない(${picked.length}問)`);
  process.exit(1);
}

console.log(`${exam} ${date} の候補（模試の問題 ${moshiSlugs.size} 件を除外）`);
for (const q of picked) console.log(`  ${q.slug}  問${q.n}  ${q.difficulty}  ${q.field}｜${q.text.slice(0, 50)}`);

if (flag === "--write") {
  const out = path.join(root, "src/data/shikenmae", `${exam}-${date.replace(/-/g, "")}.json`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(picked.map((q) => q.slug), null, 2) + "\n");
  console.log(`書き出した: ${path.relative(root, out)}`);
}
