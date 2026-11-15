/**
 * ページの最初の画面に出す「PR」表記。2026-11-15 追加。
 * 介護JJ(A8)は掲載ルールで「PR」「広告」などの表記をファーストビューに出すことを必須にしている
 * (無いと提携解除の恐れ)。転職リンクの offer.requiresPr が立っている面で、見出しの上に置く。
 */
export default function PrNotice({ className = "mb-3" }: { className?: string }) {
  return (
    <p className={`text-xs text-[color:var(--c-text-sub)] ${className}`}>
      <span className="tracking-wider border border-[color:var(--c-border)] px-1.5 py-0.5 rounded text-[10px] mr-1.5">PR</span>
      このページには広告（アフィリエイトリンク）が含まれます。
    </p>
  );
}
