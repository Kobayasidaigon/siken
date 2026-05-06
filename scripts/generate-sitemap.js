const fs = require("fs");
const path = require("path");

const BASE_URL = "https://shikakumon.com";
const questionsDir = path.join(__dirname, "../src/content/questions");
const piiDir = path.join(__dirname, "../src/content/pii");
const chizaiDir = path.join(__dirname, "../src/content/chizai");
const mynumberDir = path.join(__dirname, "../src/content/mynumber");
const columnsDir = path.join(__dirname, "../src/content/columns");
const outputPath = path.join(__dirname, "../public/sitemap.xml");

const today = new Date().toISOString().split("T")[0];

const staticPages = [
  { url: "/", priority: "1.0", freq: "weekly" },
  // 貸金業務取扱主任者
  { url: "/kashikin/", priority: "0.9", freq: "weekly" },
  { url: "/exam/0/", priority: "0.9", freq: "weekly" },
  { url: "/field/", priority: "0.8", freq: "weekly" },
  { url: "/field/kashikingyouhou/", priority: "0.8", freq: "monthly" },
  { url: "/field/risoku/", priority: "0.8", freq: "monthly" },
  { url: "/field/minpou/", priority: "0.8", freq: "monthly" },
  { url: "/field/hogo/", priority: "0.8", freq: "monthly" },
  // 個人情報保護士
  { url: "/pii/", priority: "0.9", freq: "weekly" },
  { url: "/pii/field/hogo-law/", priority: "0.8", freq: "monthly" },
  { url: "/pii/field/mynumber/", priority: "0.8", freq: "monthly" },
  { url: "/pii/field/security/", priority: "0.8", freq: "monthly" },
  // 知的財産管理技能検定3級
  { url: "/chizai/", priority: "0.9", freq: "weekly" },
  { url: "/chizai/field/patent/", priority: "0.8", freq: "monthly" },
  { url: "/chizai/field/copyright/", priority: "0.8", freq: "monthly" },
  { url: "/chizai/field/design/", priority: "0.8", freq: "monthly" },
  { url: "/chizai/field/trademark/", priority: "0.8", freq: "monthly" },
  { url: "/chizai/field/unfair/", priority: "0.8", freq: "monthly" },
  { url: "/chizai/field/related/", priority: "0.8", freq: "monthly" },
  { url: "/chizai/field/utility/", priority: "0.8", freq: "monthly" },
  { url: "/chizai/field/treaty/", priority: "0.8", freq: "monthly" },
  { url: "/chizai/field/practice/", priority: "0.8", freq: "monthly" },
  // マイナンバー実務検定3級
  { url: "/mynumber/", priority: "0.9", freq: "weekly" },
  { url: "/mynumber/field/outline/", priority: "0.8", freq: "monthly" },
  { url: "/mynumber/field/card/", priority: "0.8", freq: "monthly" },
  { url: "/mynumber/field/protection/", priority: "0.8", freq: "monthly" },
  { url: "/mynumber/field/business/", priority: "0.8", freq: "monthly" },
  { url: "/mynumber/field/practice/", priority: "0.8", freq: "monthly" },
  // その他
  { url: "/guide/", priority: "0.6", freq: "monthly" },
  { url: "/about/", priority: "0.3", freq: "yearly" },
  { url: "/privacy/", priority: "0.2", freq: "yearly" },
  { url: "/contact/", priority: "0.2", freq: "yearly" },
];

// 貸金問題
const questionSlugs = fs.readdirSync(questionsDir)
  .filter(f => f.endsWith(".md"))
  .map(f => f.replace(/\.md$/, ""));
const questionPages = questionSlugs.map(slug => ({
  url: `/q/${slug}/`,
  priority: "0.7",
  freq: "monthly",
}));

// 個人情報保護士問題
const piiSlugs = fs.existsSync(piiDir)
  ? fs.readdirSync(piiDir).filter(f => f.endsWith(".md")).map(f => f.replace(/\.md$/, ""))
  : [];
const piiPages = piiSlugs.map(slug => ({
  url: `/pii/q/${slug}/`,
  priority: "0.7",
  freq: "monthly",
}));

// 知的財産管理技能検定問題
const chizaiSlugs = fs.existsSync(chizaiDir)
  ? fs.readdirSync(chizaiDir).filter(f => f.endsWith(".md")).map(f => f.replace(/\.md$/, ""))
  : [];
const chizaiPages = chizaiSlugs.map(slug => ({
  url: `/chizai/q/${slug}/`,
  priority: "0.7",
  freq: "monthly",
}));

// マイナンバー実務検定問題
const mynumberSlugs = fs.existsSync(mynumberDir)
  ? fs.readdirSync(mynumberDir).filter(f => f.endsWith(".md")).map(f => f.replace(/\.md$/, ""))
  : [];
const mynumberPages = mynumberSlugs.map(slug => ({
  url: `/mynumber/q/${slug}/`,
  priority: "0.7",
  freq: "monthly",
}));

// コラム
const columnSlugs = fs.existsSync(columnsDir)
  ? fs.readdirSync(columnsDir).filter(f => f.endsWith(".md")).map(f => f.replace(/\.md$/, ""))
  : [];
const columnPages = columnSlugs.map(slug => ({
  url: `/column/${slug}/`,
  priority: "0.7",
  freq: "monthly",
}));

const allPages = [
  ...staticPages,
  { url: "/column/", priority: "0.8", freq: "weekly" },
  ...columnPages,
  ...questionPages,
  ...piiPages,
  ...chizaiPages,
  ...mynumberPages,
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

fs.writeFileSync(outputPath, xml);
console.log(`Sitemap generated: ${allPages.length} URLs`);
