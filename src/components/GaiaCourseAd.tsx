/**
 * 生成AIアドバイザー認定試験の講座広告。
 * リンクと文言は src/lib/affiliate-links.ts の EXAM_AFFILIATE を唯一の出典とする
 * (直書きすると、雛形から複製したときに別資格の商品を宣伝してしまうため)。
 * 配置: 資格トップページ、分野ページ、問題ページ(答え合わせ後)、コラム。
 */

import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

/** 答練(問題演習)講座。教科書講座とは別ページ。リンクは spec の飛び先から a8mat 共通で作成 */
const TOUREN_HREF = "https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.joho-gakushu.or.jp%2Fseisei-ai-advisor-touren%2F";

interface Props {
  headline?: string;
  body?: string;
}

export default function GaiaCourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "独学に不安があれば";
  const finalBody =
    body ??
    "生成AIアドバイザー認定試験は、全日本情報学習振興協会のSMART合格講座に、教科書講座と答練（問題演習）が用意されています。著作権や個人情報、AI事業者ガイドラインの言い回しは細かいので、体系的に押さえたい方は検討してみてください。";

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
        <FreeLeadCTA exam="gaia" placement="course_ad" withBadge />
        <AffiliateLink href={EXAM_AFFILIATE["gaia"].href} course="gaia" placement="course_ad">
          {EXAM_AFFILIATE["gaia"].label} →
        </AffiliateLink>
        <AffiliateLink href={TOUREN_HREF} course="gaia" placement="course_ad">
          生成AIアドバイザーのSMART答練を見る →
        </AffiliateLink>
      </div>
      <img
        width={1}
        height={1}
        src={`https://www11.a8.net/0.gif?${(EXAM_AFFILIATE["gaia"].href.match(/a8mat=[^&]+/) || [""])[0]}`}
        alt=""
        style={{ position: "absolute", border: 0 }}
      />
    </aside>
  );
}
