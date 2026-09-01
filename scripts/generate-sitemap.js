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
const chizai2Dir = path.join(__dirname, "../src/content/chizai2");
const mynumberDir = path.join(__dirname, "../src/content/mynumber");
const jitsumuDir = path.join(__dirname, "../src/content/jitsumu");
const bijihouDir = path.join(__dirname, "../src/content/bijihou");
const fukushi2Dir = path.join(__dirname, "../src/content/fukushi2");
const bijimaneDir = path.join(__dirname, "../src/content/bijimane");
const ecoDir = path.join(__dirname, "../src/content/eco");
const bijihou2Dir = path.join(__dirname, "../src/content/bijihou2");
const itpassDir = path.join(__dirname, "../src/content/itpass");
const chintaiDir = path.join(__dirname, "../src/content/chintai");
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
const chizai2 = collect(chizai2Dir);
const mynumber = collect(mynumberDir);
const jitsumu = collect(jitsumuDir);
const bijihou = collect(bijihouDir);
const fukushi2 = collect(fukushi2Dir);
const bijimane = collect(bijimaneDir);
const eco = collect(ecoDir);
const bijihou2 = collect(bijihou2Dir);
const itpass = collect(itpassDir);
const chintai = collect(chintaiDir);
const columns = collect(columnsDir);

const todayFallback = toDate(Date.now());
const kashikinMax = maxDate(questions, todayFallback);
const piiMax = maxDate(pii, todayFallback);
const chizaiMax = maxDate(chizai, todayFallback);
const chizai2Max = maxDate(chizai2, todayFallback);
const mynumberMax = maxDate(mynumber, todayFallback);
const jitsumuMax = maxDate(jitsumu, todayFallback);
const bijihouMax = maxDate(bijihou, todayFallback);
const fukushi2Max = maxDate(fukushi2, todayFallback);
const bijimaneMax = maxDate(bijimane, todayFallback);
const ecoMax = maxDate(eco, todayFallback);
const bijihou2Max = maxDate(bijihou2, todayFallback);
const itpassMax = maxDate(itpass, todayFallback);
const chintaiMax = maxDate(chintai, todayFallback);
const columnsMax = maxDate(columns, todayFallback);
const siteMax = [kashikinMax, piiMax, chizaiMax, chizai2Max, mynumberMax, jitsumuMax, bijihouMax, fukushi2Max, bijimaneMax, ecoMax, bijihou2Max, itpassMax, chintaiMax, columnsMax].sort().at(-1);

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
  { url: "/pii/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "pii/moshi/page.tsx")) },
  { url: "/pii/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "pii/mock/page.tsx")) },
  { url: "/pii/field/hogo-law/", priority: "0.8", freq: "monthly", lastmod: piiMax },
  { url: "/pii/field/mynumber/", priority: "0.8", freq: "monthly", lastmod: piiMax },
  { url: "/pii/field/security/", priority: "0.8", freq: "monthly", lastmod: piiMax },
  // 知的財産管理技能検定3級
  { url: "/chizai/", priority: "0.9", freq: "weekly", lastmod: chizaiMax },
  { url: "/chizai/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "chizai/moshi/page.tsx")) },
  { url: "/chizai/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "chizai/mock/page.tsx")) },
  { url: "/chizai/field/patent/", priority: "0.8", freq: "monthly", lastmod: chizaiMax },
  { url: "/chizai/field/copyright/", priority: "0.8", freq: "monthly", lastmod: chizaiMax },
  { url: "/chizai/field/design/", priority: "0.8", freq: "monthly", lastmod: chizaiMax },
  { url: "/chizai/field/trademark/", priority: "0.8", freq: "monthly", lastmod: chizaiMax },
  { url: "/chizai/field/unfair/", priority: "0.8", freq: "monthly", lastmod: chizaiMax },
  { url: "/chizai/field/related/", priority: "0.8", freq: "monthly", lastmod: chizaiMax },
  { url: "/chizai/field/utility/", priority: "0.8", freq: "monthly", lastmod: chizaiMax },
  { url: "/chizai/field/treaty/", priority: "0.8", freq: "monthly", lastmod: chizaiMax },
  { url: "/chizai/field/practice/", priority: "0.8", freq: "monthly", lastmod: chizaiMax },
  // 知的財産管理技能検定2級
  { url: "/chizai2/", priority: "0.9", freq: "weekly", lastmod: chizai2Max },
  { url: "/chizai2/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "chizai2/moshi/page.tsx")) },
  { url: "/chizai2/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "chizai2/mock/page.tsx")) },
  { url: "/chizai2/field/patent/", priority: "0.8", freq: "monthly", lastmod: chizai2Max },
  { url: "/chizai2/field/copyright/", priority: "0.8", freq: "monthly", lastmod: chizai2Max },
  { url: "/chizai2/field/design/", priority: "0.8", freq: "monthly", lastmod: chizai2Max },
  { url: "/chizai2/field/trademark/", priority: "0.8", freq: "monthly", lastmod: chizai2Max },
  { url: "/chizai2/field/unfair/", priority: "0.8", freq: "monthly", lastmod: chizai2Max },
  { url: "/chizai2/field/related/", priority: "0.8", freq: "monthly", lastmod: chizai2Max },
  { url: "/chizai2/field/utility/", priority: "0.8", freq: "monthly", lastmod: chizai2Max },
  { url: "/chizai2/field/treaty/", priority: "0.8", freq: "monthly", lastmod: chizai2Max },
  { url: "/chizai2/field/practice/", priority: "0.8", freq: "monthly", lastmod: chizai2Max },
  // マイナンバー実務検定3級
  { url: "/mynumber/", priority: "0.9", freq: "weekly", lastmod: mynumberMax },
  { url: "/mynumber/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "mynumber/moshi/page.tsx")) },
  { url: "/mynumber/field/outline/", priority: "0.8", freq: "monthly", lastmod: mynumberMax },
  { url: "/mynumber/field/card/", priority: "0.8", freq: "monthly", lastmod: mynumberMax },
  { url: "/mynumber/field/protection/", priority: "0.8", freq: "monthly", lastmod: mynumberMax },
  { url: "/mynumber/field/business/", priority: "0.8", freq: "monthly", lastmod: mynumberMax },
  { url: "/mynumber/field/practice/", priority: "0.8", freq: "monthly", lastmod: mynumberMax },
  // 個人情報保護実務検定3級
  { url: "/jitsumu/", priority: "0.9", freq: "weekly", lastmod: jitsumuMax },
  { url: "/jitsumu/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "jitsumu/moshi/page.tsx")) },
  { url: "/jitsumu/field/basic/", priority: "0.8", freq: "monthly", lastmod: jitsumuMax },
  { url: "/jitsumu/field/acquisition/", priority: "0.8", freq: "monthly", lastmod: jitsumuMax },
  { url: "/jitsumu/field/security/", priority: "0.8", freq: "monthly", lastmod: jitsumuMax },
  { url: "/jitsumu/field/rights/", priority: "0.8", freq: "monthly", lastmod: jitsumuMax },
  { url: "/jitsumu/field/practice/", priority: "0.8", freq: "monthly", lastmod: jitsumuMax },
  // ビジネス実務法務検定3級
  { url: "/bijihou/", priority: "0.9", freq: "weekly", lastmod: bijihouMax },
  { url: "/bijihou/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "bijihou/moshi/page.tsx")) },
  { url: "/bijihou/field/kiso/", priority: "0.8", freq: "monthly", lastmod: bijihouMax },
  { url: "/bijihou/field/minpou-saiken/", priority: "0.8", freq: "monthly", lastmod: bijihouMax },
  { url: "/bijihou/field/minpou-bukken/", priority: "0.8", freq: "monthly", lastmod: bijihouMax },
  { url: "/bijihou/field/kaisya/", priority: "0.8", freq: "monthly", lastmod: bijihouMax },
  { url: "/bijihou/field/kanren/", priority: "0.8", freq: "monthly", lastmod: bijihouMax },
  // 福祉住環境コーディネーター2級
  { url: "/fukushi2/", priority: "0.9", freq: "weekly", lastmod: fukushi2Max },
  { url: "/fukushi2/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "fukushi2/moshi/page.tsx")) },
  { url: "/fukushi2/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "fukushi2/mock/page.tsx")) },
  { url: "/fukushi2/field/society/", priority: "0.8", freq: "monthly", lastmod: fukushi2Max },
  { url: "/fukushi2/field/consultation/", priority: "0.8", freq: "monthly", lastmod: fukushi2Max },
  { url: "/fukushi2/field/rehabilitation/", priority: "0.8", freq: "monthly", lastmod: fukushi2Max },
  { url: "/fukushi2/field/disease/", priority: "0.8", freq: "monthly", lastmod: fukushi2Max },
  { url: "/fukushi2/field/basic/", priority: "0.8", freq: "monthly", lastmod: fukushi2Max },
  { url: "/fukushi2/field/place/", priority: "0.8", freq: "monthly", lastmod: fukushi2Max },
  { url: "/fukushi2/field/equipment/", priority: "0.8", freq: "monthly", lastmod: fukushi2Max },
  { url: "/fukushi2/field/kaigohoken/", priority: "0.8", freq: "monthly", lastmod: fukushi2Max },
  { url: "/fukushi2/field/law/", priority: "0.8", freq: "monthly", lastmod: fukushi2Max },
  // ビジネスマネジャー検定
  { url: "/bijimane/", priority: "0.9", freq: "weekly", lastmod: bijimaneMax },
  { url: "/bijimane/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "bijimane/moshi/page.tsx")) },
  { url: "/bijimane/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "bijimane/mock/page.tsx")) },
  { url: "/bijimane/field/role/", priority: "0.8", freq: "monthly", lastmod: bijimaneMax },
  { url: "/bijimane/field/self-communication/", priority: "0.8", freq: "monthly", lastmod: bijimaneMax },
  { url: "/bijimane/field/leadership/", priority: "0.8", freq: "monthly", lastmod: bijimaneMax },
  { url: "/bijimane/field/hr/", priority: "0.8", freq: "monthly", lastmod: bijimaneMax },
  { url: "/bijimane/field/team/", priority: "0.8", freq: "monthly", lastmod: bijimaneMax },
  { url: "/bijimane/field/strategy/", priority: "0.8", freq: "monthly", lastmod: bijimaneMax },
  { url: "/bijimane/field/operation/", priority: "0.8", freq: "monthly", lastmod: bijimaneMax },
  { url: "/bijimane/field/marketing/", priority: "0.8", freq: "monthly", lastmod: bijimaneMax },
  { url: "/bijimane/field/risk/", priority: "0.8", freq: "monthly", lastmod: bijimaneMax },
  { url: "/bijimane/field/risk-operation/", priority: "0.8", freq: "monthly", lastmod: bijimaneMax },
  { url: "/eco/", priority: "0.9", freq: "weekly", lastmod: ecoMax },
  { url: "/eco/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "eco/moshi/page.tsx")) },
  { url: "/eco/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "eco/mock/page.tsx")) },
  { url: "/eco/field/history/", priority: "0.8", freq: "monthly", lastmod: ecoMax },
  { url: "/eco/field/earth/", priority: "0.8", freq: "monthly", lastmod: ecoMax },
  { url: "/eco/field/now/", priority: "0.8", freq: "monthly", lastmod: ecoMax },
  { url: "/eco/field/climate/", priority: "0.8", freq: "monthly", lastmod: ecoMax },
  { url: "/eco/field/biodiversity/", priority: "0.8", freq: "monthly", lastmod: ecoMax },
  { url: "/eco/field/recycle/", priority: "0.8", freq: "monthly", lastmod: ecoMax },
  { url: "/eco/field/local/", priority: "0.8", freq: "monthly", lastmod: ecoMax },
  { url: "/eco/field/policy/", priority: "0.8", freq: "monthly", lastmod: ecoMax },
  { url: "/eco/field/international/", priority: "0.8", freq: "monthly", lastmod: ecoMax },
  { url: "/eco/field/actors/", priority: "0.8", freq: "monthly", lastmod: ecoMax },
  { url: "/bijihou2/", priority: "0.9", freq: "weekly", lastmod: bijihou2Max },
  { url: "/bijihou2/field/torihiki/", priority: "0.8", freq: "monthly", lastmod: bijihou2Max },
  { url: "/bijihou2/field/zaisan/", priority: "0.8", freq: "monthly", lastmod: bijihou2Max },
  { url: "/bijihou2/field/kigyoukan/", priority: "0.8", freq: "monthly", lastmod: bijihou2Max },
  { url: "/bijihou2/field/shouhisha/", priority: "0.8", freq: "monthly", lastmod: bijihou2Max },
  { url: "/bijihou2/field/jouhou/", priority: "0.8", freq: "monthly", lastmod: bijihou2Max },
  { url: "/bijihou2/field/kinyuu/", priority: "0.8", freq: "monthly", lastmod: bijihou2Max },
  { url: "/bijihou2/field/saiken/", priority: "0.8", freq: "monthly", lastmod: bijihou2Max },
  { url: "/bijihou2/field/tousan/", priority: "0.8", freq: "monthly", lastmod: bijihou2Max },
  { url: "/bijihou2/field/kaisya/", priority: "0.8", freq: "monthly", lastmod: bijihou2Max },
  { url: "/bijihou2/field/juugyouin/", priority: "0.8", freq: "monthly", lastmod: bijihou2Max },
  { url: "/itpass/", priority: "0.9", freq: "weekly", lastmod: itpassMax },
  { url: "/itpass/field/kigyou/", priority: "0.8", freq: "monthly", lastmod: itpassMax },
  { url: "/itpass/field/senryaku/", priority: "0.8", freq: "monthly", lastmod: itpassMax },
  { url: "/itpass/field/system-senryaku/", priority: "0.8", freq: "monthly", lastmod: itpassMax },
  { url: "/itpass/field/kaihatsu/", priority: "0.8", freq: "monthly", lastmod: itpassMax },
  { url: "/itpass/field/project/", priority: "0.8", freq: "monthly", lastmod: itpassMax },
  { url: "/itpass/field/service/", priority: "0.8", freq: "monthly", lastmod: itpassMax },
  { url: "/itpass/field/kiso/", priority: "0.8", freq: "monthly", lastmod: itpassMax },
  { url: "/itpass/field/computer/", priority: "0.8", freq: "monthly", lastmod: itpassMax },
  { url: "/itpass/field/tech/", priority: "0.8", freq: "monthly", lastmod: itpassMax },
  { url: "/itpass/field/security/", priority: "0.8", freq: "monthly", lastmod: itpassMax },
  { url: "/chintai/", priority: "0.9", freq: "weekly", lastmod: chintaiMax },
  { url: "/chintai/field/gyouhou/", priority: "0.8", freq: "monthly", lastmod: chintaiMax },
  { url: "/chintai/field/jutaku/", priority: "0.8", freq: "monthly", lastmod: chintaiMax },
  { url: "/chintai/field/sublease/", priority: "0.8", freq: "monthly", lastmod: chintaiMax },
  { url: "/chintai/field/keiyaku/", priority: "0.8", freq: "monthly", lastmod: chintaiMax },
  { url: "/chintai/field/shuuryou/", priority: "0.8", freq: "monthly", lastmod: chintaiMax },
  { url: "/chintai/field/kinsen/", priority: "0.8", freq: "monthly", lastmod: chintaiMax },
  { url: "/chintai/field/setsubi/", priority: "0.8", freq: "monthly", lastmod: chintaiMax },
  { url: "/chintai/field/boshuu/", priority: "0.8", freq: "monthly", lastmod: chintaiMax },
  { url: "/chintai/field/shien/", priority: "0.8", freq: "monthly", lastmod: chintaiMax },
  { url: "/chintai/field/igi/", priority: "0.8", freq: "monthly", lastmod: chintaiMax },
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
  { entries: chizai2, prefix: "/chizai2/q/" },
  { entries: mynumber, prefix: "/mynumber/q/" },
  { entries: jitsumu, prefix: "/jitsumu/q/" },
  { entries: bijihou, prefix: "/bijihou/q/" },
  { entries: fukushi2, prefix: "/fukushi2/q/" },
  { entries: bijimane, prefix: "/bijimane/q/" },
  { entries: eco, prefix: "/eco/q/" },
  { entries: bijihou2, prefix: "/bijihou2/q/" },
  { entries: itpass, prefix: "/itpass/q/" },
  { entries: chintai, prefix: "/chintai/q/" },
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
