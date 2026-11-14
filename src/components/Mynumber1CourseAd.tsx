/**
 * マイナンバー実務検定1級ページの公式講座（全日本情報学習振興協会のSMART合格講座）の広告。
 * 講座とリンクは3級と同じ（src/lib/affiliate-links.ts の EXAM_AFFILIATE.mynumber1 が唯一の出典で、
 * a8mat も3級と同じ承認済みの提携）。course は "mynumber1" にして、1級のページからのクリックを3級と分けて数える。
 * 配置: mynumber1 の資格トップ・問題ページ(答え合わせ後)。
 */

import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

interface Props {
  headline?: string;
  body?: string;
}

export default function Mynumber1CourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "独学に不安があれば";
  const finalBody =
    body ??
    "マイナンバー実務検定を実施している全日本情報学習振興協会では、公式の認定講座「SMART合格講座」を提供しています。試験範囲を体系的に学びたい方は検討してみてください。";

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
        <FreeLeadCTA exam="mynumber1" placement="course_ad" withBadge />
        <AffiliateLink href={EXAM_AFFILIATE["mynumber1"].href} course="mynumber1" placement="course_ad">
          {EXAM_AFFILIATE["mynumber1"].label} →
        </AffiliateLink>
      </div>
      <img
        width={1}
        height={1}
        src="https://www14.a8.net/0.gif?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2"
        alt=""
        style={{ position: "absolute", border: 0 }}
      />
    </aside>
  );
}
