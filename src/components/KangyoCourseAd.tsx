/**
 * 管理業務主任者の講座広告。
 * リンクと文言は src/lib/affiliate-links.ts の EXAM_AFFILIATE を唯一の出典とする
 * (直書きすると、雛形から複製したときに別資格の商品を宣伝してしまうため)。
 * 配置: 管理業務主任者関連のコラム記事の末尾、資格トップページ、問題ページ。
 */

import AffiliateLink from "@/components/AffiliateLink";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";
import FreeLeadCTA from "@/components/FreeLeadCTA";

interface Props {
  headline?: string;
  body?: string;
}

export default function KangyoCourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "独学に不安があれば";
  const finalBody = body ?? "管理業務主任者の対策講座として、アガルートのマンション管理士・管理業務主任者講座があります。2026年4月施行の改正区分所有法は独学だと情報が追いつきにくく、会計の仕訳も独学では詰まりやすい分野です。";

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
        <FreeLeadCTA exam="kangyo" placement="course_ad" withBadge />
        <AffiliateLink
          href={EXAM_AFFILIATE["kangyo"].href}
          course="kangyo"
          placement="course_ad"
        >
          {EXAM_AFFILIATE["kangyo"].label} →
        </AffiliateLink>
      </div>
      <img
        width={1}
        height={1}
        src={`https://www11.a8.net/0.gif?${(EXAM_AFFILIATE["kangyo"].href.match(/a8mat=[^&]+/) || [""])[0]}`}
        alt=""
        style={{ position: "absolute", border: 0 }}
      />
    </aside>
  );
}
