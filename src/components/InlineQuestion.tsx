"use client";
/**
 * コラムの本文中で、その場で解ける1問のカード。2026-10-24 追加。
 * 設定と置く理由は lib/inline-questions.ts。
 *
 * 操作は問題ページ(AnswerReveal)と同じ「選ぶ → 答え合わせする」。1ページにつき変更は1つにするため、
 * 回答の手順は変えていない。答えは問題ページと同じく学習履歴(recordResult)に残し、
 * question_answered を placement 付きで送る(問題ページの回答と分けて数えるため)。
 */
import { useRef, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { recordResult } from "@/lib/study-progress";
import type { InlineQuestionData } from "@/lib/inline-questions";

export default function InlineQuestion({
  q,
  placement = "column_inline_q",
}: {
  q: InlineQuestionData;
  placement?: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  // StrictMode で二重に送らないよう、回答の送信は1回だけにする(AnswerReveal と同じ)
  const answerSent = useRef(false);

  function reveal() {
    setRevealed(true);
    if (answerSent.current) return;
    answerSent.current = true;
    if (selected !== null) recordResult(q.exam, q.questionSlug, selected === q.correctAnswer);
    try {
      sendGAEvent("event", "question_answered", {
        exam: q.exam,
        result: selected === null ? "revealed" : selected === q.correctAnswer ? "correct" : "wrong",
        placement,
      });
    } catch {
      /* GA未ロードでも学習は妨げない */
    }
  }

  function track(kind: string) {
    try {
      sendGAEvent("event", "practice_link_click", { exam: q.exam, kind, placement });
    } catch {
      /* GA未ロードでも遷移は妨げない */
    }
  }

  const correct = selected === q.correctAnswer;

  return (
    <aside className="my-8 p-4 sm:p-5 rounded-lg border border-slate-200 bg-white">
      <p className="text-base font-bold text-slate-900 mb-1">{q.heading}</p>
      <p className="text-xs text-slate-500 mb-3">{q.label}</p>
      <p className="text-sm text-slate-800 leading-relaxed mb-3">{q.questionText}</p>

      <ol className="space-y-2 mb-4">
        {q.choices.map((choice, i) => {
          const num = i + 1;
          const isSelected = selected === num;
          const isCorrect = num === q.correctAnswer;

          let style = "bg-slate-50 text-slate-600 border border-transparent cursor-pointer hover:bg-slate-100";
          if (revealed) {
            if (isCorrect) {
              style = "bg-green-50 border border-green-300 text-green-800 font-medium";
            } else if (isSelected) {
              style = "bg-red-50 border border-red-300 text-red-700";
            } else {
              style = "bg-slate-50 text-slate-400 border border-transparent";
            }
          } else if (isSelected) {
            style = "bg-blue-50 border border-blue-300 text-blue-800 font-medium";
          }

          return (
            <li
              key={i}
              onClick={() => !revealed && setSelected(num)}
              className={`text-sm px-3 py-2.5 rounded-lg transition-colors flex items-start gap-2 ${style}`}
            >
              <span className="font-bold shrink-0">{num}.</span>
              <span className="flex-1">{choice}</span>
              {revealed && isCorrect && (
                <span className="shrink-0 text-xs bg-green-600 text-white px-1.5 py-0.5 rounded whitespace-nowrap">正解</span>
              )}
              {revealed && isSelected && !isCorrect && (
                <span className="shrink-0 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded whitespace-nowrap">不正解</span>
              )}
            </li>
          );
        })}
      </ol>

      {!revealed ? (
        <button
          onClick={reveal}
          className="w-full py-3 rounded-lg font-bold text-sm transition-colors bg-blue-700 text-white hover:bg-blue-600"
        >
          {selected ? "答え合わせする" : "答えを見る"}
        </button>
      ) : (
        <>
          <p
            className={`text-sm font-bold mb-2 ${
              selected === null ? "text-green-700" : correct ? "text-green-700" : "text-red-700"
            }`}
          >
            {selected === null ? `正解は ${q.correctAnswer} です` : correct ? "正解!" : `不正解 — 正解は ${q.correctAnswer} です`}
          </p>
          {q.point && <p className="text-sm text-slate-700 leading-relaxed mb-4">{q.point}</p>}
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <a
              href={q.nextHref}
              onClick={() => track("next_question")}
              className="w-full sm:w-auto text-center py-3 px-5 rounded-lg font-bold text-sm bg-blue-700 text-white no-underline hover:bg-blue-600"
            >
              {q.nextLabel} →
            </a>
            <a
              href={q.detailHref}
              onClick={() => track("explanation")}
              className="text-center text-sm text-slate-500 underline hover:no-underline sm:ml-2"
            >
              この問題の解説を全部読む
            </a>
          </div>
        </>
      )}
    </aside>
  );
}
