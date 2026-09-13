/**
 * 結果画面の得点帯。2026-09-13 追加(方針: docs/direction-2026-09.md §5-1)。
 *
 * 結果画面を「講座(アフィリエイト)」と「弱点だけ復習(Studio)」の分岐点にする。
 * 得点帯で出し分け、文言はその人の数字を使う。帯は3つだけにする。
 * 細かく分けても、母数が小さいうちは帯ごとの比較ができない。
 *
 *   high  合格の目安に届いている。取りこぼした分野を潰す段階
 *   mid   目安まで 15 ポイント以内。あと数問で届く
 *   low   目安まで 15 ポイント超。分野ごとに積み上げ直す段階
 *
 * 帯は utm_content(`{placement}_{cert}_{band}`)と GA の band パラメータに載せ、
 * Studio 側と本体側の両方で「どの帯の人が動いたか」を読めるようにする。
 */

export type ScoreBand = "high" | "mid" | "low";

/** mid とみなす、合格目安からの差(ポイント) */
export const MID_BAND_WIDTH = 15;

/**
 * @param pct     正答率(0–100)
 * @param passPct 合格の目安(0–100)
 * @param passed  合否判定が別にある試験(課題別基準・問別配点)はそれを優先する
 */
export function scoreBand(pct: number, passPct: number, passed?: boolean): ScoreBand {
  if (passed === true) return "high";
  if (passed === false && pct >= passPct) {
    // 総合では届いているのに課題別基準などで不合格。あと一歩の扱い
    return "mid";
  }
  if (pct >= passPct) return "high";
  if (passPct - pct <= MID_BAND_WIDTH) return "mid";
  return "low";
}

/**
 * 「あと何問で合格の目安か」。届いていれば 0。
 *
 * passCount(合格基準の問数)が分かっているときはそれを使う。パーセントから
 * 逆算すると、丸めのせいで 41/58 が「あと1問」になるような食い違いが出る
 * (福祉住環境2級の模試: 41問 = 70.7% → 71% → ceil(0.71×58) = 42)。
 * 無いときだけ切り上げで見積もる(あと 2.3 問 → 3 問)。
 */
export function questionsToPass(correct: number, total: number, passPct: number, passCount?: number): number {
  if (total <= 0) return 0;
  const need = passCount != null && passCount > 0 ? passCount : Math.ceil((passPct / 100) * total);
  return Math.max(0, need - correct);
}

/** GA の score_bucket と同じ丸め(5 ポイント刻み) */
export function scoreBucket(correct: number, total: number): number {
  return total > 0 ? Math.round((correct / total) * 20) * 5 : 0;
}
