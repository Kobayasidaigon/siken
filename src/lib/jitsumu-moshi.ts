import { getAllJitsumuQuestions, type JitsumuQuestionData } from "./jitsumu-questions";

/**
 * 模擬試験 第1回の固定ペーパー定義。
 * 本試験仕様: 2級相当: 80問・90分・4肢択一・合格基準70%(56問)。
 * 全員が同じ問題を同じ順序で解く固定問題(選定・並びは決定的)。分野構成は
 * 出題範囲の配分に合わせ、各分野の論点を等間隔サンプリングで選定している。
 * 設計思想の詳細は chizai-moshi.ts を参照。
 */
export const JITSUMU_MOSHI_TIME_LIMIT_MIN = 90;
export const JITSUMU_MOSHI_PASS_COUNT = 56;

export const JITSUMU_MOSHI_1_SLUGS: string[] = [
  "jitsumu-001", // 個人情報保護法の基礎 A 個人情報保護法の目的
  "jitsumu-041", // 取得・利用 A 利用目的の特定
  "jitsumu-081", // 安全管理・第三者提供 A 安全管理措置の4類型
  "jitsumu-121", // 本人の権利・漏えい対応 A 開示請求の対象
  "jitsumu-161", // 実務・関連法 A 苦情処理（40条）の基本
  "jitsumu-004", // 個人情報保護法の基礎 A 法の保護対象
  "jitsumu-044", // 取得・利用 A 利用目的の変更
  "jitsumu-084", // 安全管理・第三者提供 A 物理的安全管理措置
  "jitsumu-124", // 本人の権利・漏えい対応 B 開示請求の不開示事由
  "jitsumu-164", // 実務・関連法 B 苦情処理体制の整備
  "jitsumu-006", // 個人情報保護法の基礎 B 令和4年改正
  "jitsumu-046", // 取得・利用 B 利用目的の特定の具体例
  "jitsumu-086", // 安全管理・第三者提供 B 中小規模事業者の特例
  "jitsumu-126", // 本人の権利・漏えい対応 B 代理人による開示請求
  "jitsumu-166", // 実務・関連法 B 委員会への報告徴収
  "jitsumu-009", // 個人情報保護法の基礎 C 域外適用
  "jitsumu-049", // 取得・利用 C プロファイリングと利用目的
  "jitsumu-089", // 安全管理・第三者提供 B 廃棄時の措置
  "jitsumu-129", // 本人の権利・漏えい対応 C 開示請求への対応期間
  "jitsumu-169", // 実務・関連法 C 委員会への漏えい等報告
  "jitsumu-011", // 個人情報保護法の基礎 A 個人データの定義
  "jitsumu-051", // 取得・利用 A 適正取得の原則
  "jitsumu-091", // 安全管理・第三者提供 A 従業者の監督義務(24条)
  "jitsumu-131", // 本人の権利・漏えい対応 A 訂正請求の要件
  "jitsumu-171", // 実務・関連法 A 認定個人情報保護団体の概要
  "jitsumu-014", // 個人情報保護法の基礎 B 階層構造の理解
  "jitsumu-054", // 取得・利用 B 要配慮個人情報の取得の例外
  "jitsumu-094", // 安全管理・第三者提供 B 委託契約の締結事項
  "jitsumu-134", // 本人の権利・漏えい対応 B 訂正請求への対応
  "jitsumu-174", // 実務・関連法 B 認定団体の認定要件
  "jitsumu-017", // 個人情報保護法の基礎 B 短期保存データ
  "jitsumu-057", // 取得・利用 B 公開情報の取扱い
  "jitsumu-097", // 安全管理・第三者提供 C 委託と第三者提供の区別
  "jitsumu-137", // 本人の権利・漏えい対応 B 第三者提供停止請求
  "jitsumu-177", // 実務・関連法 B 対象事業者と認定団体
  "jitsumu-019", // 個人情報保護法の基礎 C 匿名加工情報
  "jitsumu-059", // 取得・利用 C 名刺の取得と利用
  "jitsumu-099", // 安全管理・第三者提供 C 従業者教育の実施
  "jitsumu-139", // 本人の権利・漏えい対応 C 利用停止と通知義務
  "jitsumu-179", // 実務・関連法 C 認定団体と委員会のガイドライン
  "jitsumu-022", // 個人情報保護法の基礎 B 要配慮個人情報の取得
  "jitsumu-062", // 取得・利用 A 目的外利用と本人同意
  "jitsumu-102", // 安全管理・第三者提供 A 同意不要となる例外
  "jitsumu-142", // 本人の権利・漏えい対応 A 速報の期限
  "jitsumu-182", // 実務・関連法 A GDPRの基本
  "jitsumu-024", // 個人情報保護法の基礎 B 個人識別符号の具体例
  "jitsumu-064", // 取得・利用 A 人の生命等の保護
  "jitsumu-104", // 安全管理・第三者提供 B オプトアウトの届出
  "jitsumu-144", // 本人の権利・漏えい対応 A 本人通知の義務
  "jitsumu-184", // 実務・関連法 A 特定個人情報の安全管理措置
  "jitsumu-027", // 個人情報保護法の基礎 C 要配慮個人情報と他法令との関係
  "jitsumu-067", // 取得・利用 B 目的外利用の具体例
  "jitsumu-107", // 安全管理・第三者提供 C 事業承継時の取扱い
  "jitsumu-147", // 本人の権利・漏えい対応 B 1000人超の漏えい
  "jitsumu-187", // 実務・関連法 B 電気通信事業法のCookie規制
  "jitsumu-030", // 個人情報保護法の基礎 C 要配慮個人情報の判断
  "jitsumu-070", // 取得・利用 C 目的外利用の例外整理
  "jitsumu-110", // 安全管理・第三者提供 C 不正取得・名簿業者
  "jitsumu-150", // 本人の権利・漏えい対応 C 漏えい報告と社内体制
  "jitsumu-190", // 実務・関連法 C GDPRの制裁金
  "jitsumu-032", // 個人情報保護法の基礎 A 利用目的の通知・公表
  "jitsumu-072", // 取得・利用 A 不適正利用の具体例
  "jitsumu-112", // 安全管理・第三者提供 B 十分性認定
  "jitsumu-152", // 本人の権利・漏えい対応 A 匿名加工情報の定義
  "jitsumu-192", // 実務・関連法 A USBメモリ紛失事案の対応
  "jitsumu-035", // 個人情報保護法の基礎 B 従業者の監督と委託先監督
  "jitsumu-075", // 取得・利用 B 不適正利用と他規制の関係
  "jitsumu-115", // 安全管理・第三者提供 C 外国の判定基準
  "jitsumu-155", // 本人の権利・漏えい対応 B 匿名加工情報の作成時公表
  "jitsumu-195", // 実務・関連法 B 開示請求への対応
  "jitsumu-037", // 個人情報保護法の基礎 B 外国にある第三者への提供
  "jitsumu-077", // 取得・利用 B 採用選考時の不適正利用
  "jitsumu-117", // 安全管理・第三者提供 A 記録の保存期間
  "jitsumu-157", // 本人の権利・漏えい対応 B 仮名加工情報の利用目的変更
  "jitsumu-197", // 実務・関連法 B SNSでの不適切投稿事案
  "jitsumu-040", // 個人情報保護法の基礎 C 事業者義務違反時の措置
  "jitsumu-080", // 取得・利用 C 不適正利用と監督権限
  "jitsumu-120", // 安全管理・第三者提供 C 第三者提供記録の開示請求
  "jitsumu-160", // 本人の権利・漏えい対応 C 仮名加工と匿名加工の違い
  "jitsumu-200", // 実務・関連法 C 越境データ移転トラブル
];

export async function getJitsumuMoshi1Questions(): Promise<JitsumuQuestionData[]> {
  const all = await getAllJitsumuQuestions();
  const bySlug = new Map(all.map((q) => [q.slug, q]));
  const found = JITSUMU_MOSHI_1_SLUGS.flatMap((s) => {
    const q = bySlug.get(s);
    return q ? [q] : [];
  });
  if (found.length !== JITSUMU_MOSHI_1_SLUGS.length) {
    const missing = JITSUMU_MOSHI_1_SLUGS.filter((s) => !bySlug.has(s));
    throw new Error(`jitsumu-moshi: 模試の問題が見つかりません: ${missing.join(", ")}`);
  }
  return found;
}
