import { OFFICIAL_SITES } from "@/lib/official-sites";
import type { ExamSlug } from "@/lib/study-progress";

/**
 * 資格トップの「試験の概要」の下に出す、公式ページへのリンク。2026-11-10 追加。
 * 広告ではないので、アフィリエイトの計測も rel="sponsored" も付けない。URL の一覧は src/lib/official-sites.ts。
 */
export default function OfficialSiteLink({ exam }: { exam: ExamSlug }) {
  const s = OFFICIAL_SITES[exam];
  return (
    <p className="mt-3 text-xs text-[color:var(--c-text-sub)] leading-relaxed">
      <span className="font-bold text-[color:var(--c-ink)]">{s.heading}</span>
      {"　"}
      <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
        {s.label}
      </a>
      （{s.checkedAt}にリンクを確認）
      {s.note ? <span className="block mt-1">{s.note}</span> : null}
    </p>
  );
}
