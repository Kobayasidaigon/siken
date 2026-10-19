/**
 * エックス線作業主任者免許試験の講座広告。
 * リンクと文言は src/lib/affiliate-links.ts の EXAM_AFFILIATE を唯一の出典とする
 * (直書きすると、雛形から複製したときに別資格の商品を宣伝してしまうため)。
 * 配置: 資格トップページ、分野ページ、問題ページ(答え合わせ後)、コラム。
 */

import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

interface Props {
  headline?: string;
  body?: string;
}

export default function XrayCourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "独学に不安があれば";
  const finalBody =
    body ??
    "エックス線作業主任者の対策講座は、全日本情報学習振興協会のSMART合格講座にあります。管理の遮へい計算や測定の統計処理は、公式の出題範囲を押さえて順に学ぶほうが近道です。試験は協会ではなく安全衛生技術試験協会が実施しており、講座と受験申込は別の窓口になります。";

  return (
    <aside className="theme-pii my-10 p-5 rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)]">
      <p className="mb-3">
        <span className="text-[10px] tracking-wider text-[color:var(--c-text-sub)] border border-[color:var(--c-border)] px-1.5 py-0.5 rounded">
          広告
        </span>
      </p>
      <p className="text-xs text-[color:var(--c-text-sub)] mb-3">{finalHeadline}</p>
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-4">{finalBody}</p>
      <div className="flex flex-col items-start gap-3">
        <FreeLeadCTA exam="xray" placement="course_ad" withBadge />
        <AffiliateLink href={EXAM_AFFILIATE["xray"].href} course="xray" placement="course_ad">
          {EXAM_AFFILIATE["xray"].label} →
        </AffiliateLink>
      </div>
      <img
        width={1}
        height={1}
        src={`https://www11.a8.net/0.gif?${(EXAM_AFFILIATE["xray"].href.match(/a8mat=[^&]+/) || [""])[0]}`}
        alt=""
        style={{ position: "absolute", border: 0 }}
      />
    </aside>
  );
}
