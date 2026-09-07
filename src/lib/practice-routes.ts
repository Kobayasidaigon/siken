import type { ExamSlug } from "./study-progress";

/**
 * 資格ごとに用意してある「通しで解く面」の一覧。2026-09-07 追加。
 *
 * 背景: 問題ページ(全14資格で2,866枚)から模試・本番形式テストへのリンクが1本も無かった。
 * 「次の問題へ」は同じ分野の次の1問に進むだけで、分野の最終問(109分野ぶん)は行き止まり。
 * 着地の8割を占める面から、実測でいちばん転換する面(模試の完了者)へ行く道が無い状態だった。
 *
 * この表は手で保つ。ページの有無をビルド時にファイル走査で判定すると、問題ページは
 * クライアントコンポーネント(AnswerReveal)なので実行時に fs を触れず、
 * 判定結果をどこかに焼き込む仕組みが別途要るため。資格を増やしたら、
 * src/app/<資格>/moshi/・mock/・moshi2/ を作ったのと同じコミットでここも足すこと。
 * 存在しないページへのリンクを出さないことが、この表の唯一の役割。
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
 * 2026-09-07 に残り7資格ぶんを追加して全14資格に揃えた。
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
];

/** /<資格>/moshi/ がある資格。本試験と同じ問数・時間の第1回模試(無料) */
const HAS_MOSHI: ExamSlug[] = [
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
];

/** /<資格>/moshi2/ がある資格。第2回模試(有料・買い切り) */
const HAS_MOSHI2: ExamSlug[] = [
  "pii",
  "chizai",
  "chizai2",
  "mynumber",
  "jitsumu",
  "bijihou",
  "fukushi2",
  "bijimane",
  "eco",
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
      note: "本試験と同じ問題数・制限時間で通しで解けます",
      kind: "moshi",
    });
  }
  return routes;
}

/** 第2回模試(有料)があるか。模試の結果画面から案内するときに使う */
export function hasPaidMoshi(exam: ExamSlug | undefined): boolean {
  return !!exam && HAS_MOSHI2.includes(exam);
}
