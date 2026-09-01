/**
 * 法令用語の現行性チェック。
 *
 * 問題文・選択肢・解説に、改正で使われなくなった用語や、
 * 過去に実際に混入した誤った呼称が残っていないかを機械的に検出する。
 *
 * 使い方: node scripts/check-legal-terms.mjs src/content/bijihou2 [...他ディレクトリ]
 * 終了コード 1 = 違反あり。
 */
import fs from "fs";
import path from "path";

// pattern: 検出する正規表現 / reason: なぜ駄目か / allow: 例外として許す行の正規表現
const RULES = [
  {
    pattern: /懲役|禁錮/,
    reason: "刑法改正(2025年6月1日施行)で懲役・禁錮は拘禁刑に一本化された",
    // 改正そのものを説明している行は除外(「懲役と禁錮は拘禁刑に一本化」等)
    allow: /拘禁刑/,
  },
  {
    // 個人情報保護法の文脈に限る。消費者契約法には実在の令和4年改正があるため
    // 単純な語だけで弾くと誤検知になる。
    pattern: /令和4年改正/,
    require: /個人情報|マイナンバー|番号法/,
    // ガイドライン(指針)は法律とは別に令和4年に改正されており、こちらは正しい呼称
    allow: /ガイドライン|指針/,
    reason: "個人情報保護法の改正は令和2年法律第44号。令和4年は施行年であって改正年ではない",
  },
  {
    pattern: /瑕疵担保責任/,
    reason: "民法改正(2020年4月施行)で契約不適合責任に置き換わった",
    // 旧法との対比を説明する行と、旧用語をあえて使う誤答肢は正当なので除外する
    allow: /契約不適合責任|旧民法|改正前|改正により|かつて|2020年改正|改正民法/,
  },
  {
    pattern: /プロバイダ責任制限法/,
    reason: "2024年5月に情報流通プラットフォーム対処法へ改組・改称された",
    allow: /情報流通プラットフォーム対処法/,
  },
];

const dirs = process.argv.slice(2);
if (dirs.length === 0) {
  console.error("使い方: node scripts/check-legal-terms.mjs <ディレクトリ> [...]");
  process.exit(2);
}

let violations = 0;
let scanned = 0;

for (const dir of dirs) {
  if (!fs.existsSync(dir)) {
    console.error(`ディレクトリが無い: ${dir}`);
    process.exit(2);
  }
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
    scanned++;
    const lines = fs.readFileSync(path.join(dir, f), "utf-8").split("\n");
    lines.forEach((line, i) => {
      for (const rule of RULES) {
        if (!rule.pattern.test(line)) continue;
        if (rule.require && !rule.require.test(line)) continue;
        if (rule.allow && rule.allow.test(line)) continue;
        console.log(`NG ${path.join(dir, f)}:${i + 1}  ${rule.reason}`);
        console.log(`   ${line.trim().slice(0, 100)}`);
        violations++;
      }
    });
  }
}

console.log(`\n走査 ${scanned}ファイル / 違反 ${violations}件`);
process.exit(violations > 0 ? 1 : 0);
