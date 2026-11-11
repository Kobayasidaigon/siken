const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const matter = require("gray-matter");

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
const isfDir = path.join(__dirname, "../src/content/isf");
const dxpDir = path.join(__dirname, "../src/content/dxp");
const hadDir = path.join(__dirname, "../src/content/had");
const ccmDir = path.join(__dirname, "../src/content/ccm");
const touhanDir = path.join(__dirname, "../src/content/touhan");
const hoikushiDir = path.join(__dirname, "../src/content/hoikushi");
const gaiaDir = path.join(__dirname, "../src/content/gaia");
const dxaDir = path.join(__dirname, "../src/content/dxa");
const aiaDir = path.join(__dirname, "../src/content/aia");
const xrayDir = path.join(__dirname, "../src/content/xray");
const kyoinDir = path.join(__dirname, "../src/content/kyoin");
const shakaiDir = path.join(__dirname, "../src/content/shakai");
const cccDir = path.join(__dirname, "../src/content/ccc");
const llcDir = path.join(__dirname, "../src/content/llc");
const cacDir = path.join(__dirname, "../src/content/cac");
const ibdDir = path.join(__dirname, "../src/content/ibd");
const dxoDir = path.join(__dirname, "../src/content/dxo");
const wlcDir = path.join(__dirname, "../src/content/wlc");
const fukushi3Dir = path.join(__dirname, "../src/content/fukushi3");
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
const isf = collect(isfDir);
const dxp = collect(dxpDir);
const had = collect(hadDir);
const ccm = collect(ccmDir);
const touhan = collect(touhanDir);
const hoikushi = collect(hoikushiDir);
const gaia = collect(gaiaDir);
const dxa = collect(dxaDir);
const aia = collect(aiaDir);
const xray = collect(xrayDir);
const kyoin = collect(kyoinDir);
const shakai = collect(shakaiDir);
const ccc = collect(cccDir);
const llc = collect(llcDir);
const cac = collect(cacDir);
const ibd = collect(ibdDir);
const dxo = collect(dxoDir);
const wlc = collect(wlcDir);
const fukushi3 = collect(fukushi3Dir);
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
const isfMax = maxDate(isf, todayFallback);
const dxpMax = maxDate(dxp, todayFallback);
const hadMax = maxDate(had, todayFallback);
const ccmMax = maxDate(ccm, todayFallback);
const touhanMax = maxDate(touhan, todayFallback);
const hoikushiMax = maxDate(hoikushi, todayFallback);
const gaiaMax = maxDate(gaia, todayFallback);
const dxaMax = maxDate(dxa, todayFallback);
const aiaMax = maxDate(aia, todayFallback);
const xrayMax = maxDate(xray, todayFallback);
const kyoinMax = maxDate(kyoin, todayFallback);
const shakaiMax = maxDate(shakai, todayFallback);
const cccMax = maxDate(ccc, todayFallback);
const llcMax = maxDate(llc, todayFallback);
const cacMax = maxDate(cac, todayFallback);
const ibdMax = maxDate(ibd, todayFallback);
const dxoMax = maxDate(dxo, todayFallback);
const wlcMax = maxDate(wlc, todayFallback);
const fukushi3Max = maxDate(fukushi3, todayFallback);
const columnsMax = maxDate(columns, todayFallback);
const siteMax = [kashikinMax, piiMax, chizaiMax, chizai2Max, mynumberMax, jitsumuMax, bijihouMax, fukushi2Max, bijimaneMax, ecoMax, bijihou2Max, itpassMax, chintaiMax, kangyoMax, isecMax, kyoinMax, shakaiMax, isfMax, dxpMax, hadMax, ccmMax, touhanMax, hoikushiMax, gaiaMax, dxaMax, aiaMax, xrayMax, cccMax, llcMax, cacMax, ibdMax, dxoMax, wlcMax, fukushi3Max, columnsMax].sort().at(-1);

// 試験カレンダーの月。exam-dates.ts の date / applyStart / applyEnd に出てくる年月を拾う。
// TS を読み込めないので文字列から拾う(exam-calendar.ts の calendarMonths() と同じ集合になる)。
const examDatesPath = path.join(__dirname, "../src/lib/exam-dates.ts");
const calendarMonths = (() => {
  const src = fs.readFileSync(examDatesPath, "utf-8");
  const set = new Set();
  for (const m of src.matchAll(/\b(?:date|applyStart|applyEnd):\s*"(\d{4}-\d{2})-\d{2}"/g)) set.add(m[1]);
  return [...set].sort();
})();
// exam-dates.ts の日程リストがカレンダー(exam-calendar.ts)に載っているか確かめる。
// 載っていないと、その資格の日付の月が sitemap にだけ出て、月別ページは 404 になりうる。
{
  const datesSrc = fs.readFileSync(examDatesPath, "utf-8");
  const calSrc = fs.readFileSync(path.join(__dirname, "../src/lib/exam-calendar.ts"), "utf-8");
  const lists = [...datesSrc.matchAll(/export const (\w+_EXAMS)\b/g)].map((m) => m[1]);
  const missing = lists.filter((name) => !new RegExp(`\\b${name}\\b`).test(calSrc));
  if (missing.length) {
    console.error(`src/lib/exam-calendar.ts の CALENDAR_EXAMS に日程リストが足りません: ${missing.join(", ")}`);
    process.exit(1);
  }
}

// 一覧・ハブページの lastmod は、そのページに表示されるコンテンツ群の最終更新日
const staticPages = [
  { url: "/", priority: "1.0", freq: "weekly", lastmod: siteMax },
  { url: "/tokushoho/", priority: "0.3", freq: "yearly", lastmod: fileDate(path.join(appDir, "tokushoho/page.tsx")) },
  // 貸金業務取扱主任者
  { url: "/kashikin/", priority: "0.9", freq: "weekly", lastmod: kashikinMax },
  { url: "/exam/", priority: "0.7", freq: "monthly", lastmod: kashikinMax },
  { url: "/kashikin/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "kashikin/moshi/page.tsx")) },
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
  // 福祉住環境コーディネーター3級(2026-11-12 追加)。分野ページは要点の本文(src/content/field-guides/fukushi3/)が無いので noindex で、ここには載せない
  { url: "/fukushi3/", priority: "0.9", freq: "weekly", lastmod: fukushi3Max },
  { url: "/fukushi3/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "fukushi3/mock/page.tsx")) },
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
  { url: "/isf/", priority: "0.9", freq: "weekly", lastmod: isfMax },
  { url: "/isf/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "isf/moshi/page.tsx")) },
  { url: "/isf/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "isf/mock/page.tsx")) },
  { url: "/isf/field/soron/", priority: "0.8", freq: "monthly", lastmod: isfMax },
  { url: "/isf/field/hoki/", priority: "0.8", freq: "monthly", lastmod: isfMax },
  { url: "/isf/field/jinteki/", priority: "0.8", freq: "monthly", lastmod: isfMax },
  { url: "/isf/field/setsubi/", priority: "0.8", freq: "monthly", lastmod: isfMax },
  { url: "/isf/field/riyou/", priority: "0.8", freq: "monthly", lastmod: isfMax },
  { url: "/isf/field/kogeki/", priority: "0.8", freq: "monthly", lastmod: isfMax },
  { url: "/isf/field/computer/", priority: "0.8", freq: "monthly", lastmod: isfMax },
  { url: "/isf/field/network/", priority: "0.8", freq: "monthly", lastmod: isfMax },
  { url: "/dxp/", priority: "0.9", freq: "weekly", lastmod: dxpMax },
  { url: "/dxp/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "dxp/moshi/page.tsx")) },
  { url: "/dxp/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "dxp/mock/page.tsx")) },
  { url: "/dxp/field/soron/", priority: "0.8", freq: "monthly", lastmod: dxpMax },
  { url: "/dxp/field/gyoshu/", priority: "0.8", freq: "monthly", lastmod: dxpMax },
  { url: "/dxp/field/kigyo/", priority: "0.8", freq: "monthly", lastmod: dxpMax },
  { url: "/dxp/field/ai/", priority: "0.8", freq: "monthly", lastmod: dxpMax },
  { url: "/dxp/field/bigdata/", priority: "0.8", freq: "monthly", lastmod: dxpMax },
  { url: "/dxp/field/iot/", priority: "0.8", freq: "monthly", lastmod: dxpMax },
  { url: "/dxp/field/cloud/", priority: "0.8", freq: "monthly", lastmod: dxpMax },
  { url: "/dxp/field/security/", priority: "0.8", freq: "monthly", lastmod: dxpMax },
  // ハラスメントアドバイザー
  { url: "/had/", priority: "0.9", freq: "weekly", lastmod: hadMax },
  { url: "/had/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "had/moshi/page.tsx")) },
  { url: "/had/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "had/mock/page.tsx")) },
  ...["power", "sexual", "liability", "discipline", "measures", "response", "prevention", "consultation"].map((f) => ({ url: `/had/field/${f}/`, priority: "0.8", freq: "monthly", lastmod: hadMax })),
  // 企業危機・コンプライアンス管理士
  { url: "/ccm/", priority: "0.9", freq: "weekly", lastmod: ccmMax },
  { url: "/ccm/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "ccm/moshi/page.tsx")) },
  { url: "/ccm/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "ccm/mock/page.tsx")) },
  ...["csr", "governance", "risk", "system", "pr", "misconduct", "incidents", "disaster"].map((f) => ({ url: `/ccm/field/${f}/`, priority: "0.8", freq: "monthly", lastmod: ccmMax })),
  // 登録販売者試験
  { url: "/touhan/", priority: "0.9", freq: "weekly", lastmod: touhanMax },
  { url: "/touhan/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "touhan/moshi/page.tsx")) },
  { url: "/touhan/moshi2/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "touhan/moshi2/page.tsx")) },
  { url: "/touhan/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "touhan/mock/page.tsx")) },
  ...["ch1", "ch2", "ch3", "ch4", "ch5"].map((f) => ({ url: `/touhan/field/${f}/`, priority: "0.8", freq: "monthly", lastmod: touhanMax })),
  // 保育士試験（筆記）
  { url: "/hoikushi/", priority: "0.9", freq: "weekly", lastmod: hoikushiMax },
  { url: "/hoikushi/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "hoikushi/moshi/page.tsx")) },
  { url: "/hoikushi/moshi2/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "hoikushi/moshi2/page.tsx")) },
  { url: "/hoikushi/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "hoikushi/mock/page.tsx")) },
  ...["shinri", "genri", "kateifukushi", "shakaifukushi", "kyoiku", "yogo", "hoken", "shokuiku", "jissyu"].map((f) => ({ url: `/hoikushi/field/${f}/`, priority: "0.8", freq: "monthly", lastmod: hoikushiMax })),
  // 生成AIアドバイザー認定試験
  { url: "/gaia/", priority: "0.9", freq: "weekly", lastmod: gaiaMax },
  { url: "/gaia/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "gaia/moshi/page.tsx")) },
  { url: "/gaia/moshi-2kyu/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "gaia/moshi-2kyu/page.tsx")) },
  { url: "/gaia/moshi2/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "gaia/moshi2/page.tsx")) },
  { url: "/gaia/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "gaia/mock/page.tsx")) },
  ...["ai-basics", "genai-basics", "prompt", "cases", "risk-ethics", "human-role", "enterprise", "trends", "guideline"].map((f) => ({ url: `/gaia/field/${f}/`, priority: "0.8", freq: "monthly", lastmod: gaiaMax })),
  // DX推進アドバイザー認定試験
  { url: "/dxa/", priority: "0.9", freq: "weekly", lastmod: dxaMax },
  { url: "/dxa/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "dxa/moshi/page.tsx")) },
  { url: "/dxa/moshi2/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "dxa/moshi2/page.tsx")) },
  { url: "/dxa/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "dxa/mock/page.tsx")) },
  ...["genjo", "gijutsu", "tenkai"].map((f) => ({ url: `/dxa/field/${f}/`, priority: "0.8", freq: "monthly", lastmod: dxaMax })),
  // AI活用アドバイザー認定試験
  { url: "/aia/", priority: "0.9", freq: "weekly", lastmod: aiaMax },
  { url: "/aia/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "aia/moshi/page.tsx")) },
  { url: "/aia/moshi2/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "aia/moshi2/page.tsx")) },
  { url: "/aia/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "aia/mock/page.tsx")) },
  ...["basics", "tech", "genai", "project", "cases", "human", "policy"].map((f) => ({ url: `/aia/field/${f}/`, priority: "0.8", freq: "monthly", lastmod: aiaMax })),
  // 民法法務士認定試験(2026-10-31 追加)
  { url: "/ccc/", priority: "0.9", freq: "weekly", lastmod: cccMax },
  { url: "/ccc/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "ccc/moshi/page.tsx")) },
  { url: "/ccc/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "ccc/mock/page.tsx")) },
  ...["sousoku1", "sousoku2", "bukken", "saiken1", "saiken2", "keiyaku", "houtei", "kazoku"].map((f) => ({ url: `/ccc/field/${f}/`, priority: "0.8", freq: "monthly", lastmod: cccMax })),
  // 労働法務士認定試験(2026-10-31 追加)
  { url: "/llc/", priority: "0.9", freq: "weekly", lastmod: llcMax },
  { url: "/llc/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "llc/moshi/page.tsx")) },
  { url: "/llc/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "llc/mock/page.tsx")) },
  ...["souron", "keiyaku", "jikan", "anzen", "byodo", "roushi", "hosho", "funso"].map((f) => ({ url: `/llc/field/${f}/`, priority: "0.8", freq: "monthly", lastmod: llcMax })),
  // 会社法法務士認定試験(2026-10-31 追加)
  { url: "/cac/", priority: "0.9", freq: "weekly", lastmod: cacMax },
  { url: "/cac/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "cac/moshi/page.tsx")) },
  { url: "/cac/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "cac/mock/page.tsx")) },
  ...["setsuritsu", "kabushiki", "soukai", "yakuin", "keisan", "saihen", "mochibun", "kaisan"].map((f) => ({ url: `/cac/field/${f}/`, priority: "0.8", freq: "monthly", lastmod: cacMax })),
  // インバウンド実務主任者認定試験(2026-10-31 追加)
  { url: "/ibd/", priority: "0.9", freq: "weekly", lastmod: ibdMax },
  { url: "/ibd/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "ibd/moshi/page.tsx")) },
  { url: "/ibd/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "ibd/mock/page.tsx")) },
  ...["kankou", "doukou", "shouhi", "newtourism", "rikai", "taiou", "shukyaku", "kokunai"].map((f) => ({ url: `/ibd/field/${f}/`, priority: "0.8", freq: "monthly", lastmod: ibdMax })),
  // DXオフィサー認定試験(2026-10-31 追加)
  { url: "/dxo/", priority: "0.9", freq: "weekly", lastmod: dxoMax },
  { url: "/dxo/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "dxo/moshi/page.tsx")) },
  { url: "/dxo/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "dxo/mock/page.tsx")) },
  ...["souron", "gyoushu", "ai", "data", "cloud", "marketing", "security", "tenkai"].map((f) => ({ url: `/dxo/field/${f}/`, priority: "0.8", freq: "monthly", lastmod: dxoMax })),
  // ワークライフ・コーディネーター認定試験(2026-10-31 追加)
  { url: "/wlc/", priority: "0.9", freq: "weekly", lastmod: wlcMax },
  { url: "/wlc/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "wlc/moshi/page.tsx")) },
  { url: "/wlc/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "wlc/mock/page.tsx")) },
  ...["kiso", "theme1", "theme2", "chiryo", "ikuji", "roudouhou", "koyou", "shakaihosho"].map((f) => ({ url: `/wlc/field/${f}/`, priority: "0.8", freq: "monthly", lastmod: wlcMax })),
  // エックス線作業主任者免許試験
  { url: "/xray/", priority: "0.9", freq: "weekly", lastmod: xrayMax },
  { url: "/xray/moshi/", priority: "0.7", freq: "monthly", lastmod: fileDate(path.join(appDir, "xray/moshi/page.tsx")) },
  { url: "/xray/moshi2/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "xray/moshi2/page.tsx")) },
  { url: "/xray/mock/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "xray/mock/page.tsx")) },
  ...["kanri", "hourei", "sokutei", "seitai"].map((f) => ({ url: `/xray/field/${f}/`, priority: "0.8", freq: "monthly", lastmod: xrayMax })),
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
  // 資格試験カレンダー(2026-11-01 追加)。月別ページは exam-dates.ts に日付がある月だけ作られる
  // (src/app/calendar/[ym]/page.tsx の generateStaticParams)。同じファイルから月を拾って揃える。
  { url: "/calendar/", priority: "0.8", freq: "weekly", lastmod: fileDate(examDatesPath) },
  ...calendarMonths.map((ym) => ({ url: `/calendar/${ym}/`, priority: "0.6", freq: "monthly", lastmod: fileDate(examDatesPath) })),
  // その他 (/study/ は localStorage 依存の個人ページで noindex のため sitemap から除外)
  // はじめての方へ(サイト全体の使い方・作り方。2026-11-10 追加)
  { url: "/hajimete/", priority: "0.6", freq: "monthly", lastmod: fileDate(path.join(appDir, "hajimete/page.tsx")) },
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
  { entries: fukushi3, prefix: "/fukushi3/q/" },
  { entries: bijimane, prefix: "/bijimane/q/" },
  { entries: eco, prefix: "/eco/q/" },
  { entries: bijihou2, prefix: "/bijihou2/q/" },
  { entries: itpass, prefix: "/itpass/q/" },
  { entries: chintai, prefix: "/chintai/q/" },
  { entries: kangyo, prefix: "/kangyo/q/" },
  { entries: isec, prefix: "/isec/q/" },
  { entries: kyoin, prefix: "/kyoin/q/" },
  { entries: shakai, prefix: "/shakai/q/" },
  { entries: isf, prefix: "/isf/q/" },
  { entries: dxp, prefix: "/dxp/q/" },
  { entries: touhan, prefix: "/touhan/q/" },
  { entries: hoikushi, prefix: "/hoikushi/q/" },
  { entries: gaia, prefix: "/gaia/q/" },
  { entries: dxa, prefix: "/dxa/q/" },
  { entries: aia, prefix: "/aia/q/" },
  { entries: xray, prefix: "/xray/q/" },
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
// 必須項目(exam・examPeriod・result・publishedAt)が欠けた下書きは数えない(src/lib/voices.ts の isPublishable と同じ基準。2026-11-10)
const voicesDir = path.join(__dirname, "../src/content/voices");
const voices = collect(voicesDir).filter((e) => {
  const { data } = matter(fs.readFileSync(path.join(voicesDir, `${e.slug}.md`), "utf-8"));
  return Boolean(data.exam && data.examPeriod && data.result && data.publishedAt);
});
const voicePages =
  voices.length > 0
    ? [{ url: "/voice/", priority: "0.6", freq: "weekly", lastmod: maxDate(voices, todayFallback) }]
    : [];

// 問題ページ(/q/ と /<資格>/q/)は 2026-09-25 から noindex(各 q/[slug]/page.tsx)。
// 検索クリックの実測は Google 2%・Bing 0% で、流入はコラムと資格トップでほぼ全部だった。
// 4千枚の同じ型のページはサイト全体の評価(AdSense の審査を含む)を下げる側に働くと判断した。
// noindex の URL を sitemap に載せると Search Console が「noindex なのに送信されている」と
// 警告するので、ここで外す。資格を増やして contentPages に足しても /q/ は自動で除かれる。
const isQuestionUrl = (url) => /^\/(?:[a-z0-9]+\/)?q\//.test(url);

// 2026-11-10: AdSense の再審査(「有用性の低いコンテンツ」で不承認)に向けて、そのページにしかない文章が
// ほとんど無い一覧・入口のページを noindex にした。ページ側の noindex と同じ基準で、ここでも外す。
//   - /tokushoho/(もともと noindex。いま販売している商品は無い)
//   - /exam/・/exam/0/(貸金の問題一覧)と /field/(貸金の分野一覧)
//   - 論点まとめ /topic/*・/pii/topic/*(問題文の書き出しを並べて自動で作るページ)
//   - 本番形式テスト /<資格>/mock/(出題ボタンと案内だけ)
//   - 分野ページのうち、要点の本文 src/content/field-guides/<資格>/<分野slug>.md が無いもの(src/lib/field-guides.ts)
//   - 試験カレンダーの終わった月(src/app/calendar/[ym]/page.tsx)
const fieldGuidesDir = path.join(__dirname, "../src/content/field-guides");
const currentYmJst = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 7);
/** 分野ページなら要点の本文のファイルのパスを返す(ファイルがあるかは問わない)。分野ページでなければ null */
function fieldGuidePath(url) {
  const m = url.match(/^\/(?:([a-z0-9]+)\/)?field\/([a-z0-9-]+)\/$/);
  if (!m) return null;
  const exam = m[1] || "kashikin"; // 貸金の分野ページは /field/<slug>/
  return path.join(fieldGuidesDir, exam, `${m[2]}.md`);
}
/** 分野ページなら要点の本文があるかを返す。分野ページでなければ null */
function fieldGuideExists(url) {
  const p = fieldGuidePath(url);
  return p === null ? null : fs.existsSync(p);
}
const examIntrosDir = path.join(__dirname, "../src/content/exam-intros");
/** 資格トップ(/<資格>/)なら「勉強の進め方」の本文のファイルのパスを返す(ファイルがあるかは問わない)。資格トップでなければ null */
function examIntroPath(url) {
  const m = url.match(/^\/([a-z0-9]+)\/$/);
  return m ? path.join(examIntrosDir, `${m[1]}.md`) : null;
}
const isEndedCalendarMonth = (url) => {
  const m = url.match(/^\/calendar\/(\d{4}-\d{2})\/$/);
  return !!m && m[1] < currentYmJst;
};
const isNoindexUrl = (url) =>
  url === "/tokushoho/" ||
  url === "/exam/" ||
  /^\/exam\/\d+\/$/.test(url) ||
  url === "/field/" ||
  /^\/(?:pii\/)?topic\//.test(url) ||
  /^\/(?:[a-z0-9]+\/)?mock\/$/.test(url) ||
  fieldGuideExists(url) === false ||
  isEndedCalendarMonth(url);

const allPages = [
  ...staticPages,
  { url: "/column/", priority: "0.8", freq: "weekly", lastmod: columnsMax },
  ...voicePages,
  ...contentPages.filter((p) => !isQuestionUrl(p.url)),
]
  .filter((p) => !isNoindexUrl(p.url))
  // 要点の本文がある分野ページの lastmod は、問題の更新日と要点の更新日の新しいほう。
  // 要点を置いて index に戻ったこと・要点を直したことを、検索エンジンに伝えるため(2026-11-10)
  // 資格トップも同じく、「勉強の進め方」の本文(src/content/exam-intros/<資格>.md。src/lib/exam-intros.ts)があれば、その更新日も見る
  .map((p) => {
    const extra = fieldGuidePath(p.url) ?? examIntroPath(p.url);
    return extra && fs.existsSync(extra) ? { ...p, lastmod: [p.lastmod, fileDate(extra)].sort().at(-1) } : p;
  });

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
  // 月が替わると、生成した時点ではこれからだった月が「終わった月」になって expected から抜ける。
  // その月がコミット済みの sitemap に残っているのは古いだけで害はないので、ビルドは止めない(次にローカルで生成すれば消える)
  const extra = [...committed].filter((u) => !expected.has(u) && !isEndedCalendarMonth(u.slice(BASE_URL.length)));
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
