import { getFieldGuide } from "@/lib/field-guides";

/**
 * 分野ページの「要点」本文。src/content/field-guides/<資格>/<分野slug>.md があるときだけ出す(lib/field-guides.ts)。
 * 無い分野ページは何も出さない(そのページは noindex になる)。
 */
export default async function FieldGuide({ exam, slug }: { exam: string; slug: string }) {
  const guide = await getFieldGuide(exam, slug);
  if (!guide) return null;
  return (
    <section className="card p-5 sm:p-6 mb-8">
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: guide.html }} />
      {guide.updatedAt && (
        <p className="text-xs text-[color:var(--c-text-sub)] mt-4">最終更新：{guide.updatedAt}</p>
      )}
    </section>
  );
}
