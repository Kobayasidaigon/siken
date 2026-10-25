#!/usr/bin/env node
/**
 * 「試験前の10問」のセットの点検(prebuild)。2026-10-25 追加。lib/shikenmae.ts を参照。
 *   - イベントごとに、10問のセット(src/data/shikenmae/<資格>-<YYYYMMDD>.json)が 10問・重複なし・実在の問題か。
 *   - 窓が開いているのにセットが無ければ、ビルドを止める。
 *   - 14日以内に窓が開くのにセットが無ければ、警告だけ(関係のない修正のデプロイを止めないため)。
 */
import fs from "fs";
import path from "path";

const root = process.cwd();
const events = JSON.parse(fs.readFileSync(path.join(root, "src/data/shikenmae/events.json"), "utf-8"));
const today = new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10);
const addDays = (ymd, n) => {
  const d = new Date(`${ymd}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

let errors = 0;
for (const e of events) {
  const key = e.date.replace(/-/g, "");
  const file = path.join(root, "src/data/shikenmae", `${e.exam}-${key}.json`);
  const start = addDays(e.date, -7);
  const open = today >= start && today <= e.date;
  if (!fs.existsSync(file)) {
    if (open) {
      console.error(`shikenmae: ${e.exam} ${e.date} は窓が開いているのにセットが無い: ${path.relative(root, file)}`);
      errors++;
    } else if (today < start && addDays(today, 14) >= start) {
      console.warn(`shikenmae: 警告 ${e.exam} ${e.date} の窓が ${start} に開くが、セットがまだ無い`);
    }
    continue;
  }
  const slugs = JSON.parse(fs.readFileSync(file, "utf-8"));
  const problems = [];
  if (!Array.isArray(slugs) || slugs.length !== 10) problems.push(`10問でない(${Array.isArray(slugs) ? slugs.length : "配列でない"})`);
  else {
    if (new Set(slugs).size !== slugs.length) problems.push("重複がある");
    for (const s of slugs) {
      if (!fs.existsSync(path.join(root, "src/content", e.exam, `${s}.md`))) problems.push(`問題が無い: ${s}`);
    }
  }
  if (problems.length) {
    console.error(`shikenmae: ${e.exam} ${e.date}: ${problems.join(" / ")}`);
    errors++;
  }
}
if (errors) process.exit(1);
console.log(`shikenmae: ${events.length} 件のイベントを点検しました`);
