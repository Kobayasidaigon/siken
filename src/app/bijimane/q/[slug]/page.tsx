import { getAllBijimaneSlugs, getBijimaneQuestion, getBijimaneQuestionsByField } from "@/lib/bijimane-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AnswerReveal from "@/app/q/[slug]/AnswerReveal";
import BookmarkButton from "@/app/q/[slug]/BookmarkButton";
import BijimaneCourseAd from "@/components/BijimaneCourseAd";
import { pageMetadata } from "@/lib/page-metadata";

const fieldSlugMap: Record<string, string> = {
  "マネジャーの役割と心構え": "role",
  "マネジャー自身のマネジメントとコミュニケーション": "self-communication",
  "部下のマネジメントとリーダーシップ": "leadership",
  "人材育成と人事考課": "hr",
  "チームのマネジメントと企業組織論": "team",
  "経営計画・事業計画と戦略": "strategy",
  "業務のマネジメントと問題解決": "operation",
  "マーケティング・イノベーションと財務の基礎": "marketing",
  "リスクマネジメントの考え方と職場のリスク": "risk",
  "業務・組織・事故災害のリスクマネジメント": "risk-operation",
};

export async function generateStaticParams() {
  return getAllBijimaneSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const q = await getBijimaneQuestion(slug);
  if (!q) return {};
  return pageMetadata({
    path: `/bijimane/q/${slug}/`,
    title: q.title,
    description: q.description,
  });
}

export default async function BijimaneQuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = await getBijimaneQuestion(slug);
  if (!q) notFound();

  const fieldQuestions = await getBijimaneQuestionsByField(q.field);
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
    about: { "@type": "Thing", name: "ビジネスマネジャー検定試験" },
    educationalLevel: q.difficulty === "A" ? "beginner" : q.difficulty === "B" ? "intermediate" : "advanced",
    hasPart: [{
      "@type": "Question",
      name: q.questionText,
      acceptedAnswer: { "@type": "Answer", text: q.choices[q.correctAnswer - 1] },
      suggestedAnswer: q.choices.filter((_, i) => i !== q.correctAnswer - 1).map((c) => ({ "@type": "Answer", text: c })),
    }],
  };

  return (
    <article className="theme-bijimane pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex flex-wrap gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/bijimane/">ビジネスマネジャー検定</a><span>/</span>
        {fieldSlug && <><a href={`/bijimane/field/${fieldSlug}/`}>{q.field}</a><span>/</span></>}
        <span className="text-[color:var(--c-ink)]">問{fieldIndex}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-3 leading-tight font-serif">{q.title}</h1>
      <div className="w-12 h-1 mb-4" style={{ background: "var(--c-bijimane)" }}></div>

      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <span
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={{ background: "var(--c-bijimane-soft)", color: "var(--c-bijimane-ink)" }}
        >
          {q.field} 問{fieldIndex}/{fieldTotal}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColor}`}>難易度{q.difficulty}（{difficultyLabel}）</span>
        <BookmarkButton exam="bijimane" questionSlug={slug} />
      </div>

      <section className="card p-5 mb-6" style={{ borderLeft: "4px solid var(--c-bijimane)" }}>
        <h2 className="text-sm font-bold mb-3" style={{ color: "var(--c-bijimane-ink)" }}>問題文</h2>
        <p className="text-sm text-[color:var(--c-text)] leading-relaxed whitespace-pre-wrap">{q.questionText}</p>
      </section>

      <AnswerReveal choices={q.choices} correctAnswer={q.correctAnswer} explanationHtml={q.content} exam="bijimane" questionSlug={slug} courseAd={<BijimaneCourseAd />} />

      <nav className="mt-8 flex justify-between items-center pt-4 border-t border-[color:var(--c-border)]">
        {prevQ ? (
          <a href={`/bijimane/q/${prevQ.slug}/`} className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-bijimane)]">← 問{idx}</a>
        ) : <span />}
        {fieldSlug && (
          <a href={`/bijimane/field/${fieldSlug}/`} className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-bijimane)]">
            {q.field}の一覧
          </a>
        )}
        {nextQ ? (
          <a href={`/bijimane/q/${nextQ.slug}/`} className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-bijimane)]">問{idx + 2} →</a>
        ) : <span />}
      </nav>
    </article>
  );
}
