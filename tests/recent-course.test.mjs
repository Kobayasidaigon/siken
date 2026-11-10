// 「前回チェックした講座」の記録(src/lib/recent-course.ts)。2026-11-10 追加。
// プライバシーポリシーに「60日を過ぎた記録は、次に当サイトを開いたときに消します」と書いたので、
// 読み込みのたびに古い記録が端末から消えることを確かめる。
import test from "node:test";
import assert from "node:assert/strict";
import { loadTs } from "./load-ts.mjs";

const store = new Map();
globalThis.window = globalThis;
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => void store.set(k, String(v)),
  removeItem: (k) => void store.delete(k),
  key: (i) => [...store.keys()][i] ?? null,
  get length() {
    return store.size;
  },
};

const { loadRecentCourses } = loadTs("src/lib/recent-course.ts");
const KEY = "shikakumon-recent-course-v1";
const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 10, 10);

test("60日を過ぎた記録は、読み込んだときに端末から消える", () => {
  store.set(
    KEY,
    JSON.stringify({
      kashikin: { exam: "kashikin", kind: "paid", ts: NOW - 61 * DAY },
      pii: { exam: "pii", kind: "free", ts: NOW - 10 * DAY },
    })
  );
  assert.deepEqual(loadRecentCourses(NOW).map((r) => r.exam), ["pii"]);
  assert.deepEqual(Object.keys(JSON.parse(store.get(KEY))), ["pii"]);
});

test("非表示の期間中の記録は、60日を過ぎても非表示が終わるまで残す(表示はしない)", () => {
  store.set(
    KEY,
    JSON.stringify({ chizai: { exam: "chizai", kind: "paid", ts: NOW - 61 * DAY, dismissedUntil: NOW + 5 * DAY } })
  );
  assert.deepEqual(loadRecentCourses(NOW), []);
  assert.ok(JSON.parse(store.get(KEY)).chizai, "非表示の指定が先に消えると、次のクリックですぐ表示が戻ってしまう");
  assert.deepEqual(loadRecentCourses(NOW + 6 * DAY), []);
  assert.equal(store.get(KEY), undefined, "非表示が終われば記録もキーも消える");
});

test("壊れた記録は消し、キーごと無くなる", () => {
  store.set(KEY, JSON.stringify({ eco: { exam: "eco", kind: "paid" } }));
  assert.deepEqual(loadRecentCourses(NOW), []);
  assert.equal(store.get(KEY), undefined);
});
