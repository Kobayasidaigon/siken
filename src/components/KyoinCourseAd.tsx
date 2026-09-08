/**
 * 教員採用試験の講座広告。
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

export default function KyoinCourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "独学に不安があれば";
  const finalBody =
    body ??
    "教員採用試験の対策講座として、アガルートの教員採用試験講座があります。筆記だけでなく面接・模擬授業まで課される試験で、志望自治体の出題傾向に合わせて優先順位をつけるのは独学だと難しいところです。";

  return (
    <aside className="theme-fukushi my-10 p-5 rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)]">
      <p className="mb-3">
        <span className="text-[10px] tracking-wider text-[color:var(--c-text-sub)] border border-[color:var(--c-border)] px-1.5 py-0.5 rounded">
          広告
        </span>
      </p>
      <p className="text-xs text-[color:var(--c-text-sub)] mb-3">{finalHeadline}</p>
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-4">{finalBody}</p>
      {/* isec と同じく「有料講座(主) → 無料オファー(副)」の順。
          アガルートの成果条件に資料請求が含まれるかは未確認(監査レポート §4)なので、
          確実に成果になる講座購入を上に置く。 */}
      <div className="flex flex-col items-start gap-3">
        <AffiliateLink href={EXAM_AFFILIATE["kyoin"].href} course="kyoin" placement="course_ad">
          {EXAM_AFFILIATE["kyoin"].label} →
        </AffiliateLink>
        <FreeLeadCTA exam="kyoin" placement="course_ad" withBadge />
      </div>
      <img
        width={1}
        height={1}
        src={`https://www11.a8.net/0.gif?${(EXAM_AFFILIATE["kyoin"].href.match(/a8mat=[^&]+/) || [""])[0]}`}
        alt=""
        style={{ position: "absolute", border: 0 }}
      />
    </aside>
  );
}
