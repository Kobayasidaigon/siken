import { getQuestionsByExam, getExamNumbers } from "@/lib/questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const exams = getExamNumbers();
  const nums = exams.length > 0 ? exams : Array.from({ length: 19 }, (_, i) => i + 1);
  return nums.map((n) => ({ num: String(n) }));
}

export async function generateMetadata({ params }: { params: Promise<{ num: string }> }): Promise<Metadata> {
  const { num } = await params;
  const title = num === "0" ? "オリジナル練習問題 一覧" : `第${num}回 過去問一覧`;
  return {
    title,
    description: `貸金業務取扱主任者試験 ${title}。問題ごとに詳しい解説付き。`,
  };
}

export default async function ExamPage({ params }: { params: Promise<{ num: string }> }) {
  const { num } = await params;
  const examNumber = parseInt(num);
  if (isNaN(examNumber) || examNumber < 0 || examNumber > 19) notFound();

  const questions = await getQuestionsByExam(examNumber);

  return (
    <div className="pb-16">
      <nav className="breadcrumb text-xs text-slate-400 mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/exam/">年度別</a><span>/</span>
        <span className="text-slate-600">第{examNumber}回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
        {examNumber === 0 ? "オリジナル練習問題" : `第${examNumber}回 貸金業務取扱主任者試験`}
      </h1>
      <p className="text-sm text-slate-500 mb-6">全問の解説一覧</p>

      {questions.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-slate-400 text-sm">この回の問題は準備中です。</p>
          <p className="text-slate-400 text-xs mt-2">順次追加していきます。</p>
        </div>
      ) : (
        <div className="space-y-2">
          {questions.map((q) => {
            const diffColor = { A: "bg-green-100 text-green-700", B: "bg-amber-100 text-amber-700", C: "bg-red-100 text-red-700" }[q.difficulty];
            return (
              <a
                key={q.slug}
                href={`/q/${q.slug}/`}
                className="card p-4 flex justify-between items-center hover:shadow-md transition-shadow no-underline group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      問{q.questionNumber}
                    </span>
                    <span className="text-xs text-slate-400">{q.field}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${diffColor}`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 group-hover:text-blue-600 line-clamp-1">
                    {q.questionText.slice(0, 60)}...
                  </p>
                </div>
                <svg className="w-4 h-4 text-slate-300 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            );
          })}
        </div>
      )}

      {/* Other exams */}
      <nav className="mt-8 flex justify-between items-center pt-4 border-t border-slate-200">
        {examNumber > 1 && (
          <a href={`/exam/${examNumber - 1}/`} className="text-sm text-blue-600 no-underline hover:underline">
            ← 第{examNumber - 1}回
          </a>
        )}
        <a href="/exam/" className="text-sm text-slate-500 no-underline hover:underline">年度一覧</a>
        {examNumber < 19 && (
          <a href={`/exam/${examNumber + 1}/`} className="text-sm text-blue-600 no-underline hover:underline">
            第{examNumber + 1}回 →
          </a>
        )}
      </nav>
    </div>
  );
}
