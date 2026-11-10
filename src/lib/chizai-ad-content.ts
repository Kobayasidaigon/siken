/**
 * 知的財産管理技能検定3級 講座広告（オンスク.JP）のページ別訴求文。
 * 各コラムの検索意図に合わせた文言を定義する。
 * 知財3級講座はアガルートに無いためオンスクを採用（ユーザーのオンスク維持方針）。
 *
 * secondaryBenrishi: true のページは、オンスク3級CTAに加えて
 * 「3級の先に弁理士を狙うなら」という従属CTA（既存アガルート弁理士リンク）を併置し、
 * 低単価オンスクに偏った知財流入の単価ミックスを底上げする。
 */

interface ChizaiAdContent {
  headline: string;
  body: string;
  secondaryBenrishi?: boolean; // アガルート弁理士の二段CTAを併置するか
}

// コラム記事 slug → 訴求文 のマッピング
const CHIZAI_AD_BY_SLUG: Record<string, ChizaiAdContent> = {
  "chizai-benkyou-jikan": {
    headline: "限られた勉強時間で効率よく仕上げるなら",
    body: "出題範囲は、知的財産の保護・活用と関係法規にわたります。月額制のオンスク.JPの知財検定3級講座は、出題範囲を講義で整理してくれるので、限られた時間でも範囲を一巡しやすくなります。",
    secondaryBenrishi: true,
  },
  "chizai-goukakuritsu": {
    headline: "学科・実技とも70%以上を取るために",
    body: "知財検定3級は、学科と実技の両方で満点の70%以上を取る必要があります。月額制のオンスク.JPの知財検定3級講座は、論点を講義で整理してくれるので、苦手分野を残さずに準備を進めやすくなります。",
    secondaryBenrishi: true,
  },
  "chizai-benkyouhou": {
    headline: "独学で詰まったときの選択肢",
    body: "独学は自由が利く反面、特許・著作権など分野ごとの勘所でつまずきがちです。月額制のオンスク.JPの知財検定3級講座は、講師が論点を整理してくれるので、独学で迷子になった方にも向いています。",
  },
  "chizai-kakomonn": {
    headline: "過去問演習の前に土台を作るなら",
    body: "公式サイトでは過去3回分の試験問題と正解が公開されています。いきなり問題演習に入るより先に範囲を一巡しておきたい方には、月額制のオンスク.JPの知財検定3級講座が使えます。講義で範囲を整理してから演習に入れます。",
  },
  "chizai-toha": {
    headline: "受験を決めた方へ",
    body: "資格の価値が見えたら、次は合格に向けた準備です。月額制のオンスク.JPの知財検定3級講座なら、初学者でも出題範囲を段階的に学習できます。",
  },
  "chizai-nittei": {
    headline: "試験日が決まったら次にやること",
    body: "試験日が見えた今が、逆算で学習計画を立てる時期です。月額制のオンスク.JPの知財検定3級講座は、範囲が体系化されているので、計画を組み立てる手間が省けます。",
  },
  "chizai-iminai": {
    headline: "資格を活かすために合格を目指す方へ",
    body: "資格を実務やキャリアに活かすには、まず合格することが大前提です。月額制のオンスク.JPの知財検定3級講座なら、出題範囲を体系的に押さえながら合格を目指せます。",
  },
};

/**
 * slug から該当する訴求文を取得。マッチしなければ undefined（呼び出し側で汎用文にフォールバック）。
 */
export function getChizaiAdContent(slug: string): ChizaiAdContent | undefined {
  return CHIZAI_AD_BY_SLUG[slug];
}
