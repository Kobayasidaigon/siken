// 分野ページの「要点」(src/content/field-guides/<資格>/<分野slug>.md)と、資格トップの「勉強の進め方」
// (src/content/exam-intros/<資格>.md)の書式の検査。2026-11-10 追加。
// どちらも AdSense の再審査に向けて足した、そのページにしかない本文。公式資料で確かめた事実だけを書き、
// 最後に出典と確認日を添える約束なので、出典の欄が欠けたり、更新日が日付型に化けたりしたものをここで止める。
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const GUIDES = "src/content/field-guides";
const INTROS = "src/content/exam-intros";

function listGuides() {
  if (!fs.existsSync(GUIDES)) return [];
  const out = [];
  for (const exam of fs.readdirSync(GUIDES)) {
    const sub = path.join(GUIDES, exam);
    if (!fs.statSync(sub).isDirectory()) continue;
    for (const f of fs.readdirSync(sub).filter((f) => f.endsWith(".md"))) out.push(path.join(sub, f));
  }
  return out;
}

function listIntros() {
  if (!fs.existsSync(INTROS)) return [];
  return fs.readdirSync(INTROS).filter((f) => f.endsWith(".md")).map((f) => path.join(INTROS, f));
}

/** front matter と本文に分ける(gray-matter を使わず、テストを依存なしにする) */
function split(file) {
  const text = fs.readFileSync(file, "utf-8");
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(m, `${file}: front matter が無い`);
  return { fm: m[1], body: m[2] };
}

/** 出典の見出しより前の本文の文字数(markdown の記号・URL・空白を除く) */
function bodyChars(body) {
  const main = body.split(/^#{2,3} 出典\s*$/m)[0];
  return main
    .replace(/\]\([^)]*\)/g, "")
    .replace(/[#*\-|>[\]`]/g, "")
    .replace(/\s/g, "").length;
}

const files = [...listGuides(), ...listIntros()];

test("updatedAt を引用符つきの YYYY-MM-DD で書いている", () => {
  const bad = files.filter((f) => !/^updatedAt: "\d{4}-\d{2}-\d{2}"$/m.test(split(f).fm));
  assert.deepEqual(bad, []);
});

test("出典の欄があり、どの出典にも URL と確認日がある", () => {
  const bad = [];
  for (const f of files) {
    const { body } = split(f);
    const parts = body.split(/^#{2,3} 出典\s*$/m);
    if (parts.length !== 2) {
      bad.push(`${f}: 出典の見出しが無い(または2つ以上ある)`);
      continue;
    }
    const items = parts[1].split("\n").filter((l) => l.startsWith("- "));
    if (items.length === 0) bad.push(`${f}: 出典が1件も無い`);
    for (const l of items) {
      if (!/\]\(https:\/\/[^)\s]+\)/.test(l)) bad.push(`${f}: URL が無い出典: ${l}`);
      if (!/\d{4}年\d{1,2}月\d{1,2}日確認/.test(l)) bad.push(`${f}: 確認日が無い出典: ${l}`);
    }
  }
  assert.deepEqual(bad, []);
});

test("本文が短すぎない(要点は300字以上、勉強の進め方は500字以上)", () => {
  const bad = [];
  for (const f of listGuides()) if (bodyChars(split(f).body) < 300) bad.push(f);
  for (const f of listIntros()) if (bodyChars(split(f).body) < 500) bad.push(f);
  assert.deepEqual(bad, []);
});

test("「編集部」や、試験について言い切る宣伝の言葉を使っていない", () => {
  const bad = [];
  for (const f of files) {
    const { body } = split(f);
    for (const w of ["編集部", "必ず出る", "絶対に", "確実に合格", "最強", "完全攻略"]) {
      if (body.includes(w)) bad.push(`${f}: ${w}`);
    }
  }
  assert.deepEqual(bad, []);
});

test("本文のコラムへのリンク先がある", () => {
  const bad = [];
  for (const f of files) {
    for (const m of split(f).body.matchAll(/\]\(\/column\/([a-z0-9-]+)\/\)/g)) {
      if (!fs.existsSync(path.join("src/content/columns", `${m[1]}.md`))) bad.push(`${f}: /column/${m[1]}/`);
    }
  }
  assert.deepEqual(bad, []);
});

test("本文の分野ページへのリンク先がある", () => {
  const bad = [];
  for (const f of files) {
    for (const m of split(f).body.matchAll(/\]\(\/([a-z0-9]+)\/field\/([a-z0-9-]+)\/\)/g)) {
      const page = fs.readFileSync(path.join("src/app", m[1], "page.tsx"), "utf-8");
      if (!page.includes(`slug: "${m[2]}"`)) bad.push(`${f}: /${m[1]}/field/${m[2]}/`);
    }
  }
  assert.deepEqual(bad, []);
});

test("勉強の進め方の本文がある資格は、トップでその本文を出している", () => {
  const bad = [];
  for (const f of listIntros()) {
    const exam = path.basename(f, ".md");
    const page = path.join("src/app", exam, "page.tsx");
    if (!fs.existsSync(page) || !fs.readFileSync(page, "utf-8").includes(`<ExamIntro exam="${exam}" />`)) bad.push(exam);
  }
  assert.deepEqual(bad, []);
});
