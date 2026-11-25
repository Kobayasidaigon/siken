import type { ReactNode } from "react";

/**
 * 択一の選択肢1つ分。<ol> の中に並べて使う。2026-11-25 追加。
 *
 * 以前は各画面で <li onClick> を直接書いていて、フォーカスが当たらず Enter / Space で選べず、
 * 選択中かどうかも背景色でしか分からなかった(キーボード・スクリーンリーダーでは答えられない)。
 * <li> の中に <button aria-pressed> を置き、選択状態を支援技術にも伝える。
 * 配色(状態ごとのクラス)は呼び出し側がこれまでどおり渡す。
 *
 * 使っている所: app/q/[slug]/AnswerReveal.tsx / components/InlineQuestion.tsx /
 * app/kashikin/mock/MockExam.tsx / components/MoshiExam.tsx
 */
export default function ChoiceOption({
  num,
  label,
  selected,
  disabled = false,
  onSelect,
  className,
  children,
}: {
  num: number; // 1始まりの選択肢番号
  label: string;
  selected: boolean;
  /** 答え合わせ後など、もう選び直せないとき */
  disabled?: boolean;
  onSelect: () => void;
  /** 状態ごとの配色クラス */
  className: string;
  /** 選択肢の後ろに付けるもの(「正解」「不正解」の札など) */
  children?: ReactNode;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        disabled={disabled}
        className={`w-full text-left text-sm px-3 py-2.5 rounded-lg transition-colors flex items-start gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${className}`}
      >
        <span className="font-bold shrink-0">{num}.</span>
        <span className="flex-1">{label}</span>
        {children}
      </button>
    </li>
  );
}
