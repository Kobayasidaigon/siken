const fs = require("fs");
const path = require("path");

const BASE_URL = "https://siken-ten.vercel.app";
const questionsDir = path.join(__dirname, "../src/content/questions");
const outputPath = path.join(__dirname, "../public/sitemap.xml");

const today = new Date().toISOString().split("T")[0];

const staticPages = [
  { url: "/", priority: "1.0", freq: "weekly" },
  { url: "/exam/0/", priority: "0.9", freq: "weekly" },
  { url: "/field/", priority: "0.9", freq: "weekly" },
  { url: "/field/kashikingyouhou/", priority: "0.8", freq: "monthly" },
  { url: "/field/risoku/", priority: "0.8", freq: "monthly" },
  { url: "/field/minpou/", priority: "0.8", freq: "monthly" },
  { url: "/field/hogo/", priority: "0.8", freq: "monthly" },
  { url: "/guide/", priority: "0.6", freq: "monthly" },
  { url: "/about/", priority: "0.3", freq: "yearly" },
  { url: "/privacy/", priority: "0.2", freq: "yearly" },
  { url: "/contact/", priority: "0.2", freq: "yearly" },
];

const slugs = fs.readdirSync(questionsDir)
  .filter(f => f.endsWith(".md"))
  .map(f => f.replace(/\.md$/, ""));

const questionPages = slugs.map(slug => ({
  url: `/q/${slug}/`,
  priority: "0.7",
  freq: "monthly",
}));

const allPages = [...staticPages, ...questionPages];

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
