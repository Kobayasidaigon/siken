// sitemap(public/sitemap.xml)に noindex のページが混ざっていないかの検査。2026-11-10 追加。
// AdSense の再審査に向けて、そのページにしかない文章がほとんど無い一覧・入口のページを noindex にした。
// noindex の URL を sitemap で送ると Search Console が警告し、検索に出したいページの判断もぶれるので、
// 1) コミットした sitemap に noindex の型の URL が無いこと(scripts/generate-sitemap.js の除外)と、
// 2) ページ側のソースに noindex の指定が残っていること、の両方をここで止める。
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const xml = fs.readFileSync("public/sitemap.xml", "utf-8");
const urls = [...xml.matchAll(/<loc>https:\/\/shikakumon\.com([^<]*)<\/loc>/g)].map((m) => m[1]);

test("sitemap が読める", () => {
  assert.ok(urls.length > 100, `URL が ${urls.length} 件しかない`);
});

test("問題ページ・腕試しテスト・論点まとめ・問題一覧・特商法ページが入っていない", () => {
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

// ページ側の noindex の指定(2)。sitemap から外したページの noindex を誤って消すと、
// 「sitemap には無いが検索には出る薄いページ」に戻るので、ソースの文字列で確かめる。
function read(p) {
  return fs.readFileSync(p, "utf-8");
}

test("一覧・入口のページはソースで noindex を指定している", () => {
  const files = [
    "src/app/tokushoho/page.tsx",
    "src/app/exam/page.tsx",
    "src/app/exam/[num]/page.tsx",
    "src/app/field/page.tsx",
    "src/app/topic/[slug]/page.tsx",
    "src/app/pii/topic/[slug]/page.tsx",
  ];
  for (const dir of fs.readdirSync("src/app")) {
    const mock = path.join("src/app", dir, "mock/page.tsx");
    if (fs.existsSync(mock)) files.push(mock);
  }
  assert.equal(files.filter((f) => f.endsWith("mock/page.tsx")).length, 34, "腕試しテストのページは34資格ぶん");
  const missing = files.filter((f) => !/noindex:\s*true/.test(read(f)));
  assert.deepEqual(missing, []);
});

test("分野ページは、要点の本文が無いあいだ noindex(34資格すべて)", () => {
  const templates = [["kashikin", "src/app/field/[slug]/page.tsx"]];
  for (const dir of fs.readdirSync("src/app")) {
    const t = path.join("src/app", dir, "field/[slug]/page.tsx");
    if (fs.existsSync(t)) templates.push([dir, t]);
  }
  assert.equal(templates.length, 34);
  const bad = templates
    .filter(([exam, f]) => {
      const src = read(f);
      return !src.includes(`hasFieldGuide("${exam}", slug)`) || !/noindex:\s*!guide/.test(src) || !src.includes(`<FieldGuide exam="${exam}"`);
    })
    .map(([, f]) => f);
  assert.deepEqual(bad, []);
});

test("試験カレンダーは終わった月を noindex にし、sitemap にも載せない", () => {
  assert.match(read("src/app/calendar/[ym]/page.tsx"), /noindex:\s*ended/);
  const ymJst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 7);
  const ended = urls.filter((u) => {
    const m = u.match(/^\/calendar\/(\d{4}-\d{2})\/$/);
    return m && m[1] < ymJst;
  });
  // 月の変わり目は、コミット済みの sitemap に先月が残ることがある(ビルドの照合は終わった月の差を止めない)。
  // ここでは「先月より前」が残っていないことだけを見る
  const prev = new Date(Date.now() + 9 * 3600 * 1000);
  prev.setUTCDate(1);
  prev.setUTCMonth(prev.getUTCMonth() - 1);
  const prevYm = prev.toISOString().slice(0, 7);
  assert.deepEqual(ended.filter((u) => u.slice(10, 17) < prevYm), [], "sitemap を作り直す(node scripts/generate-sitemap.js)");
});
