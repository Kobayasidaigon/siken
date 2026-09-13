"use client";

/**
 * コラムの本文前に置く「その場で1問」。2026-09-13 追加。
 * 方針: docs/direction-2026-09.md §6「試験日・合格率・勉強時間コラムにその場で1問」。
 *
 * 情報を見に来た人ほど、1問触ると解き始める。問題ページの部品(AnswerReveal)は
 * 広告・Studio 送客・ドリルの導線まで持っていて、読み物の冒頭には重いので、
 * 選択肢と答え合わせだけの小さな部品にした。解説は問題ページで読んでもらう。
 *
 * 解答は学習履歴(メダル)と回答ログ(匿名)に、問題ページで解いたときと同じ扱いで記録する。
 */

import { useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { recordResult, type ExamSlug } from "@/lib/study-progress";
import { logAnswer } from "@/lib/growth/answer-log";

interface Props {
  exam: ExamSlug;
  examName: string;
  slug: string;
  questionText: string;
  choices: string[];
  correctAnswer: number;
  /** 問題ページのURL(解説へ) */
  href: string;
  field: string;
}

export default function InlineQuestion({ exam, examName, slug, questionText, choices, correctAnswer, href, field }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  function reveal() {
    if (selected === null || revealed) return;
    setRevealed(true);
    const correct = selected === correctAnswer;
    try {
      recordResult(exam, slug, correct);
    } catch {
      /* 記録できなくても表示は妨げない */
    }
    logAnswer(exam, slug, correct, "column");
    try {
      sendGAEvent("event", "question_answered", {
        exam,
        result: correct ? "correct" : "wrong",
        placement: "column",
      });
    } catch {
      /* noop */
    }
  }

  return (
    <aside className="card p-5 mb-8">
      <p className="text-xs text-[color:var(--c-text-sub)] mb-1">
        読む前に1問だけ・{examName}（{field}）
      </p>
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed whitespace-pre-wrap mb-3">{questionText}</p>
      <ol className="space-y-1.5 mb-3">
        {choices.map((choice, i) => {
          const num = i + 1;
          const isSelected = selected === num;
          const isCorrect = num === correctAnswer;
          let style = "bg-slate-50 text-slate-600 border border-transparent cursor-pointer hover:bg-slate-100";
          if (revealed) {
            if (isCorrect) style = "bg-green-50 border border-green-300 text-green-800 font-medium";
            else if (isSelected) style = "bg-red-50 border border-red-300 text-red-700";
            else style = "bg-slate-50 text-slate-400 border border-transparent";
          } else if (isSelected) {
            style = "bg-blue-50 border border-blue-300 text-blue-800 font-medium";
          }
          return (
            <li key={i}>
              <button
                type="button"
                disabled={revealed}
                aria-pressed={isSelected}
                onClick={() => !revealed && setSelected(num)}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-start gap-2 disabled:cursor-default ${style}`}
              >
                <span className="font-bold shrink-0">{num}.</span>
                <span className="flex-1">{choice}</span>
              </button>
            </li>
          );
        })}
      </ol>
      {!revealed ? (
        <button
          type="button"
          onClick={reveal}
          disabled={selected === null}
          className="text-sm font-bold px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-600 disabled:opacity-40"
        >
          答え合わせする
        </button>
      ) : (
        <p className="text-sm">
          <span className={`font-bold ${selected === correctAnswer ? "text-green-700" : "text-red-700"}`}>
            {selected === correctAnswer ? "正解です。" : `不正解。正解は ${correctAnswer} です。`}
          </span>{" "}
          <a href={href} className="text-blue-700 underline">
            解説を読む →
          </a>
        </p>
      )}
    </aside>
  );
}
