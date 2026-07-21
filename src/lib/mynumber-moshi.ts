import { getAllMynumberQuestions, type MynumberQuestionData } from "./mynumber-questions";

/**
 * 模擬試験 第1回の固定ペーパー定義。
 * 本試験仕様: 50問・75分・4肢択一・合格基準70%(35問)。
 * 全員が同じ問題を同じ順序で解く固定問題(選定・並びは決定的)。分野構成は
 * 出題範囲の配分に合わせ、各分野の論点を等間隔サンプリングで選定している。
 * 設計思想の詳細は chizai-moshi.ts を参照。
 */
export const MYNUMBER_MOSHI_TIME_LIMIT_MIN = 75;
export const MYNUMBER_MOSHI_PASS_COUNT = 35;

export const MYNUMBER_MOSHI_1_SLUGS: string[] = [
  "mynumber-001", // 番号法の概要 A 番号法の目的
  "mynumber-081", // 特定個人情報保護 A 特定個人情報の提供制限
  "mynumber-041", // 個人番号カード・利用 A 個人番号カードの基本記載事項
  "mynumber-121", // 事業者の取扱い A 事業者の本人確認
  "mynumber-161", // 法人番号・罰則・実務 A 法人番号の桁数
  "mynumber-005", // 番号法の概要 B 税分野での利用
  "mynumber-085", // 特定個人情報保護 B 災害対策における提供
  "mynumber-045", // 個人番号カード・利用 B 個人番号カードの交付主体
  "mynumber-125", // 事業者の取扱い B 雇用関係にある場合の本人確認
  "mynumber-165", // 法人番号・罰則・実務 B 法人番号の利用範囲
  "mynumber-010", // 番号法の概要 A 番号法と他法令の関係
  "mynumber-090", // 特定個人情報保護 C 緊急避難的な提供
  "mynumber-050", // 個人番号カード・利用 C 個人番号カード券面のICチップ
  "mynumber-130", // 事業者の取扱い C 本人確認義務違反時の責任
  "mynumber-170", // 法人番号・罰則・実務 C 法人番号の活用例
  "mynumber-014", // 番号法の概要 A 本人確認の3要素
  "mynumber-094", // 特定個人情報保護 B マイナポータルでの情報確認
  "mynumber-054", // 個人番号カード・利用 B コンビニ交付サービス
  "mynumber-134", // 事業者の取扱い B 利用目的の変更
  "mynumber-174", // 法人番号・罰則・実務 B 国外犯処罰
  "mynumber-018", // 番号法の概要 B 個人番号と外国人
  "mynumber-098", // 特定個人情報保護 B デジタル庁の役割
  "mynumber-058", // 個人番号カード・利用 B 公的個人認証サービス
  "mynumber-138", // 事業者の取扱い C 目的外利用の例外
  "mynumber-178", // 法人番号・罰則・実務 C 罰則の重さの比較
  "mynumber-023", // 番号法の概要 A 行政機関等の意義
  "mynumber-103", // 特定個人情報保護 A 評価対象の閾値
  "mynumber-063", // 個人番号カード・利用 A 自己情報表示機能
  "mynumber-143", // 事業者の取扱い A 人的安全管理措置
  "mynumber-183", // 法人番号・罰則・実務 A 苦情処理
  "mynumber-027", // 番号法の概要 B 個人情報保護委員会
  "mynumber-107", // 特定個人情報保護 B 重点項目評価書
  "mynumber-067", // 個人番号カード・利用 B 公金受取口座登録
  "mynumber-147", // 事業者の取扱い B 中小規模事業者の特例
  "mynumber-187", // 法人番号・罰則・実務 B 漏えい等報告
  "mynumber-031", // 番号法の概要 A 個人番号の指定主体
  "mynumber-111", // 特定個人情報保護 A 番号法と個人情報保護法の関係
  "mynumber-071", // 個人番号カード・利用 A 個人番号の利用範囲
  "mynumber-151", // 事業者の取扱い A 委託先の監督義務
  "mynumber-191", // 法人番号・罰則・実務 A USB紛失時の対応
  "mynumber-036", // 番号法の概要 B 個人番号の通知方法
  "mynumber-116", // 特定個人情報保護 B 漏えい時の対応
  "mynumber-076", // 個人番号カード・利用 B 児童手当での利用
  "mynumber-156", // 事業者の取扱い B 委託先の取扱状況把握
  "mynumber-196", // 法人番号・罰則・実務 B 本人通知の方法
  "mynumber-040", // 番号法の概要 C 番号法の総合理解
  "mynumber-120", // 特定個人情報保護 C 上書き規定の理解
  "mynumber-080", // 個人番号カード・利用 C 社会保障分野の総合問題
  "mynumber-160", // 事業者の取扱い C クラウドサービス利用時の委託
  "mynumber-200", // 法人番号・罰則・実務 C 本人からの照会への対応
];

export async function getMynumberMoshi1Questions(): Promise<MynumberQuestionData[]> {
  const all = await getAllMynumberQuestions();
  const bySlug = new Map(all.map((q) => [q.slug, q]));
  const found = MYNUMBER_MOSHI_1_SLUGS.flatMap((s) => {
    const q = bySlug.get(s);
    return q ? [q] : [];
  });
  if (found.length !== MYNUMBER_MOSHI_1_SLUGS.length) {
    const missing = MYNUMBER_MOSHI_1_SLUGS.filter((s) => !bySlug.has(s));
    throw new Error(`mynumber-moshi: 模試の問題が見つかりません: ${missing.join(", ")}`);
  }
  return found;
}
