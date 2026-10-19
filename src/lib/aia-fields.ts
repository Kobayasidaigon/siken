/**
 * AI活用アドバイザー認定試験の分野定義。唯一の出典。
 * had-fields.ts と同じ形で、資格トップ・分野ページ・問題ページの3か所が同じ配列を読む。
 * task は本試験の科目・課題との対応(表示用)。仕様の出典と確認日は docs/new-certs-2026-10-review.md を参照。
 */

export interface AiaField {
  /** URL に使う分野スラッグ。/aia/field/<slug>/ */
  slug: string;
  /** 問題 md の field と完全一致させる値 */
  name: string;
  /** 本試験の科目・課題(表示用) */
  task: string;
  desc: string;
}

export const AIA_FIELDS: AiaField[] = [
  {
    slug: "basics",
    name: "AIの基礎知識・用語",
    task: "第1課題",
    desc: "AIの定義と歴史、機械学習・教師あり/なし・強化学習、AI関連の基礎用語、AIでできること・できないこと",
  },
  {
    slug: "tech",
    name: "AIの技術",
    task: "第2課題",
    desc: "ディープラーニング、ニューラルネットワーク、画像認識・自然言語処理・音声、知的活動を実現する技術",
  },
  {
    slug: "genai",
    name: "生成AIの基礎知識",
    task: "第3課題",
    desc: "生成AIの仕組み、大規模言語モデル、トークン・パラメータ・学習データ、従来のAIとの違い、代表的な生成AIサービス",
  },
  {
    slug: "project",
    name: "AIプロジェクトの流れ",
    task: "第4課題",
    desc: "AI開発を取り巻く環境、AIプロジェクトの流れ（課題の落とし込みからチューニング、運用と効果検証まで）",
  },
  {
    slug: "cases",
    name: "企業・団体のAI導入事例",
    task: "第5課題",
    desc: "製造・自動車・農林水産・医療介護・金融・物流・流通・教育・エンタメ・スポーツ・スマートライフ・エネルギー・防犯防災・インフラ・行政などの導入事例",
  },
  {
    slug: "human",
    name: "人材・AIの導入動向",
    task: "第6課題",
    desc: "企業のAI人材（スキル・育成・採用）、企業のAI導入動向と課題、調査データの読み方",
  },
  {
    slug: "policy",
    name: "AIの制度・政策動向",
    task: "第7課題",
    desc: "AIに関するガイドライン・制度（AI事業者ガイドライン、AI法、個人情報・著作権）、国の政策動向",
  },
];

/** 分野名 → スラッグ。問題ページのパンくずで使う */
export const AIA_FIELD_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(
  AIA_FIELDS.map((f) => [f.name, f.slug])
);

export function aiaFieldBySlug(slug: string): AiaField | undefined {
  return AIA_FIELDS.find((f) => f.slug === slug);
}
