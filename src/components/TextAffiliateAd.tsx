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
}

export default function TextAffiliateAd({ headline, body, linkHref, linkText, pixelSrc }: Props) {
  return (
    <aside className="my-8 p-5 rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)]">
      <p className="mb-3">
        <span className="text-[10px] tracking-wider text-[color:var(--c-text-sub)] border border-[color:var(--c-border)] px-1.5 py-0.5 rounded">
          広告
        </span>
      </p>
      <p className="text-xs text-[color:var(--c-text-sub)] mb-2">{headline}</p>
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-3">
        {body}
      </p>
      <a
        href={linkHref}
        rel="nofollow sponsored"
        target="_blank"
        className="text-sm text-blue-700 hover:underline font-medium"
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
