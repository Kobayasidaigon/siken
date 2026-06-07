/**
 * 汎用テキスト型アフィリエイト広告。コラム本文の流れに馴染ませる目的で使う。
 * バナーではなくテキストリンク中心。広告ラベルは控えめに表示。
 */

interface Props {
  headline: string;     // 「○○をお探しの方へ」など導入
  body: string;         // 文脈の説明
  linkHref: string;     // アフィリエイトURL
  linkText: string;     // アンカーテキスト
  pixelSrc?: string;    // A8の1x1トラッキングピクセル（任意）
  themeClass?: string;  // テーマ色クラス（例 "theme-kashikin"）。CTAボタンの色に反映
}

export default function TextAffiliateAd({ headline, body, linkHref, linkText, pixelSrc, themeClass = "" }: Props) {
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
      <a
        href={linkHref}
        rel="nofollow sponsored noopener"
        target="_blank"
        className="btn-ad"
      >
        {linkText} →
      </a>
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
