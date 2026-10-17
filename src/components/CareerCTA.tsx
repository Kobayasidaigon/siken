/**
 * 資格を活かした転職サービスの共通CTA。2026-10-17 追加。
 *
 * career-links.ts の track に offer(ASP 発行リンク)があるときだけ「広告」ラベル付きで出す。
 * 未設定なら null(安全な no-op)。FreeLeadCTA / BookLeadCTA と同じ設計。
 *
 * variant:
 *   card … コラム末尾。TextAffiliateAd と同じ体裁(導入・本文・ボタン)
 *   line … 模試の結果面・合格報告の送信後。1行だけ添える
 *
 * 計測: course="career-<資格 or track>"、placement="<面>_career"(career-links.ts の冒頭を参照)。
 */

import AffiliateLink from "@/components/AffiliateLink";
import { EXAM_CAREER, careerOfferFor, type CareerTrack } from "@/lib/career-links";
import type { ExamSlug } from "@/lib/study-progress";

interface Props {
  /** 資格から track を引く。横断記事など資格が決まらない面は track を直接渡す */
  exam?: ExamSlug;
  track?: CareerTrack;
  placement: string; // 例 "column", "moshi_result", "pass_report"
  variant?: "card" | "line";
  /** line のときの導入文。省略時は track の headline */
  lead?: string;
  /** line の外枠に付けるクラス(余白など)。未設定で何も出ないときに空の枠が残らないよう、枠ごとここで描く */
  className?: string;
}

export default function CareerCTA({ exam, track, placement, variant = "card", lead, className }: Props) {
  const resolved = track ?? (exam ? EXAM_CAREER[exam] : undefined);
  if (!resolved) return null;
  const target = careerOfferFor(resolved);
  if (!target) return null;

  const course = `career-${exam ?? resolved}`;
  const pixel = target.offer.pixel && (
    <img width={1} height={1} src={target.offer.pixel} alt="" style={{ position: "absolute", border: 0 }} />
  );

  if (variant === "line") {
    return (
      <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${className ?? ""}`}>
        <span className="tracking-wider border border-[color:var(--c-border)] px-1.5 py-0.5 rounded text-[10px] text-[color:var(--c-text-sub)]">
          広告
        </span>
        <span>{lead ?? target.headline}</span>
        <AffiliateLink
          href={target.offer.href}
          course={course}
          placement={`${placement}_career`}
          className="text-blue-700 hover:underline font-medium"
        >
          {target.offer.label} →
        </AffiliateLink>
        {pixel}
      </div>
    );
  }

  return (
    <aside className="my-8 p-5 rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)]">
      <p className="mb-3">
        <span className="text-[10px] tracking-wider text-[color:var(--c-text-sub)] border border-[color:var(--c-border)] px-1.5 py-0.5 rounded">
          広告
        </span>
      </p>
      <p className="text-xs text-[color:var(--c-text-sub)] mb-2">{target.headline}</p>
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-4">{target.body}</p>
      <AffiliateLink href={target.offer.href} course={course} placement={`${placement}_career`}>
        {target.offer.label} →
      </AffiliateLink>
      {pixel}
    </aside>
  );
}
