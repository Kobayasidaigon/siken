/**
 * ビジネス実務法務検定 公式講座（全日本情報学習振興協会 SMART合格講座）の広告
 * 配置: ビジネス実務法務検定関連コラム記事の本文末尾、トップページ
 */

import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";

interface Props {
  headline?: string;
  body?: string;
}

export default function KangyoCourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "独学に不安があれば";
  const finalBody = body ?? "管理業務主任者の対策講座として、全日本情報学習振興協会のSMART合格講座があります。ストラテジ系からテクノロジ系まで範囲が広いため、体系的に学びたい方は検討してみてください。";

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
          href="https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.joho-gakushu.jp%2Fsmartinfo%2Fsmart_lineup.php"
          course="kangyo"
          placement="course_ad"
        >
          ビジネス実務法務検定のSMART合格講座を見る →
        </AffiliateLink>
      </div>
      <img
        width={1}
        height={1}
        src="https://www17.a8.net/0.gif?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2"
        alt=""
        style={{ position: "absolute", border: 0 }}
      />
    </aside>
  );
}
