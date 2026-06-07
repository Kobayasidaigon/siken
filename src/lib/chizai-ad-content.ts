/**
 * 知的財産管理技能検定3級 講座広告（オンスク.JP）のページ別訴求文。
 * 各コラムの検索意図に合わせた文言を定義する。
 * 知財3級講座はアガルートに無いためオンスクを採用（ユーザーのオンスク維持方針）。
 *
 * secondaryBenrishi: true のページは、オンスク3級CTAに加えて
 * 「3級の先に弁理士を狙うなら」という従属CTA（既存アガルート弁理士リンク）を併置し、
 * 低単価オンスクに偏った知財流入の単価ミックスを底上げする。
 */

export interface ChizaiAdContent {
  headline: string;
  body: string;
  secondaryBenrishi?: boolean; // アガルート弁理士の二段CTAを併置するか
}

// 知財トップページ用
export const CHIZAI_TOP_AD: ChizaiAdContent = {
  headline: "9分野を効率よく対策するなら",
  body: "知的財産管理技能検定は出題範囲が9分野と広く、市販教材も限られる試験です。月額制のオンライン講座オンスク.JPは知財検定3級講座を提供しており、スキマ時間で全分野を体系的に押さえられます。",
};

// コラム記事 slug → 訴求文 のマッピング
export const CHIZAI_AD_BY_SLUG: Record<string, ChizaiAdContent> = {
  "chizai-benkyou-jikan": {
    headline: "限られた勉強時間で効率よく仕上げるなら",
    body: "9分野を独学で順に追うと時間が読めません。月額制のオンスク.JPの知財検定3級講座は、出題範囲を講義で整理してくれるので、限られた時間でも全分野をムラなく一巡しやすくなります。",
    secondaryBenrishi: true,
  },
  "chizai-goukakuritsu": {
    headline: "合格率70〜80%側に確実に入るために",
    body: "合格率が高めの試験でも、9分野のどこかに穴があると不合格側に回ります。月額制のオンスク.JPの知財検定3級講座は、出題されやすい論点を講義で整理してくれるので、苦手分野を残さず合格圏に入りやすくなります。",
    secondaryBenrishi: true,
  },
  "chizai-benkyouhou": {
    headline: "独学で詰まったときの選択肢",
    body: "独学は自由が利く反面、特許・著作権など分野ごとの勘所でつまずきがちです。月額制のオンスク.JPの知財検定3級講座は、講師が論点を整理してくれるので、独学で迷子になった方にも向いています。",
  },
  "chizai-kakomonn": {
    headline: "過去問演習の前に土台を作るなら",
    body: "知財検定3級は過去問の流通が限られ、いきなり問題演習だと改正論点でつまずきがちです。月額制のオンスク.JPの知財検定3級講座は、講義で範囲を一巡してから演習に入れるので、効率よく対策を進められます。",
  },
  "chizai-toha": {
    headline: "受験を決めた方へ",
    body: "資格の価値が見えたら、次は確実に合格することです。月額制のオンスク.JPの知財検定3級講座なら、初学者でも9分野を段階的に学習できます。",
  },
  "chizai-nittei": {
    headline: "試験日が決まったら次にやること",
    body: "試験日が見えた今が、逆算で学習計画を立てる時期です。月額制のオンスク.JPの知財検定3級講座は、範囲が体系化されているので、計画を組み立てる手間が省けます。",
  },
  "chizai-iminai": {
    headline: "資格を活かすために確実に取得したい方へ",
    body: "資格を実務やキャリアに活かすには、まず合格することが大前提です。月額制のオンスク.JPの知財検定3級講座なら、9分野を体系的に押さえて着実に合格を目指せます。",
  },
};

/**
 * slug から該当する訴求文を取得。マッチしなければ undefined（呼び出し側で汎用文にフォールバック）。
 */
export function getChizaiAdContent(slug: string): ChizaiAdContent | undefined {
  return CHIZAI_AD_BY_SLUG[slug];
}
