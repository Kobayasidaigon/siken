/**
 * 福祉住環境コーディネーター2級 対策講座（ユーキャン）の広告
 * 配置: fukushi2 の問題ページ・分野ページ・資格トップ・関連コラム末尾
 *
 * TODO(A8提携後): AffiliateLink の href を A8 の a8mat 付きリンクへ差し替え、
 * インプレッション計測用の 1x1 gif も追加する（BijihouCourseAd.tsx 参照）。
 * 差し替え時は src/lib/affiliate-links.ts の fukushi2 エントリも同時に更新すること。
 */

import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";

interface Props {
  headline?: string;
  body?: string;
}

export default function Fukushi2CourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "独学に不安があれば";
  const finalBody = body ?? "福祉住環境コーディネーター2級の対策講座として、ユーキャンの通信講座があります。公式テキストは範囲が広いため、体系的に整理しながら学びたい方は検討してみてください。";

  return (
    <aside className="theme-fukushi my-10 p-5 rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)]">
      <p className="mb-3">
        <span className="text-[10px] tracking-wider text-[color:var(--c-text-sub)] border border-[color:var(--c-border)] px-1.5 py-0.5 rounded">
          広告
        </span>
      </p>
      <p className="text-xs text-[color:var(--c-text-sub)] mb-3">{finalHeadline}</p>
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-4">
        {finalBody}
      </p>
      <div className="flex flex-col items-start gap-3">
        <FreeLeadCTA exam="fukushi2" placement="course_ad" withBadge />
        <AffiliateLink
          href="https://www.u-can.co.jp/%E7%A6%8F%E7%A5%89%E4%BD%8F%E7%92%B0%E5%A2%83%E3%82%B3%E3%83%BC%E3%83%87%E3%82%A3%E3%83%8D%E3%83%BC%E3%82%BF%E3%83%BC/"
          course="fukushi2"
          placement="course_ad"
        >
          ユーキャンの福祉住環境コーディネーター講座を見る →
        </AffiliateLink>
      </div>
    </aside>
  );
}
