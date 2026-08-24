/**
 * 資格トップに置く第2回(有料)への導線。
 *
 * ページもAPIも動くのに、どこからもリンクしていなければ誰にも見つからない。
 * 設備サイトで実際にその状態のまま公開直前まで気づかなかったため、第1回の
 * ボタンのすぐ隣に、価格を出した状態で並べる。
 *
 * 配色は資格トップの theme-* が定義する --c-accent 系をそのまま使うので、
 * 資格ごとに色を書き分ける必要はない。
 */

import { moshi2ProductOf } from "@/lib/moshi2-products";
import type { ExamSlug } from "@/lib/study-progress";

export default function Moshi2TopLink({ certId }: { certId: ExamSlug }) {
  const p = moshi2ProductOf(certId);
  if (!p) return null;

  return (
    <a
      href={`/${certId}/moshi2/`}
      className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-accent-soft)]"
      style={{ borderColor: "var(--c-border)", color: "var(--c-text)" }}
    >
      第2回（¥{p.priceJpy.toLocaleString()}・別問題）→
    </a>
  );
}
