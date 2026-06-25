/**
 * 低摩擦オファー（資料請求／無料体験／無料受講相談）の共通CTA。
 *
 * EXAM_AFFILIATE[exam].freeHref が設定されているときだけ「無料」CTAを表示する。
 * 未設定なら null を返す（＝安全な no-op）。これにより、A8で無料素材リンクを取得して
 * affiliate-links.ts に貼るだけで、採点直後・学習履歴・分野ページ・講座広告の各所に
 * 一斉に無料CTAが点灯する。
 *
 * 有料講座の購入はCVRの天井が低いため、各高intent面で有料CTAの「上」に無料CTAを
 * 併置するのが狙い（監査の最優先課題＝offer-mix）。クリックはGA4で
 * affiliate_click(course, placement="*_free") として計測される。
 */

import AffiliateLink from "@/components/AffiliateLink";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";
import type { ExamSlug } from "@/lib/study-progress";

interface Props {
  exam: ExamSlug;
  placement: string;       // 例 "question_result", "course_ad", "field", "study"
  className?: string;
  /** true のとき先頭に控えめな「無料」バッジを付ける（テキストCTA文脈向け） */
  withBadge?: boolean;
}

export default function FreeLeadCTA({ exam, placement, className, withBadge }: Props) {
  const target = EXAM_AFFILIATE[exam];
  if (!target?.freeHref) return null;

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1">
      {withBadge && (
        <span className="tracking-wider border border-[color:var(--c-border)] px-1.5 py-0.5 rounded text-[10px] text-[color:var(--c-text-sub)]">
          無料
        </span>
      )}
      <AffiliateLink
        href={target.freeHref}
        course={target.course}
        placement={`${placement}_free`}
        className={className ?? "text-blue-700 hover:underline font-medium"}
      >
        {target.freeLabel ?? "まずは無料で資料請求する"} →
      </AffiliateLink>
    </span>
  );
}
