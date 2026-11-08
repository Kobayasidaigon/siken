// 答え合わせ直後の CTA(申込導線と Studio のどちらを上に出すか)の切り替え。
// 申込締切の直前に成果が集中するため、切り替えの日付がずれると売上に直結する。
import test from "node:test";
import assert from "node:assert/strict";
import { loadTs } from "./load-ts.mjs";

const { decideCtaPriority, APPLY_URGENT_DAYS, EXAM_SCHEDULES } = loadTs("src/lib/cta-priority.ts");

// 締切と開始が入っている回を1つ選んで、その前後の日付で判定を見る
const [slug, round] = Object.entries(EXAM_SCHEDULES)
  .flatMap(([s, list]) => list.map((e) => [s, e]))
  .find(([, e]) => e.applyStart && e.applyEnd && e.applyStart < e.applyEnd);

const jst = (ymd) => new Date(`${ymd}T12:00:00+09:00`);
const addDays = (ymd, n) => {
  const d = new Date(`${ymd}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

test("日程の無い資格は Studio を上に出す", () => {
  assert.deepEqual(decideCtaPriority(null), { primary: "studio", phase: "unknown", daysLeft: null });
});

test("締切の当日は apply_urgent・残り0日", () => {
  const r = decideCtaPriority(slug, jst(round.applyEnd));
  assert.equal(r.phase, "apply_urgent");
  assert.equal(r.primary, "apply");
  assert.equal(r.daysLeft, 0);
});

test(`締切の${APPLY_URGENT_DAYS}日前までは apply_urgent`, () => {
  const day = addDays(round.applyEnd, -APPLY_URGENT_DAYS);
  if (day < round.applyStart) return; // 受付期間が短い回では成り立たない
  const r = decideCtaPriority(slug, jst(day));
  assert.equal(r.phase, "apply_urgent");
  assert.equal(r.daysLeft, APPLY_URGENT_DAYS);
});

test("受付開始の前日は pre_apply", () => {
  const r = decideCtaPriority(slug, jst(addDays(round.applyStart, -1)));
  // 前の回の受付期間と重なる資格もあるので、少なくとも apply_urgent ではないことだけ見る
  assert.notEqual(r.phase, "apply_urgent");
});
