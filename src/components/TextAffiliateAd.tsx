/**
 * 汎用テキスト型アフィリエイト広告。コラム本文の流れに馴染ませる目的で使う。
 * バナーではなくテキストリンク中心。広告ラベルは控えめに表示。
 */

import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";
import type { ExamSlug } from "@/lib/study-progress";

interface Props {
  headline: string;     // 「○○をお探しの方へ」など導入
  body: string;         // 文脈の説明
  linkHref: string;     // アフィリエイトURL
  linkText: string;     // アンカーテキスト
  pixelSrc?: string;    // A8の1x1トラッキングピクセル（任意）
  themeClass?: string;  // テーマ色クラス（例 "theme-kashikin"）。CTAボタンの色に反映
  course?: string;      // GA4計測用の識別子。指定時はAffiliateLink経由でクリックを計測する
  placement?: string;   // GA4計測のplacement。既定 "column"
  /**
   * 2026-09-05追加。指定すると有料リンクの上に、その資格の無料オファー
   * (affiliate-links.ts の freeHref = 資料請求・無料体験)を CourseAd と同じ体裁で併置する。
   * 貸金コラム12本はこのコンポーネント直書きだったため、他13資格のコラム(CourseAd経由)と違い
   * 無料CTAが一切出ていなかった。freeHref 未設定の資格なら何も出ない。
   */
  exam?: ExamSlug;
}

export default function TextAffiliateAd({ headline, body, linkHref, linkText, pixelSrc, themeClass = "", course, placement = "column", exam }: Props) {
  return (
    <aside className={`${themeClass} my-8 p-5 rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)]`}>
      <p className="mb-3">
        <span className="text-[10px] tracking-wider text-[color:var(--c-text-sub)] border border-[color:var(--c-border)] px-1.5 py-0.5 rounded">
          広告
        </span>
      </p>
      <p className="text-xs text-[color:var(--c-text-sub)] mb-2">{headline}</p>
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-4">
        {body}
      </p>
      {exam && (
        <div className="mb-3">
          <FreeLeadCTA exam={exam} placement={placement} withBadge />
        </div>
      )}
      {course ? (
        <AffiliateLink href={linkHref} course={course} placement={placement}>
          {linkText} →
        </AffiliateLink>
      ) : (
        <a
          href={linkHref}
          rel="nofollow sponsored noopener"
          target="_blank"
          className="btn-ad"
        >
          {linkText} →
        </a>
      )}
      {pixelSrc && (
        <img
          width={1}
          height={1}
          src={pixelSrc}
          alt=""
          style={{ position: "absolute", border: 0 }}
        />
      )}
    </aside>
  );
}
