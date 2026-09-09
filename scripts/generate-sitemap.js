const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// CI(Vercel)は shallow clone のため git の履歴からも正しい更新日を引けず、
// 全URL同一の偽 lastmod を生成してしまう。CIではローカル生成してコミット済みの
// public/sitemap.xml をそのまま使う(ローカルの npm run build で常に再生成される)。
const IS_CI = !!(process.env.VERCEL || process.env.CI);

// lastmod の一次情報は git の最終コミット日。mtime は clone / checkout / 別マシンで
// 失われる(2026-09-05: 別環境で clone したところ全ファイルの mtime が同日になり、
// mtime 依存のままでは再生成できなかった)。git が使えない場合だけ mtime に落とす。
// 未コミットの新規ファイルは git に無いので mtime(=作成日)になる。これは正しい。
const REPO_ROOT = path.join(__dirname, "..");
const gitDates = IS_CI ? null : (() => {
  try {
    const out = execSync("git log --name-only --format=%ad --date=short", {
      cwd: REPO_ROOT,
      encoding: "utf-8",
      maxBuffer: 64 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    });
    const map = new Map();
    let current = null;
    for (const line of out.split("\n")) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(line)) {
        current = line;
        continue;
      }
      // git log は新しいコミットから並ぶので、最初に出た日付が最終更新日
      if (line && current && !map.has(line)) map.set(line, current);
    }
    return map;
  } catch {
    return null;
  }
})();

function gitDate(p) {
  if (!gitDates) return null;
  const rel = path.relative(REPO_ROOT, p).split(path.sep).join("/");
  return gitDates.get(rel) || null;
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
const kangyoDir = path.join(__dirname, "../src/content/kangyo");
const isecDir = path.join(__dirname, "../src/content/isec");
const kyoinDir = path.join(__dirname, "../src/content/kyoin");
const shakaiDir = path.join(__dirname, "../src/content/shakai");
const columnsDir = path.join(__dirname, "../src/content/columns");
const appDir = path.join(__dirname, "../src/app");
const outputPath = path.join(__dirname, "../public/sitemap.xml");

// 第2回模試(有料)の /<資格>/moshi2/ は、この staticPages 配列が手書きのため
// 追加され忘れていた(2026-09-07 に発見)。9資格ぶんの商品ページが sitemap に
// 1本も無く、robots の noindex も付いていない=出したいのに出していない状態だった。
// 資格を増やすときは moshi と moshi2 を対で足すこと。
// lastmod はビルド日ではなく「そのページのコンテンツが実際に変わった日」を出す。
// 全URL一律の生成日を入れると Google に偽シグナルとして無視されるため。
function toDate(mtimeMs) {
  return new Date(mtimeMs).toISOString().split("T")[0];
}

function fileDate(p) {
  const g = gitDate(p);
  if (g) return g;
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
      lastmod: fileDate(path.join(dir, f)),
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
const kangyo = collect(kangyoDir);
const isec = collect(isecDir);
const kyoin = collect(kyoinDir);
const shakai = collect(shakaiDir);
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
const kangyoMax = maxDate(kangyo, todayFallback);
const isecMax = maxDate(isec, todayFallback);
const kyoinMax = maxDate(kyoin, todayFallback);
const shakaiMax = maxDate(shakai, todayFallback);
const columnsMax = maxDate(columns, todayFallback);
const siteMax = [kashikinMax, piiMax, chizaiMax, chizai2Max, mynumberMax, jitsumuMax, bijihouMax, fukushi2Max, bijimaneMax, ecoMax, bijihou2Max, itpassMax, chintaiMax, kangyoMax, isecMax, kyoinMax, shakaiMax, columnsMax].sort().at(-1);

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
  { url: "/topic/kinshi-koui/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/haigyou-todokede/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/riyousha-hogo/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/seimei-hoken/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/kousei-shousho/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/hakushi-ininjou/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/meigi-gashi/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/shoumeisho-keitai/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/hyoushiki-keiji/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/shuninsha-secchi/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/jougen-kinri/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/shoumetsu-jikou/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/hoshou-keiyaku/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/rentai-hoshou/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/bensai/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/fuhou-koui/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/teitouken/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/shichiken/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/souzoku/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/seigen-kouiryoku/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/kinshou-hou/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/keihyou-hou/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/tajuu-saimu/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/topic/shouhisha-kihonhou/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  // 個人情報保護士
  { url: "/pii/", priority: "0.9", freq: "weekly", lastmod: piiMax },
  { url: "/pii/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "pii/moshi/page.tsx")) },
  { url: "/pii/moshi2/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "pii/moshi2/page.tsx")) },
  { url: "/pii/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "pii/mock/page.tsx")) },
  { url: "/pii/field/hogo-law/", priority: "0.8", freq: "monthly", lastmod: piiMax },
  { url: "/pii/field/mynumber/", priority: "0.8", freq: "monthly", lastmod: piiMax },
  { url: "/pii/field/security/", priority: "0.8", freq: "monthly", lastmod: piiMax },
  // 論点別のまとめページ(2026-09-07 追加)。同じ論点の問題が3問以上ある論点だけ、
  // 検索語に答える面を1枚にまとめている。lastmod はその資格の問題群の最終更新日
  // (ページの中身は問題データから組み立てているため)。
  { url: "/pii/topic/jigyousha/", priority: "0.7", freq: "monthly", lastmod: piiMax },
  { url: "/pii/topic/riyou-mokuteki/", priority: "0.7", freq: "monthly", lastmod: piiMax },
  { url: "/pii/topic/tekisei-shutoku/", priority: "0.7", freq: "monthly", lastmod: piiMax },
  { url: "/pii/topic/daisansha-teikyou/", priority: "0.7", freq: "monthly", lastmod: piiMax },
  { url: "/pii/topic/gaikoku-teikyou/", priority: "0.7", freq: "monthly", lastmod: piiMax },
  { url: "/pii/topic/teikyou-kiroku/", priority: "0.7", freq: "monthly", lastmod: piiMax },
  { url: "/pii/topic/kamei-kakou/", priority: "0.7", freq: "monthly", lastmod: piiMax },
  { url: "/pii/topic/tokumei-kakou/", priority: "0.7", freq: "monthly", lastmod: piiMax },
  { url: "/pii/topic/mynumber-kiso/", priority: "0.7", freq: "monthly", lastmod: piiMax },
  { url: "/pii/topic/security-kyoui/", priority: "0.7", freq: "monthly", lastmod: piiMax },
  { url: "/pii/topic/cyber-kougeki/", priority: "0.7", freq: "monthly", lastmod: piiMax },
  // 知的財産管理技能検定3級
  { url: "/chizai/", priority: "0.9", freq: "weekly", lastmod: chizaiMax },
  { url: "/chizai/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "chizai/moshi/page.tsx")) },
  { url: "/chizai/moshi2/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "chizai/moshi2/page.tsx")) },
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
  { url: "/chizai2/moshi2/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "chizai2/moshi2/page.tsx")) },
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
  { url: "/mynumber/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "mynumber/mock/page.tsx")) },
  { url: "/mynumber/moshi2/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "mynumber/moshi2/page.tsx")) },
  { url: "/mynumber/field/outline/", priority: "0.8", freq: "monthly", lastmod: mynumberMax },
  { url: "/mynumber/field/card/", priority: "0.8", freq: "monthly", lastmod: mynumberMax },
  { url: "/mynumber/field/protection/", priority: "0.8", freq: "monthly", lastmod: mynumberMax },
  { url: "/mynumber/field/business/", priority: "0.8", freq: "monthly", lastmod: mynumberMax },
  { url: "/mynumber/field/practice/", priority: "0.8", freq: "monthly", lastmod: mynumberMax },
  // 個人情報保護実務検定3級
  { url: "/jitsumu/", priority: "0.9", freq: "weekly", lastmod: jitsumuMax },
  { url: "/jitsumu/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "jitsumu/moshi/page.tsx")) },
  { url: "/jitsumu/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "jitsumu/mock/page.tsx")) },
  { url: "/jitsumu/moshi2/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "jitsumu/moshi2/page.tsx")) },
  { url: "/jitsumu/field/basic/", priority: "0.8", freq: "monthly", lastmod: jitsumuMax },
  { url: "/jitsumu/field/acquisition/", priority: "0.8", freq: "monthly", lastmod: jitsumuMax },
  { url: "/jitsumu/field/security/", priority: "0.8", freq: "monthly", lastmod: jitsumuMax },
  { url: "/jitsumu/field/rights/", priority: "0.8", freq: "monthly", lastmod: jitsumuMax },
  { url: "/jitsumu/field/practice/", priority: "0.8", freq: "monthly", lastmod: jitsumuMax },
  // ビジネス実務法務検定3級
  { url: "/bijihou/", priority: "0.9", freq: "weekly", lastmod: bijihouMax },
  { url: "/bijihou/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "bijihou/moshi/page.tsx")) },
  { url: "/bijihou/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "bijihou/mock/page.tsx")) },
  { url: "/bijihou/moshi2/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "bijihou/moshi2/page.tsx")) },
  { url: "/bijihou/field/kiso/", priority: "0.8", freq: "monthly", lastmod: bijihouMax },
  { url: "/bijihou/field/minpou-saiken/", priority: "0.8", freq: "monthly", lastmod: bijihouMax },
  { url: "/bijihou/field/minpou-bukken/", priority: "0.8", freq: "monthly", lastmod: bijihouMax },
  { url: "/bijihou/field/kaisya/", priority: "0.8", freq: "monthly", lastmod: bijihouMax },
  { url: "/bijihou/field/kanren/", priority: "0.8", freq: "monthly", lastmod: bijihouMax },
  // 福祉住環境コーディネーター2級
  { url: "/fukushi2/", priority: "0.9", freq: "weekly", lastmod: fukushi2Max },
  { url: "/fukushi2/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "fukushi2/moshi/page.tsx")) },
  { url: "/fukushi2/moshi2/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "fukushi2/moshi2/page.tsx")) },
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
  { url: "/bijimane/moshi2/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "bijimane/moshi2/page.tsx")) },
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
  { url: "/eco/moshi2/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "eco/moshi2/page.tsx")) },
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
  { url: "/bijihou2/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "bijihou2/moshi/page.tsx")) },
  { url: "/bijihou2/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "bijihou2/mock/page.tsx")) },
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
  { url: "/itpass/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "itpass/moshi/page.tsx")) },
  { url: "/itpass/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "itpass/mock/page.tsx")) },
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
  // 情報・サイバーセキュリティ管理士認定試験
  { url: "/isec/", priority: "0.9", freq: "weekly", lastmod: isecMax },
  { url: "/isec/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "isec/moshi/page.tsx")) },
  { url: "/isec/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "isec/mock/page.tsx")) },
  { url: "/isec/field/soron/", priority: "0.8", freq: "monthly", lastmod: isecMax },
  { url: "/isec/field/hoki/", priority: "0.8", freq: "monthly", lastmod: isecMax },
  { url: "/isec/field/kyoui/", priority: "0.8", freq: "monthly", lastmod: isecMax },
  { url: "/isec/field/taisaku/", priority: "0.8", freq: "monthly", lastmod: isecMax },
  { url: "/isec/field/cyber/", priority: "0.8", freq: "monthly", lastmod: isecMax },
  { url: "/isec/field/incident/", priority: "0.8", freq: "monthly", lastmod: isecMax },
  { url: "/isec/field/network/", priority: "0.8", freq: "monthly", lastmod: isecMax },
  { url: "/isec/field/computer/", priority: "0.8", freq: "monthly", lastmod: isecMax },
  // 教員採用試験（教職教養）
  { url: "/kyoin/", priority: "0.9", freq: "weekly", lastmod: kyoinMax },
  { url: "/kyoin/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "kyoin/moshi/page.tsx")) },
  { url: "/kyoin/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "kyoin/mock/page.tsx")) },
  { url: "/kyoin/field/houki-kihon/", priority: "0.8", freq: "monthly", lastmod: kyoinMax },
  { url: "/kyoin/field/houki-jinji/", priority: "0.8", freq: "monthly", lastmod: kyoinMax },
  { url: "/kyoin/field/genri-yoryo/", priority: "0.8", freq: "monthly", lastmod: kyoinMax },
  { url: "/kyoin/field/genri-shido/", priority: "0.8", freq: "monthly", lastmod: kyoinMax },
  { url: "/kyoin/field/shinri/", priority: "0.8", freq: "monthly", lastmod: kyoinMax },
  { url: "/kyoin/field/rekishi/", priority: "0.8", freq: "monthly", lastmod: kyoinMax },
  { url: "/kyoin/field/jiji/", priority: "0.8", freq: "monthly", lastmod: kyoinMax },
  { url: "/kyoin/field/kyoyo/", priority: "0.8", freq: "monthly", lastmod: kyoinMax },
  // 社会福祉士（共通科目）
  { url: "/shakai/", priority: "0.9", freq: "weekly", lastmod: shakaiMax },
  { url: "/shakai/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "shakai/moshi/page.tsx")) },
  { url: "/shakai/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "shakai/mock/page.tsx")) },
  { url: "/shakai/field/genri/", priority: "0.8", freq: "monthly", lastmod: shakaiMax },
  { url: "/shakai/field/shakaihosho/", priority: "0.8", freq: "monthly", lastmod: shakaiMax },
  { url: "/shakai/field/kenri/", priority: "0.8", freq: "monthly", lastmod: shakaiMax },
  { url: "/shakai/field/chiiki/", priority: "0.8", freq: "monthly", lastmod: shakaiMax },
  { url: "/shakai/field/shogai/", priority: "0.8", freq: "monthly", lastmod: shakaiMax },
  { url: "/shakai/field/igaku/", priority: "0.8", freq: "monthly", lastmod: shakaiMax },
  { url: "/shakai/field/shakaigaku/", priority: "0.8", freq: "monthly", lastmod: shakaiMax },
  { url: "/shakai/field/sw/", priority: "0.8", freq: "monthly", lastmod: shakaiMax },
  { url: "/chintai/", priority: "0.9", freq: "weekly", lastmod: chintaiMax },
  { url: "/chintai/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "chintai/moshi/page.tsx")) },
  { url: "/chintai/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "chintai/mock/page.tsx")) },
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
  { url: "/kangyo/", priority: "0.9", freq: "weekly", lastmod: kangyoMax },
  { url: "/kangyo/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "kangyo/moshi/page.tsx")) },
  { url: "/kangyo/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "kangyo/mock/page.tsx")) },
  { url: "/kangyo/field/kubun1/", priority: "0.8", freq: "monthly", lastmod: kangyoMax },
  { url: "/kangyo/field/kubun2/", priority: "0.8", freq: "monthly", lastmod: kangyoMax },
  { url: "/kangyo/field/kiyaku/", priority: "0.8", freq: "monthly", lastmod: kangyoMax },
  { url: "/kangyo/field/itaku/", priority: "0.8", freq: "monthly", lastmod: kangyoMax },
  { url: "/kangyo/field/minpou/", priority: "0.8", freq: "monthly", lastmod: kangyoMax },
  { url: "/kangyo/field/kaikei/", priority: "0.8", freq: "monthly", lastmod: kangyoMax },
  { url: "/kangyo/field/tekiseika/", priority: "0.8", freq: "monthly", lastmod: kangyoMax },
  { url: "/kangyo/field/hozen/", priority: "0.8", freq: "monthly", lastmod: kangyoMax },
  { url: "/kangyo/field/setsubi/", priority: "0.8", freq: "monthly", lastmod: kangyoMax },
  { url: "/kangyo/field/kenchiku/", priority: "0.8", freq: "monthly", lastmod: kangyoMax },
  // その他 (/study/ は localStorage 依存の個人ページで noindex のため sitemap から除外)
  { url: "/guide/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "guide/page.tsx")) },
  { url: "/goukaku-houkoku/", priority: "0.4", freq: "monthly", lastmod: fileDate(path.join(appDir, "goukaku-houkoku/page.tsx")) },
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
  { entries: kangyo, prefix: "/kangyo/q/" },
  { entries: isec, prefix: "/isec/q/" },
  { entries: kyoin, prefix: "/kyoin/q/" },
  { entries: shakai, prefix: "/shakai/q/" },
].flatMap(({ entries, prefix }) =>
  entries.map((e) => ({
    url: `${prefix}${e.slug}/`,
    priority: "0.7",
    freq: "monthly",
    lastmod: e.lastmod,
  }))
);

// 合格報告の一覧は、掲載済みの報告が1件でもあるときだけ sitemap に載せる。
// 0件のうちは中身が「報告のお願い」だけなので、検索結果に出しても価値がない
// (ページ側も 0件のときは noindex にしてある: src/app/voice/page.tsx)。
const voices = collect(path.join(__dirname, "../src/content/voices"));
const voicePages =
  voices.length > 0
    ? [{ url: "/voice/", priority: "0.6", freq: "weekly", lastmod: maxDate(voices, todayFallback) }]
    : [];

const allPages = [
  ...staticPages,
  { url: "/column/", priority: "0.8", freq: "weekly", lastmod: columnsMax },
  ...voicePages,
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

// CI(Vercel)は shallow clone で lastmod を正しく引けないため、生成はせず
// コミット済みの public/sitemap.xml をそのまま使う。ただし「ページを足したのに
// 上の手書き配列に足し忘れた」「スクリプトは直したが sitemap を再生成し忘れた」
// まま気づかずデプロイされるのを、ここで止める。
// URL の一覧は git 履歴ではなくファイルの有無だけで決まるので、shallow clone でも
// 正しく求まる(lastmod だけが引けない)。実際 /<資格>/moshi2/ の9本はこの
// 取りこぼしで長期間 sitemap に載っていなかった(2026-09-07 に発見)。
if (IS_CI) {
  const committedXml = fs.readFileSync(outputPath, "utf-8");
  const committed = new Set([...committedXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  const expected = new Set(allPages.map((p) => `${BASE_URL}${p.url}`));
  const missing = [...expected].filter((u) => !committed.has(u));
  const extra = [...committed].filter((u) => !expected.has(u));
  if (missing.length || extra.length) {
    console.error(
      "public/sitemap.xml が古いです。ローカルで npm run build を実行し、再生成された public/sitemap.xml を同じコミットに含めてください。"
    );
    if (missing.length) console.error(`  未収録 ${missing.length}件:\n    ${missing.slice(0, 20).join("\n    ")}`);
    if (extra.length) console.error(`  余分 ${extra.length}件:\n    ${extra.slice(0, 20).join("\n    ")}`);
    process.exit(1);
  }
  console.log(`CI detected: committed public/sitemap.xml is up to date (${allPages.length} URLs)`);
  process.exit(0);
}

fs.writeFileSync(outputPath, xml);
console.log(`Sitemap generated: ${allPages.length} URLs`);
