/**
 * 模擬試験(components/MoshiExam.tsx)の合否判定。
 *
 * テストから読み込めるよう、画面から切り出している(tests/moshi-pass.test.mjs)。
 * 判定の順序:
 *   1. sections があれば、全セクションが基準(passCount)を満たすこと
 *   2. passPoints があれば、問別配点の合計点が passPoints 以上であること
 *      無ければ、正解数が総合の passCount 以上であること
 * セクション基準を満たしても総合基準は必ず確かめる。登録販売者のように
 * 「合計84点以上かつ各章3.5割以上」で、章の基準の合計(42問)が総合基準より低い試験があるため。
 */

export interface MoshiPassQuestion {
  correctAnswer: number; // 1始まり
  points?: number;
}

export interface MoshiPassSection {
  start: number; // 0始まりの開始index
  count: number;
  passCount: number;
}

export interface MoshiPassRule {
  passCount: number; // 総合の合格基準(問数)
  sections?: MoshiPassSection[];
  passPoints?: number;
  pointsPerQuestion?: number;
}

export function isMoshiPassed(
  questions: MoshiPassQuestion[],
  ans: (number | null)[],
  rule: MoshiPassRule,
): boolean {
  const { passCount, sections, passPoints, pointsPerQuestion } = rule;
  if (sections && sections.length > 0) {
    const sectionsOk = sections.every((sec) => {
      let c = 0;
      for (let i = sec.start; i < sec.start + sec.count; i++) {
        if (ans[i] === questions[i].correctAnswer) c++;
      }
      return c >= sec.passCount;
    });
    if (!sectionsOk) return false;
  }
  // 問別配点がある試験(東商IBT型)は合計点で判定
  if (passPoints != null) {
    const pts = questions.reduce(
      (s, q, i) => s + (ans[i] === q.correctAnswer ? (q.points ?? pointsPerQuestion ?? 1) : 0),
      0,
    );
    return pts >= passPoints;
  }
  const score = questions.reduce((s, q, i) => s + (ans[i] === q.correctAnswer ? 1 : 0), 0);
  return score >= passCount;
}
