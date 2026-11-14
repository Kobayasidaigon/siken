import { getAllMynumber2Questions, type Mynumber2QuestionData } from "./mynumber2-questions";

/**
 * マイナンバー実務検定2級 模擬試験 第1回の固定ペーパー定義。
 *
 * 本試験仕様(全日本情報学習振興協会のページ https://www.joho-gakushu.or.jp/nns/ と
 * 出題内容のページ https://www.joho-gakushu.or.jp/nns/naiyou.php を 2026-11-14 に確認):
 * 2級は60問、10:00〜11:45(105分)、70%以上の得点で合格(問題の難易度により調整あり)。
 * 分野ごとの問題数は公表されていないので、本模試の「6分野×10問」は当サイトの想定。
 *
 * 構成: 4肢択一60問 / 42問(70%)以上で合格判定。全員が同じ問題を同じ順序で解く固定問題。
 * 各分野から等間隔に10問ずつ選び、正解の位置が 1〜4 で15問ずつになるようにずらした
 * (難易度は A:12 / B:33 / C:15)。
 */
export const MYNUMBER2_MOSHI_TIME_LIMIT_MIN = 105;
export const MYNUMBER2_MOSHI_PASS_COUNT = 42;

const MYNUMBER2_MOSHI_1_SLUGS: string[] = [
  // 番号法の総則と個人番号（10問）
  "mynumber2-001", // A 個人番号の定義
  "mynumber2-004", // A 番号法の目的
  "mynumber2-007", // B 個人番号の指定と通知
  "mynumber2-010", // B 利用範囲（行政機関等）
  "mynumber2-013", // B 再委託
  "mynumber2-016", // B 書面提出の重複回避
  "mynumber2-019", // C 提供の求めの制限（場面）
  "mynumber2-022", // B 利用目的の範囲
  "mynumber2-025", // A 個人番号の性質
  "mynumber2-028", // B 内閣総理大臣の支援
  // 個人番号カードと本人確認（10問）
  "mynumber2-031", // A 個人番号カードの記載事項
  "mynumber2-033", // A 紛失時の届出
  "mynumber2-035", // B 転出届とカードの提出
  "mynumber2-037", // B 個人番号カードの利用
  "mynumber2-040", // B 番号確認書類と身元確認書類
  "mynumber2-042", // B 通知カード
  "mynumber2-044", // C 交付時の本人確認
  "mynumber2-047", // A 本人確認の場面
  "mynumber2-049", // C カード代替電磁的記録の送信と確認
  "mynumber2-051", // A 個人番号カードの性格
  // 特定個人情報の提供と収集・保管（10問）
  "mynumber2-055", // B 個人番号関係事務実施者からの提供
  "mynumber2-057", // B 転職時の提供
  "mynumber2-060", // B 情報提供の記録
  "mynumber2-063", // A 収集・保管の制限
  "mynumber2-066", // B 提供を求める時期
  "mynumber2-069", // C 条例による地方公共団体内の提供
  "mynumber2-071", // C 振替機関等による提供
  "mynumber2-074", // B グループ会社間の提供
  "mynumber2-077", // C マスキングによる保管
  "mynumber2-080", // B 特定個人情報ファイルの作成（場面）
  // 保護評価・個人情報保護法の特例・監督（10問）
  "mynumber2-083", // B 特定個人情報保護評価の実施時期
  "mynumber2-085", // C 委員会の承認の要件
  "mynumber2-088", // C 第三者提供の停止
  "mynumber2-090", // B 委員の任期
  "mynumber2-093", // C 勧告と命令
  "mynumber2-095", // B 漏えい等の報告
  "mynumber2-098", // B サイバーセキュリティとの連携
  "mynumber2-100", // B 要配慮個人情報の取得
  "mynumber2-103", // B 保護評価の対象
  "mynumber2-105", // C 命令の要件
  // 法人番号と罰則（10問）
  "mynumber2-107", // A 法人番号の指定
  "mynumber2-109", // B 法人番号の公表
  "mynumber2-111", // B 特定法人情報の提供の求め
  "mynumber2-113", // C 特定法人情報の正確性
  "mynumber2-115", // B 個人番号の不正な提供・盗用
  "mynumber2-117", // C 不正アクセスによる取得
  "mynumber2-119", // B 情報提供ネットワークシステムの秘密
  "mynumber2-121", // C 両罰規定
  "mynumber2-123", // B 罰則の主体
  "mynumber2-125", // C 併科の有無
  // 事業者編ガイドライン（10問）
  "mynumber2-127", // A 利用目的の特定
  "mynumber2-129", // B 利用目的の変更
  "mynumber2-131", // C 範囲外のプリントアウト
  "mynumber2-134", // A 委託先の監督の内容
  "mynumber2-136", // B 委託先の選定
  "mynumber2-139", // A 安全管理措置の対象
  "mynumber2-141", // B 中小規模事業者
  "mynumber2-143", // B 廃棄の時期
  "mynumber2-146", // B バックアップ
  "mynumber2-148", // B 保管の継続
];

/**
 * 固定ペーパーの60問を MYNUMBER2_MOSHI_1_SLUGS の順序どおりに返す。
 * 問題ファイルが見つからないものは黙って落とすのではなくビルドを落とす
 * (問題番号の付け替えなどで模試が静かに短くなる事故を防ぐため)。
 */
export async function getMynumber2Moshi1(): Promise<Mynumber2QuestionData[]> {
  const all = await getAllMynumber2Questions();
  const bySlug = new Map(all.map((q) => [q.slug, q]));
  return MYNUMBER2_MOSHI_1_SLUGS.map((slug) => {
    const q = bySlug.get(slug);
    if (!q) {
      throw new Error(`[mynumber2-moshi] 模試の問題が見つかりません: ${slug}`);
    }
    return q;
  });
}
