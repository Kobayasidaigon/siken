/**
 * 書籍オファー(公式テキスト・問題集)の共通CTA。2026-09-05 追加。
 *
 * EXAM_AFFILIATE[exam].bookHref が設定されているときだけ「広告」バッジ付きの1行を出す。
 * 未設定なら null(安全な no-op)。FreeLeadCTA と同じ設計で、もしもアフィリエイト
 * (Amazon / 楽天ブックス)の「かんたんリンク」を affiliate-links.ts に貼るだけで、
 * 未提携3資格(福祉住環境2級・ビジマネ・eco検定)の CourseAd に書籍導線が点灯する。
 *
 * 3資格はいずれも「公式テキストからの出題」が明示された検定で、講座の広告主が市場に
 * ほぼ無い(監査レポート §4)。書籍は単価が低いが、提携前でも収益ゼロを脱せる。
 * クリックは GA4 で affiliate_click(course, placement="*_book") として計測される。
 */

import AffiliateLink from "@/components/AffiliateLink";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";
import type { ExamSlug } from "@/lib/study-progress";

interface Props {
  exam: ExamSlug;
  placement: string;
  className?: string;
}

export default function BookLeadCTA({ exam, placement, className }: Props) {
  const target = EXAM_AFFILIATE[exam];
  if (!target?.bookHref) return null;

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className="tracking-wider border border-[color:var(--c-border)] px-1.5 py-0.5 rounded text-[10px] text-[color:var(--c-text-sub)]">
        広告
      </span>
      <AffiliateLink
        href={target.bookHref}
        course={target.course}
        placement={`${placement}_book`}
        className={className ?? "text-blue-700 hover:underline font-medium"}
      >
        {target.bookLabel ?? "公式テキストの最新版を見る"} →
      </AffiliateLink>
    </span>
  );
}
