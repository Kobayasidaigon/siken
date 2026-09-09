import type { ExamSlug } from "./study-progress";

/**
 * 資格ごとに用意してある「通しで解く面」の一覧。2026-09-07 追加。
 *
 * 背景: 問題ページ(追加当時は全14資格で2,866枚)から模試・本番形式テストへのリンクが1本も無かった。
 * 「次の問題へ」は同じ分野の次の1問に進むだけで、分野の最終問(109分野ぶん)は行き止まり。
 * 着地の8割を占める面から、実測でいちばん転換する面(模試の完了者)へ行く道が無い状態だった。
 *
 * この表は手で保つ。ページの有無をビルド時にファイル走査で判定すると、問題ページは
 * クライアントコンポーネント(AnswerReveal)なので実行時に fs を触れず、
 * 判定結果をどこかに焼き込む仕組みが別途要るため。資格を増やしたら、
 * src/app/<資格>/moshi/・mock/・moshi2/ を作ったのと同じコミットでここも足すこと。
 * 存在しないページへのリンクを出さないことが、この表の唯一の役割。
 * 表とページのずれは prebuild の scripts/audit-practice-routes.mjs が突き合わせる。
 *
 * 有料の第2回模試(moshi2)はここで持たない。出典は lib/moshi2-products.ts の
 * MOSHI2_PRODUCTS ひとつで、二重に持つと片方だけ更新する事故が起きる
 * (実例が Moshi2TopLink.tsx の冒頭コメントに残っている)。
 */

export type PracticeRoute = {
  href: string;
  label: string;
  /** リンクの下に出す一行。何をする面なのかを、煽らずに説明する */
  note: string;
  /** GA の placement。面ごとの効きを分けて見るために使う */
  kind: "mock" | "moshi" | "moshi2";
};

/**
 * /<資格>/mock/ がある資格。全て20問・採点と分野別正答率つき。
 * 2026-09-07 に残り7資格ぶんを追加して全14資格に揃えた。2026-09-08 に isec を追加して15資格。
 */
const HAS_MOCK: ExamSlug[] = [
  "kashikin",
  "pii",
  "chizai",
  "chizai2",
  "mynumber",
  "jitsumu",
  "bijihou",
  "bijihou2",
  "fukushi2",
  "bijimane",
  "eco",
  "itpass",
  "chintai",
  "kangyo",
  "isec",
  "kyoin",
  "shakai",
];

/** /<資格>/moshi/ がある資格。本試験と同じ問数・時間の第1回模試(無料) */
const HAS_MOSHI: ExamSlug[] = [
  // 2026-09-09 追加。A8 主力資格なのにここだけ無料模試が無く、
  // 「模試完了者が最も転換する」面が丸ごと欠けていた。
  "kashikin",
  "pii",
  "chizai",
  "chizai2",
  "mynumber",
  "jitsumu",
  "bijihou",
  "bijihou2",
  "fukushi2",
  "bijimane",
  "eco",
  "itpass",
  "chintai",
  "kangyo",
  "isec",
  "kyoin",
  "shakai",
];

/**
 * 問題ページから案内する「通しで解く面」。
 *
 * 有料の第2回模試(moshi2)はここに含めない。1問解いた直後の面から有料商品へ
 * 直接送るのは、このサイトの控えめな広告方針から外れる。第1回模試を解き終えた
 * 結果画面から案内する動線が既にあり、そちらのほうが購入の文脈も整っている。
 */
export function practiceRoutesFor(exam: ExamSlug | undefined): PracticeRoute[] {
  if (!exam) return [];
  const routes: PracticeRoute[] = [];
  if (HAS_MOCK.includes(exam)) {
    routes.push({
      href: `/${exam}/mock/`,
      label: "本番形式テスト",
      note: "20問をまとめて解いて採点。分野別の正答率が出ます",
      kind: "mock",
    });
  }
  if (HAS_MOSHI.includes(exam)) {
    routes.push({
      href: `/${exam}/moshi/`,
      label: "模擬試験（第1回）",
      // 「本試験と同じ問題数」とは13資格共通では書けない。東商のIBT/CBT系
      // (bijihou / bijihou2 / bijimane / eco / fukushi2)は本試験の出題数が公表されておらず、
      // bijimane/moshi/page.tsx と eco/moshi/page.tsx は「本模試の50問は当サイト独自の構成で、
      // 本試験の出題数を示すものではない」と自ら注記している。
      // 13資格すべてで成立するのは「固定問題」と「分野別の正答率が出る」ことだけ。
      note: "全員が同じ固定問題を、制限時間つきで通しで解きます。分野別の正答率つき",
      kind: "moshi",
    });
  }
  return routes;
}
