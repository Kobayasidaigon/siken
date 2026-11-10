// sitemap(public/sitemap.xml)に noindex のページが混ざっていないかの検査。2026-11-10 追加。
// AdSense の再審査に向けて、そのページにしかない文章がほとんど無い一覧・入口のページを noindex にした。
// noindex の URL を sitemap で送ると Search Console が警告し、検索に出したいページの判断もぶれるので、
// scripts/generate-sitemap.js の除外と、ページ側の noindex がずれていないかをここで止める。
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const xml = fs.readFileSync("public/sitemap.xml", "utf-8");
const urls = [...xml.matchAll(/<loc>https:\/\/shikakumon\.com([^<]*)<\/loc>/g)].map((m) => m[1]);

test("sitemap が読める", () => {
  assert.ok(urls.length > 100, `URL が ${urls.length} 件しかない`);
});

test("問題ページ・本番形式テスト・論点まとめ・問題一覧・特商法ページが入っていない", () => {
  const bad = urls.filter(
    (u) =>
      /^\/(?:[a-z0-9]+\/)?q\//.test(u) ||
      /^\/(?:[a-z0-9]+\/)?mock\/$/.test(u) ||
      /^\/(?:pii\/)?topic\//.test(u) ||
      u === "/exam/" ||
      /^\/exam\/\d+\/$/.test(u) ||
      u === "/field/" ||
      u === "/tokushoho/"
  );
  assert.deepEqual(bad, []);
});

test("分野ページは要点の本文(src/content/field-guides/)があるものだけ", () => {
  const missing = [];
  for (const u of urls) {
    const m = u.match(/^\/(?:([a-z0-9]+)\/)?field\/([a-z0-9-]+)\/$/);
    if (!m) continue;
    const exam = m[1] || "kashikin";
    if (!fs.existsSync(path.join("src/content/field-guides", exam, `${m[2]}.md`))) missing.push(u);
  }
  assert.deepEqual(missing, []);
});

test("要点の本文がある分野ページは sitemap に入っている", () => {
  const dir = "src/content/field-guides";
  if (!fs.existsSync(dir)) return;
  const expected = [];
  for (const exam of fs.readdirSync(dir)) {
    const sub = path.join(dir, exam);
    if (!fs.statSync(sub).isDirectory()) continue;
    for (const f of fs.readdirSync(sub).filter((f) => f.endsWith(".md"))) {
      const slug = f.replace(/\.md$/, "");
      expected.push(exam === "kashikin" ? `/field/${slug}/` : `/${exam}/field/${slug}/`);
    }
  }
  const absent = expected.filter((u) => !urls.includes(u));
  assert.deepEqual(absent, [], "sitemap を作り直す(node scripts/generate-sitemap.js)");
});
