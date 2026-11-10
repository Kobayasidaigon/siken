/**
 * ビジネスマネジャー検定 対策講座（産業能率大学の通信講座）の広告
 * 2026-11-10: 以前は「東商の公式通信講座（産業能率大学）」と書いていた。東京商工会議所の公式通信講座のページ
 *   (kentei.tokyo-cci.or.jp/bijimane/support/online-course.html)に産業能率大学の名前は無く、申込は運営委託機関の
 *   株式会社ワールド・ヒューマン・リソーシス。一方、産業能率大学 総合研究所の「公式通信講座 ＜Web専用＞」のページ
 *   (www.hj.sanno.ac.jp/distance-learning/course/2AM0-01.html)は「東京商工会議所の公式通信講座」と書いている(受講料21,000円で一致)。
 *   このリンク先(B650-01)がその講座かは開けず確かめられなかったので、「東商公式」とは書かない。
 * 2026-11-10(午後): 旧リンク先(/cp/distance-learning/course/B650-01.html)は /distance-learning/… に転送されて
 *   「ページが見つかりません」になっていた(AdSense 申し込み前の Cowork の確認で判明)。開けることを確かめた
 *   2AM0-01「＜Web専用＞ビジネスマネジャー検定試験(R)」(受講料21,000円・税込)に差し替えた。そのページは
 *   「東京商工会議所の公式通信講座」と書いているが、東商のページには産業能率大学の名前が無いので、文言は変えていない。
 *   「公式テキストは400ページ超」も公式ページで確かめられないため外した。
 * 配置: bijimane の問題ページ・分野ページ・資格トップ・関連コラム末尾
 *
 * TODO(A8提携後): AffiliateLink の href を A8 の a8mat 付きリンクへ差し替え、
 * インプレッション計測用の 1x1 gif も追加する（BijihouCourseAd.tsx 参照）。
 * 差し替え時は src/lib/affiliate-links.ts の bijimane エントリも同時に更新すること。
 * 提携可否の確認はユーザー宿題（night-batch/INBOX.md 項目1）。
 */

import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";
import BookLeadCTA from "@/components/BookLeadCTA";

interface Props {
  headline?: string;
  body?: string;
}

export default function BijimaneCourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "独学に不安があれば";
  const finalBody =
    body ??
    "ビジネスマネジャー検定は、マネジャーの役割から人と組織、業務、リスクのマネジメントまで範囲が広い試験です。体系的に整理しながら学びたい方は、産業能率大学の通信講座も検討してみてください。";

  return (
    <aside className="theme-bijimane my-10 p-5 rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)]">
      <p className="mb-3">
        <span className="text-[10px] tracking-wider text-[color:var(--c-text-sub)] border border-[color:var(--c-border)] px-1.5 py-0.5 rounded">
          広告
        </span>
      </p>
      <p className="text-xs text-[color:var(--c-text-sub)] mb-3">{finalHeadline}</p>
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-4">{finalBody}</p>
      <div className="flex flex-col items-start gap-3">
        <FreeLeadCTA exam="bijimane" placement="course_ad" withBadge />
        <BookLeadCTA exam="bijimane" placement="course_ad" />
        <AffiliateLink
          href="https://www.hj.sanno.ac.jp/distance-learning/course/2AM0-01.html"
          course="bijimane"
          placement="course_ad"
        >
          産業能率大学の通信講座を見る →
        </AffiliateLink>
      </div>
    </aside>
  );
}
