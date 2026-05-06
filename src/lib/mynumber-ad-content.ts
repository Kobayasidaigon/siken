/**
 * マイナンバー実務検定の公式講座広告（A8.net）のページ別訴求文
 * 各ページの読者心理に合わせた文言を定義
 */

export interface MynumberAdContent {
  headline: string;
  body: string;
}

// マイナンバートップページ用
export const MYNUMBER_TOP_AD: MynumberAdContent = {
  headline: "全範囲を体系的に学びたい方へ",
  body: "試験を実施している全日本情報学習振興協会の公式講座です。番号法の条文や事業者ガイドラインを、講師の解説で押さえられます。",
};

// コラム記事 slug → 訴求文 のマッピング
export const MYNUMBER_AD_BY_SLUG: Record<string, MynumberAdContent> = {
  "mynumber-goukakuritsu": {
    headline: "合格率を上げる近道は",
    body: "合格率は準備の質で大きく変わります。試験を実施している協会の公式講座は、出題傾向を踏まえた構成なので、独学よりも合格圏に近づきやすいです。",
  },
  "mynumber-benkyouhou": {
    headline: "独学で詰まったときの選択肢",
    body: "番号法の条文と事業者ガイドラインを並行して理解するのが意外と難しいです。試験を実施している協会の講座は、講師が論点を整理してくれるので、独学で行き詰まった方にも向いています。",
  },
  "mynumber-toha": {
    headline: "受験を決めた方へ",
    body: "資格の価値が見えたら、次は確実に合格することです。試験を実施している協会の公式講座なら、初学者でも段階的に学習を進められます。",
  },
  "mynumber-nittei": {
    headline: "試験日が決まったら次にやること",
    body: "試験日が見えた今が、逆算で学習計画を立てる時期です。試験を実施している協会の公式講座は、合格までの道筋が用意されているので、計画を組み立てる手間が省けます。",
  },
  "mynumber-benkyou-jikan": {
    headline: "短期間で合格を目指すなら",
    body: "限られた勉強時間で合格するには、何をやらないかの判断が重要です。試験を実施している協会の公式講座は、出題されやすい論点に絞られているので、効率重視の方に向いています。",
  },
  "mynumber-kakomonn": {
    headline: "過去問だけでは不安な方へ",
    body: "過去問演習だけでは、改正論点や初見の問題への対応力が育ちにくいです。試験を実施している協会の講座は、論点の背景まで解説してくれるので、応用問題にも対応しやすくなります。",
  },
  "mynumber-iminai": {
    headline: "資格を活かすために確実に取得したい方へ",
    body: "資格を実務で活かすには、まず合格することが大前提です。試験を実施している協会の公式講座なら、合格までの道筋がはっきりしているので、迷わず学習を進められます。",
  },
};

export function getMynumberAdContent(slug: string): MynumberAdContent | undefined {
  return MYNUMBER_AD_BY_SLUG[slug];
}
