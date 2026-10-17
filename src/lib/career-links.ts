/**
 * 資格を活かした転職サービスへの導線(アフィリエイト)の正準定義。2026-10-17 追加。
 *
 * 講座広告(affiliate-links.ts)は「これから受ける人」向けで、合格した人・合格圏の人には
 * 出すものが無かった。合格した人の次の行動は「資格を仕事に活かす」なので、
 * 読者層(track)ごとに転職サービスのリンクを1本ずつ持たせる。
 *
 * 使い方: ASP(A8 等)で転職サービスと提携したら、その track の offer に
 *   発行された計測付きリンクを貼るだけ。CareerCTA(コラム末尾・模試の合格圏・合格報告の送信後)が
 *   一斉に点灯する。生成リンクは改変しないこと(既存リンクの a8mat から自前で作らない方針)。
 *   未設定(undefined)の間は何も表示しない(安全な no-op)。
 *   どの track が未設定でも general に offer があれば、文言ごと general に切り替えて出す。
 * 申請先の候補と成果条件は docs/career-affiliate.md。
 *
 * 計測: AffiliateLink の course は "career-<資格>"(資格IDにしないこと。recent-course が
 *   「前回チェックした講座」として講座リンクを出し直してしまう)、placement は "<面>_career"。
 *   広告主は href の a8mat から affiliate-program.ts で引く(提携したら1行足す)。
 */

import type { ExamSlug } from "./study-progress";

export type CareerTrack = "kanri" | "fudosan" | "kinyu" | "fukushi" | "it" | "kyoin" | "general";

export interface CareerOffer {
  href: string;   // ASP 発行の計測付きリンク
  label: string;  // アンカーテキスト(サービス名を入れる。例「MS Agentで管理部門の求人を見る」)
  pixel?: string; // A8 の1x1計測ピクセル(素材に付いていれば)
}

export interface CareerTrackInfo {
  name: string;     // 読者層の名前(docs・コメント用)
  headline: string; // カードの導入(1行)
  body: string;     // カードの本文。特定サービスの効果をうたわない
  offer?: CareerOffer;
}

export const CAREER_TRACKS: Record<CareerTrack, CareerTrackInfo> = {
  kanri: {
    name: "管理部門(総務・人事・法務・コンプライアンス・知財)",
    headline: "資格を活かして管理部門で働くなら",
    body: "総務・人事・法務の求人は、資格の名前よりも「どの業務を任せられるか」で見られます。管理部門に特化した転職サービスなら、学んだ分野が求人のどの業務に当たるかを担当者と整理できます。",
  },
  fudosan: {
    name: "不動産(賃貸管理・マンション管理)",
    headline: "不動産管理の仕事で資格を活かすなら",
    body: "管理会社には事務所ごとに業務管理者・管理業務主任者を置く義務があり、資格を持つ人の求人が出ています。不動産業界に特化した転職サービスなら、資格が応募条件や手当になる求人を探せます。",
  },
  kinyu: {
    name: "金融(消費者金融・クレジット・信販)",
    headline: "貸金業界で資格を活かすなら",
    body: "貸金業者は営業所ごとに貸金業務取扱主任者を置く必要があり、資格を持つ人を優遇する求人があります。金融業界に強い転職サービスなら、資格が評価される職場を探せます。",
  },
  fukushi: {
    name: "介護・福祉",
    headline: "福祉の仕事で資格を活かすなら",
    body: "介護・福祉の求人は、施設の種類や働き方で条件が大きく変わります。福祉職に特化した転職サービスなら、資格を活かせる職場を条件で絞り込めます。",
  },
  it: {
    name: "IT・情報セキュリティ",
    headline: "ITの仕事で資格を活かすなら",
    body: "IT系の資格は、それだけで採用が決まるものではありませんが、未経験からIT職を目指すときの学習の証明になります。IT業界に強い転職サービスなら、資格を評価する求人を探せます。",
  },
  kyoin: {
    name: "教員・教育",
    headline: "教壇に立つ道を広げるなら",
    body: "教員採用試験の結果を待つあいだや次の試験までの期間に、常勤講師・非常勤講師として働く道もあります。教育業界の求人サービスに登録しておくと、条件に合う募集を探せます。",
  },
  general: {
    name: "総合(どの資格にも使える転職サービス)",
    headline: "資格を次の仕事につなげるなら",
    body: "資格は、取ったあとにどう使うかで価値が変わります。転職サービスに登録すると、資格を評価する求人や、今の経験と組み合わせた仕事の探し方を担当者と相談できます。",
  },
};

/** 資格ごとの読者層。ビジマネ・eco検定は特定の業界に結び付かないので general。 */
export const EXAM_CAREER: Record<ExamSlug, CareerTrack> = {
  kashikin: "kinyu",
  pii: "kanri",
  mynumber: "kanri",
  jitsumu: "kanri",
  bijihou: "kanri",
  bijihou2: "kanri",
  had: "kanri",
  ccm: "kanri",
  chizai: "kanri",
  chizai2: "kanri",
  chintai: "fudosan",
  kangyo: "fudosan",
  shakai: "fukushi",
  fukushi2: "fukushi",
  itpass: "it",
  isec: "it",
  isf: "it",
  dxp: "it",
  kyoin: "kyoin",
  bijimane: "general",
  eco: "general",
};

/**
 * 表示する文言とリンクを返す。その track に offer が無ければ general に切り替え、
 * general にも無ければ null(何も出さない)。
 */
export function careerOfferFor(track: CareerTrack): (CareerTrackInfo & { offer: CareerOffer }) | null {
  const own = CAREER_TRACKS[track];
  if (own.offer) return { ...own, offer: own.offer };
  const general = CAREER_TRACKS.general;
  if (general.offer) return { ...general, offer: general.offer };
  return null;
}
