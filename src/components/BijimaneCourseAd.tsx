/**
 * ビジネスマネジャー検定 対策講座（産業能率大学＝東商の公式通信講座）の広告
 * 配置: bijimane の問題ページ・分野ページ・資格トップ・関連コラム末尾
 *
 * TODO(A8提携後): AffiliateLink の href を A8 の a8mat 付きリンクへ差し替え、
 * インプレッション計測用の 1x1 gif も追加する（BijihouCourseAd.tsx 参照）。
 * 差し替え時は src/lib/affiliate-links.ts の bijimane エントリも同時に更新すること。
 * 提携可否の確認はユーザー宿題（night-batch/INBOX.md 項目1）。
 */

import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";

interface Props {
  headline?: string;
  body?: string;
}

export default function BijimaneCourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "独学に不安があれば";
  const finalBody =
    body ??
    "ビジネスマネジャー検定には、東京商工会議所の公式通信講座（産業能率大学）があります。公式テキストは400ページ超と範囲が広いため、体系的に整理しながら学びたい方は検討してみてください。";

  return (
    <aside className="theme-bijimane my-10 p-5 rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)]">
      <p className="mb-3">
        <span className="text-[10px] tracking-wider text-[color:var(--c-text-sub)] border border-[color:var(--c-border)] px-1.5 py-0.5 rounded">
          広告
        </span>
      </p>
      <p className="text-xs text-[color:var(--c-text-sub)] mb-3">{finalHeadline}</p>
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-4">{finalBody}</p>
      <div className="flex flex-col items-start gap-3">
        <FreeLeadCTA exam="bijimane" placement="course_ad" withBadge />
        <AffiliateLink
          href="https://www.hj.sanno.ac.jp/cp/distance-learning/course/B650-01.html"
          course="bijimane"
          placement="course_ad"
        >
          東商公式通信講座（産業能率大学）を見る →
        </AffiliateLink>
      </div>
    </aside>
  );
}
