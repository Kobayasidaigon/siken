// 学習履歴の読み込み(importProgress)の動作確認。中身は scripts/test-import-progress.mjs。
import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("学習履歴の統合が全ケースで期待どおり", () => {
  const r = spawnSync(process.execPath, ["scripts/test-import-progress.mjs"], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});
