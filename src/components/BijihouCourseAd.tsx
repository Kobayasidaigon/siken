/**
 * ビジネス実務法務検定 公式講座（全日本情報学習振興協会 SMART合格講座）の広告
 * 配置: ビジネス実務法務検定関連コラム記事の本文末尾、トップページ、問題・分野ページ
 *
 * 2026-09-05: リンクと文言を src/lib/affiliate-links.ts の EXAM_AFFILIATE に一本化
 * (直書きだと着地URLを変えたときに更新漏れが起きる。ItpassCourseAd と同じ流儀)。
 */

import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

interface Props {
  headline?: string;
  body?: string;
}

export default function BijihouCourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "独学に不安があれば";
  const finalBody = body ?? "ビジネス実務法務検定の対策講座として、全日本情報学習振興協会のSMART合格講座があります。試験範囲を体系的に学びたい方は検討してみてください。";
  const target = EXAM_AFFILIATE["bijihou"];

  return (
    <aside className="theme-kashikin my-10 p-5 rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)]">
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
        <FreeLeadCTA exam="bijihou" placement="course_ad" withBadge />
        <AffiliateLink href={target.href} course={target.course} placement="course_ad">
          {target.label} →
        </AffiliateLink>
      </div>
      <img
        width={1}
        height={1}
        src={`https://www17.a8.net/0.gif?${(target.href.match(/a8mat=[^&]+/) || [""])[0]}`}
        alt=""
        style={{ position: "absolute", border: 0 }}
      />
    </aside>
  );
}
