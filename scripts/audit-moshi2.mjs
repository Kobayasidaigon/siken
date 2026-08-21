#!/usr/bin/env node
// =============================================================================
// 模擬試験 第2回(書き下ろし)の問題データの機械監査。
//
// 【なぜ audit-questions.mjs と別か】
// audit-questions.mjs は src/content/**/*.md を見るが、第2回は無料問題集に混ぜ
// たくないので src/lib/*-moshi2.ts に直接持つ。そのため既存の監査が届かない。
// 有料で売る前提の問題こそ品質を落とせないので、同等の基準に加えて、この商品
// 特有の事故を2つ検査する:
//
//   1. 無料で公開済みの問題(src/content/<cert>/*.md)との重複
//      無料サイトで解ける問題を売ってしまうのが、この商品で一番やってはいけない事故。
//      実際に設備サイトの移植時、90問中3問が無料問題と実質同一で見つかった。
//   2. 正解位置の周期パターン
//      分布が均等でも規則的だと、内容を知らなくても当てられる。
//
//   node scripts/audit-moshi2.mjs          … 監査(違反があれば exit 1)
//   node scripts/audit-moshi2.mjs --report … 数値だけ出して常に exit 0
//   node scripts/audit-moshi2.mjs chizai   … 資格を絞る
// =============================================================================

import fs from "node:fs";
import path from "node:path";

const REPORT_ONLY = process.argv.includes("--report");
const ONLY = process.argv.slice(2).filter((a) => !a.startsWith("--"));

const LIMITS = {
  GAP_CHARS: 20,       // 正解肢が他より何字長ければ「長すぎ」とみなすか
  GAP_RATIO_PCT: 2,    // その問題が全体の何%まで許されるか
  ANSWER_POS_PCT: 45,  // 4択なら偶然は25%。45%を超えたら偏り
  DUP_MAX: 0,
  POS_REF_MAX: 0,
  NEAR_DUP: 0.6,      // 設問文＋正解肢のbigram類似度がこれ以上なら言い換え重複を疑う
  PERIOD_SHARE: 0.7,   // 周期クラス内で同じ位置が占めてよい上限
  PERIOD_MIN: 2,
  PERIOD_MAX: 6,
};

// 解説が選択肢の「位置」に言及していないか。第2回は出題順を固定するとはいえ、
// 番号で語る解説は問題の並べ替えに耐えないし、読み手にも不親切。
const POS_REF = /選択肢[0-9１-４]|最初の選択肢|[1-4１-４]番目の選択肢|肢[1-4１-４]/;

// 日本語(かな・漢字)・英数・記号以外の文字。生成時にハングルやキリル文字が
// 紛れ込む事故が設備サイトで実際に起きたので、機械で弾く。
const STRAY_SCRIPT = /[Ѐ-ӿ가-힯฀-๿]/;

// 日本語の文中に英単語が紛れ込む事故("一定回数continuously誤ると"のような生成崩れ)を拾う。
// CVSS・DKIM・IoT のような略語は大文字なので、小文字4字以上の連なりだけを見る。
// e-Tax / TLS 1.3 のような表記を誤検知しないよう、前後が英字の場合は対象外。
const STRAY_LATIN = /(?<![A-Za-z])[a-z]{4,}(?![A-Za-z])/;

// 監査の対象。**このリストはサイト固有**なので、他サイトからスクリプトを
// コピーしたときは必ず書き換えること(コピーしたまま放置して、本来の資格を
// 監査しなくなる事故を実際に起こした)。
const TARGETS = [
  { certId: "pii",      name: "個人情報保護士",              expect: 100 },
  { certId: "chizai",   name: "知的財産管理技能検定3級",     expect: 30  },
  { certId: "chizai2",  name: "知的財産管理技能検定2級",     expect: 40  },
  { certId: "mynumber", name: "マイナンバー実務検定3級",     expect: 35, ox: 15 },
  { certId: "jitsumu",  name: "個人情報保護実務検定",        expect: 80  },
  { certId: "bijihou",  name: "ビジネス実務法務検定3級",     expect: 35, ox: 15 },
  { certId: "fukushi2", name: "福祉住環境コーディネーター2級", expect: 50 },
  { certId: "bijimane", name: "ビジネスマネジャー検定",      expect: 50  },
  { certId: "eco",      name: "eco検定",                     expect: 50  },
];

/** *-moshi2.ts をブロック分割して読む(TSを実行せずテキストとして解析)。 */
function readMoshi2(file) {
  if (!fs.existsSync(file)) return [];
  const src = fs.readFileSync(file, "utf8");
  const items = [];
  for (const b of src.split(/\r?\n  \{\r?\n/).slice(1)) {
    const id = (b.match(/id: "((?:[^"\\]|\\.)*)"/) || [])[1];
    const q = (b.match(/questionText:\s*\r?\n?\s*"((?:[^"\\]|\\.)*)"/) || [])[1];
    const cm = b.match(/choices: \[([\s\S]*?)\],\r?\n/);
    const am = b.match(/correctAnswer: (\d)/);
    const em = b.match(/explain:\s*\r?\n?\s*"((?:[^"\\]|\\.)*)"/);
    const fm = (b.match(/field: "([^"]+)"/) || [])[1];
    const dm = (b.match(/difficulty: "([ABC])"/) || [])[1];
    if (!id || !q || !cm || !am) continue;
    items.push({
      id,
      q,
      field: fm ?? "",
      difficulty: dm ?? "",
      choices: [...cm[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]),
      answer: Number(am[1]), // 1始まり
      explain: em ? em[1] : "",
    });
  }
  return items;
}

/** *-moshi2-ox.ts の○×問題を読む。 */
function readMoshi2Ox(file) {
  if (!fs.existsSync(file)) return [];
  const src = fs.readFileSync(file, "utf8");
  const items = [];
  for (const b of src.split(/\r?\n  \{\r?\n/).slice(1)) {
    const id = (b.match(/id: "((?:[^"\\]|\\.)*)"/) || [])[1];
    const st = (b.match(/statement:\s*\r?\n?\s*"((?:[^"\\]|\\.)*)"/) || [])[1];
    const an = (b.match(/answer: (true|false)/) || [])[1];
    const fm = (b.match(/field: "([^"]+)"/) || [])[1];
    const em = (b.match(/explain:\s*\r?\n?\s*"((?:[^"\\]|\\.)*)"/) || [])[1];
    if (!id || !st || !an) continue;
    items.push({ id, statement: st, answer: an === "true", field: fm ?? "", explain: em ?? "" });
  }
  return items;
}

/** 無料問題集(markdown)の設問文と分野を読む。 */
function readFreeBank(certId) {
  const dir = path.join("src/content", certId === "kashikin" ? "questions" : certId);
  if (!fs.existsSync(dir)) return { texts: new Map(), fields: new Set() };
  const texts = new Map();
  const fields = new Set();
  const gists = [];
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md"))) {
    const src = fs.readFileSync(path.join(dir, f), "utf8");
    const qt = (src.match(/^questionText:\s*"([\s\S]*?)"\s*$/m) || [])[1];
    const fd = (src.match(/^field:\s*"?([^"\n]+?)"?\s*$/m) || [])[1];
    const ca = Number((src.match(/^correctAnswer:\s*(\d)/m) || [])[1]);
    const cm = src.match(/^choices:\n([\s\S]*?)^correctAnswer:/m);
    const chs = cm ? [...cm[1].matchAll(/^\s*-\s*"([\s\S]*?)"\s*$/gm)].map((m) => m[1]) : [];
    const slug = f.replace(/\.md$/, "");
    if (qt) texts.set(norm(qt), slug);
    if (fd) fields.add(fd.trim());
    if (qt && chs[ca - 1]) gists.push({ slug, gist: norm(qt + chs[ca - 1]) });
  }
  return { texts, fields, gists };
}

/** 比較用に設問文を正規化(記号と空白の揺れを吸収)。 */
const norm = (s) => String(s).replace(/[（）()「」『』、。・,.\s]/g, "");

/** 文字bigramのDice係数。設問文の言い回しを変えただけの重複を拾うために使う。 */
function bigrams(s) {
  const out = new Set();
  for (let i = 0; i + 1 < s.length; i++) out.add(s.slice(i, i + 2));
  return out;
}
function dice(a, b) {
  if (!a.size || !b.size) return 0;
  let hit = 0;
  for (const g of a) if (b.has(g)) hit++;
  return (2 * hit) / (a.size + b.size);
}

let anyViolation = false;
let anyData = false;

for (const t of TARGETS) {
  if (ONLY.length && !ONLY.includes(t.certId)) continue;
  const file = `src/lib/${t.certId}-moshi2.ts`;
  const paid = readMoshi2(file);

  if (paid.length === 0) {
    if (ONLY.length) console.log(`\n[第2回の監査] ${t.certId} — 未作成 (${file})`);
    continue;
  }
  anyData = true;
  console.log(`\n[第2回の監査] ${t.certId} (${t.name}) — ${paid.length}問  (${file})`);
  if (paid.length !== t.expect) {
    console.log(`  ※ 想定 ${t.expect}問${t.ox ? `(+○×${t.ox}問)` : ""} に対して ${paid.length}問`);
  }

  const violations = [];
  const pos = [0, 0, 0, 0, 0];
  const overGap = [];
  let posRef = 0;
  let shape = 0;
  const strays = [];
  const badFields = [];
  const badDiff = [];

  const { texts: freeTexts, fields: freeFields, gists: freeGists } = readFreeBank(t.certId);

  for (const it of paid) {
    const { choices: ch, answer: a } = it;
    if (!Array.isArray(ch) || ch.length !== 4 || !(a >= 1 && a <= ch.length)) {
      shape++;
      continue;
    }
    pos[a - 1]++;
    const lens = ch.map((c) => c.length);
    const ai = a - 1;
    if (lens[ai] === Math.max(...lens)) {
      const gap = lens[ai] - Math.max(...lens.filter((_, i) => i !== ai));
      if (gap >= LIMITS.GAP_CHARS) overGap.push({ id: it.id, gap });
    }
    if (POS_REF.test(it.explain)) posRef++;
    const blob = [it.q, it.explain, ...ch].join(" ");
    if (STRAY_SCRIPT.test(blob) || STRAY_LATIN.test(blob)) strays.push(it.id);
    // 分野名は第1回・無料問題集と一致していないと弱点分析の集計が割れる
    if (freeFields.size && !freeFields.has(it.field)) badFields.push(`${it.id}: "${it.field}"`);
    if (!["A", "B", "C"].includes(it.difficulty)) badDiff.push(it.id);
  }

  /* ---- ID の重複・欠番 ---- */
  const ids = paid.map((x) => x.id);
  const dupIds = ids.filter((x, i) => ids.indexOf(x) !== i);

  /* ---- 正解位置の周期性 ---- */
  const shown = paid.map((it) => it.answer - 1);
  const periodHits = [];
  for (let k = LIMITS.PERIOD_MIN; k <= LIMITS.PERIOD_MAX; k++) {
    for (let r = 0; r < k; r++) {
      const cls = shown.filter((_, i) => i % k === r);
      if (cls.length < 8) continue;
      const freq = {};
      for (const v of cls) freq[v] = (freq[v] || 0) + 1;
      const top = Math.max(...Object.values(freq));
      const share = top / cls.length;
      if (share > LIMITS.PERIOD_SHARE) {
        periodHits.push(`周期${k}の${r}番目: ${Math.round(share * 100)}%が同じ位置 (${cls.length}問中${top}問)`);
      }
    }
  }

  /* ---- 重複 ---- */
  const seen = new Map();
  const dupsInside = [];
  for (const it of paid) {
    const k = norm(it.q);
    if (seen.has(k)) dupsInside.push(`${it.id} ⇔ ${seen.get(k)}`);
    else seen.set(k, it.id);
  }
  const dupsFree = [];
  for (const it of paid) {
    const hit = freeTexts.get(norm(it.q));
    if (hit) dupsFree.push(`${it.id} ⇔ ${hit}`);
  }

  /* ---- 言い回しを変えただけの重複 ----
     設問文が1文字でも違えば上の完全一致は素通りする。買った人が「無料で解いた
     問題だ」と気づくのは論点が同じときなので、設問文＋正解肢をまとめた文字列の
     bigram類似度で近い組を拾う。しきい値は、同じ分野の別論点(0.4前後)と
     同一論点の言い換え(0.6超)が分かれる位置に置いている。 */
  const freeBg = freeGists.map((g) => ({ slug: g.slug, bg: bigrams(g.gist) }));
  const nearDups = [];
  for (const it of paid) {
    const mine = bigrams(norm(it.q + (it.choices[it.answer - 1] ?? "")));
    let best = { slug: "", score: 0 };
    for (const f of freeBg) {
      const sc = dice(mine, f.bg);
      if (sc > best.score) best = { slug: f.slug, score: sc };
    }
    if (best.score >= LIMITS.NEAR_DUP) {
      nearDups.push(`${it.id} ⇔ ${best.slug} (類似度 ${Math.round(best.score * 100)}%)`);
    }
  }

  const n = paid.length;
  const pct = (x) => Math.round((x / n) * 1000) / 10;
  const maxPosPct = pct(Math.max(...pos));
  const gapPct = pct(overGap.length);

  console.log(`  正解肢が${LIMITS.GAP_CHARS}字以上長い: ${overGap.length}問 (${gapPct}%)  [上限 ${LIMITS.GAP_RATIO_PCT}%]`);
  console.log(`  正解位置の分布     : ${pos.slice(0, 4).join(" / ")}  (最大 ${maxPosPct}% / 上限 ${LIMITS.ANSWER_POS_PCT}%)`);
  console.log(`  正解位置の周期性   : ${periodHits.length}件  [上限 0件]`);
  console.log(`  設問文の重複(内部) : ${dupsInside.length}件  [上限 ${LIMITS.DUP_MAX}件]`);
  console.log(`  無料問題と論点が近い: ${nearDups.length}件  [上限 0件]  ※言い換え重複の検出(類似度${Math.round(LIMITS.NEAR_DUP * 100)}%以上)`);
  console.log(`  無料問題との重複   : ${dupsFree.length}件  [上限 ${LIMITS.DUP_MAX}件]  ※有料の生命線 (無料 ${freeTexts.size}問と照合)`);
  console.log(`  解説が位置に言及   : ${posRef}問  [上限 ${LIMITS.POS_REF_MAX}問]`);
  console.log(`  分野名が第1回と不一致: ${badFields.length}問  [上限 0問]`);
  console.log(`  異種文字・英単語混入: ${strays.length}問  [上限 0問]`);
  if (shape) console.log(`  形式不正           : ${shape}件`);

  if (shape > 0) violations.push(`形式不正(4択でない/正解番号が範囲外)が${shape}件`);
  if (dupIds.length) violations.push(`IDが重複: ${[...new Set(dupIds)].join(", ")}`);
  if (badDiff.length) violations.push(`difficulty が A/B/C でない問題が${badDiff.length}問 (${badDiff.slice(0, 5).join(", ")})`);
  if (badFields.length)
    violations.push(`分野名が第1回・無料問題集と一致しない問題が${badFields.length}問 — 弱点分析の集計が割れる\n      ` + badFields.slice(0, 5).join("\n      "));
  if (strays.length) violations.push(`日本語以外の文字や英単語が混入: ${strays.slice(0, 5).join(", ")}`);
  if (posRef > LIMITS.POS_REF_MAX) violations.push(`解説が選択肢の位置に言及している問題が${posRef}問`);
  if (gapPct > LIMITS.GAP_RATIO_PCT)
    violations.push(`正解肢が${LIMITS.GAP_CHARS}字以上長い問題が${overGap.length}問(${gapPct}%) — 内容を知らなくても長い肢が当たる`);
  if (maxPosPct > LIMITS.ANSWER_POS_PCT) violations.push(`正解位置が${maxPosPct}%に偏っている`);
  if (periodHits.length > 0)
    violations.push(`正解位置に周期パターンがある(${periodHits.length}件)\n      ` + periodHits.slice(0, 4).join("\n      "));
  if (dupsInside.length > LIMITS.DUP_MAX) violations.push(`第2回の内部で設問が${dupsInside.length}件重複`);
  if (dupsFree.length > LIMITS.DUP_MAX)
    violations.push(`無料で公開済みの問題と${dupsFree.length}件重複 — 有料商品として成立しない`);
  if (nearDups.length > 0)
    violations.push(
      `無料問題と論点が同じ疑いのある問題が${nearDups.length}件 — 言い換えても買った人には同じ問題に見える\n      ` +
        nearDups.join("\n      ")
    );

  if (violations.length) {
    anyViolation = true;
    console.log("\n  違反:");
    violations.forEach((v) => console.log("    - " + v));
    if (dupsFree.length) {
      console.log("\n  無料問題との重複(先頭5件):");
      dupsFree.slice(0, 5).forEach((d) => console.log("    " + d));
    }
    if (dupsInside.length) {
      console.log("\n  内部重複(先頭5件):");
      dupsInside.slice(0, 5).forEach((d) => console.log("    " + d));
    }
    if (overGap.length) {
      console.log("\n  正解肢が長い上位5件:");
      overGap.sort((a, b) => b.gap - a.gap).slice(0, 5).forEach((o) => console.log(`    ${o.id} (+${o.gap}字)`));
    }
  } else {
    console.log("  → 監査OK");
  }
}

/* ---- ○×(二肢択一)問題の監査 ----
   ○×は当てずっぽうで50%当たるため、○と×の偏りがそのまま得点の下駄になる。
   4択以上に配分と連続を厳しく見る。 */
for (const t of TARGETS) {
  if (ONLY.length && !ONLY.includes(t.certId)) continue;
  const file = `src/lib/${t.certId}-moshi2-ox.ts`;
  const ox = readMoshi2Ox(file);
  if (ox.length === 0) continue;
  anyData = true;
  console.log(`\n[第2回の監査/○×] ${t.certId} — ${ox.length}問  (${file})`);

  const v = [];
  const nTrue = ox.filter((x) => x.answer).length;
  const truePct = Math.round((nTrue / ox.length) * 1000) / 10;
  let run = 1, maxRun = 1;
  for (let i = 1; i < ox.length; i++) {
    run = ox[i].answer === ox[i - 1].answer ? run + 1 : 1;
    if (run > maxRun) maxRun = run;
  }
  const seenOx = new Map(); const dupOx = [];
  for (const x of ox) {
    const k = norm(x.statement);
    if (seenOx.has(k)) dupOx.push(`${x.id} ⇔ ${seenOx.get(k)}`); else seenOx.set(k, x.id);
  }
  const fb = readFreeBank(t.certId);
  const freeBgOx = fb.gists.map((g) => ({ slug: g.slug, bg: bigrams(g.gist) }));
  const nearOx = [];
  for (const x of ox) {
    const mine = bigrams(norm(x.statement));
    let best = { slug: "", score: 0 };
    for (const f of freeBgOx) { const sc = dice(mine, f.bg); if (sc > best.score) best = { slug: f.slug, score: sc }; }
    if (best.score >= LIMITS.NEAR_DUP) nearOx.push(`${x.id} ⇔ ${best.slug} (類似度 ${Math.round(best.score * 100)}%)`);
  }
  const badFOx = ox.filter((x) => fb.fields.size && !fb.fields.has(x.field)).map((x) => `${x.id}: "${x.field}"`);
  const strayOx = ox.filter((x) => {
    const blob = x.statement + x.explain;
    return STRAY_SCRIPT.test(blob) || STRAY_LATIN.test(blob);
  }).map((x) => x.id);
  const noExp = ox.filter((x) => !x.explain).map((x) => x.id);

  console.log(`  ○の割合           : ${truePct}%  [30〜70%]`);
  console.log(`  同じ答えの最大連続 : ${maxRun}問  [上限 3問]`);
  console.log(`  記述の重複(内部)   : ${dupOx.length}件  [上限 0件]`);
  console.log(`  無料問題と論点が近い: ${nearOx.length}件  [上限 0件]`);
  console.log(`  分野名が第1回と不一致: ${badFOx.length}問  [上限 0問]`);
  console.log(`  異種文字・英単語混入: ${strayOx.length}問  [上限 0問]`);

  if (truePct < 30 || truePct > 70) v.push(`○の割合が${truePct}% — 当てずっぽうの正答率が上がる`);
  if (maxRun > 3) v.push(`同じ答えが${maxRun}問連続している`);
  if (dupOx.length) v.push(`記述が${dupOx.length}件重複 (${dupOx.slice(0, 3).join(", ")})`);
  if (nearOx.length) v.push(`無料問題と論点が同じ疑いのある問題が${nearOx.length}件\n      ` + nearOx.join("\n      "));
  if (badFOx.length) v.push(`分野名が一致しない問題が${badFOx.length}問 (${badFOx.slice(0, 3).join(", ")})`);
  if (strayOx.length) v.push(`日本語以外の文字や英単語が混入: ${strayOx.join(", ")}`);
  if (noExp.length) v.push(`解説が無い問題が${noExp.length}問 (${noExp.slice(0, 3).join(", ")})`);

  if (v.length) { anyViolation = true; console.log("\n  違反:"); v.forEach((x) => console.log("    - " + x)); }
  else console.log("  → 監査OK");
}

if (!anyData) console.log("\n[第2回の監査] 対象データなし");
console.log("");
if (REPORT_ONLY) process.exit(0);
if (anyViolation) {
  console.error("audit-moshi2: 違反があるためビルドを中止します\n");
  process.exit(1);
}
