/**
 * 個人情報保護士 公式講座（全日本情報学習振興協会）の広告
 * 配置: PII関連コラム記事の本文末尾、PIIトップページ
 *
 * 各ページの文脈に合わせた訴求文を props で渡せる。
 * 渡されない場合はデフォルトの汎用文を表示。
 */

import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";

interface Props {
  headline?: string;
  body?: string;
}

export default function PiiCourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "独学に不安があれば";
  const finalBody = body ?? "個人情報保護士試験を実施している全日本情報学習振興協会では、公式の認定講座「SMART合格講座」を提供しています。試験範囲を体系的に学びたい方は検討してみてください。";

  return (
    <aside className="theme-pii my-10 p-5 rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)]">
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
        <FreeLeadCTA exam="pii" placement="course_ad" withBadge />
        <AffiliateLink
          href="https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.joho-gakushu.jp%2Fsmartinfo%2Fk_piip%2F"
          course="pii"
          placement="course_ad"
        >
          個人情報保護士のSMART合格講座を見る →
        </AffiliateLink>
      </div>
      <img
        width={1}
        height={1}
        src="https://www11.a8.net/0.gif?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2"
        alt=""
        style={{ position: "absolute", border: 0 }}
      />
    </aside>
  );
}
