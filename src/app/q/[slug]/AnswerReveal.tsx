"use client";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { recordResult, loadProgress, type ExamSlug, type Medal } from "@/lib/study-progress";
import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";
import { EXAM_AFFILIATE, RESULT_CTA_HEADLINE } from "@/lib/affiliate-links";

// 答え合わせ直後CTAを出す資格（段階導入：まず流入の大きい bijihou と pii で検証）
const RESULT_CTA_EXAMS: ExamSlug[] = ["bijihou", "pii"];

const MEDAL_LABEL: Record<Medal, string> = { bronze: "🥉 銅", silver: "🥈 銀", gold: "🥇 金" };
const MEDAL_NEXT: Record<Medal, string> = {
  bronze: "もう一度正解で 🥈 銀になります",
  silver: "もう一度正解で 🥇 金になります",
  gold: "この問題はマスター（金）です！",
};

export default function AnswerReveal({
  choices,
  correctAnswer,
  explanationHtml,
  exam,
  questionSlug,
  courseAd,
}: {
  choices: string[];
  correctAnswer: number;
  explanationHtml: string;
  exam?: ExamSlug;
  questionSlug?: string;
  // 講座広告（CourseAd）。解答後（最高関心点）にのみ表示する。設問を解いている最中の
  // 常時表示はimpを焼くだけ（CTR 0.26%）なので、ここで revealed ゲートをかける。
  courseAd?: ReactNode;
}) {
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [medal, setMedal] = useState<Medal | null>(null);

  useEffect(() => {
    if (revealed && selected !== null && exam && questionSlug) {
      recordResult(exam, questionSlug, selected === correctAnswer);
      // 更新後のメダルを取得して表示
      setMedal(loadProgress()[exam].medals?.[questionSlug] ?? null);
    }
  }, [revealed, selected, correctAnswer, exam, questionSlug]);

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
              {exam && questionSlug && medal && (
                <>
                  <p className="text-sm font-bold mt-2">
                    この問題：{MEDAL_LABEL[medal]}
                  </p>
                  <p className="text-xs text-[color:var(--c-text-sub)] mt-1">
                    {MEDAL_NEXT[medal]}（<a href="/study/" className="underline">学習履歴を見る</a>）
                  </p>
                </>
              )}
            </div>
          )}

          {!selected && (
            <div className="card p-4 mb-6 text-center bg-green-50 border-green-200">
              <p className="text-base font-bold text-green-700">
                正解: {correctAnswer}
              </p>
            </div>
          )}

          {/* 答え合わせ直後CTA（最高関心点。結果カードの外・控えめなテキストリンク） */}
          {exam && RESULT_CTA_EXAMS.includes(exam) && (
            <p className="mb-6 text-xs text-[color:var(--c-text-sub)] flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="tracking-wider border border-[color:var(--c-border)] px-1.5 py-0.5 rounded text-[10px]">広告</span>
              <span>{RESULT_CTA_HEADLINE[exam]}</span>
              {/* 低摩擦の無料オファーが設定されていれば有料CTAの前に併置（freeHref未設定なら非表示） */}
              <FreeLeadCTA exam={exam} placement="question_result" />
              <AffiliateLink
                href={EXAM_AFFILIATE[exam].href}
                course={EXAM_AFFILIATE[exam].course}
                placement="question_result"
                className="text-blue-700 hover:underline font-medium"
              >
                {EXAM_AFFILIATE[exam].label} →
              </AffiliateLink>
            </p>
          )}

          {/* Explanation */}
          <section className="prose max-w-none" dangerouslySetInnerHTML={{ __html: explanationHtml }} />

          {/* 答え合わせ後（最高関心点）の Studio 送客。全資格で表示・affiliate より優先 */}
          <aside className="mt-8 p-4 rounded-lg border border-indigo-200 bg-indigo-50">
            <p className="text-xs font-bold mb-1 text-indigo-900">
              自分専用の問題集も作れます
            </p>
            <p className="text-xs leading-relaxed mb-2 text-indigo-900/80">
              資格名を入れるだけ、または手元の教材 PDF・写真から、AI が 4 択問題を生成する姉妹サービス「シカクモン
              Studio」。間違えた問題は忘却曲線で自動復習でき、試験まで続く学習に。
            </p>
            <a
              href={`https://studio.shikakumon.com/?utm_source=shikakumon&utm_medium=quiz_${exam ?? "result"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold inline-flex items-center gap-1 no-underline text-indigo-600 hover:underline"
            >
              シカクモン Studio を無料で試す
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </aside>

          {/* 講座広告（CourseAd）は解答後のみ表示。設問の最中の常時表示をやめ、
              最高関心点だけに絞ることで低intentのimp浪費を止める。 */}
          {courseAd}
        </>
      )}
    </>
  );
}
