/**
 * アフィリエイトリンクの広告主名(GA4 の program パラメータ)。2026-09-19 追加。
 *
 * affiliate_click / cta_impression に course(資格)と placement(面)は付いていたが、
 * 「どの広告主のリンクか」は無く、同じ資格で SMART と アガルート、講座と資料請求を
 * 並べたときにどちらが踏まれたかを href の文字列から推測するしかなかった。
 * a8mat の第2区画(プログラムID)は メディア×プログラム で固定なので、そこから引く。
 * 設備資格ドリル(src/lib/affiliate-track.ts)と同じ語彙。
 *
 * 新しい広告主のリンクを足したらここにも1行足す(未知は "a8" として送られる)。
 */
const A8_PROGRAM: Record<string, string> = {
  "9T22IA": "smart", // 全日本情報学習振興協会 SMART合格講座(講座・試験申込)
  AWY41E: "agaroot", // アガルート(講座・資料請求)
  BJKL0Y: "onsuku", // オンスク.JP(月額プラン)
  "3TJ5IQ": "lec", // LEC
  FFHK1M: "sat", // SAT株式会社(設備ドリルと共通)
  GE0P4Q: "nousen", // 能セン
  G998AI: "denkouseka", // 電光石火(電工技能セット)
};

export function programOf(href: string | undefined): string {
  if (!href) return "none";
  const m = href.match(/a8mat=[A-Z0-9]+\+([A-Z0-9]+)\+/);
  if (m) return A8_PROGRAM[m[1]] ?? "a8";
  if (/af\.moshimo\.com/.test(href)) return "moshimo";
  return "other";
}
