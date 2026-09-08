import ExamVoices from "@/components/ExamVoices";
import PassReportCta from "@/components/PassReportCta";
import { EXAM_THEME } from "@/lib/exam-theme";
import { EXAM_LIST, type ExamSlug } from "@/lib/study-progress";

/**
 * 資格トップに置く「合格報告」の一式。2026-09-05 追加。
 *
 *   1. 掲載済みの報告(あれば最大3件)
 *   2. 受験直後の人への報告のお願い(試験日から45日以内。日程データが無い資格は常時)
 *
 * どちらも条件を満たさなければ何も描画しないので、資格トップには1行入れるだけでよい。
 * 講座広告(CourseAd)の直前に置く: 「実際に受かった人がいる」文脈の後に広告が来る順にする。
 */

/** 日程データを持たない資格(通年CBTなど)は、試験日で窓を作れないので常時お願いを出す */
const ALWAYS_ASK: ExamSlug[] = ["itpass", "isec", "kyoin"];

export default async function ExamVoicesSection({ exam }: { exam: ExamSlug }) {
  const theme = EXAM_THEME[exam];
  const examName = EXAM_LIST.find((e) => e.slug === exam)?.name ?? "";

  return (
    <>
      <ExamVoices exam={exam} examName={examName} accent={theme.accent} />
      <PassReportCta
        exam={exam}
        examName={examName}
        accent={theme.accent}
        always={ALWAYS_ASK.includes(exam)}
        className="mb-12"
      />
    </>
  );
}
