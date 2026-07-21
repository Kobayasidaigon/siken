import { getAllBijihouQuestions, type BijihouQuestionData } from "./bijihou-questions";

/**
 * 模擬試験 第1回の固定ペーパー定義。
 * 本試験仕様: 本試験(IBT/CBT)は90分・100点満点・70点合格で問題数は非公開。本模試は50問×2点=100点満点・70点(35問)合格として時間と採点基準に準拠。
 * 全員が同じ問題を同じ順序で解く固定問題(選定・並びは決定的)。分野構成は
 * 出題範囲の配分に合わせ、各分野の論点を等間隔サンプリングで選定している。
 * 設計思想の詳細は chizai-moshi.ts を参照。
 */
export const BIJIHOU_MOSHI_TIME_LIMIT_MIN = 90;
export const BIJIHOU_MOSHI_PASS_COUNT = 35;

export const BIJIHOU_MOSHI_1_SLUGS: string[] = [
  "bijihou-001", // 法体系・取引の基礎 A 法体系における公法と私法の区別
  "bijihou-081", // 民法（物権・担保・相続） A 所有権の取得
  "bijihou-121", // 商法・会社法 A 株式会社の特徴
  "bijihou-161", // 関連法規 A 消費者契約法の取消事由
  "bijihou-005", // 法体系・取引の基礎 B 民法と商法の関係
  "bijihou-041", // 民法（債権・契約） A 売買契約と手付の効力
  "bijihou-085", // 民法（物権・担保・相続） B 共有持分の処分
  "bijihou-125", // 商法・会社法 B 株式の譲渡
  "bijihou-165", // 関連法規 B 特定商取引法の連鎖販売取引
  "bijihou-010", // 法体系・取引の基礎 C 一般法と特別法の関係
  "bijihou-045", // 民法（債権・契約） A 売買契約の成立要件
  "bijihou-090", // 民法（物権・担保・相続） C 共有物分割
  "bijihou-130", // 商法・会社法 C 資本金と資本準備金
  "bijihou-170", // 関連法規 A 製造物責任法(PL法)
  "bijihou-014", // 法体系・取引の基礎 B 代理の意義と要件
  "bijihou-050", // 民法（債権・契約） C 手付の倍返しと現実の提供
  "bijihou-094", // 民法（物権・担保・相続） B 留置権
  "bijihou-134", // 商法・会社法 B 取締役の任期
  "bijihou-174", // 関連法規 B 不正競争防止法の営業秘密
  "bijihou-018", // 法体系・取引の基礎 A 法人の種類
  "bijihou-054", // 民法（債権・契約） B 請負契約の報酬請求権
  "bijihou-098", // 民法（物権・担保・相続） C 先取特権
  "bijihou-138", // 商法・会社法 B 取締役の善管注意義務
  "bijihou-178", // 関連法規 B 景品表示法のステルスマーケティング規制
  "bijihou-023", // 法体系・取引の基礎 A 意思表示の効力
  "bijihou-059", // 民法（債権・契約） C 賃借権の対抗要件
  "bijihou-103", // 民法（物権・担保・相続） B 共同不法行為
  "bijihou-143", // 商法・会社法 A 商号
  "bijihou-183", // 関連法規 A 商標権の機能と効力
  "bijihou-027", // 法体系・取引の基礎 B 虚偽表示
  "bijihou-063", // 民法（債権・契約） A 履行不能と填補賠償
  "bijihou-107", // 民法（物権・担保・相続） A 責任能力
  "bijihou-147", // 商法・会社法 C 商人間の売買特則
  "bijihou-187", // 関連法規 B 意匠権・実用新案権
  "bijihou-031", // 法体系・取引の基礎 B 条件付き法律行為
  "bijihou-067", // 民法（債権・契約） C 法定利率の変動制
  "bijihou-111", // 民法（物権・担保・相続） A 不当利得の成立
  "bijihou-151", // 商法・会社法 A 手形の種類
  "bijihou-191", // 関連法規 A 労働基準法の労働時間規制
  "bijihou-036", // 法体系・取引の基礎 B 取消しと無効の違い
  "bijihou-073", // 民法（債権・契約） A 債権譲渡の対抗要件
  "bijihou-116", // 民法（物権・担保・相続） A 相続分
  "bijihou-156", // 商法・会社法 A 小切手の機能
  "bijihou-196", // 関連法規 B 民事保全と民事執行
  "bijihou-040", // 法体系・取引の基礎 C 契約の解除
  "bijihou-080", // 民法（債権・契約） C 債務引受の類型
  "bijihou-076", // 民法（物権） B 根抵当権の特徴
  "bijihou-120", // 民法（物権・担保・相続） C 配偶者居住権
  "bijihou-160", // 商法・会社法 C 電子記録債権
  "bijihou-200", // 関連法規 C 民事訴訟と倒産処理手続
];

export async function getBijihouMoshi1Questions(): Promise<BijihouQuestionData[]> {
  const all = await getAllBijihouQuestions();
  const bySlug = new Map(all.map((q) => [q.slug, q]));
  const found = BIJIHOU_MOSHI_1_SLUGS.flatMap((s) => {
    const q = bySlug.get(s);
    return q ? [q] : [];
  });
  if (found.length !== BIJIHOU_MOSHI_1_SLUGS.length) {
    const missing = BIJIHOU_MOSHI_1_SLUGS.filter((s) => !bySlug.has(s));
    throw new Error(`bijihou-moshi: 模試の問題が見つかりません: ${missing.join(", ")}`);
  }
  return found;
}
