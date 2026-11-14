import { getAllMynumber1Questions, type Mynumber1QuestionData } from "./mynumber1-questions";
import { getAllMynumber2Questions } from "./mynumber2-questions";

/**
 * マイナンバー実務検定1級 模擬試験 第1回の固定ペーパー定義。
 *
 * 本試験仕様(全日本情報学習振興協会のページ https://www.joho-gakushu.or.jp/nns/ と
 * 出題内容のページ https://www.joho-gakushu.or.jp/nns/naiyou.php を 2026-11-14 に確認):
 * 1級は80問、10:00〜12:15(135分)、70%以上の得点で合格(問題の難易度により調整あり)。
 * 範囲は2級の出題項目に、行政機関等編ガイドラインと金融業務ガイドラインが加わる。
 * 協会はこの2つのガイドラインを各5〜10問程度と案内しているので、本模試では各8問にした。
 * ほかの分野ごとの問題数は公表されていないので、残り64問の配分は当サイトの想定。
 *
 * 構成: 4肢択一80問 / 56問(70%)以上で合格判定。全員が同じ問題を同じ順序で解く固定問題。
 * 2級と共通の範囲は /mynumber2/ の問題から、2級の模擬試験 第1回で使っていない問題を選んだ。
 * 正解の位置は 1〜4 で20問ずつ(難易度は A:15 / B:42 / C:23)。
 */
export const MYNUMBER1_MOSHI_TIME_LIMIT_MIN = 135;
export const MYNUMBER1_MOSHI_PASS_COUNT = 56;

const MYNUMBER1_MOSHI_1_SLUGS: string[] = [
  // 番号法の総則と個人番号（11問）
  "mynumber2-003", // B 個人番号利用事務と個人番号関係事務
  "mynumber2-008", // B 個人番号の変更
  "mynumber2-009", // C 個人番号の生成
  "mynumber2-011", // B 利用範囲（個人番号関係事務）
  "mynumber2-014", // A 委託先の監督
  "mynumber2-017", // B 提供の要求
  "mynumber2-020", // A 本人確認の措置
  "mynumber2-021", // B 個人番号関係事務実施者の範囲
  "mynumber2-023", // C 個人番号の変更（場面）
  "mynumber2-024", // B 情報提供用個人識別符号
  "mynumber2-027", // C 個人番号利用事務の範囲
  // 個人番号カードと本人確認（10問）
  "mynumber2-032", // A 個人番号カードの交付
  "mynumber2-039", // A 本人確認の2要素
  "mynumber2-041", // B 代理人からの提供
  "mynumber2-043", // B 本人確認の義務
  "mynumber2-045", // C カードの利用の安全管理基準
  "mynumber2-046", // B 手数料
  "mynumber2-048", // B 国外転出者の届出
  "mynumber2-050", // B 扶養親族の個人番号
  "mynumber2-052", // C 代理人が法人の場合
  "mynumber2-053", // B カードのコピー
  // 特定個人情報の提供と収集・保管（11問）
  "mynumber2-054", // A 提供の制限の原則
  "mynumber2-056", // B 本人からの提供
  "mynumber2-059", // A 情報提供ネットワークシステム
  "mynumber2-061", // B 生命・身体・財産の保護
  "mynumber2-062", // B 裁判・捜査などでの提供
  "mynumber2-064", // B 保管の期間
  "mynumber2-065", // C 扶養控除等申告書の保存
  "mynumber2-067", // C 提供を求める時期（例示）
  "mynumber2-070", // B 国税と地方税の連携
  "mynumber2-079", // C 住民基本台帳法による提供
  "mynumber2-081", // B 提供の求めと同一世帯
  // 保護評価・個人情報保護法の特例・監督（11問）
  "mynumber2-082", // B 特定個人情報保護評価の指針
  "mynumber2-084", // C 特定個人情報保護評価の手続
  "mynumber2-086", // A 事業者と個人情報保護法の特例
  "mynumber2-091", // B 委員会の位置づけ
  "mynumber2-092", // B 報告と立入検査
  "mynumber2-094", // B 報告・検査の拒否
  "mynumber2-097", // C 委託先での漏えい
  "mynumber2-099", // C 評価書の公表の効果
  "mynumber2-102", // C 委員の暫定的な任命
  "mynumber2-104", // B 勧告
  "mynumber2-106", // C 緊急命令
  // 法人番号と罰則（10問）
  "mynumber2-108", // B 法人番号の対象
  "mynumber2-110", // B 届出による法人番号の指定
  "mynumber2-112", // A 法人番号と個人番号の違い
  "mynumber2-114", // A 特定個人情報ファイルの不正な提供
  "mynumber2-116", // B 詐欺・暴行などによる取得
  "mynumber2-118", // B 職権濫用による収集
  "mynumber2-120", // B 国外犯
  "mynumber2-122", // C 両罰規定の金額
  "mynumber2-124", // A 罰則の重さの比較
  "mynumber2-126", // B 法人番号の利用
  // 事業者編ガイドライン（11問）
  "mynumber2-128", // B 利用目的の通知の方法
  "mynumber2-130", // A 社員番号としての利用
  "mynumber2-132", // B 雇用形態の変更
  "mynumber2-133", // B 本人以外から取得する場合
  "mynumber2-135", // B 委託契約の内容
  "mynumber2-140", // B 従業者の監督
  "mynumber2-144", // B 廃棄の委託
  "mynumber2-145", // C アクセス制御と特定個人情報ファイル
  "mynumber2-147", // C 委託による収集
  "mynumber2-149", // B 事業承継と利用目的
  "mynumber2-150", // C 提供を求めてはならない場合
  // 行政機関等編ガイドライン（8問）
  "mynumber1-001", // A ガイドラインの記述の意味
  "mynumber1-002", // B ガイドラインの対象
  "mynumber1-004", // C 番号法と条例
  "mynumber1-006", // B 条例による独自利用
  "mynumber1-014", // B 同意と提供制限
  "mynumber1-015", // C 開示請求と個人番号
  "mynumber1-022", // C 書面提出の省略
  "mynumber1-023", // C 提供等の記録
  // 金融業務ガイドライン（8問）
  "mynumber1-028", // A 金融機関の主な事務
  "mynumber1-029", // A 顧客番号としての利用
  "mynumber1-032", // C 激甚災害時の利用の要件
  "mynumber1-037", // A 提供を求める時期
  "mynumber1-041", // C 出資配当金
  "mynumber1-042", // B 「提供」の意味
  "mynumber1-046", // B 特定口座開設届出書の保存
  "mynumber1-051", // B 代理人からの提供と本人確認
];

export interface Mynumber1MoshiQuestion extends Mynumber1QuestionData {
  /** 問題ページのパス。2級と共通の範囲の問題は /mynumber2/q/ にある */
  path: string;
  /** 学習記録(/study)に残す資格。2級の問題は2級の記録に入れる */
  progressExam: "mynumber1" | "mynumber2";
}

/**
 * 固定ペーパーの80問を MYNUMBER1_MOSHI_1_SLUGS の順序どおりに返す。
 * 問題ファイルが見つからないものは黙って落とすのではなくビルドを落とす
 * (問題番号の付け替えなどで模試が静かに短くなる事故を防ぐため)。
 */
export async function getMynumber1Moshi1(): Promise<Mynumber1MoshiQuestion[]> {
  const [own, shared] = await Promise.all([getAllMynumber1Questions(), getAllMynumber2Questions()]);
  const bySlug = new Map<string, Mynumber1MoshiQuestion>();
  for (const q of own) bySlug.set(q.slug, { ...q, path: `/mynumber1/q/${q.slug}/`, progressExam: "mynumber1" });
  for (const q of shared) bySlug.set(q.slug, { ...q, path: `/mynumber2/q/${q.slug}/`, progressExam: "mynumber2" });
  return MYNUMBER1_MOSHI_1_SLUGS.map((slug) => {
    const q = bySlug.get(slug);
    if (!q) {
      throw new Error(`[mynumber1-moshi] 模試の問題が見つかりません: ${slug}`);
    }
    return q;
  });
}
