// 模擬試験の合否判定(src/lib/moshi-pass.ts)。
// 章(セクション)ごとの基準があり総合点の基準もある試験で、章の基準だけ見て合格と出していた不具合の再発防止。
// 登録販売者は「合計84点以上かつ各章3.5割以上」で、章の基準(7/7/14/7/7)を足しても42問にしかならない。
import test from "node:test";
import assert from "node:assert/strict";
import { loadTs } from "./load-ts.mjs";

const { isMoshiPassed } = loadTs("src/lib/moshi-pass.ts");
const { moshi2ProductOf } = loadTs("src/lib/moshi2-products.ts");

// 正解はすべて 1。各セクションの先頭から指定数だけ正解(1)、残りは不正解(2)にした答案を作る
function build(sections, corrects) {
  const total = sections.reduce((n, s) => Math.max(n, s.start + s.count), 0);
  const questions = Array.from({ length: total }, () => ({ correctAnswer: 1 }));
  const ans = new Array(total).fill(2);
  sections.forEach((s, k) => {
    for (let i = 0; i < corrects[k]; i++) ans[s.start + i] = 1;
  });
  return { questions, ans };
}

function judge(product, corrects) {
  const { questions, ans } = build(product.sections, corrects);
  return isMoshiPassed(questions, ans, {
    passCount: product.passCount,
    sections: product.sections,
    passPoints: product.passPoints,
    pointsPerQuestion: product.pointsPerQuestion,
  });
}

// 第1回(src/lib/touhan-moshi.ts の TOUHAN_MOSHI_SECTIONS / PASS_COUNT=84)も同じ章構成・同じ基準
const touhan = moshi2ProductOf("touhan");

test("登録販売者: 前提(総合84問・章は20/20/40/20/20問)", () => {
  assert.equal(touhan.passCount, 84);
  assert.equal(touhan.passPoints, undefined);
  assert.deepEqual(touhan.sections.map((s) => s.count), [20, 20, 40, 20, 20]);
  assert.deepEqual(touhan.sections.map((s) => s.passCount), [7, 7, 14, 7, 7]);
});

test("登録販売者: 各章の基準ちょうど(合計42問)は不合格", () => {
  assert.equal(judge(touhan, [7, 7, 14, 7, 7]), false);
});

test("登録販売者: 各章クリアで合計83問は不合格", () => {
  assert.equal(judge(touhan, [14, 14, 27, 14, 14]), false);
});

test("登録販売者: 各章クリアで合計84問は合格", () => {
  assert.equal(judge(touhan, [14, 14, 28, 14, 14]), true);
});

test("登録販売者: 合計84問でも1章が基準未満なら不合格", () => {
  assert.equal(judge(touhan, [6, 20, 38, 10, 10]), false);
});

test("個人情報保護士: 各課題35問ちょうどで合格、1課題34問なら不合格(判定は従来どおり)", () => {
  const pii = moshi2ProductOf("pii");
  assert.equal(judge(pii, [35, 35]), true);
  assert.equal(judge(pii, [34, 50]), false);
});

test("保育士: 全科目の基準ちょうど(合計96問)で合格(判定は従来どおり)", () => {
  const hoikushi = moshi2ProductOf("hoikushi");
  assert.equal(judge(hoikushi, hoikushi.sections.map((s) => s.passCount)), true);
  const corrects = hoikushi.sections.map((s) => s.passCount);
  corrects[0] -= 1;
  assert.equal(judge(hoikushi, corrects), false);
});

test("エックス線: 各科目クリアでも合計点が60点未満なら不合格(passPoints の判定は従来どおり)", () => {
  const xray = moshi2ProductOf("xray");
  // 配点が問別(q.points)の試験なので、ここでは1問1点として passPoints との比較だけを見る
  const { questions, ans } = build(xray.sections, [10, 10, 10, 10]);
  assert.equal(isMoshiPassed(questions, ans, { passCount: xray.passCount, sections: xray.sections, passPoints: 41 }), false);
  assert.equal(isMoshiPassed(questions, ans, { passCount: xray.passCount, sections: xray.sections, passPoints: 40 }), true);
});
