/**
 * シカクモン Studio を前面に出すカード。2026-11-22 追加。
 *
 * アフィリ提携が無い資格(lib/studio-cta.ts の STUDIO_FIRST_EXAMS)で、講座広告の枠の代わりに出す。
 * 既存の Studio 導線(答え合わせ後の aside・コラム末尾)は「文言の具体性で効かせる」控えめな見た目だが、
 * ここは売上ゼロの枠を Studio に振り向ける場所なので、ボタンと無料で試せることをはっきり出す。
 *
 * 計測: placement はその枠の既存の語彙(course_ad / question_result)をそのまま使い、
 * 同じ枠の講座リンク(affiliate_click)と studio_click を並べて比べられるようにする。
 * utm_content は question_result だけ既存の quiz_<資格> に揃え、それ以外は studio_card_<placement>_<資格>。
 *
 * 料金の書き方(2026-11-21 ユーザー談): 無料プランでも登録から7日間は Pro の機能を試せる。
 * Pro の初回契約にも7日間の無料トライアルが付く。金額は Studio 側で変わりうるのでここには書かない。
 */
import StudioLink from "@/components/StudioLink";
import type { ExamSlug } from "@/lib/study-progress";
import { STUDIO_FIRST_SHORT_NAMES, hasStudioLp, studioCtaFor } from "@/lib/studio-cta";

export default function StudioPromoCard({
  exam,
  placement,
  kicker,
}: {
  exam: ExamSlug;
  /** 設置面。AffiliateLink と同じ語彙(course_ad / question_result) */
  placement: string;
  /** 見出しの上の小さな一言(コラムなど、呼び出し側の文脈に合わせたいとき) */
  kicker?: string;
}) {
  const content = placement === "question_result" ? `quiz_${exam}` : `studio_card_${placement}_${exam}`;
  const cta = studioCtaFor(exam, content);
  const name = STUDIO_FIRST_SHORT_NAMES[exam] ?? "この資格";
  const lp = hasStudioLp(exam);

  return (
    <aside className="my-10 p-5 rounded-lg border-2 border-indigo-300 bg-indigo-50">
      <p className="text-[11px] font-bold tracking-wider text-indigo-700 mb-2">
        {kicker ?? "姉妹サービス シカクモン Studio"}
      </p>
      <p className="text-base font-bold text-indigo-950 leading-snug mb-3">
        {name}の演習を、AI が作る問題で増やす
      </p>
      <ul className="text-sm text-indigo-950/90 leading-relaxed space-y-1.5 mb-4 list-none pl-0">
        {lp ? (
          <li>✓ 登録なしで、{name}の問題をその場で1問解けます(解説つき)</li>
        ) : (
          <li>✓ 資格名を入れるだけで、AI がその資格の問題を作ります(解説つき)</li>
        )}
        <li>✓ 間違えた論点や手元のノート・テキストから、自分用の問題集を作れます</li>
        <li>✓ 忘れたころに出し直す復習と、AI への質問にも対応しています</li>
        <li>✓ 登録は無料。登録から7日間は Pro の機能もそのまま試せます</li>
      </ul>
      <StudioLink
        href={cta.href}
        placement={placement}
        exam={exam}
        className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white no-underline hover:bg-indigo-700"
      >
        {lp ? cta.linkLabel : "シカクモン Studio を無料で試す"} →
      </StudioLink>
    </aside>
  );
}
