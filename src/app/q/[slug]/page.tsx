import { getAllQuestionSlugs, getQuestion } from "@/lib/questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AnswerReveal from "./AnswerReveal";

export async function generateStaticParams() {
  return getAllQuestionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const q = await getQuestion(slug);
  if (!q) return {};
  return {
    title: q.title,
    description: q.description,
  };
}

export default async function QuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = await getQuestion(slug);
  if (!q) notFound();

  const difficultyLabel = { A: "易しい", B: "標準", C: "難しい" }[q.difficulty];
  const difficultyColor = { A: "bg-green-100 text-green-700", B: "bg-amber-100 text-amber-700", C: "bg-red-100 text-red-700" }[q.difficulty];

  return (
    <article className="pb-16">
      {/* Breadcrumb */}
      <nav className="breadcrumb text-xs text-slate-400 mb-4 flex flex-wrap gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href={`/field/`}>分野別</a><span>/</span>
        <span className="text-slate-600">問{q.questionNumber}</span>
      </nav>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 leading-tight">
        {q.title}
      </h1>

      {/* Meta tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
          {q.year}
        </span>
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
          {q.field}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColor}`}>
          難易度{q.difficulty}（{difficultyLabel}）
        </span>
      </div>

      {/* Question Box */}
      <section className="card p-5 mb-6 border-l-4 border-blue-500">
        <h2 className="text-sm font-bold text-blue-800 mb-3">問題文</h2>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mb-4">
          {q.questionText}
        </p>
      </section>

      {/* Interactive Answer Section */}
      <AnswerReveal
        choices={q.choices}
        correctAnswer={q.correctAnswer}
        explanationHtml={q.content}
      />

      {/* Navigation */}
      <nav className="mt-8 flex justify-between items-center pt-4 border-t border-slate-200">
        {q.questionNumber > 1 && (
          <a
            href={`/q/${q.examNumber}-${String(q.questionNumber - 1).padStart(3, "0")}/`}
            className="text-sm text-blue-600 no-underline hover:underline"
          >
            ← 問{q.questionNumber - 1}
          </a>
        )}
        <a href={`/exam/${q.examNumber}/`} className="text-sm text-slate-500 no-underline hover:underline">
          問題一覧に戻る
        </a>
        <a
          href={`/q/${q.examNumber}-${String(q.questionNumber + 1).padStart(3, "0")}/`}
          className="text-sm text-blue-600 no-underline hover:underline"
        >
          問{q.questionNumber + 1} →
        </a>
      </nav>
    </article>
  );
}
