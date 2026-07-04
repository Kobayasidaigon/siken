const fs = require("fs");
const path = require("path");

// CI(Vercel)では git clone 直後で全ファイルの mtime がビルド時刻になり、
// 全URL同一の偽 lastmod を生成してしまう。CIではローカル生成してコミット済みの
// public/sitemap.xml をそのまま使う(ローカルの npm run build で常に再生成される)。
if (process.env.VERCEL || process.env.CI) {
  console.log("CI detected: using committed public/sitemap.xml as-is");
  process.exit(0);
}

const BASE_URL = "https://shikakumon.com";
const questionsDir = path.join(__dirname, "../src/content/questions");
const piiDir = path.join(__dirname, "../src/content/pii");
const chizaiDir = path.join(__dirname, "../src/content/chizai");
const mynumberDir = path.join(__dirname, "../src/content/mynumber");
const jitsumuDir = path.join(__dirname, "../src/content/jitsumu");
const bijihouDir = path.join(__dirname, "../src/content/bijihou");
const columnsDir = path.join(__dirname, "../src/content/columns");
const appDir = path.join(__dirname, "../src/app");
const outputPath = path.join(__dirname, "../public/sitemap.xml");

// lastmod はビルド日ではなく「そのページのコンテンツが実際に変わった日」を出す。
// 全URL一律の生成日を入れると Google に偽シグナルとして無視されるため。
function toDate(mtimeMs) {
  return new Date(mtimeMs).toISOString().split("T")[0];
}

function fileDate(p) {
  try {
    return toDate(fs.statSync(p).mtimeMs);
  } catch {
    return toDate(Date.now());
  }
}

// コンテンツディレクトリから {slug, lastmod} を収集
function collect(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({
      slug: f.replace(/\.md$/, ""),
      lastmod: toDate(fs.statSync(path.join(dir, f)).mtimeMs),
    }));
}

function maxDate(entries, fallback) {
  if (entries.length === 0) return fallback;
  return entries.map((e) => e.lastmod).sort().at(-1);
}

const questions = collect(questionsDir);
const pii = collect(piiDir);
const chizai = collect(chizaiDir);
const mynumber = collect(mynumberDir);
const jitsumu = collect(jitsumuDir);
const bijihou = collect(bijihouDir);
const columns = collect(columnsDir);

const todayFallback = toDate(Date.now());
const kashikinMax = maxDate(questions, todayFallback);
const piiMax = maxDate(pii, todayFallback);
const chizaiMax = maxDate(chizai, todayFallback);
const mynumberMax = maxDate(mynumber, todayFallback);
const jitsumuMax = maxDate(jitsumu, todayFallback);
const bijihouMax = maxDate(bijihou, todayFallback);
const columnsMax = maxDate(columns, todayFallback);
const siteMax = [kashikinMax, piiMax, chizaiMax, mynumberMax, jitsumuMax, bijihouMax, columnsMax].sort().at(-1);

// 一覧・ハブページの lastmod は、そのページに表示されるコンテンツ群の最終更新日
const staticPages = [
  { url: "/", priority: "1.0", freq: "weekly", lastmod: siteMax },
  // 貸金業務取扱主任者
  { url: "/kashikin/", priority: "0.9", freq: "weekly", lastmod: kashikinMax },
  { url: "/exam/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/exam/0/", priority: "0.9", freq: "weekly", lastmod: kashikinMax },
  { url: "/kashikin/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "kashikin/mock/page.tsx")) },
  { url: "/field/", priority: "0.8", freq: "weekly", lastmod: kashikinMax },
  { url: "/field/kashikingyouhou/", priority: "0.8", freq: "monthly", lastmod: kashikinMax },
  { url: "/field/risoku/", priority: "0.8", freq: "monthly", lastmod: kashikinMax },
  { url: "/field/minpou/", priority: "0.8", freq: "monthly", lastmod: kashikinMax },
  { url: "/field/hogo/", priority: "0.8", freq: "monthly", lastmod: kashikinMax },
  // 個人情報保護士
  { url: "/pii/", priority: "0.9", freq: "weekly", lastmod: piiMax },
  { url: "/pii/field/hogo-law/", priority: "0.8", freq: "monthly", lastmod: piiMax },
  { url: "/pii/field/mynumber/", priority: "0.8", freq: "monthly", lastmod: piiMax },
  { url: "/pii/field/security/", priority: "0.8", freq: "monthly", lastmod: piiMax },
  // 知的財産管理技能検定3級
  { url: "/chizai/", priority: "0.9", freq: "weekly", lastmod: chizaiMax },
  { url: "/chizai/field/patent/", priority: "0.8", freq: "monthly", lastmod: chizaiMax },
  { url: "/chizai/field/copyright/", priority: "0.8", freq: "monthly", lastmod: chizaiMax },
  { url: "/chizai/field/design/", priority: "0.8", freq: "monthly", lastmod: chizaiMax },
  { url: "/chizai/field/trademark/", priority: "0.8", freq: "monthly", lastmod: chizaiMax },
  { url: "/chizai/field/unfair/", priority: "0.8", freq: "monthly", lastmod: chizaiMax },
  { url: "/chizai/field/related/", priority: "0.8", freq: "monthly", lastmod: chizaiMax },
  { url: "/chizai/field/utility/", priority: "0.8", freq: "monthly", lastmod: chizaiMax },
  { url: "/chizai/field/treaty/", priority: "0.8", freq: "monthly", lastmod: chizaiMax },
  { url: "/chizai/field/practice/", priority: "0.8", freq: "monthly", lastmod: chizaiMax },
  // マイナンバー実務検定3級
  { url: "/mynumber/", priority: "0.9", freq: "weekly", lastmod: mynumberMax },
  { url: "/mynumber/field/outline/", priority: "0.8", freq: "monthly", lastmod: mynumberMax },
  { url: "/mynumber/field/card/", priority: "0.8", freq: "monthly", lastmod: mynumberMax },
  { url: "/mynumber/field/protection/", priority: "0.8", freq: "monthly", lastmod: mynumberMax },
  { url: "/mynumber/field/business/", priority: "0.8", freq: "monthly", lastmod: mynumberMax },
  { url: "/mynumber/field/practice/", priority: "0.8", freq: "monthly", lastmod: mynumberMax },
  // 個人情報保護実務検定3級
  { url: "/jitsumu/", priority: "0.9", freq: "weekly", lastmod: jitsumuMax },
  { url: "/jitsumu/field/basic/", priority: "0.8", freq: "monthly", lastmod: jitsumuMax },
  { url: "/jitsumu/field/acquisition/", priority: "0.8", freq: "monthly", lastmod: jitsumuMax },
  { url: "/jitsumu/field/security/", priority: "0.8", freq: "monthly", lastmod: jitsumuMax },
  { url: "/jitsumu/field/rights/", priority: "0.8", freq: "monthly", lastmod: jitsumuMax },
  { url: "/jitsumu/field/practice/", priority: "0.8", freq: "monthly", lastmod: jitsumuMax },
  // ビジネス実務法務検定3級
  { url: "/bijihou/", priority: "0.9", freq: "weekly", lastmod: bijihouMax },
  { url: "/bijihou/field/kiso/", priority: "0.8", freq: "monthly", lastmod: bijihouMax },
  { url: "/bijihou/field/minpou-saiken/", priority: "0.8", freq: "monthly", lastmod: bijihouMax },
  { url: "/bijihou/field/minpou-bukken/", priority: "0.8", freq: "monthly", lastmod: bijihouMax },
  { url: "/bijihou/field/kaisya/", priority: "0.8", freq: "monthly", lastmod: bijihouMax },
  { url: "/bijihou/field/kanren/", priority: "0.8", freq: "monthly", lastmod: bijihouMax },
  // その他 (/study/ は localStorage 依存の個人ページで noindex のため sitemap から除外)
  { url: "/guide/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "guide/page.tsx")) },
  { url: "/about/", priority: "0.3", freq: "yearly", lastmod: fileDate(path.join(appDir, "about/page.tsx")) },
  { url: "/privacy/", priority: "0.2", freq: "yearly", lastmod: fileDate(path.join(appDir, "privacy/page.tsx")) },
  { url: "/contact/", priority: "0.2", freq: "yearly", lastmod: fileDate(path.join(appDir, "contact/page.tsx")) },
];

const contentPages = [
  { entries: columns, prefix: "/column/" },
  { entries: questions, prefix: "/q/" },
  { entries: pii, prefix: "/pii/q/" },
  { entries: chizai, prefix: "/chizai/q/" },
  { entries: mynumber, prefix: "/mynumber/q/" },
  { entries: jitsumu, prefix: "/jitsumu/q/" },
  { entries: bijihou, prefix: "/bijihou/q/" },
].flatMap(({ entries, prefix }) =>
  entries.map((e) => ({
    url: `${prefix}${e.slug}/`,
    priority: "0.7",
    freq: "monthly",
    lastmod: e.lastmod,
  }))
);

const allPages = [
  ...staticPages,
  { url: "/column/", priority: "0.8", freq: "weekly", lastmod: columnsMax },
  ...contentPages,
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

fs.writeFileSync(outputPath, xml);
console.log(`Sitemap generated: ${allPages.length} URLs`);
