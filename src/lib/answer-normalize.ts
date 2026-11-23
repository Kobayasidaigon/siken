/**
 * 記入式の問題の採点。2026-11-23 追加。
 *
 * 記入式は「正解として認める答え」のリストと、利用者が打った文字を比べる。
 * そのまま比べると、全角/半角・カタカナ/ひらがな・空白・カッコ・漢数字の違いだけで
 * 不正解になり、知っているのに×をつけられる不満が出る。比べる前に両方を
 * 同じ形にそろえてから、完全一致で判定する(部分一致は認めない。「善意無過失」に
 * 「善意」と打って正解になるのを防ぐため)。
 *
 * それでも拾えない別解は、画面側の「自分の答えも正しい」ボタン(自己採点)で受ける。
 * 別解に気づいたら、問題データの answers に足す。
 */

const KANJI_DIGIT: Record<string, number> = {
  〇: 0, 零: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9,
};
const KANJI_UNIT: Record<string, number> = { 十: 10, 百: 100, 千: 1000 };

/** 「二十」「百五十」「三〇」のような漢数字の並びを算用数字にする。読めなければ null */
function kanjiToNumber(s: string): number | null {
  // 単位を含まない並び(「二〇」「三〇」)は桁を並べた数として読む
  if (![...s].some((c) => c in KANJI_UNIT)) {
    let v = 0;
    for (const c of s) {
      if (!(c in KANJI_DIGIT)) return null;
      v = v * 10 + KANJI_DIGIT[c];
    }
    return v;
  }
  let total = 0;
  let cur = 0;
  for (const c of s) {
    if (c in KANJI_DIGIT) cur = KANJI_DIGIT[c];
    else if (c in KANJI_UNIT) {
      total += (cur || 1) * KANJI_UNIT[c];
      cur = 0;
    } else return null;
  }
  return total + cur;
}

/**
 * 比べるための形にそろえる。
 * - NFKC(全角英数・全角記号→半角、半角カナ→全角カナ)
 * - 英字は小文字
 * - カタカナ→ひらがな(「ぜんい」「ゼンイ」を同じに)
 * - 「3ヶ月」「3カ月」「3か月」「3ケ月」を同じに
 * - 漢数字→算用数字(「第三条」と「第3条」、「二十年」と「20年」)
 * - 空白・句読点・カッコ・中黒などの記号を消す
 */
export function normalizeAnswer(input: string): string {
  let s = input.normalize("NFKC").toLowerCase();
  // 漢数字(カナ変換より先に。「〇」などを数字として読むため)
  s = s.replace(/[〇零一二三四五六七八九十百千]+/g, (m) => {
    const n = kanjiToNumber(m);
    return n == null ? m : String(n);
  });
  // カタカナ→ひらがな(ァ〜ヶ の範囲。ヵ・ヶ は下で別に扱う)
  s = s.replace(/[ヵヶ]/g, "か");
  s = s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
  // 「3け月」(ケ月をひらがなにしたもの)も「3か月」に
  s = s.replace(/(\d)け(月|所|国|条)/g, "$1か$2");
  // 空白・記号
  s = s.replace(/[\s　、。,.・･「」『』()（）［］\[\]【】〔〕"'“”‘’!?！？:：;；~〜ー‐\-−–—_/／]/g, "");
  return s;
}

/** 打った答えが、認める答えのどれかと(そろえたうえで)一致するか */
export function isCorrectInput(input: string, accepted: string[]): boolean {
  const n = normalizeAnswer(input);
  if (!n) return false;
  return accepted.some((a) => normalizeAnswer(a) === n);
}
