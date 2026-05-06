export interface JitsumuAdContent {
  headline: string;
  body: string;
}

export const JITSUMU_TOP_AD: JitsumuAdContent = {
  headline: "全範囲を体系的に学びたい方へ",
  body: "試験を実施している全日本情報学習振興協会の公式講座です。改正法対応の論点も、講師の解説で押さえられます。",
};

export const JITSUMU_AD_BY_SLUG: Record<string, JitsumuAdContent> = {
  "jitsumu-goukakuritsu": {
    headline: "合格率を上げる近道は",
    body: "合格率は準備の質次第で変わります。試験を実施している協会の公式講座は、出題傾向を踏まえた構成なので、独学よりも合格圏に近づきやすいです。",
  },
  "jitsumu-benkyouhou": {
    headline: "独学で詰まったときの選択肢",
    body: "改正法と実務ガイドラインを並行して理解するのは意外と難しいです。試験を実施している協会の講座は、講師が論点を整理してくれるので、独学で行き詰まった方にも向いています。",
  },
  "jitsumu-toha": {
    headline: "受験を決めた方へ",
    body: "資格の価値が見えたら、次は確実に合格することです。試験を実施している協会の公式講座なら、初学者でも段階的に学習を進められます。",
  },
  "jitsumu-nittei": {
    headline: "試験日が決まったら次にやること",
    body: "試験日が見えた今が、逆算で学習計画を立てる時期です。試験を実施している協会の公式講座は、合格までの道筋が用意されているので、計画を組み立てる手間が省けます。",
  },
  "jitsumu-benkyou-jikan": {
    headline: "短期間で合格を目指すなら",
    body: "限られた勉強時間で合格するには、何をやらないかの判断が重要です。試験を実施している協会の公式講座は、出題されやすい論点に絞られているので、効率重視の方に向いています。",
  },
  "jitsumu-kakomonn": {
    headline: "過去問だけでは不安な方へ",
    body: "過去問演習だけでは、改正論点や初見問題への対応力が育ちにくいです。試験を実施している協会の講座は、論点の背景まで解説してくれるので、応用問題にも対応しやすくなります。",
  },
  "jitsumu-iminai": {
    headline: "資格を活かすために確実に取得したい方へ",
    body: "資格を実務で活かすには、まず合格することが大前提です。試験を実施している協会の公式講座なら、合格までの道筋がはっきりしているので、迷わず学習を進められます。",
  },
};

export function getJitsumuAdContent(slug: string): JitsumuAdContent | undefined {
  return JITSUMU_AD_BY_SLUG[slug];
}
