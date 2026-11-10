/**
 * ビジネス実務法務検定3級の公式講座広告（A8.net SMART合格講座）のページ別訴求文
 */

interface BijihouAdContent {
  headline: string;
  body: string;
}

// トップページ用
export const BIJIHOU_TOP_AD: BijihouAdContent = {
  headline: "全範囲を体系的に学びたい方へ",
  body: "全日本情報学習振興協会のSMART合格講座は、ビジネス実務法務検定の対策講座を提供しています。民法・会社法・関連法規を講師の解説で押さえられます。",
};

// コラム記事 slug → 訴求文 のマッピング
const BIJIHOU_AD_BY_SLUG: Record<string, BijihouAdContent> = {
  "bijihou-toha": {
    headline: "取得を決めた方へ",
    body: "メリットを実感するには、まず合格することが必要です。SMART合格講座は民法・会社法・関連法規を講師が順番に整理してくれるので、初めての法律学習でも段階を追って進められます。",
  },
  "bijihou-benkyou-jikan": {
    headline: "学習配分を決める手間を省きたい方へ",
    body: "短期集中でも分散型でも、何にどれだけ時間を割くかの設計が悩みどころです。SMART合格講座は試験範囲がカリキュラムとして組まれているので、自分で配分を判断する負担が減ります。",
  },
  "bijihou-benkyouhou": {
    headline: "独学で詰まったときの選択肢",
    body: "無権代理と表見代理、担保物権の使い分け、会社の機関設計など、独学だと整理しきれない論点が続きます。SMART合格講座は講師が論点を順序立てて解説するので、つまずいた箇所を巻き戻して理解できます。",
  },
  "bijihou-goukakuritsu": {
    headline: "合格率が回によって変わる試験だから",
    body: "3級の合格率は、第58回(2025年度第2シーズン)が38.3%、第59回(2026年度第1シーズン)が56.9%と、回によって大きく変わります。SMART合格講座は民法・会社法・関連法規を講師の解説で押さえられるので、独学で手薄になりやすい分野の補強に使えます。",
  },
  "bijihou-iminai": {
    headline: "取得すると決めた方へ",
    body: "資格は合格して初めて履歴書に書けます。SMART合格講座は合格までの道筋が用意されているので、独学の不安を抱えずに学習を進められます。",
  },
  "bijihou-kakomonn": {
    headline: "問題演習とあわせて理解を固めたい方へ",
    body: "3級の公式問題集(2026年度版)は、章別問題と模擬問題3回分の構成です。SMART合格講座は民法・会社法・関連法規を講師の解説で押さえられるので、問題演習で見つかった苦手分野の理解を固めるのに使えます。",
  },
  "bijihou-nittei": {
    headline: "申込を済ませたら次のステップ",
    body: "試験日が決まれば、残された時間で何を学ぶかの設計が次の課題です。SMART合格講座は合格までのカリキュラムが用意されているので、計画作成に時間を割かず学習に入れます。",
  },
};

export function getBijihouAdContent(slug: string): BijihouAdContent | undefined {
  return BIJIHOU_AD_BY_SLUG[slug];
}
