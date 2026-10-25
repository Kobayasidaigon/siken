/**
 * 「試験前の10問」への入口の1行(資格トップ・直前対策コラム)。窓が開いているあいだだけ出す。2026-10-25 追加。
 * 窓の判定はサーバーで行う(ページは ISR で1時間ごとに作り直すので、ずれは最大1時間)。表示のあとに行が差し込まれて
 * 下の要素がずれないよう、クライアントでは判定しない。問題ページの入口は AnswerReveal にある(答えたあとに出る)。
 */
import { openShikenmaeFor, mdJa, shikenmaePath } from "@/lib/shikenmae";
import ShikenmaeEntryLink from "./ShikenmaeEntryLink";

export default function ShikenmaeEntry({ exam, placement }: { exam: string; placement: "cert_top" | "column" }) {
  const e = openShikenmaeFor(exam);
  if (!e) return null;
  return (
    <p className="card p-4 mb-6 text-sm leading-relaxed">
      <span className="text-[color:var(--c-text-sub)]">{mdJa(e.date)}の試験の前に: </span>
      <ShikenmaeEntryLink href={shikenmaePath(e)} exam={e.exam} placement={placement}>
        試験前の10問（同じ10問を1回だけ）→
      </ShikenmaeEntryLink>
    </p>
  );
}
