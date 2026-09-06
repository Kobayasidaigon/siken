/**
 * eco検定（環境社会検定試験）向けの学習リソース案内。
 * 配置: eco の問題ページ・分野ページ・資格トップ・関連コラム末尾
 *
 * TODO(A8提携後): AffiliateLink の href を A8 の a8mat 付きリンクへ差し替え、
 * インプレッション計測用の 1x1 gif も追加する（BijihouCourseAd.tsx 参照）。
 * 差し替え時は src/lib/affiliate-links.ts の eco エントリも同時に更新すること。
 * 提携可否の確認はユーザー宿題（night-batch/INBOX.md）。
 *
 * ※提携が付くまでのリンク先は東京商工会議所の公式検定サイト（トラッキングなし）。
 *   収益はゼロだが、受験者が最初に見るべき一次情報へ導く導線としては正しいので出しておく。
 * ※そのため他資格の CourseAd と違い「広告」バッジを出していない（アフィリではないため）。
 *   A8リンクへ差し替える際は、他の CourseAd と同じ「広告」バッジを必ず復活させること。
 */

import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";
import BookLeadCTA from "@/components/BookLeadCTA";

interface Props {
  headline?: string;
  body?: string;
}

export default function EcoCourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "公式テキストから押さえたい方へ";
  const finalBody =
    body ??
    "eco検定は公式テキストの内容から出題される試験です。出題範囲は気候変動・生物多様性・循環型社会・環境法と広く、用語の量も多いため、まず公式テキストの最新版で範囲の全体像をつかむのが近道です。";

  return (
    <aside className="theme-eco my-10 p-5 rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)]">
      <p className="text-xs text-[color:var(--c-text-sub)] mb-3">{finalHeadline}</p>
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-4">{finalBody}</p>
      <div className="flex flex-col items-start gap-3">
        <FreeLeadCTA exam="eco" placement="course_ad" withBadge />
        <BookLeadCTA exam="eco" placement="course_ad" />
        <AffiliateLink
          href="https://kentei.tokyo-cci.or.jp/eco/"
          course="eco"
          placement="course_ad"
        >
          東商の公式サイトで公式テキスト・学習方法を見る →
        </AffiliateLink>
      </div>
    </aside>
  );
}
