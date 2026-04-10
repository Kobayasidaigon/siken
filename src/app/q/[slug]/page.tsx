import { getAllQuestionSlugs, getQuestion, getQuestionsByField } from "@/lib/questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AnswerReveal from "./AnswerReveal";

const fieldSlugMap: Record<string, string> = {
  "貸金業法": "kashikingyouhou",
  "利息制限法・出資法": "risoku",
  "民法・民事訴訟法": "minpou",
  "資金需要者等の保護": "hogo",
};

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

  // 分野内のインデックスを計算
  const fieldQuestions = await getQuestionsByField(q.field);
  const idx = fieldQuestions.findIndex((x) => x.slug === slug);
  const fieldIndex = idx + 1;
  const fieldTotal = fieldQuestions.length;
  const prevQ = idx > 0 ? fieldQuestions[idx - 1] : null;
  const nextQ = idx < fieldQuestions.length - 1 ? fieldQuestions[idx + 1] : null;
  const fieldSlug = fieldSlugMap[q.field] || "";

  const difficultyLabel = { A: "易しい", B: "標準", C: "難しい" }[q.difficulty];
  const difficultyColor = { A: "bg-green-100 text-green-800", B: "bg-amber-100 text-amber-800", C: "bg-red-100 text-red-800" }[q.difficulty];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: q.title,
    about: {
      "@type": "Thing",
      name: "貸金業務取扱主任者試験",
    },
    educationalLevel: q.difficulty === "A" ? "beginner" : q.difficulty === "B" ? "intermediate" : "advanced",
    hasPart: [{
      "@type": "Question",
      name: q.questionText,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.choices[q.correctAnswer - 1],
      },
      suggestedAnswer: q.choices.filter((_, i) => i !== q.correctAnswer - 1).map((c) => ({
        "@type": "Answer",
        text: c,
      })),
    }],
  };

  return (
    <article className="theme-kashikin pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex flex-wrap gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/kashikin/">貸金業務取扱主任者</a><span>/</span>
        {fieldSlug && <><a href={`/field/${fieldSlug}/`}>{q.field}</a><span>/</span></>}
        <span className="text-[color:var(--c-ink)]">問{fieldIndex}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-3 leading-tight font-serif">
        {q.title}
      </h1>
      <div className="w-12 h-1 mb-4" style={{ background: "var(--c-kashikin)" }}></div>

      <div className="flex flex-wrap gap-2 mb-6">
        <span
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={{ background: "var(--c-kashikin-soft)", color: "var(--c-kashikin-ink)" }}
        >
          {q.field} 問{fieldIndex}/{fieldTotal}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColor}`}>
          難易度{q.difficulty}（{difficultyLabel}）
        </span>
      </div>

      <section className="card p-5 mb-6" style={{ borderLeft: "4px solid var(--c-kashikin)" }}>
        <h2 className="text-sm font-bold mb-3" style={{ color: "var(--c-kashikin-ink)" }}>問題文</h2>
        <p className="text-sm text-[color:var(--c-text)] leading-relaxed whitespace-pre-wrap mb-4">
          {q.questionText}
        </p>
      </section>

      <AnswerReveal
        choices={q.choices}
        correctAnswer={q.correctAnswer}
        explanationHtml={q.content}
      />

      <nav className="mt-8 flex justify-between items-center pt-4 border-t border-[color:var(--c-border)]">
        {prevQ ? (
          <a href={`/q/${prevQ.slug}/`} className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-kashikin)]">
            ← 問{idx}
          </a>
        ) : <span />}
        {fieldSlug && (
          <a href={`/field/${fieldSlug}/`} className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-kashikin)]">
            {q.field}の一覧
          </a>
        )}
        {nextQ ? (
          <a href={`/q/${nextQ.slug}/`} className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-kashikin)]">
            問{idx + 2} →
          </a>
        ) : <span />}
      </nav>
    </article>
  );
}
