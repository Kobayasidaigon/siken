/**
 * 福祉住環境コーディネーター3級 対策講座（ユーキャン）の広告。
 * ユーキャンの「福祉住環境コーディネーター講座」は「２・３級講座」（2026-11-12 に講座のページで確認）なので、
 * 2級と同じ講座を案内する。リンクは src/lib/affiliate-links.ts の EXAM_AFFILIATE を唯一の出典とする。
 * 配置: fukushi3 の資格トップ・問題ページ(答え合わせ後)。
 *
 * 掲載面の制限は2級と同じ（lib/ucan-policy.ts）: 数値を伴う合格率・合格者数を書いた面には出さない。
 * ユーキャンは A8 提携の申請中で、いまは計測なしの直リンク（Fukushi2CourseAd.tsx の TODO と同じ）。
 */

import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";
import BookLeadCTA from "@/components/BookLeadCTA";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

interface Props {
  headline?: string;
  body?: string;
}

export default function Fukushi3CourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "独学に不安があれば";
  const finalBody =
    body ??
    "福祉住環境コーディネーターの対策講座として、ユーキャンの通信講座（2・3級講座）があります。3級から始めて2級まで続けて学びたい方は検討してみてください。";

  return (
    <aside className="theme-fukushi my-10 p-5 rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)]">
      <p className="mb-3">
        <span className="text-[10px] tracking-wider text-[color:var(--c-text-sub)] border border-[color:var(--c-border)] px-1.5 py-0.5 rounded">
          広告
        </span>
      </p>
      <p className="text-xs text-[color:var(--c-text-sub)] mb-3">{finalHeadline}</p>
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-4">{finalBody}</p>
      <div className="flex flex-col items-start gap-3">
        <FreeLeadCTA exam="fukushi3" placement="course_ad" withBadge />
        <BookLeadCTA exam="fukushi3" placement="course_ad" />
        <AffiliateLink href={EXAM_AFFILIATE["fukushi3"].href} course="fukushi3" placement="course_ad">
          {EXAM_AFFILIATE["fukushi3"].label} →
        </AffiliateLink>
      </div>
    </aside>
  );
}
