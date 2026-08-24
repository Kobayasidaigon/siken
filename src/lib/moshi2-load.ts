// =============================================================================
// 第2回模試(有料)の問題を読み込み、受験画面が使う形に整える。
//
// **このファイルはサーバー専用**。クライアントコンポーネントから import しては
// いけない。import した瞬間、有料の問題データがブラウザのバンドルに載り、
// 購入せずに読めてしまう。呼び出しは /api/moshi2/[cert] からだけにすること。
//
// 第1回のページが ○×問題を MoshiQuestion に変換しているのと同じ手順を踏む。
// ○×を先、四肢択一を後に並べるのも第1回と同じ(公式サンプルの並び)。
// =============================================================================

import type { Moshi2OxQuestion, Moshi2Question } from "./moshi2-types";
import { moshi2ProductOf } from "./moshi2-products";

/** 受験画面が受け取る形。MoshiExam の MoshiQuestion と同じ。 */
export type Moshi2Paper = {
  slug: string;
  questionText: string;
  choices: string[];
  correctAnswer: number;
  points?: number;
  noLink?: boolean;
  field: string;
  explanationHtml?: string;
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** 解説はプレーンテキストで持っているので、改行を段落に開いてから埋め込む。 */
function explainToHtml(s: string): string {
  return s
    .split(/\n{2,}/)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

/** 資格ID → 第2回のデータ。動的 import なので、他資格の問題は読み込まれない。 */
const LOADERS: Record<string, () => Promise<{ takuitsu: Moshi2Question[]; ox: Moshi2OxQuestion[] }>> = {
  pii: async () => ({ takuitsu: (await import("./pii-moshi2")).PII_MOSHI_2, ox: [] }),
  jitsumu: async () => ({ takuitsu: (await import("./jitsumu-moshi2")).JITSUMU_MOSHI_2, ox: [] }),
  bijimane: async () => ({ takuitsu: (await import("./bijimane-moshi2")).BIJIMANE_MOSHI_2, ox: [] }),
  chizai: async () => ({ takuitsu: (await import("./chizai-moshi2")).CHIZAI_MOSHI_2, ox: [] }),
  chizai2: async () => ({ takuitsu: (await import("./chizai2-moshi2")).CHIZAI2_MOSHI_2, ox: [] }),
  eco: async () => ({ takuitsu: (await import("./eco-moshi2")).ECO_MOSHI_2, ox: [] }),
  bijihou: async () => ({
    takuitsu: (await import("./bijihou-moshi2")).BIJIHOU_MOSHI_2,
    ox: (await import("./bijihou-moshi2-ox")).BIJIHOU_MOSHI_2_OX,
  }),
  mynumber: async () => ({
    takuitsu: (await import("./mynumber-moshi2")).MYNUMBER_MOSHI_2,
    ox: (await import("./mynumber-moshi2-ox")).MYNUMBER_MOSHI_2_OX,
  }),
  fukushi2: async () => ({
    takuitsu: (await import("./fukushi2-moshi2")).FUKUSHI2_MOSHI_2,
    ox: (await import("./fukushi2-moshi2-ox")).FUKUSHI2_MOSHI_2_OX,
  }),
};

/**
 * 第2回の紙面を返す。商品定義に無い資格、データが揃っていない資格は null。
 * 件数が商品定義と食い違う場合も null を返す(中途半端な紙面を売らないため)。
 */
export async function loadMoshi2(certId: string): Promise<Moshi2Paper[] | null> {
  const product = moshi2ProductOf(certId);
  const loader = LOADERS[certId];
  if (!product || !loader) return null;

  const { takuitsu, ox } = await loader();
  if (takuitsu.length !== product.questionCount || ox.length !== product.oxCount) return null;

  // ○×は各1点。四肢択一は問別配点があればそれを使い、無ければ全問一律。
  const oxPaper: Moshi2Paper[] = ox.map((o) => ({
    slug: o.id,
    questionText: `次の記述の内容は正しいか、誤っているか。\n\n${o.statement}`,
    choices: ["正しい", "誤っている"],
    correctAnswer: o.answer ? 1 : 2,
    field: o.field,
    explanationHtml: explainToHtml(o.explain),
    points: product.passPoints ? (product.pointsPerQuestion ?? 1) : undefined,
    noLink: true,
  }));

  const takuitsuPaper: Moshi2Paper[] = takuitsu.map((q) => ({
    slug: q.id,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    field: q.field,
    explanationHtml: explainToHtml(q.explain),
    points: q.points ?? (product.passPoints ? product.pointsPerQuestion : undefined),
    noLink: true,
  }));

  return [...oxPaper, ...takuitsuPaper];
}
