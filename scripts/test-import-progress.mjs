#!/usr/bin/env node
// =============================================================================
// 学習履歴の統合(importProgress)の動作確認。
//
// 【なぜ要るか】
// 学習履歴の保存先は localStorage だけで、書き出したファイルの読み込みは
// 利用者にとって取り返しのつかない操作(replace は元に戻せない)。
// このリポジトリにテストの仕組みが無いので、この1本だけ node 単体で動くように
// してある(study-progress.ts を typescript でその場に変換し、localStorage を
// 差し替えて実行する)。
//
// とくに (a)(d) は実際にあった設計ミスの再発防止。
// メダルは強いほうを残し、正誤配列は後勝ち、と判断軸を2つ持っていたため
// 「メダルは金なのに間違えた問題欄に出ている」状態が作れてしまい、
// 復習ドリルは金を出題しないのでその問題は自力で直せなかった。
//
//   node scripts/test-import-progress.mjs   … 全ケース通れば exit 0
// =============================================================================

import { readFileSync } from "node:fs";
const ts = (await import("typescript")).default;

const raw = readFileSync("src/lib/study-progress.ts", "utf-8");
const js = ts.transpileModule(raw, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

const store = new Map();
globalThis.window = { dispatchEvent() {} };
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, v),
  removeItem: (k) => store.delete(k),
};
globalThis.Event = class { constructor(t) { this.type = t; } };

const exports_ = {};
new Function("exports", "require", js)(exports_, () => ({}));
const { loadProgress, importProgress } = exports_;

function reset() { store.clear(); }
function set(exam, slug, medal, list) {
  const p = loadProgress();
  p[exam].medals[slug] = medal;
  p[exam][list].push(slug);
  localStorage.setItem("shikakumon-study-v1", JSON.stringify(p));
}
const file = (progress) => ({ app: "shikakumon", kind: "study-progress", version: 1, exportedAt: "2026-01-01T00:00:00Z", progress });
const blank = () => JSON.parse(JSON.stringify(loadProgress()));

let ng = 0;
function check(name, cond, got) {
  console.log(`${cond ? "OK " : "NG "} ${name}${cond ? "" : "  → " + JSON.stringify(got)}`);
  if (!cond) ng++;
}

reset(); set("pii", "pii-001", "gold", "correct");
{ const f = blank(); f.pii.wrong = ["pii-001"]; f.pii.medals = { "pii-001": "bronze" };
  importProgress(file(f), "merge");
  const p = loadProgress();
  check("(a) 金 × 誤答ファイル → 金のまま、誤答欄に出ない",
    p.pii.medals["pii-001"] === "gold" && !p.pii.wrong.includes("pii-001") && p.pii.correct.includes("pii-001"), p.pii); }

reset(); set("pii", "pii-002", "bronze", "wrong");
{ const f = blank(); f.pii.correct = ["pii-002"]; f.pii.medals = { "pii-002": "silver" };
  importProgress(file(f), "merge");
  const p = loadProgress();
  check("(b) 銅 × 正解ファイル → 銀・正解欄へ移る",
    p.pii.medals["pii-002"] === "silver" && p.pii.correct.includes("pii-002") && !p.pii.wrong.includes("pii-002"), p.pii); }

reset();
{ const f = blank(); f.pii.wrong = ["pii-003"]; f.pii.correct = ["pii-004"]; delete f.pii.medals;
  importProgress(file(f), "merge");
  const p = loadProgress();
  check("(c) medals無しの旧ファイル → 銅/銀を補完",
    p.pii.medals["pii-003"] === "bronze" && p.pii.medals["pii-004"] === "silver", p.pii.medals); }

reset(); set("pii", "pii-005", "gold", "correct"); set("pii", "pii-006", "bronze", "wrong");
{ const f = blank(); f.pii.wrong = ["pii-005", "pii-007"]; f.pii.correct = ["pii-006"];
  importProgress(file(f), "merge");
  const p = loadProgress();
  const bad = Object.entries(p.pii.medals).filter(([s, m]) =>
    (m === "bronze" && !p.pii.wrong.includes(s)) || (m !== "bronze" && !p.pii.correct.includes(s)));
  check("(d) メダルと正誤配列が全問で整合(食い違いを作れない)", bad.length === 0, bad); }

reset(); set("pii", "pii-008", "gold", "correct");
{ const f = blank(); f.pii.correct = ["pii-009"]; f.pii.medals = { "pii-009": "silver" };
  importProgress(file(f), "replace");
  const p = loadProgress();
  check("(e) replace は手元を捨てる", !p.pii.medals["pii-008"] && p.pii.medals["pii-009"] === "silver", p.pii); }

reset();
{ const orig = globalThis.localStorage.setItem;
  globalThis.localStorage.setItem = () => { throw new Error("QuotaExceeded"); };
  const r = importProgress(file(blank()), "merge");
  globalThis.localStorage.setItem = orig;
  check("(f) 保存失敗は ok:false を返す", r.ok === false && /保存できませんでした/.test(r.error ?? ""), r); }

reset();
check("(g1) 別サイトのJSONを拒否", importProgress({ app: "other" }, "merge").ok === false);
check("(g2) 新しすぎる版を拒否", importProgress({ app: "shikakumon", kind: "study-progress", version: 99, progress: {} }, "merge").ok === false);
check("(g3) 中身が無いものを拒否", importProgress(null, "merge").ok === false);

console.log(ng === 0 ? "\n全ケース OK" : `\n${ng} 件 NG`);
process.exit(ng === 0 ? 0 : 1);
