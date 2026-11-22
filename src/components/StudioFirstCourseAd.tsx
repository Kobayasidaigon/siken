/**
 * アフィリ提携が無い資格(lib/studio-cta.ts の STUDIO_FIRST_EXAMS)の講座枠。2026-11-22 追加。
 *
 * 枠の主役を Studio のカードにし、講座・公式サイトへの直リンク(計測なし・売上ゼロ)は
 * 提携が取れたときのために下に小さく残す。直リンクはアフィリではないので「広告」ラベルは付けない
 * (提携して a8mat 付きリンクに替えるときは、他の *CourseAd と同じ「広告」ラベルを戻すこと)。
 */
import AffiliateLink from "@/components/AffiliateLink";
import StudioPromoCard from "@/components/StudioPromoCard";
import type { ExamSlug } from "@/lib/study-progress";

export default function StudioFirstCourseAd({
  exam,
  placement = "course_ad",
  courseHref,
  courseLabel,
  courseLead,
  showCourseLink = true,
}: {
  exam: ExamSlug;
  placement?: string;
  courseHref: string;
  courseLabel: string;
  /** 直リンクの前に付ける一言 */
  courseLead: string;
  /** 講座の直リンクを出すか(ユーキャンの掲載ルールで出せない面がある。lib/ucan-policy.ts) */
  showCourseLink?: boolean;
}) {
  return (
    <div className="my-10">
      <StudioPromoCard exam={exam} placement={placement} />
      {showCourseLink && (
        <p className="-mt-7 text-xs text-[color:var(--c-text-sub)] leading-relaxed">
          {courseLead}
          <AffiliateLink href={courseHref} course={exam} placement={placement} className="ml-1 hover:underline">
            {courseLabel} →
          </AffiliateLink>
        </p>
      )}
    </div>
  );
}
