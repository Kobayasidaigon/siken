/**
 * 情報・サイバーセキュリティ管理士認定試験の講座広告。
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

export default function IsecCourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "独学に不安があれば";
  const finalBody =
    body ??
    "情報・サイバーセキュリティ管理士認定試験は、試験を実施している全日本情報学習振興協会自身がSMART合格講座を出しています。4課題のうち「コンピュータの一般知識」は非IT職には範囲が広く、独学だと優先順位をつけにくいところです。";

  return (
    <aside className="theme-pii my-10 p-5 rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)]">
      <p className="mb-3">
        <span className="text-[10px] tracking-wider text-[color:var(--c-text-sub)] border border-[color:var(--c-border)] px-1.5 py-0.5 rounded">
          広告
        </span>
      </p>
      <p className="text-xs text-[color:var(--c-text-sub)] mb-3">{finalHeadline}</p>
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-4">{finalBody}</p>
      {/* 他資格の CourseAd は「無料登録(主) → 有料講座(副)」の順だが、この資格は逆にしてある。
          成果になるのは講座購入と受験申込で、無料登録はそこへの入口にすぎない
          (ユーザー判断 2026-09-08)。無料登録は摩擦の低い受け皿として残す。 */}
      <div className="flex flex-col items-start gap-3">
        <AffiliateLink href={EXAM_AFFILIATE["isec"].href} course="isec" placement="course_ad">
          {EXAM_AFFILIATE["isec"].label} →
        </AffiliateLink>
        <FreeLeadCTA exam="isec" placement="course_ad" withBadge />
      </div>
      <img
        width={1}
        height={1}
        src={`https://www11.a8.net/0.gif?${(EXAM_AFFILIATE["isec"].href.match(/a8mat=[^&]+/) || [""])[0]}`}
        alt=""
        style={{ position: "absolute", border: 0 }}
      />
    </aside>
  );
}
