// 一問一答(○×・記入式)の検査。2026-11-23 追加。
// 記入式の表記ゆれのそろえ方と、問題データの約束(空欄・根拠の問題・○×の作り方)を確かめる。
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { loadTs } from "./load-ts.mjs";

const { normalizeAnswer, isCorrectInput } = loadTs("src/lib/answer-normalize.ts");
const { buildOxItems } = loadTs("src/lib/ox-from-choices.ts");
const KINYU = {
  bijihou: loadTs("src/lib/kinyu/bijihou.ts").BIJIHOU_KINYU,
  fukushi2: loadTs("src/lib/kinyu/fukushi2.ts").FUKUSHI2_KINYU,
  eco: loadTs("src/lib/kinyu/eco.ts").ECO_KINYU,
  mynumber: loadTs("src/lib/kinyu/mynumber.ts").MYNUMBER_KINYU,
};

test("全角/半角・カナ・空白・漢数字の違いは正解にする", () => {
  assert.ok(isCorrectInput("ゼンイ", ["ぜんい"]));
  assert.ok(isCorrectInput(" 承諾 ", ["承諾"]));
  assert.ok(isCorrectInput("５０", ["50"]));
  assert.ok(isCorrectInput("五十", ["50"]));
  assert.ok(isCorrectInput("第三条", ["第3条"]));
  assert.ok(isCorrectInput("百五十", ["150"]));
  assert.ok(isCorrectInput("３ヶ月", ["3か月"]));
  assert.ok(isCorrectInput("3カ月", ["3か月"]));
  assert.ok(isCorrectInput("四分の三", ["4分の3"]));
  assert.ok(isCorrectInput("「債務名義」", ["債務名義"]));
  assert.ok(isCorrectInput("ABC", ["abc"]));
});

test("部分一致や空の答えは不正解にする", () => {
  assert.equal(isCorrectInput("善意", ["善意無過失"]), false);
  assert.equal(isCorrectInput("", ["承諾"]), false);
  assert.equal(isCorrectInput("   ", ["承諾"]), false);
  assert.equal(isCorrectInput("40", ["4"]), false);
  assert.equal(normalizeAnswer("５"), "5");
});

test("記入式の問題データの約束", () => {
  const ids = new Set();
  for (const [exam, list] of Object.entries(KINYU)) for (const q of list) {
    assert.ok(!ids.has(q.id), `id の重複: ${q.id}`);
    ids.add(q.id);
    assert.equal((q.prompt.match(/＿＿/g) ?? []).length, 1, `${q.id}: 空欄「＿＿」はちょうど1つ`);
    assert.ok(q.answers.length > 0 && q.answers.every((a) => normalizeAnswer(a) !== ""), `${q.id}: 答えが空`);
    assert.ok(q.explain.length > 0, `${q.id}: 解説が空`);
    if (q.sourceSlug) assert.ok(fs.existsSync(`src/content/${exam}/${q.sourceSlug}.md`), `${q.id}: 根拠の問題 ${q.sourceSlug} が無い`);
  }
});

test("○×は4択の正解の向き(適切/不適切)どおりに作られる", () => {
  for (const exam of ["bijihou", "fukushi2", "eco", "mynumber"]) {
    const items = buildOxItems(exam);
    assert.ok(items.length > 100, `${exam}: ○×が少なすぎる(${items.length})`);
    const bySource = new Map();
    for (const it of items) {
      assert.ok(it.statement.length >= 12 && it.explain.length > 0, it.id);
      bySource.set(it.sourceSlug, [...(bySource.get(it.sourceSlug) ?? []), it]);
    }
    for (const [slug, its] of bySource) {
      const text = fs.readFileSync(`src/content/${exam}/${slug}.md`, "utf-8");
      const correct = Number(text.match(/^correctAnswer:\s*(\d)/m)[1]);
      const negative = /(不適切な|適切でない|誤っている)ものはどれか/.test(text.match(/^questionText:.*$/m)[0]);
      for (const it of its) {
        assert.equal(it.answer, negative ? it.choiceNo !== correct : it.choiceNo === correct, it.id);
      }
      // 「最も適切」なら○が1つ、「最も不適切」なら×が1つ
      const trues = its.filter((it) => it.answer).length;
      assert.equal(trues, negative ? its.length - 1 : 1, slug);
    }
  }
});

// 2026-11-27: 全資格の問題ページに「4択 / ○×」の切り替えを付けた。その元になる○×の作り方を確かめる。
const { ICHIMON_EXAMS_ALL } = loadTs("src/lib/ichimon.ts");
const { getQuestionOx } = loadTs("src/lib/ox-from-choices.ts");
const dirOf = (exam) => (exam === "kashikin" ? "questions" : exam);

test("全資格で、○×の向きが4択の正解と食い違わない", () => {
  const exams = fs.readdirSync("src/content").filter((d) =>
    !["columns", "exam-intros", "field-guides", "voices"].includes(d)).map((d) => (d === "questions" ? "kashikin" : d));
  for (const exam of exams) {
    const bySource = new Map();
    for (const it of buildOxItems(exam)) bySource.set(it.sourceSlug, [...(bySource.get(it.sourceSlug) ?? []), it]);
    for (const [slug, its] of bySource) {
      const text = fs.readFileSync(`src/content/${dirOf(exam)}/${slug}.md`, "utf-8");
      const correct = Number(text.match(/^correctAnswer:\s*(\d)/m)[1]);
      const negative = /(不適切な|適切でない|誤っている)もの/.test(text.match(/^questionText:.*$/m)[0]);
      for (const it of its) assert.equal(it.answer, negative ? it.choiceNo !== correct : it.choiceNo === correct, it.id);
      assert.equal(its.filter((it) => it.answer).length, negative ? its.length - 1 : 1, `${exam}/${slug}`);
      assert.ok(its.every((it) => it.topic.length > 0), `${exam}/${slug}: topic が空`);
    }
  }
});

test("組合せ・個数・計算の問題は○×にしない", () => {
  for (const exam of ["kashikin", "hoikushi", "touhan", "pii"]) {
    for (const it of buildOxItems(exam)) {
      const text = fs.readFileSync(`src/content/${dirOf(exam)}/${it.sourceSlug}.md`, "utf-8");
      const qt = text.match(/^questionText:.*$/m)[0];
      assert.ok(!/組み?合わ?せ|個数|いくつあるか/.test(qt), `${exam}/${it.sourceSlug}`);
    }
  }
});

test("問題ページ用の○×と、一問一答の対象資格", () => {
  const ox = getQuestionOx("kashikin", buildOxItems("kashikin")[0].sourceSlug);
  assert.ok(ox && ox.items.length === 4 && ox.items.filter((i) => i.answer).length >= 1);
  assert.equal(getQuestionOx("kashikin", "no-such-question"), null);
  for (const exam of ICHIMON_EXAMS_ALL) {
    assert.ok(buildOxItems(exam).length >= 20, `${exam}: ○×が20問未満なら一問一答ページを作らない`);
    assert.ok(fs.existsSync(`src/app/${exam}/ichimon/page.tsx`), `${exam}: 一問一答ページが無い`);
  }
});
