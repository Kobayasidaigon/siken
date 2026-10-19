import { getAllXrayQuestions, type XrayQuestionData } from "./xray-questions";

/**
 * 模擬試験 第1回(無料)の固定ペーパー定義。
 * 本試験仕様: 五肢択一・240分・合計60点以上（100点満点）かつ各科目4問以上（満点の40%）。
 * 全員が同じ問題を同じ順序で解く固定問題。分野・選択肢数ごとの出題数は本試験の構成に合わせ、
 * 各グループの問題を番号順に等間隔で選んでいる(scratchpad の gen-siken が生成)。
 * 第2回(有料)は xray-moshi2.ts の別問題で、ここの問題とは重複しない。
 */
export const XRAY_MOSHI_TIME_LIMIT_MIN = 240;
export const XRAY_MOSHI_PASS_COUNT = 24;

export const XRAY_MOSHI_1_SLUGS: string[] = [
  "xray-003", // エックス線の管理 A 5択 写真作用・蛍光作用・電離作用
  "xray-007", // エックス線の管理 B 5択 実焦点と実効焦点の関係
  "xray-011", // エックス線の管理 C 5択 全強度と管電流・管電圧の比例関係
  "xray-015", // エックス線の管理 C 5択 オージェ効果
  "xray-019", // エックス線の管理 C 5択 コンプトン効果の特徴
  "xray-023", // エックス線の管理 B 5択 質量減弱係数と密度から半価層を求める
  "xray-027", // エックス線の管理 B 5択 狭いビームと再生係数の性質
  "xray-031", // エックス線の管理 B 5択 照射時間から逆算する境界距離
  "xray-035", // エックス線の管理 B 5択 アルミニウム板と鋼板からの散乱線
  "xray-039", // エックス線の管理 B 5択 ブラッグの条件による波長の計算
  "xray-043", // 関係法令 B 5択 5年間100ミリシーベルトの残り枠
  "xray-047", // 関係法令 B 5択 緊急作業時の線量限度
  "xray-051", // 関係法令 B 5択 男性の線量算定周期
  "xray-055", // 関係法令 B 5択 ろ過板の使用義務と例外
  "xray-059", // 関係法令 B 5択 放射線装置室の設置と例外
  "xray-063", // 関係法令 B 5択 事故の記録の保存期間と記録事項
  "xray-067", // 関係法令 B 5択 作業主任者の職務に含まれないもの
  "xray-071", // 関係法令 C 5択 免許の取消し・効力停止と欠格
  "xray-075", // 関係法令 B 5択 放射性物質の濃度の測定
  "xray-079", // 関係法令 B 5択 健康診断結果に基づく措置
  "xray-083", // エックス線の測定 B 5択 組織加重係数を用いた実効線量の計算
  "xray-087", // エックス線の測定 B 5択 周辺線量当量と個人線量当量
  "xray-091", // エックス線の測定 B 5択 比例計数管のガス増幅とパルス波高
  "xray-095", // エックス線の測定 B 5択 不感時間による真の計数率の計算
  "xray-099", // エックス線の測定 B 5択 半導体検出器の原理と特性
  "xray-103", // エックス線の測定 B 5択 蛍光ガラス線量計の再読取り
  "xray-107", // エックス線の測定 B 5択 電離箱式・GM式・シンチ式の特徴比較
  "xray-111", // エックス線の測定 A 5択 測定時のレンジ選択と取扱い
  "xray-115", // エックス線の測定 B 5択 計数の統計に関する記述
  "xray-119", // エックス線の測定 C 5択 3か所測定時のHmの扱い
  "xray-123", // 生体に与える影響 C 5択 増殖死と間期死
  "xray-127", // 生体に与える影響 A 5択 高感受性の組織・器官の組合せ
  "xray-131", // 生体に与える影響 B 5択 DNA損傷数の見積もり
  "xray-135", // 生体に与える影響 B 5択 潜伏期の長さ
  "xray-139", // 生体に与える影響 C 5択 線量限度の考え方としきい線量
  "xray-143", // 生体に与える影響 A 5択 全身被ばくによる死亡の型と期間
  "xray-147", // 生体に与える影響 B 5択 血球減少の時期の違い
  "xray-151", // 生体に与える影響 B 5択 酸素増感比の計算
  "xray-155", // 生体に与える影響 B 5択 胎児の影響が現れる線量の目安
  "xray-159", // 生体に与える影響 A 5択 精巣の一時的不妊と永久不妊
];

/** 科目ごとの合格基準(MoshiExam の sections と同じ形)。start は 0 始まり。 */
export const XRAY_MOSHI_SECTIONS = [
  {
    "label": "エックス線の管理",
    "start": 0,
    "count": 10,
    "passCount": 4
  },
  {
    "label": "関係法令",
    "start": 10,
    "count": 10,
    "passCount": 4
  },
  {
    "label": "エックス線の測定",
    "start": 20,
    "count": 10,
    "passCount": 4
  },
  {
    "label": "生体に与える影響",
    "start": 30,
    "count": 10,
    "passCount": 4
  }
];

export const XRAY_MOSHI_PASS_POINTS = 60;

export async function getXrayMoshi1Questions(): Promise<XrayQuestionData[]> {
  const all = await getAllXrayQuestions();
  const bySlug = new Map(all.map((q) => [q.slug, q]));
  const found = XRAY_MOSHI_1_SLUGS.flatMap((s) => {
    const q = bySlug.get(s);
    return q ? [q] : [];
  });
  if (found.length !== XRAY_MOSHI_1_SLUGS.length) {
    const missing = XRAY_MOSHI_1_SLUGS.filter((s) => !bySlug.has(s));
    throw new Error(`xray-moshi: 模試の問題が見つかりません: ${missing.join(", ")}`);
  }
  return found;
}
