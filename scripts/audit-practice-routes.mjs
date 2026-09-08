#!/usr/bin/env node
// =============================================================================
// 「通しで解く面」の手書きの表と、実際のページの突き合わせ。
//
// 【なぜ要るか】
// 問題ページ(全14資格・2,866枚)から模試・本番形式テストへ出す導線は、
// src/lib/practice-routes.ts の手書きの配列を見て出している。問題ページは
// クライアントコンポーネントなので実行時に fs を触れず、ページの有無を
// その場で判定できないためにこうしている。
//
// この形は、資格を足したときに片方だけ更新すると次のどちらかを起こす:
//   表にあるがページが無い … 404 へのリンクを2,866枚に撒く
//   ページはあるが表に無い … 作った模試が誰からも見つからない
// 後者は実際に起きていて、src/components/Moshi2TopLink.tsx の冒頭に
// 事故として記録が残っている。人の注意ではなく機械で止める。
//
// sitemap(scripts/generate-sitemap.js)の staticPages も同じ顔ぶれを手書きして
// いるので、そちらの取りこぼしも併せて見る。prebuild で sitemap 生成の前に走らせ、
// ずれたまま sitemap を作らないようにしている。
//
//   node scripts/audit-practice-routes.mjs          … 監査(違反があれば exit 1)
//   node scripts/audit-practice-routes.mjs --report … 数だけ出して常に exit 0
//
// 2026-09-07 時点の正解値: mock 14 / moshi 13 / moshi2 9
// =============================================================================

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPORT_ONLY = process.argv.includes("--report");

const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf-8");

/** src/lib/study-progress.ts の ExamSlug 型から資格IDの母集団を取る */
function allExams() {
  const src = read("src/lib/study-progress.ts");
  const m = src.match(/export type ExamSlug =([^;]+);/);
  if (!m) throw new Error("ExamSlug の定義を読み取れませんでした");
  return [...m[1].matchAll(/"([a-z0-9]+)"/g)].map((x) => x[1]);
}

/** practice-routes.ts の配列リテラルから資格IDを取る */
function tableOf(constName) {
  const src = read("src/lib/practice-routes.ts");
  const i = src.indexOf(`const ${constName}: ExamSlug[] = [`);
  if (i < 0) throw new Error(`${constName} が見つかりません`);
  const body = src.slice(i, src.indexOf("];", i));
  return [...body.matchAll(/"([a-z0-9]+)"/g)].map((x) => x[1]);
}

/** moshi2 の出典は MOSHI2_PRODUCTS ひとつ(practice-routes.ts は持たない) */
function moshi2Products() {
  const src = read("src/lib/moshi2-products.ts");
  return [...src.matchAll(/^\s{4}certId: "([a-z0-9]+)",/gm)].map((x) => x[1]);
}

/** 実際に src/app/<資格>/<kind>/page.tsx があるか */
function pagesOf(kind, exams) {
  return exams.filter((e) => fs.existsSync(path.join(ROOT, `src/app/${e}/${kind}/page.tsx`)));
}

const exams = allExams();
const sitemap = read("scripts/generate-sitemap.js");
const problems = [];

const CHECKS = [
  { kind: "mock", table: tableOf("HAS_MOCK"), label: "本番形式テスト" },
  { kind: "moshi", table: tableOf("HAS_MOSHI"), label: "模擬試験 第1回" },
  { kind: "moshi2", table: moshi2Products(), label: "模擬試験 第2回(有料)", from: "moshi2-products.ts" },
];

for (const { kind, table, label, from } of CHECKS) {
  const pages = pagesOf(kind, exams);
  const src = from ?? "practice-routes.ts";

  for (const e of table) {
    if (!pages.includes(e)) {
      problems.push(`${label}: ${src} は "${e}" を挙げているが src/app/${e}/${kind}/page.tsx が無い(404へのリンクを撒く)`);
    }
  }
  for (const e of pages) {
    if (!table.includes(e)) {
      problems.push(`${label}: src/app/${e}/${kind}/page.tsx はあるが ${src} に "${e}" が無い(誰からも見つからない)`);
    }
    if (!sitemap.includes(`url: "/${e}/${kind}/"`)) {
      problems.push(`${label}: /${e}/${kind}/ が scripts/generate-sitemap.js の staticPages に無い`);
    }
  }
  console.log(`${label}: ページ ${pages.length} / 表 ${table.length}`);
}

if (problems.length === 0) {
  console.log("practice-routes: 表・ページ・sitemap は一致しています");
  process.exit(0);
}

console.error("\n--- 通しで解く面のずれ ---");
for (const p of problems) console.error(`  ${p}`);
console.error(
  "\nページを足したときは src/lib/practice-routes.ts と scripts/generate-sitemap.js の両方を更新してください。"
);
process.exit(REPORT_ONLY ? 0 : 1);
