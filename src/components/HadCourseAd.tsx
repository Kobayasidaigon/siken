/**
 * ハラスメントアドバイザー認定試験の講座広告。
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

export default function HadCourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "独学に不安があれば";
  const finalBody =
    body ??
    "ハラスメントアドバイザー認定試験は、全日本情報学習振興協会のSMART合格講座で対策講座が用意されています。課題Ⅱの法的責任や課題Ⅲの措置義務は法令と指針の言い回しが細かく、2026年10月にはカスタマーハラスメント対策も義務になったので、独学だと最新の範囲を押さえ切れているか不安が残りやすいところです。";

  return (
    <aside className="theme-pii my-10 p-5 rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)]">
      <p className="mb-3">
        <span className="text-[10px] tracking-wider text-[color:var(--c-text-sub)] border border-[color:var(--c-border)] px-1.5 py-0.5 rounded">
          広告
        </span>
      </p>
      <p className="text-xs text-[color:var(--c-text-sub)] mb-3">{finalHeadline}</p>
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-4">{finalBody}</p>
      {/* isf と同じ並び(講座 → 無料登録)。リンクは affiliate-links.ts の had / ccm。
          講座・申込の A8 リンクはユーザーが発行するまで、発行済みの SMART 無料登録リンクを出す。 */}
      <div className="flex flex-col items-start gap-3">
        <AffiliateLink href={EXAM_AFFILIATE["had"].href} course="had" placement="course_ad">
          {EXAM_AFFILIATE["had"].label} →
        </AffiliateLink>
        <FreeLeadCTA exam="had" placement="course_ad" withBadge />
      </div>
      <img
        width={1}
        height={1}
        src={`https://www11.a8.net/0.gif?${(EXAM_AFFILIATE["had"].href.match(/a8mat=[^&]+/) || [""])[0]}`}
        alt=""
        style={{ position: "absolute", border: 0 }}
      />
    </aside>
  );
}
