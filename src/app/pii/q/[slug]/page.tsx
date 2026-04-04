import { getAllPiiSlugs, getPiiQuestion } from "@/lib/pii-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AnswerReveal from "@/app/q/[slug]/AnswerReveal";

export async function generateStaticParams() {
  return getAllPiiSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const q = await getPiiQuestion(slug);
  if (!q) return {};
  return { title: q.title, description: q.description };
}

export default async function PiiQuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = await getPiiQuestion(slug);
  if (!q) notFound();

  const difficultyLabel = { A: "易しい", B: "標準", C: "難しい" }[q.difficulty];
  const difficultyColor = { A: "bg-green-100 text-green-700", B: "bg-amber-100 text-amber-700", C: "bg-red-100 text-red-700" }[q.difficulty];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: q.title,
    about: { "@type": "Thing", name: "個人情報保護士認定試験" },
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
  const prevSlug = `pii-${String(prevNum).padStart(3, "0")}`;
  const nextSlug = `pii-${String(nextNum).padStart(3, "0")}`;

  return (
    <article className="pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="breadcrumb text-xs text-slate-400 mb-4 flex flex-wrap gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/pii/">個人情報保護士</a><span>/</span>
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
          <a href={`/pii/q/${prevSlug}/`} className="text-sm text-blue-600 no-underline hover:underline">← 問{prevNum}</a>
        )}
        <a href="/pii/" className="text-sm text-slate-500 no-underline hover:underline">問題一覧に戻る</a>
        {q.questionNumber < 300 && (
          <a href={`/pii/q/${nextSlug}/`} className="text-sm text-blue-600 no-underline hover:underline">問{nextNum} →</a>
        )}
      </nav>
    </article>
  );
}
