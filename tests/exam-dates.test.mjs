// 試験日データ(src/lib/exam-dates.ts)の形の検査。
// 日付の打ち間違い(存在しない日・締切が試験日より後・開始と締切の逆転)は、
// 締切カウントダウンと申込導線の切り替えを静かに壊すので、ここで止める。
import test from "node:test";
import assert from "node:assert/strict";
import { loadTs } from "./load-ts.mjs";

const dates = loadTs("src/lib/exam-dates.ts");
const { EXAM_LIST } = loadTs("src/lib/study-progress.ts");

const isYmd = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && new Date(`${s}T00:00:00Z`).toISOString().startsWith(s);

const lists = Object.entries(dates).filter(([k, v]) => k.endsWith("_EXAMS") && Array.isArray(v));

test("試験日・申込期間はすべて実在する日付", () => {
  for (const [name, list] of lists) {
    for (const e of list) {
      assert.ok(isYmd(e.date), `${name} ${e.label}: date=${e.date}`);
      if (e.applyStart) assert.ok(isYmd(e.applyStart), `${name} ${e.label}: applyStart=${e.applyStart}`);
      if (e.applyEnd) assert.ok(isYmd(e.applyEnd), `${name} ${e.label}: applyEnd=${e.applyEnd}`);
    }
  }
});

test("申込開始 ≦ 申込締切 ≦ 試験日", () => {
  for (const [name, list] of lists) {
    for (const e of list) {
      if (e.applyStart && e.applyEnd) assert.ok(e.applyStart <= e.applyEnd, `${name} ${e.label}: 開始が締切より後`);
      if (e.applyEnd) assert.ok(e.applyEnd <= e.date, `${name} ${e.label}: 締切が試験日より後`);
    }
  }
});

test("各資格の回は試験日の古い順に並んでいる", () => {
  for (const [name, list] of lists) {
    const sorted = [...list].sort((a, b) => a.date.localeCompare(b.date));
    assert.deepEqual(list.map((e) => e.date), sorted.map((e) => e.date), name);
  }
});

test("EXAMS_BY_SLUG は実在する資格だけを指す", () => {
  const slugs = new Set(EXAM_LIST.map((e) => e.slug));
  for (const slug of Object.keys(dates.EXAMS_BY_SLUG)) assert.ok(slugs.has(slug), `未知の資格: ${slug}`);
});

test("試験期間の最終日は実在する日付で、開始日より後・次の回より前", () => {
  for (const [name, list] of lists) {
    list.forEach((e, i) => {
      if (!e.periodEnd) return;
      assert.ok(isYmd(e.periodEnd), `${name} ${e.label}: periodEnd=${e.periodEnd}`);
      assert.ok(e.date < e.periodEnd, `${name} ${e.label}: 最終日が開始日以前`);
      const next = list[i + 1];
      if (next) assert.ok(e.periodEnd < next.date, `${name} ${e.label}: 最終日が次の回の開始日以降`);
    });
  }
});

test("ongoingPeriodExam は試験期間中の回だけを返す", () => {
  const realNow = Date.now;
  const at = (iso) => { Date.now = () => new Date(`${iso}T12:00:00+09:00`).getTime(); };
  try {
    at("2026-11-11");
    assert.equal(dates.ongoingPeriodExam(dates.ECO_EXAMS), null);
    at("2026-11-12");
    assert.equal(dates.ongoingPeriodExam(dates.ECO_EXAMS)?.label, "第41回");
    at("2026-12-03");
    assert.equal(dates.ongoingPeriodExam(dates.ECO_EXAMS)?.label, "第41回");
    at("2026-12-04");
    assert.equal(dates.ongoingPeriodExam(dates.ECO_EXAMS), null);
    // periodEnd の無い資格(個人情報保護士)は対象外
    at("2026-12-13");
    assert.equal(dates.ongoingPeriodExam(dates.PII_EXAMS), null);
  } finally {
    Date.now = realNow;
  }
});
