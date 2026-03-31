"use client";
import { useState } from "react";

export default function AnswerReveal({
  choices,
  correctAnswer,
  explanationHtml,
}: {
  choices: string[];
  correctAnswer: number;
  explanationHtml: string;
}) {
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <>
      {/* Choices */}
      <ol className="space-y-2 mb-6">
        {choices.map((choice, i) => {
          const num = i + 1;
          const isSelected = selected === num;
          const isCorrect = num === correctAnswer;

          let style = "bg-slate-50 text-slate-600 border border-transparent cursor-pointer hover:bg-slate-100";
          if (revealed) {
            if (isCorrect) {
              style = "bg-green-50 border border-green-300 text-green-800 font-medium";
            } else if (isSelected && !isCorrect) {
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

      {/* Reveal Button */}
      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-3 rounded-lg font-bold text-sm transition-colors mb-6 bg-blue-700 text-white hover:bg-blue-600"
        >
          {selected ? "答え合わせする" : "答えを見る"}
        </button>
      )}

      {/* Result */}
      {revealed && (
        <>
          {selected && (
            <div className={`card p-4 mb-6 text-center ${selected === correctAnswer ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <p className={`text-base font-bold ${selected === correctAnswer ? "text-green-700" : "text-red-700"}`}>
                {selected === correctAnswer ? "正解!" : `不正解 — 正解は ${correctAnswer} です`}
              </p>
            </div>
          )}

          {!selected && (
            <div className="card p-4 mb-6 text-center bg-green-50 border-green-200">
              <p className="text-base font-bold text-green-700">
                正解: {correctAnswer}
              </p>
            </div>
          )}

          {/* Explanation */}
          <section className="prose max-w-none" dangerouslySetInnerHTML={{ __html: explanationHtml }} />
        </>
      )}
    </>
  );
}
