import { getAllChizaiSlugs, getChizaiQuestion, getChizaiQuestionsByField } from "@/lib/chizai-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AnswerReveal from "@/app/q/[slug]/AnswerReveal";
import BookmarkButton from "@/app/q/[slug]/BookmarkButton";
import ChizaiCourseAd from "@/components/ChizaiCourseAd";
import { pageMetadata } from "@/lib/page-metadata";

const fieldSlugMap: Record<string, string> = {
  "特許法": "patent",
  "著作権法": "copyright",
  "意匠法": "design",
  "商標法": "trademark",
  "不正競争防止法": "unfair",
  "関連法規": "related",
  "実用新案法・種苗法": "utility",
  "国際条約": "treaty",
  "知財実務": "practice",
};

export async function generateStaticParams() {
  return getAllChizaiSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const q = await getChizaiQuestion(slug);
  if (!q) return {};
  return pageMetadata({
    path: `/chizai/q/${slug}/`,
    title: q.title,
    description: q.description,
  });
}

export default async function ChizaiQuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = await getChizaiQuestion(slug);
  if (!q) notFound();

  const fieldQuestions = await getChizaiQuestionsByField(q.field);
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
    about: { "@type": "Thing", name: "知的財産管理技能検定3級" },
    educationalLevel: q.difficulty === "A" ? "beginner" : q.difficulty === "B" ? "intermediate" : "advanced",
    hasPart: [{
      "@type": "Question",
      name: q.questionText,
      acceptedAnswer: { "@type": "Answer", text: q.choices[q.correctAnswer - 1] },
      suggestedAnswer: q.choices.filter((_, i) => i !== q.correctAnswer - 1).map((c) => ({ "@type": "Answer", text: c })),
    }],
  };

  return (
    <article className="theme-chizai pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex flex-wrap gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/chizai/">知的財産管理技能検定3級</a><span>/</span>
        {fieldSlug && <><a href={`/chizai/field/${fieldSlug}/`}>{q.field}</a><span>/</span></>}
        <span className="text-[color:var(--c-ink)]">問{fieldIndex}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-3 leading-tight font-serif">{q.title}</h1>
      <div className="w-12 h-1 mb-4" style={{ background: "var(--c-chizai)" }}></div>

      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <span
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={{ background: "var(--c-chizai-soft)", color: "var(--c-chizai-ink)" }}
        >
          {q.field} 問{fieldIndex}/{fieldTotal}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColor}`}>難易度{q.difficulty}（{difficultyLabel}）</span>
        <BookmarkButton exam="chizai" questionSlug={slug} />
      </div>

      <section className="card p-5 mb-6" style={{ borderLeft: "4px solid var(--c-chizai)" }}>
        <h2 className="text-sm font-bold mb-3" style={{ color: "var(--c-chizai-ink)" }}>問題文</h2>
        <p className="text-sm text-[color:var(--c-text)] leading-relaxed whitespace-pre-wrap">{q.questionText}</p>
      </section>

      <AnswerReveal choices={q.choices} correctAnswer={q.correctAnswer} explanationHtml={q.content} exam="chizai" questionSlug={slug} courseAd={<ChizaiCourseAd />} />

      <nav className="mt-8 flex justify-between items-center pt-4 border-t border-[color:var(--c-border)]">
        {prevQ ? (
          <a href={`/chizai/q/${prevQ.slug}/`} className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-chizai)]">← 問{idx}</a>
        ) : <span />}
        {fieldSlug && (
          <a href={`/chizai/field/${fieldSlug}/`} className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-chizai)]">
            {q.field}の一覧
          </a>
        )}
        {nextQ ? (
          <a href={`/chizai/q/${nextQ.slug}/`} className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-chizai)]">問{idx + 2} →</a>
        ) : <span />}
      </nav>
    </article>
  );
}
