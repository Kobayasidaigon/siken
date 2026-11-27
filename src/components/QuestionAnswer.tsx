import type { ComponentProps } from "react";
import AnswerReveal from "@/app/q/[slug]/AnswerReveal";
import { getQuestionOx } from "@/lib/ox-from-choices";

/**
 * 問題ページの解答欄。AnswerReveal に、その問題を○×に分けたデータを足して渡す。2026-11-27 追加。
 *
 * ○×に分けられる問題(lib/ox-from-choices.ts の条件に合うもの)だけ「4択 / ○×」の切り替えが出る。
 * 計算・組合せ・語句を選ぶ問題などは今までどおり4択だけ。
 */
export default function QuestionAnswer(props: Omit<ComponentProps<typeof AnswerReveal>, "ox">) {
  const ox = props.exam && props.questionSlug ? getQuestionOx(props.exam, props.questionSlug) : null;
  return <AnswerReveal {...props} ox={ox ?? undefined} />;
}
