/**
 * JSON-LD を安全に埋め込む共通コンポーネント。
 * "</script>" 等がデータに混入しても script タグが早期終了しないよう
 * "<" を < にエスケープする(JSON としては等価)。
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
