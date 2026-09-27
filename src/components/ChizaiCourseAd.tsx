/**
 * 知的財産管理技能検定3級 講座（オンスク.JP）の広告
 * 配置: 知財関連コラム末尾・知財トップページ・知財の問題ページ
 *
 * アガルート等の大手は知財検定の対策講座を提供していないため、現状はオンスク.JPを採用。
 * リンクは lib/affiliate-links.ts の EXAM_AFFILIATE.chizai を参照する（更新漏れ防止）。
 * 各ページの文脈に合わせた訴求文を props で渡せる。渡さなければ汎用文を表示。
 *
 * 2026-09-19: 無料会員登録への CTA(FreeLeadCTA)を撤去。A8 の成果地点は月額スタンダード
 * プランの新規申込だけで、無料登録は自動有料化されない設計のため報酬にならない
 * (120click→0件)。主 CTA を有料プラン案内(月額タブ)に、副 CTA を講座内容ページにした。
 * 一括パックは成果対象外なので、こちらから一括へ誘導する文言は置かない。
 */

import AffiliateLink from "@/components/AffiliateLink";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

/** 講座の内容(講師・カリキュラム)を確認したい読者向けの副リンク。同一 a8mat の別着地。 */
const COURSE_DETAIL_HREF =
  "https://px.a8.net/svt/ejp?a8mat=4B3TF4+BJKL0Y+408S+BW8O2&a8ejpredirect=https%3A%2F%2Fonsuku.jp%2Ftraining%2Fchizai3";

interface Props {
  headline?: string;
  body?: string;
}

export default function ChizaiCourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "知財検定の対策講座をお探しの方へ";
  const finalBody =
    body ??
    "知的財産管理技能検定は市販教材が限られる試験です。月額制のオンライン講座オンスク.JPは知財検定3級講座を提供しており、スキマ時間で出題範囲を体系的に押さえられます。";

  return (
    <aside className="theme-chizai my-10 p-5 rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)]">
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
        <AffiliateLink
          href={EXAM_AFFILIATE.chizai.href}
          course="chizai"
          placement="course_ad"
        >
          {EXAM_AFFILIATE.chizai.label} →
        </AffiliateLink>
        <AffiliateLink
          href={COURSE_DETAIL_HREF}
          course="chizai"
          placement="course_ad_detail"
          className="text-xs text-[color:var(--c-text-sub)] hover:underline"
        >
          講座の内容・担当講師を見る →
        </AffiliateLink>
      </div>
      <img
        width={1}
        height={1}
        src="https://www11.a8.net/0.gif?a8mat=4B3TF4+BJKL0Y+408S+BW8O2"
        alt=""
        style={{ position: "absolute", border: 0 }}
      />
    </aside>
  );
}
