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
  "bijihou-toha": {
    headline: "取得を決めた方へ",
    body: "メリットを実感するには、まず合格することが必要です。SMART合格講座は民法・会社法・関連法規を講師が順番に整理してくれるので、初めての法律学習でも段階を追って進められます。",
  },
  "bijihou-benkyou-jikan": {
    headline: "学習配分を決める手間を省きたい方へ",
    body: "1ヶ月集中・2ヶ月分散のどちらでも、何にどれだけ時間を割くかの設計が悩みどころです。SMART合格講座は試験範囲がカリキュラムとして組まれているので、自分で配分を判断する負担が減ります。",
  },
  "bijihou-benkyouhou": {
    headline: "独学で詰まったときの選択肢",
    body: "代理の3類型、担保物権の使い分け、会社の機関設計など、独学だと整理しきれない論点が続きます。SMART合格講座は講師が論点を順序立てて解説するので、つまずいた箇所を巻き戻して理解できます。",
  },
  "bijihou-goukakuritsu": {
    headline: "合格率の数字に油断しないために",
    body: "70〜80%の合格率でも、民法の広さや関連法規の手薄さで取りこぼす方はいます。SMART合格講座は頻出論点に絞った構成なので、点を取るべきところで確実に取りに行けます。",
  },
  "bijihou-iminai": {
    headline: "取得すると決めた方へ",
    body: "資格は合格して初めて履歴書に書けます。SMART合格講座は合格までの道筋が用意されているので、独学の不安を抱えずに学習を進められます。",
  },
  "bijihou-kakomonn": {
    headline: "過去問だけでは不安な方へ",
    body: "IBT・CBT化で本番と同じ形式の過去問は手に入りにくくなりました。SMART合格講座は出題傾向を踏まえた問題と解説で構成されているため、過去問演習の不足を補えます。",
  },
  "bijihou-nittei": {
    headline: "申込を済ませたら次のステップ",
    body: "試験日が決まれば、残された時間で何を学ぶかの設計が次の課題です。SMART合格講座は合格までのカリキュラムが用意されているので、計画作成に時間を割かず学習に入れます。",
  },
};

export function getBijihouAdContent(slug: string): BijihouAdContent | undefined {
  return BIJIHOU_AD_BY_SLUG[slug];
}
