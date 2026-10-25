#!/usr/bin/env node
/**
 * 「試験前の10問」の OG 画像(1200×630)を、イベントごとに1枚作る。2026-10-25 追加。
 *   node scripts/make-shikenmae-og.mjs        # src/data/shikenmae/events.json の全イベント
 * 出力: public/og/shikenmae-<資格>-<YYYYMMDD>.png。点は入れない(点ごとの画像は作らない)。
 * 見た目は public/og-default.png に合わせる(生成り地・明朝・朱1色)。
 * Playwright と Google Fonts(Noto Serif JP / Noto Sans JP)を使う。Playwright はこのリポジトリの依存に入れていない
 * (作業環境に入っているものを使う)。画像は生成してコミットする。
 */
import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const root = process.cwd();
const events = JSON.parse(fs.readFileSync(path.join(root, "src/data/shikenmae/events.json"), "utf-8"));
const WEEK = ["日", "月", "火", "水", "木", "金", "土"];
const ja = (ymd) => {
  const d = new Date(`${ymd}T00:00:00Z`);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), w: WEEK[d.getUTCDay()] };
};
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
fs.mkdirSync(path.join(root, "public/og"), { recursive: true });
for (const e of events) {
  const t = ja(e.date);
  const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@500;700&family=Noto+Sans+JP:wght@400;500&display=block" rel="stylesheet">
<style>
  html,body{margin:0;width:1200px;height:630px;background:#f8f7f2;}
  .frame{position:absolute;inset:28px;border:2px solid #dcdbd2;}
  .bar{position:absolute;left:90px;top:120px;width:120px;height:8px;background:#c2410c;}
  .site{position:absolute;left:92px;top:66px;font:500 30px "Noto Sans JP";color:#555;letter-spacing:.08em;}
  .exam{position:absolute;left:88px;top:170px;font:700 64px "Noto Serif JP";color:#2a2925;letter-spacing:.04em;}
  .title{position:absolute;left:88px;top:262px;font:700 84px "Noto Serif JP";color:#2a2925;letter-spacing:.06em;}
  .when{position:absolute;left:92px;top:392px;font:400 32px "Noto Sans JP";color:#333;letter-spacing:.04em;}
  .foot{position:absolute;left:92px;top:510px;font:400 26px "Noto Sans JP";color:#c2410c;letter-spacing:.04em;}
</style></head><body>
<div class="frame"></div><div class="site">シカクモン</div><div class="bar"></div>
<div class="exam">${esc(e.examName)}</div>
<div class="title">試験前の10問</div>
<div class="when">${t.y}年${t.m}月${t.d}日（${t.w}）の試験の前の7日間、同じ10問を1回だけ</div>
<div class="foot">練習問題から10問・登録不要・答えと解説つき　shikakumon.com</div>
</body></html>`;
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(root, "public/og", `shikenmae-${e.exam}-${e.date.replace(/-/g, "")}.png`);
  await page.screenshot({ path: out });
  console.log("書き出した:", path.relative(root, out));
}
await browser.close();
