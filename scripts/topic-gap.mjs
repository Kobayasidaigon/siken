#!/usr/bin/env node
// =============================================================================
// 論点ギャップ分析。「まだコラムにしていない論点」を、検証済み解説の厚い順に出す。
//
//   node scripts/topic-gap.mjs                … 候補を上位から表示
//   node scripts/topic-gap.mjs --min 6        … 問題数6問以上の論点だけ
//   node scripts/topic-gap.mjs --exam pii     … 資格を絞る
//   node scripts/topic-gap.mjs --json         … 機械可読出力(プロンプトへの入力用)
//
// 【なぜ必要か】
// 既存コラムは「とは / 合格率 / 勉強法 / 勉強時間 / 過去問 / 日程 / 意味ない / テキスト」を
// 資格ごとに横展開した型で、10資格ぶんほぼ埋まっている。ここに足すと骨格が同じ記事が増え、
// check-column-dup.mjs の閾値に当たる。増やす余地は別の軸にしかない。
//
// その軸が「論点解説」。本サイトには2,500問超の解説が既にあり、条文番号つきで検品も
// 通っている(2026-08 の是正44コミット)。1つの論点に複数問ぶんの検証済み記述が溜まって
// いるので、それを束ねれば新規の調査なしに記事が作れる。しかも論点ごとに中身が違うため、
// 構造的に重複しない。
//
// 既存の例外記事 fukushi2-riyusho(住宅改修の理由書とは？)がこの型の先行事例で、
// 93本中唯一「資格の情報」ではなく「論点そのもの」を扱っている。
//
// このスクリプトは検索需要を知らない。問題数は「その論点に検証済みの材料がどれだけ
// あるか」であって、人気度ではない。最終的にどれを書くかは人が選ぶこと。
// =============================================================================

import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : fallback;
};
const MIN_Q = Number(opt("min", 4));
const EXAM_FILTER = opt("exam", null);
const AS_JSON = argv.includes("--json");

const CONTENT = path.join(process.cwd(), "src/content");

// ディレクトリ名 -> 資格名(表示用)
const EXAMS = {
  questions: "貸金業務取扱主任者",
  pii: "個人情報保護士",
  chizai: "知的財産管理技能検定3級",
  chizai2: "知的財産管理技能検定2級",
  mynumber: "マイナンバー実務検定3級",
  jitsumu: "個人情報保護実務検定",
  bijihou: "ビジネス実務法務検定3級",
  fukushi2: "福祉住環境コーディネーター2級",
  bijimane: "ビジネスマネジャー検定",
  eco: "eco検定",
};

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ---- 既存コラム(論点が既に扱われていないかの照合先) -------------------------
const COLUMNS_DIR = path.join(CONTENT, "columns");
const columns = fs.existsSync(COLUMNS_DIR)
  ? fs
      .readdirSync(COLUMNS_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => ({
        slug: f.replace(/\.md$/, ""),
        text: fs.readFileSync(path.join(COLUMNS_DIR, f), "utf-8"),
      }))
  : [];

/**
 * その論点に触れている既存コラムを返す。
 * 本文で一度触れただけか、見出し・タイトルに立てて論じているかを区別する。
 * 後者は「もう記事になっている」とみなして候補から外す。
 */
function coveredBy(topic) {
  const hits = [];
  for (const c of columns) {
    if (!c.text.includes(topic)) continue;
    const inHeading = new RegExp(
      `^(#{1,3} .*|title: .*|description: .*)${escapeRe(topic)}`,
      "m"
    ).test(c.text);
    hits.push({ slug: c.slug, heading: inHeading });
  }
  return hits;
}

// ---- 問題から論点を集める ---------------------------------------------------
// title の形式は 【問N】<資格名> 練習問題｜<論点> で全資格そろっている。
const topics = new Map();

for (const [dir, examName] of Object.entries(EXAMS)) {
  if (EXAM_FILTER && dir !== EXAM_FILTER) continue;
  const d = path.join(CONTENT, dir);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d).filter((x) => x.endsWith(".md"))) {
    const head = fs.readFileSync(path.join(d, f), "utf-8").slice(0, 3000);
    const title = head.match(/^title:\s*"(.*?)"/m)?.[1];
    const field = head.match(/^field:\s*"(.*?)"/m)?.[1] ?? "";
    if (!title || !title.includes("｜")) continue;
    const topic = title.split("｜").pop().trim();
    if (topic.length < 3) continue;
    const key = `${dir}::${topic}`;
    if (!topics.has(key)) {
      topics.set(key, { dir, exam: examName, topic, field, files: [] });
    }
    topics.get(key).files.push(f.replace(/\.md$/, ""));
  }
}

// ---- 候補の抽出 -------------------------------------------------------------
const rows = [];
for (const t of topics.values()) {
  if (t.files.length < MIN_Q) continue;
  const cov = coveredBy(t.topic);
  rows.push({
    exam: t.exam,
    dir: t.dir,
    field: t.field,
    topic: t.topic,
    questions: t.files.length,
    sampleQuestions: t.files.slice(0, 8),
    coveredInHeading: cov.filter((c) => c.heading).map((c) => c.slug),
    mentionedIn: cov.filter((c) => !c.heading).map((c) => c.slug),
  });
}

const candidates = rows.filter((r) => r.coveredInHeading.length === 0);
candidates.sort((a, b) => b.questions - a.questions || a.exam.localeCompare(b.exam));

if (AS_JSON) {
  console.log(JSON.stringify({ minQuestions: MIN_Q, total: candidates.length, candidates }, null, 2));
} else {
  console.log(`論点 ${topics.size} 件のうち、問題 ${MIN_Q} 問以上ある論点は ${rows.length} 件`);
  console.log(`そのうち既存コラムで見出しに立っていない(=未記事化)のは ${candidates.length} 件`);
  console.log("");
  console.log("問数 資格                 分野                 論点");
  for (const r of candidates.slice(0, 40)) {
    const note = r.mentionedIn.length
      ? `  (本文で言及: ${r.mentionedIn.slice(0, 2).join(",")})`
      : "";
    console.log(
      `${String(r.questions).padStart(4)} ${r.exam.padEnd(20)} ${r.field.slice(0, 20).padEnd(20)} ${r.topic}${note}`
    );
  }
}
