/**
 * 生成AIアドバイザー認定試験の分野定義。唯一の出典。
 * had-fields.ts と同じ形で、資格トップ・分野ページ・問題ページの3か所が同じ配列を読む。
 * task は本試験の科目・課題との対応(表示用)。仕様の出典と確認日は docs/new-certs-2026-10-review.md を参照。
 */

export interface GaiaField {
  /** URL に使う分野スラッグ。/gaia/field/<slug>/ */
  slug: string;
  /** 問題 md の field と完全一致させる値 */
  name: string;
  /** 本試験の科目・課題(表示用) */
  task: string;
  desc: string;
}

export const GAIA_FIELDS: GaiaField[] = [
  {
    slug: "ai-basics",
    name: "AIの基礎理解",
    task: "第1課題",
    desc: "AIとは、機械学習（教師あり・教師なし・強化学習）、深層学習の基礎",
  },
  {
    slug: "genai-basics",
    name: "生成AIの基礎理解",
    task: "第2課題",
    desc: "生成AIの仕組み（LLM・拡散モデル・GAN）、トークン・パラメータ、従来のAIとの違い、代表的な生成AIサービスの特徴",
  },
  {
    slug: "prompt",
    name: "プロンプトエンジニアリング",
    task: "第3課題",
    desc: "プロンプトの考え方、役割指定・出力形式・Few-shot・Chain of Thought・反復改善などのテクニック",
  },
  {
    slug: "cases",
    name: "活用ケーススタディ",
    task: "第4課題",
    desc: "ビジネス文書、マーケティング、教育・学習、創作、コーディング支援での活用ケース",
  },
  {
    slug: "risk-ethics",
    name: "リスクと限界・倫理・著作権・情報管理",
    task: "第5課題",
    desc: "ハルシネーション、知識の更新限界、著作権侵害リスク、個人情報・機密情報の入力ルール、倫理原則、悪用リスク",
  },
  {
    slug: "human-role",
    name: "AIと人間の役割分担",
    task: "第6課題",
    desc: "協働モデル（AIは支援、人間が最終判断）、説明可能性、意思決定と責任、労働市場への影響",
  },
  {
    slug: "enterprise",
    name: "AI導入における企業課題",
    task: "第7課題",
    desc: "導入ポリシー、情報漏えい防止とセキュリティ、コスト管理とROI、法規制・ガイドライン",
  },
  {
    slug: "trends",
    name: "最新動向・将来展望",
    task: "第8課題",
    desc: "マルチモーダルAI、AIエージェント、分野別の拡大、人間とAIの協働社会",
  },
  {
    slug: "guideline",
    name: "AI事業者ガイドライン・制度",
    task: "「その他」（AI事業者ガイドラインなど）",
    desc: "AI事業者ガイドライン（総務省・経産省）、人間中心のAI社会原則などの制度・指針",
  },
];

/** 分野名 → スラッグ。問題ページのパンくずで使う */
export const GAIA_FIELD_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(
  GAIA_FIELDS.map((f) => [f.name, f.slug])
);

export function gaiaFieldBySlug(slug: string): GaiaField | undefined {
  return GAIA_FIELDS.find((f) => f.slug === slug);
}
