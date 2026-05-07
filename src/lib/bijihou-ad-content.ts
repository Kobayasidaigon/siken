/**
 * ビジネス実務法務検定3級の公式講座広告（A8.net SMART合格講座）のページ別訴求文
 */

export interface BijihouAdContent {
  headline: string;
  body: string;
}

// トップページ用
export const BIJIHOU_TOP_AD: BijihouAdContent = {
  headline: "全範囲を体系的に学びたい方へ",
  body: "全日本情報学習振興協会のSMART合格講座は、ビジネス実務法務検定の対策講座を提供しています。民法・会社法・関連法規を講師の解説で押さえられます。",
};

// コラム記事 slug → 訴求文 のマッピング
export const BIJIHOU_AD_BY_SLUG: Record<string, BijihouAdContent> = {
  "bijihou-goukakuritsu": {
    headline: "合格率を上げる近道は",
    body: "合格率は準備の質で大きく変わります。SMART合格講座は出題傾向を踏まえた構成なので、独学よりも合格圏に近づきやすいです。",
  },
  "bijihou-benkyouhou": {
    headline: "独学で詰まったときの選択肢",
    body: "民法と会社法を並行して学ぶのが意外と難しい試験です。SMART合格講座は講師が論点を整理してくれるので、独学で行き詰まった方にも向いています。",
  },
  "bijihou-toha": {
    headline: "受験を決めた方へ",
    body: "資格の価値が見えたら、次は確実に合格することです。SMART合格講座なら、初学者でも段階的に学習を進められます。",
  },
  "bijihou-nittei": {
    headline: "試験日が決まったら次にやること",
    body: "試験期間が見えた今が、逆算で学習計画を立てる時期です。SMART合格講座は合格までの道筋が用意されているので、計画を組み立てる手間が省けます。",
  },
  "bijihou-benkyou-jikan": {
    headline: "短期間で合格を目指すなら",
    body: "限られた勉強時間で合格するには、何をやらないかの判断が重要です。SMART合格講座は出題されやすい論点に絞られているので、効率重視の方に向いています。",
  },
  "bijihou-kakomonn": {
    headline: "過去問だけでは不安な方へ",
    body: "過去問演習だけでは、改正法や初見の問題への対応力が育ちにくいです。SMART合格講座は論点の背景まで解説してくれるので、応用問題にも対応しやすくなります。",
  },
  "bijihou-iminai": {
    headline: "資格を活かすために確実に取得したい方へ",
    body: "資格を実務で活かすには、まず合格することが大前提です。SMART合格講座なら合格までの道筋がはっきりしているので、迷わず学習を進められます。",
  },
};

export function getBijihouAdContent(slug: string): BijihouAdContent | undefined {
  return BIJIHOU_AD_BY_SLUG[slug];
}
