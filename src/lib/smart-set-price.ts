/**
 * SMART合格講座の受講料(税込)。「講座のみ」と「試験と同時申込」の2本立て。2026-10-06 追加。
 *
 * 協会の講座ページに「試験と同時申込する場合は3,300円(税込)の割引が適用されます。」とあり、
 * 同時申込の金額 = 講座のみ + 受験料(公開会場) − 3,300円 になっている(下の4資格すべてで合う)。
 * A8 の報酬は講座申込 30%・試験申込 10% で、2026年の最大の1件(注文30,800円)は
 * 個人情報保護士の同時申込と金額が一致する(未確定・金額からの推定)。
 * 資格トップの講座広告の下に、この割引と金額を出す(SmartSetNote)。
 *
 * 金額を変えたら SMART_SET_CHECKED も変える(画面に「◯年◯月時点」と出る)。
 * 出典は各 source の協会ページ。
 * ※2026-10-06 は本環境から協会サイトへ到達できず、金額はユーザーが公式ページで確認した値。
 */

export type SmartSetExam = "pii" | "jitsumu" | "mynumber" | "isec";

interface Price {
  grade?: string; // 級で金額が違う資格だけ
  yen: number;
}

export interface SmartSetPrice {
  courseOnly: Price[];
  withExam: Price[];
  source: string;
}

export const SMART_SET_DISCOUNT_YEN = 3300;
export const SMART_SET_CHECKED = "2026年10月";

export const SMART_SET_PRICE: Record<SmartSetExam, SmartSetPrice> = {
  pii: {
    courseOnly: [{ yen: 23100 }],
    withExam: [{ yen: 30800 }],
    source: "https://www.joho-gakushu.jp/smartinfo/k_piip/",
  },
  jitsumu: {
    courseOnly: [
      { grade: "1級", yen: 19800 },
      { grade: "2級", yen: 17600 },
    ],
    withExam: [
      { grade: "1級", yen: 27500 },
      { grade: "2級", yen: 23100 },
    ],
    source: "https://www.joho-gakushu.jp/smartinfo/k_pipl/",
  },
  mynumber: {
    courseOnly: [{ yen: 17600 }],
    withExam: [
      { grade: "1級", yen: 25300 },
      { grade: "2級", yen: 23100 },
      { grade: "3級", yen: 22000 },
    ],
    source: "https://www.joho-gakushu.jp/smartinfo/k_nns/",
  },
  isec: {
    courseOnly: [{ yen: 17600 }],
    withExam: [{ yen: 25300 }],
    source: "https://www.joho-gakushu.jp/smartinfo/k_isme/",
  },
};

export function yen(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** 例: "30,800円" / "1級27,500円・2級23,100円" */
export function formatPrices(rows: Price[]): string {
  return rows.map((r) => `${r.grade ?? ""}${yen(r.yen)}円`).join("・");
}
