/**
 * 情報・サイバーセキュリティ初級認定試験の講座広告。
 * リンクと文言は src/lib/affiliate-links.ts の EXAM_AFFILIATE を唯一の出典とする
 * (直書きすると、雛形から複製したときに別資格の商品を宣伝してしまうため)。
 * 配置: 資格トップページ、分野ページ、問題ページ(答え合わせ後)。
 */

import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

interface Props {
  headline?: string;
  body?: string;
}

export default function IsfCourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "独学に不安があれば";
  const finalBody =
    body ??
    "情報・サイバーセキュリティ初級認定試験は、試験を実施している全日本情報学習振興協会自身がSMART合格講座を出しています。課題Ⅳ「コンピュータの一般知識」はITの経験が無いと取っつきにくく、独学だと時間がかかりやすいところです。";

  return (
    <aside className="theme-pii my-10 p-5 rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)]">
      <p className="mb-3">
        <span className="text-[10px] tracking-wider text-[color:var(--c-text-sub)] border border-[color:var(--c-border)] px-1.5 py-0.5 rounded">
          広告
        </span>
      </p>
      <p className="text-xs text-[color:var(--c-text-sub)] mb-3">{finalHeadline}</p>
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-4">{finalBody}</p>
      {/* isec と同じ並び(講座 → 無料登録)。リンクは affiliate-links.ts の isf / dxp
          (2026-10-09 に A8 で発行した講座リンクへ差し替え、無料登録は freeHref へ移した)。 */}
      <div className="flex flex-col items-start gap-3">
        <AffiliateLink href={EXAM_AFFILIATE["isf"].href} course="isf" placement="course_ad">
          {EXAM_AFFILIATE["isf"].label} →
        </AffiliateLink>
        <FreeLeadCTA exam="isf" placement="course_ad" withBadge />
      </div>
      <img
        width={1}
        height={1}
        src={`https://www11.a8.net/0.gif?${(EXAM_AFFILIATE["isf"].href.match(/a8mat=[^&]+/) || [""])[0]}`}
        alt=""
        style={{ position: "absolute", border: 0 }}
      />
    </aside>
  );
}
