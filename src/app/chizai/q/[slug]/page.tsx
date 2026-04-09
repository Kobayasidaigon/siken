import { getAllChizaiSlugs, getChizaiQuestion } from "@/lib/chizai-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AnswerReveal from "@/app/q/[slug]/AnswerReveal";

export async function generateStaticParams() {
  return getAllChizaiSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const q = await getChizaiQuestion(slug);
  if (!q) return {};
  return { title: q.title, description: q.description };
}

export default async function ChizaiQuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = await getChizaiQuestion(slug);
  if (!q) notFound();

  const difficultyLabel = { A: "易しい", B: "標準", C: "難しい" }[q.difficulty];
  const difficultyColor = { A: "bg-green-100 text-green-700", B: "bg-amber-100 text-amber-700", C: "bg-red-100 text-red-700" }[q.difficulty];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: q.title,
    about: { "@type": "Thing", name: "知的財産管理技能検定3級" },
    educationalLevel: q.difficulty === "A" ? "beginner" : q.difficulty === "B" ? "intermediate" : "advanced",
    hasPart: [{
      "@type": "Question",
      name: q.questionText,
      acceptedAnswer: { "@type": "Answer", text: q.choices[q.correctAnswer - 1] },
      suggestedAnswer: q.choices.filter((_, i) => i !== q.correctAnswer - 1).map((c) => ({ "@type": "Answer", text: c })),
    }],
  };

  const prevNum = q.questionNumber - 1;
  const nextNum = q.questionNumber + 1;
  const prevSlug = `chizai-${String(prevNum).padStart(3, "0")}`;
  const nextSlug = `chizai-${String(nextNum).padStart(3, "0")}`;

  return (
    <article className="pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="breadcrumb text-xs text-slate-400 mb-4 flex flex-wrap gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/chizai/">知的財産管理技能検定3級</a><span>/</span>
        <span className="text-slate-600">問{q.questionNumber}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 leading-tight">{q.title}</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">{q.field}</span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColor}`}>難易度{q.difficulty}（{difficultyLabel}）</span>
      </div>

      <section className="card p-5 mb-6 border-l-4 border-blue-500">
        <h2 className="text-sm font-bold text-blue-800 mb-3">問題文</h2>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{q.questionText}</p>
      </section>

      <AnswerReveal choices={q.choices} correctAnswer={q.correctAnswer} explanationHtml={q.content} />

      <nav className="mt-8 flex justify-between items-center pt-4 border-t border-slate-200">
        {q.questionNumber > 1 && (
          <a href={`/chizai/q/${prevSlug}/`} className="text-sm text-blue-600 no-underline hover:underline">← 問{prevNum}</a>
        )}
        <a href="/chizai/" className="text-sm text-slate-500 no-underline hover:underline">問題一覧に戻る</a>
        {q.questionNumber < 200 && (
          <a href={`/chizai/q/${nextSlug}/`} className="text-sm text-blue-600 no-underline hover:underline">問{nextNum} →</a>
        )}
      </nav>
    </article>
  );
}
