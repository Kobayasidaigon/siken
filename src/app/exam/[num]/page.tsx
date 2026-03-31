import { getQuestionsByExam, getExamNumbers } from "@/lib/questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { QuestionData } from "@/lib/types";

export async function generateStaticParams() {
  const exams = getExamNumbers();
  return exams.map((n) => ({ num: String(n) }));
}

export async function generateMetadata({ params }: { params: Promise<{ num: string }> }): Promise<Metadata> {
  const { num } = await params;
  const title = num === "0" ? "オリジナル練習問題 一覧" : `第${num}回 問題一覧`;
  return {
    title,
    description: `貸金業務取扱主任者試験 ${title}。問題ごとに詳しい解説付き。`,
  };
}

const fieldOrder = ["貸金業法", "利息制限法・出資法", "民法・民事訴訟法", "資金需要者等の保護"];
const fieldColors: Record<string, string> = {
  "貸金業法": "border-blue-500 bg-blue-50",
  "利息制限法・出資法": "border-amber-500 bg-amber-50",
  "民法・民事訴訟法": "border-emerald-500 bg-emerald-50",
  "資金需要者等の保護": "border-purple-500 bg-purple-50",
};
const fieldTextColors: Record<string, string> = {
  "貸金業法": "text-blue-800",
  "利息制限法・出資法": "text-amber-800",
  "民法・民事訴訟法": "text-emerald-800",
  "資金需要者等の保護": "text-purple-800",
};

function QuestionCard({ q }: { q: QuestionData }) {
  const diffColor = { A: "bg-green-100 text-green-700", B: "bg-amber-100 text-amber-700", C: "bg-red-100 text-red-700" }[q.difficulty];
  return (
    <a
      href={`/q/${q.slug}/`}
      className="card p-4 flex justify-between items-center hover:shadow-md transition-shadow no-underline group"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
            問{q.questionNumber}
          </span>
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
}

export default async function ExamPage({ params }: { params: Promise<{ num: string }> }) {
  const { num } = await params;
  const examNumber = parseInt(num);
  if (isNaN(examNumber) || examNumber < 0 || examNumber > 19) notFound();

  const questions = await getQuestionsByExam(examNumber);

  // Group by field
  const grouped = new Map<string, QuestionData[]>();
  for (const field of fieldOrder) {
    grouped.set(field, []);
  }
  for (const q of questions) {
    const list = grouped.get(q.field);
    if (list) list.push(q);
    else grouped.set(q.field, [q]);
  }

  const isOriginal = examNumber === 0;

  return (
    <div className="pb-16">
      <nav className="breadcrumb text-xs text-slate-400 mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <span className="text-slate-600">{isOriginal ? "オリジナル練習問題" : `第${examNumber}回`}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
        {isOriginal ? "オリジナル練習問題" : `第${examNumber}回 貸金業務取扱主任者試験`}
      </h1>
      <p className="text-sm text-slate-500 mb-6">全{questions.length}問｜分野別に整理</p>

      {questions.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-slate-400 text-sm">この回の問題は準備中です。</p>
          <p className="text-slate-400 text-xs mt-2">順次追加していきます。</p>
        </div>
      ) : (
        <div className="space-y-8">
          {fieldOrder.map((field) => {
            const fieldQuestions = grouped.get(field) || [];
            if (fieldQuestions.length === 0) return null;
            return (
              <section key={field}>
                <div className={`border-l-4 pl-4 py-2 mb-4 rounded-r ${fieldColors[field] || "border-slate-400 bg-slate-50"}`}>
                  <h2 className={`text-base font-bold ${fieldTextColors[field] || "text-slate-800"}`}>
                    {field}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">{fieldQuestions.length}問</p>
                </div>
                <div className="space-y-2">
                  {fieldQuestions.map((q) => (
                    <QuestionCard key={q.slug} q={q} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Navigation */}
      <nav className="mt-8 flex justify-center pt-4 border-t border-slate-200">
        <a href="/exam/" className="text-sm text-slate-500 no-underline hover:underline">問題一覧に戻る</a>
      </nav>
    </div>
  );
}
