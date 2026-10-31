/**
 * 労働法務士認定試験の分野定義。唯一の出典。
 * had-fields.ts と同じ形で、資格トップ・分野ページ・問題ページの3か所が同じ配列を読む。
 *
 * task は本試験の出題範囲（課題・編）。2026-10-31 に協会の公式ページ(https://www.joho-gakushu.or.jp/llc/)で確認した出題内容に沿って、
 * 当サイトで8分野に分けた（1分野20問の予定）。
 */

export interface LlcField {
  /** URL に使う分野スラッグ。/llc/field/<slug>/ */
  slug: string;
  /** 問題 md の field と完全一致させる値 */
  name: string;
  /** 本試験の出題範囲（表示用） */
  task: string;
  desc: string;
}

export const LLC_FIELDS: LlcField[] = [
  {
    slug: "souron",
    name: "労働法総論",
    task: "労働法総論",
    desc: "労働法の意義と沿革、憲法27条・28条、労働者と使用者の定義、労働基準法の適用範囲、労働法の法源",
  },
  {
    slug: "keiyaku",
    name: "労働契約（成立・就業規則・終了）",
    task: "雇用関係法",
    desc: "労働契約の成立と労働条件の明示、就業規則と労働契約法、労働条件の変更、配転・出向、懲戒、解雇と解雇予告、雇止め・無期転換",
  },
  {
    slug: "jikan",
    name: "労働時間・休日・賃金",
    task: "雇用関係法",
    desc: "法定労働時間と36協定、時間外・休日・深夜の割増賃金、変形労働時間制・フレックス・裁量労働、年次有給休暇、賃金支払の5原則、最低賃金",
  },
  {
    slug: "anzen",
    name: "安全衛生・労災補償",
    task: "雇用関係法",
    desc: "労働安全衛生法の体制と健康診断・ストレスチェック、長時間労働者の面接指導、労災保険の業務災害・通勤災害、安全配慮義務",
  },
  {
    slug: "byodo",
    name: "雇用平等・多様な働き方",
    task: "雇用関係法",
    desc: "男女雇用機会均等法、育児・介護休業法、ハラスメント防止措置、パートタイム・有期雇用労働法の同一労働同一賃金、労働者派遣法",
  },
  {
    slug: "roushi",
    name: "労使関係法（労働組合法）",
    task: "労使関係法",
    desc: "労働組合の要件、団体交渉、労働協約の効力、争議行為と正当性、不当労働行為と労働委員会の救済",
  },
  {
    slug: "hosho",
    name: "雇用保障法",
    task: "雇用保障法",
    desc: "職業安定法、雇用保険の給付、高年齢者雇用安定法の雇用確保措置、障害者雇用促進法の法定雇用率、労働施策総合推進法",
  },
  {
    slug: "funso",
    name: "労働紛争の解決・外国人労働者",
    task: "労働紛争解決・その他",
    desc: "個別労働紛争解決促進法と労働局のあっせん、労働審判、労働関係調整法、外国人労働者の在留資格と雇用管理、育成就労",
  },
];

/** 分野名 → スラッグ。問題ページのパンくずで使う */
export const LLC_FIELD_SLUG_BY_NAME: Record<string, string> = Object.fromEntries(
  LLC_FIELDS.map((f) => [f.name, f.slug])
);

export function llcFieldBySlug(slug: string): LlcField | undefined {
  return LLC_FIELDS.find((f) => f.slug === slug);
}
