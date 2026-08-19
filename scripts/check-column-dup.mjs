#!/usr/bin/env node
// =============================================================================
// コラムの近似重複検出。
//
//   node scripts/check-column-dup.mjs            … 全ペアを検査(閾値超えがあれば exit 1)
//   node scripts/check-column-dup.mjs --report   … 数値だけ出して常に exit 0
//   node scripts/check-column-dup.mjs --top 20   … 類似度の高い順に20ペア表示
//
// 【なぜ必要か】
// 既存コラムは「とは / 合格率 / 勉強法 / 勉強時間 / 過去問 / 日程 / 意味ない」を
// 資格ごとに横展開した構造で、資格名を差し替えただけの記事が生まれやすい。
// 検索エンジンから見て価値の薄い量産と判定されると、増やすほど逆効果になる。
//
// 目視では気づけないので測る。日本語なので形態素解析は使わず、
// 文字3-gram の Jaccard 係数で比較する(辞書もモデルも要らず、決定的に動く)。
//
// 資格名・数値・記号は先に落とす。「◯◯の合格率は？」型の記事どうしは
// 資格名を消すと骨格の同一性が露出するため、そこを見たいから。
// =============================================================================

import fs from "node:fs";
import path from "node:path";

const REPORT_ONLY = process.argv.includes("--report");
const TOP_N = (() => {
  const i = process.argv.indexOf("--top");
  return i >= 0 ? Number(process.argv[i + 1]) || 20 : 20;
})();

// 閾値: これを超えるペアは「作り分けができていない」とみなす。
// 既存93本の実測分布をもとに決めた値(scripts/prompts/ronten-column.md に経緯)。
const LIMIT = 0.45;

const COLUMNS_DIR = path.join(process.cwd(), "src/content/columns");

/** 資格名など、差し替えれば同じになる語を落として骨格だけ残す。 */
const EXAM_WORDS = [
  "貸金業務取扱主任者", "貸金業務", "貸金業", "個人情報保護実務検定", "個人情報保護士",
  "知的財産管理技能検定", "知財検定", "知財", "マイナンバー実務検定", "マイナンバー",
  "ビジネス実務法務検定", "ビジ法", "ビジネスマネジャー検定", "ビジマネ",
  "福祉住環境コーディネーター", "福祉住環境", "eco検定", "環境社会検定試験",
  "シカクモン", "1級", "2級", "3級",
];

function normalize(text) {
  let t = text;
  for (const w of EXAM_WORDS) t = t.split(w).join("");
  return t
    .replace(/^---[\s\S]*?---/, "")        // frontmatter
    .replace(/\|[^\n]*\|/g, "")            // 表(数値の羅列で類似度が跳ねるため落とす)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // リンクはテキストだけ残す
    .replace(/[0-9０-９]/g, "")             // 数値
    .replace(/[#*>`\-\s、。「」（）()【】：:・|]/g, "")
    .trim();
}

/** 文字3-gram の集合。 */
function grams(s, n = 3) {
  const out = new Set();
  for (let i = 0; i + n <= s.length; i++) out.add(s.slice(i, i + n));
  return out;
}

function jaccard(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const g of a) if (b.has(g)) inter++;
  return inter / (a.size + b.size - inter);
}

const files = fs.existsSync(COLUMNS_DIR)
  ? fs.readdirSync(COLUMNS_DIR).filter((f) => f.endsWith(".md")).sort()
  : [];

const docs = files.map((f) => {
  const raw = fs.readFileSync(path.join(COLUMNS_DIR, f), "utf-8");
  return { slug: f.replace(/\.md$/, ""), grams: grams(normalize(raw)) };
});

const pairs = [];
for (let i = 0; i < docs.length; i++) {
  for (let j = i + 1; j < docs.length; j++) {
    pairs.push({ a: docs[i].slug, b: docs[j].slug, sim: jaccard(docs[i].grams, docs[j].grams) });
  }
}
pairs.sort((x, y) => y.sim - x.sim);

const over = pairs.filter((p) => p.sim > LIMIT);

console.log(`コラム ${docs.length} 本 / ${pairs.length} ペアを比較 (文字3-gram Jaccard)`);
if (pairs.length) {
  const sims = pairs.map((p) => p.sim).sort((a, b) => a - b);
  const q = (r) => sims[Math.floor((sims.length - 1) * r)].toFixed(3);
  console.log(`中央値 ${q(0.5)} / 90パーセンタイル ${q(0.9)} / 99パーセンタイル ${q(0.99)} / 最大 ${sims[sims.length - 1].toFixed(3)}`);
}
console.log(`\n類似度 上位${TOP_N}ペア:`);
for (const p of pairs.slice(0, TOP_N)) {
  const mark = p.sim > LIMIT ? "NG" : "  ";
  console.log(`  ${mark} ${p.sim.toFixed(3)}  ${p.a}  ×  ${p.b}`);
}

console.log(`\n閾値 ${LIMIT} 超え: ${over.length} ペア`);
if (over.length && !REPORT_ONLY) {
  console.error("\n作り分けができていないコラムがあります。骨格ではなく中身で差をつけてください。");
  process.exit(1);
}
