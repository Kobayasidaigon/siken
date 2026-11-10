import { getExamIntro } from "@/lib/exam-intros";

/**
 * 資格トップの「勉強の進め方」本文。src/content/exam-intros/<資格>.md があるときだけ出す(lib/exam-intros.ts)。
 * 無い資格のトップには何も出さない。
 */
export default async function ExamIntro({ exam }: { exam: string }) {
  const intro = await getExamIntro(exam);
  if (!intro) return null;
  return (
    <section className="mb-12">
      <div className="card p-5 sm:p-6">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: intro.html }} />
        {intro.updatedAt && (
          <p className="text-xs text-[color:var(--c-text-sub)] mt-4">最終更新：{intro.updatedAt}</p>
        )}
      </div>
    </section>
  );
}
