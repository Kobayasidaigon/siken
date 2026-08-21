import type { ExamSlug } from "./study-progress";

/**
 * 第2回模試(有料)の商品定義。
 *
 * 価格は Stripe のダッシュボードではなくここで定義し、Checkout の price_data に
 * 直接渡す。Stripe 側に商品を作らないのは、価格の変更をコードのレビュー履歴に
 * 残したいのと、資格が増えるたびにダッシュボード作業が増えるのを避けるため。
 * JPY はゼロ十進通貨なので、この値がそのまま円として渡る。
 *
 * 試験仕様(時間・合格基準・形式)は第1回と揃える。第1回と条件が違うと、
 * 「本試験の再現」という商品の前提が崩れるため。
 */
export type Moshi2Product = {
  certId: ExamSlug;
  /** 表示名(Stripe の明細にもこの名前が出る) */
  name: string;
  /** 税込価格(円) */
  priceJpy: number;
  /** 決済画面と商品ページに出す短い説明 */
  description: string;

  /* ---- 試験仕様(第1回と揃える) ---- */
  /** 四肢択一(等)の問題数。○×がある試験は oxCount と合わせて総問数になる */
  questionCount: number;
  /** ○×(二肢択一)の問題数。無い試験は 0 */
  oxCount: number;
  timeLimitMin: number;
  /** 総合の合格基準(問数) */
  passCount: number;
  passLabel: string;
  /** 選択肢の形式(表示用)。第1回のページと同じ文言にする */
  choiceLabel: string;
  /** 問別配点で合否を出す試験の合格点(100点満点中)。無い試験は未指定 */
  passPoints?: number;
  /** 全問一律の配点。問別配点の試験(福祉住環境)では使わない */
  pointsPerQuestion?: number;
  /** 課題ごとに合格基準がある試験(個人情報保護士)の区分 */
  sections?: { label: string; start: number; count: number; passCount: number }[];
};

export const MOSHI2_PRODUCTS: Partial<Record<ExamSlug, Moshi2Product>> = {
  pii: {
    certId: "pii",
    name: "個人情報保護士 模擬試験 第2回",
    priceJpy: 1980,
    description:
      "本試験と同じ100問(課題Ⅰ50問+課題Ⅱ50問)・150分・課題別判定。第1回とは完全に別問題です。",
    questionCount: 100,
    oxCount: 0,
    timeLimitMin: 150,
    passCount: 70,
    passLabel: "各課題70%（各50問中35問）以上",
    choiceLabel: "4肢択一",
    sections: [
      { label: "課題Ⅰ（個人情報保護の総論）", start: 0, count: 50, passCount: 35 },
      { label: "課題Ⅱ（対策と情報セキュリティ）", start: 50, count: 50, passCount: 35 },
    ],
  },
  jitsumu: {
    certId: "jitsumu",
    name: "個人情報保護実務検定 模擬試験 第2回",
    priceJpy: 1980,
    description: "本試験と同じ80問・90分・70%判定。第1回とは完全に別問題です。",
    questionCount: 80,
    oxCount: 0,
    timeLimitMin: 90,
    passCount: 56,
    passLabel: "70%（80問中56問）以上",
    choiceLabel: "4肢択一",
  },
  bijihou: {
    certId: "bijihou",
    name: "ビジネス実務法務検定3級 模擬試験 第2回",
    priceJpy: 1280,
    description:
      "○×15問+4肢択一35問の混合50問・90分・100点満点70点判定。第1回とは完全に別問題です。",
    questionCount: 35,
    oxCount: 15,
    timeLimitMin: 90,
    passCount: 35,
    passLabel: "70点／100点満点 以上",
    choiceLabel: "○×+4肢択一",
    passPoints: 70,
    pointsPerQuestion: 2,
  },
  bijimane: {
    certId: "bijimane",
    name: "ビジネスマネジャー検定 模擬試験 第2回",
    priceJpy: 1280,
    description: "四肢択一50問×各2点=100点満点・90分・70点判定。第1回とは完全に別問題です。",
    questionCount: 50,
    oxCount: 0,
    timeLimitMin: 90,
    passCount: 35,
    passLabel: "70点／100点満点 以上",
    choiceLabel: "四肢択一",
    passPoints: 70,
    pointsPerQuestion: 2,
  },
  chizai: {
    certId: "chizai",
    name: "知的財産管理技能検定3級 模擬試験 第2回",
    priceJpy: 1280,
    description: "本試験(学科)と同じ30問・45分・3肢択一・70%判定。第1回とは完全に別問題です。",
    questionCount: 30,
    oxCount: 0,
    timeLimitMin: 45,
    passCount: 21,
    passLabel: "70%（30問中21問）以上",
    choiceLabel: "3肢択一",
  },
  chizai2: {
    certId: "chizai2",
    name: "知的財産管理技能検定2級 模擬試験 第2回",
    priceJpy: 1280,
    description: "本試験(学科)と同じ40問・60分・4肢択一・80%判定。第1回とは完全に別問題です。",
    questionCount: 40,
    oxCount: 0,
    timeLimitMin: 60,
    passCount: 32,
    passLabel: "80%（40問中32問）以上",
    choiceLabel: "4肢択一",
  },
  eco: {
    certId: "eco",
    name: "eco検定 模擬試験 第2回",
    priceJpy: 1280,
    description: "四肢択一50問×各2点=100点満点・90分・70点判定。第1回とは完全に別問題です。",
    questionCount: 50,
    oxCount: 0,
    timeLimitMin: 90,
    passCount: 35,
    passLabel: "70点／100点満点 以上",
    choiceLabel: "四肢択一",
    passPoints: 70,
    pointsPerQuestion: 2,
  },
  fukushi2: {
    certId: "fukushi2",
    name: "福祉住環境コーディネーター2級 模擬試験 第2回",
    priceJpy: 1280,
    description:
      "○×30問+四肢択一28問=100点満点・90分・70点判定。第1回とは完全に別問題です。",
    questionCount: 28,
    oxCount: 30,
    timeLimitMin: 90,
    passCount: 35,
    passLabel: "70点／100点満点 以上",
    choiceLabel: "○×+四肢択一",
    passPoints: 70,
  },
  mynumber: {
    certId: "mynumber",
    name: "マイナンバー実務検定3級 模擬試験 第2回",
    priceJpy: 1280,
    description:
      "○×15問+4肢択一35問の混合50問・75分・70%判定。第1回とは完全に別問題です。",
    questionCount: 35,
    oxCount: 15,
    timeLimitMin: 75,
    passCount: 35,
    passLabel: "70%（50問中35問）以上",
    choiceLabel: "○×+4肢択一",
  },
};

export function moshi2ProductOf(certId: string): Moshi2Product | undefined {
  return MOSHI2_PRODUCTS[certId as ExamSlug];
}
