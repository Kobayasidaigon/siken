import { getAllJitsumuQuestions } from "./jitsumu-questions";
import { getAllPiiQuestions } from "./pii-questions";
import type { ExamSlug } from "./study-progress";

/**
 * 個人情報保護実務検定 1級形式の模擬試験の固定ペーパー定義。
 *
 * 本試験仕様(全日本情報学習振興協会 https://www.joho-gakushu.or.jp/pipl/ と
 * 出題項目 https://www.joho-gakushu.or.jp/pipl/naiyou.php を 2026-11-14 に確認):
 * 1級は100問・120分(10:15〜12:15)、70%以上の得点で合格(難易度により調整あり)。
 * 2級との違いは、課題Ⅱ第4編「情報システムセキュリティ」(細目: 技術的セキュリティ対策に関連する知識、
 * 技術的安全管理措置の実施項目)が1級だけの範囲に入ること。課題や編ごとの問題数は公表されていない。
 *
 * 構成: 4肢択一100問 / 70問(70%)以上で合格判定。全員が同じ問題を同じ順序で解く固定問題。
 * - 2級と共通の範囲: 個人情報保護実務検定の練習問題(5分野)から16問ずつ、80問。
 *   2級形式の模擬試験 第1回と30問が重なる(正解の位置をそろえるため)。
 * - 情報システムセキュリティ: 個人情報保護士の練習問題の技術的対策(pii-261〜310。アクセス制御・認証、
 *   暗号、ネットワーク、クラウド・テレワーク、端末と監視)から各4問、20問。
 *   実務検定の練習問題にはこの編の問題が無いため、範囲が同じ個人情報保護士の問題を使う。
 * 80問:20問の配分は当サイトの想定。正解の位置は 1〜4 で25問ずつ(難易度は A:30 / B:44 / C:26)。
 */
export const JITSUMU_MOSHI_1KYU_TIME_LIMIT_MIN = 120;
export const JITSUMU_MOSHI_1KYU_PASS_COUNT = 70;

const JITSUMU_MOSHI_1KYU_SLUGS: string[] = [
  // 個人情報保護法の基礎（16問）
  "jitsumu-003", // A 個人情報の該当性
  "jitsumu-008", // B 個人情報保護委員会
  "jitsumu-011", // A 個人データの定義
  "jitsumu-019", // C 匿名加工情報
  "jitsumu-022", // B 要配慮個人情報の取得
  "jitsumu-026", // B 身体的特徴の個人識別符号
  "jitsumu-027", // C 要配慮個人情報と他法令との関係
  "jitsumu-029", // C 公的番号の個人識別符号
  "jitsumu-030", // C 要配慮個人情報の判断
  "jitsumu-031", // A 利用目的の特定
  "jitsumu-033", // A 安全管理措置
  "jitsumu-036", // B 本人の権利
  "jitsumu-037", // B 外国にある第三者への提供
  "jitsumu-038", // C 苦情処理と漏えい時対応
  "jitsumu-039", // C 不適正利用の禁止
  "jitsumu-040", // C 事業者義務違反時の措置
  // 取得・利用（16問）
  "jitsumu-043", // A 利用目的の特定の程度
  "jitsumu-045", // B 利用目的の通知・公表の例外
  "jitsumu-046", // B 利用目的の特定の具体例
  "jitsumu-050", // C 利用目的の通知方法
  "jitsumu-053", // A 不正の手段による取得の例
  "jitsumu-054", // B 要配慮個人情報の取得の例外
  "jitsumu-055", // B 取得時の通知の不要な場合
  "jitsumu-057", // B 公開情報の取扱い
  "jitsumu-060", // C 書面による直接取得時の明示
  "jitsumu-062", // A 目的外利用と本人同意
  "jitsumu-063", // A 法令に基づく場合の例外
  "jitsumu-065", // B 公衆衛生のための例外
  "jitsumu-066", // B 国の機関等への協力
  "jitsumu-070", // C 目的外利用の例外整理
  "jitsumu-075", // B 不適正利用と他規制の関係
  "jitsumu-077", // B 採用選考時の不適正利用
  // 安全管理・第三者提供（16問）
  "jitsumu-081", // A 安全管理措置の4類型
  "jitsumu-083", // B 人的安全管理措置
  "jitsumu-084", // A 物理的安全管理措置
  "jitsumu-087", // C 区域管理の考え方
  "jitsumu-088", // C USBメモリの取扱い
  "jitsumu-092", // B 従業者の範囲
  "jitsumu-098", // C 委託先での漏えい時の責任
  "jitsumu-100", // C 退職者への対応
  "jitsumu-103", // A 第三者非該当の3類型
  "jitsumu-105", // B オプトアウト除外対象
  "jitsumu-106", // B 共同利用の要件
  "jitsumu-107", // C 事業承継時の取扱い
  "jitsumu-108", // B 法令に基づく提供
  "jitsumu-112", // B 十分性認定
  "jitsumu-113", // B 基準適合体制
  "jitsumu-114", // B 外国提供時の情報提供義務
  // 本人の権利・漏えい対応（16問）
  "jitsumu-124", // B 開示請求の不開示事由
  "jitsumu-125", // B 開示請求の手数料
  "jitsumu-126", // B 代理人による開示請求
  "jitsumu-127", // B 開示請求の手続
  "jitsumu-128", // C 開示請求と裁判上の請求
  "jitsumu-131", // A 訂正請求の要件
  "jitsumu-132", // A 利用停止等請求の要件
  "jitsumu-133", // A 利用停止請求の対象拡大
  "jitsumu-134", // B 訂正請求への対応
  "jitsumu-141", // A 漏えい等報告の対象事案
  "jitsumu-142", // A 速報の期限
  "jitsumu-148", // C 本人通知の代替措置
  "jitsumu-151", // A 仮名加工情報の定義
  "jitsumu-154", // A 匿名加工情報の第三者提供
  "jitsumu-157", // B 仮名加工情報の利用目的変更
  "jitsumu-160", // C 仮名加工と匿名加工の違い
  // 実務・関連法（16問）
  "jitsumu-163", // A 委員会の権限（報告徴収・立入検査）
  "jitsumu-164", // B 苦情処理体制の整備
  "jitsumu-167", // C 委員会と他省庁の関係
  "jitsumu-170", // A 個人情報保護委員会の独立性
  "jitsumu-173", // A 個人情報保護指針
  "jitsumu-176", // B 認定団体への監督
  "jitsumu-177", // B 対象事業者と認定団体
  "jitsumu-179", // C 認定団体と委員会のガイドライン
  "jitsumu-181", // A マイナンバー法の概要
  "jitsumu-183", // B マイナンバーの利用範囲
  "jitsumu-184", // A 特定個人情報の安全管理措置
  "jitsumu-186", // B GDPRのデータ主体の権利
  "jitsumu-188", // C 個人情報保護法の罰則
  "jitsumu-190", // C GDPRの制裁金
  "jitsumu-194", // B 不正アクセスによる漏えい事案
  "jitsumu-196", // B 利用停止請求への対応
  // 情報システムセキュリティ（個人情報保護士の問題）（20問）
  "pii-261", // A アクセス制御
  "pii-264", // B 認証技術
  "pii-266", // B アクセス制御の実装
  "pii-268", // C 生体認証技術
  "pii-272", // A 公開鍵暗号方式
  "pii-277", // C PKI（公開鍵基盤）
  "pii-278", // A ハッシュ関数
  "pii-280", // C TLS 1.3
  "pii-281", // A ファイアウォール
  "pii-285", // B WAF
  "pii-287", // A プロキシサーバ
  "pii-290", // B 多層防御
  "pii-292", // B IoTセキュリティ
  "pii-293", // B テレワークセキュリティ
  "pii-295", // B クラウドサービスの責任分界
  "pii-299", // B サプライチェーンセキュリティ
  "pii-303", // A ログ監視と監査証跡
  "pii-305", // A メールセキュリティと迷惑メール対策
  "pii-306", // B 脆弱性スキャン実施
  "pii-310", // C セキュリティインシデント重大度分類
];

export interface Jitsumu1kyuMoshiQuestion {
  slug: string;
  questionText: string;
  choices: string[];
  correctAnswer: number;
  field: string;
  /** 問題ページのパス(/jitsumu/q/ か /pii/q/) */
  path: string;
  /** 学習記録(/study)に残す資格 */
  progressExam: ExamSlug;
}

/** 固定ペーパーの100問を順序どおりに返す。見つからない問題があればビルドを落とす */
export async function getJitsumuMoshi1kyuQuestions(): Promise<Jitsumu1kyuMoshiQuestion[]> {
  const [jitsumu, pii] = await Promise.all([getAllJitsumuQuestions(), getAllPiiQuestions()]);
  const bySlug = new Map<string, Jitsumu1kyuMoshiQuestion>();
  for (const q of jitsumu) {
    bySlug.set(q.slug, { slug: q.slug, questionText: q.questionText, choices: q.choices, correctAnswer: q.correctAnswer, field: q.field, path: `/jitsumu/q/${q.slug}/`, progressExam: "jitsumu" });
  }
  for (const q of pii) {
    bySlug.set(q.slug, { slug: q.slug, questionText: q.questionText, choices: q.choices, correctAnswer: q.correctAnswer, field: "情報システムセキュリティ", path: `/pii/q/${q.slug}/`, progressExam: "pii" });
  }
  return JITSUMU_MOSHI_1KYU_SLUGS.map((slug) => {
    const q = bySlug.get(slug);
    if (!q) throw new Error(`[jitsumu-moshi-1kyu] 模試の問題が見つかりません: ${slug}`);
    return q;
  });
}
