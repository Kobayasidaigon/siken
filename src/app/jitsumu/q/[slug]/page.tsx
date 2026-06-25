import { getAllJitsumuSlugs, getJitsumuQuestion, getJitsumuQuestionsByField } from "@/lib/jitsumu-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AnswerReveal from "@/app/q/[slug]/AnswerReveal";
import BookmarkButton from "@/app/q/[slug]/BookmarkButton";
import JitsumuCourseAd from "@/components/JitsumuCourseAd";
import { pageMetadata } from "@/lib/page-metadata";

const fieldSlugMap: Record<string, string> = {
  "個人情報保護法の基礎": "basic",
  "取得・利用": "acquisition",
  "安全管理・第三者提供": "security",
  "本人の権利・漏えい対応": "rights",
  "実務・関連法": "practice",
};

export async function generateStaticParams() {
  return getAllJitsumuSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const q = await getJitsumuQuestion(slug);
  if (!q) return {};
  return pageMetadata({
    path: `/jitsumu/q/${slug}/`,
    title: q.title,
    description: q.description,
  });
}

export default async function JitsumuQuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = await getJitsumuQuestion(slug);
  if (!q) notFound();

  const fieldQuestions = await getJitsumuQuestionsByField(q.field);
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
    about: { "@type": "Thing", name: "個人情報保護実務検定" },
    educationalLevel: q.difficulty === "A" ? "beginner" : q.difficulty === "B" ? "intermediate" : "advanced",
    hasPart: [{
      "@type": "Question",
      name: q.questionText,
      acceptedAnswer: { "@type": "Answer", text: q.choices[q.correctAnswer - 1] },
      suggestedAnswer: q.choices.filter((_, i) => i !== q.correctAnswer - 1).map((c) => ({ "@type": "Answer", text: c })),
    }],
  };

  return (
    <article className="theme-pii pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex flex-wrap gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/jitsumu/">個人情報保護実務検定</a><span>/</span>
        {fieldSlug && <><a href={`/jitsumu/field/${fieldSlug}/`}>{q.field}</a><span>/</span></>}
        <span className="text-[color:var(--c-ink)]">問{fieldIndex}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-3 leading-tight font-serif">{q.title}</h1>
      <div className="w-12 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>

      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: "var(--c-pii-soft)", color: "var(--c-pii-ink)" }}>
          {q.field} 問{fieldIndex}/{fieldTotal}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColor}`}>難易度{q.difficulty}（{difficultyLabel}）</span>
        <BookmarkButton exam="jitsumu" questionSlug={slug} />
      </div>

      <section className="card p-5 mb-6" style={{ borderLeft: "4px solid var(--c-pii)" }}>
        <h2 className="text-sm font-bold mb-3" style={{ color: "var(--c-pii-ink)" }}>問題文</h2>
        <p className="text-sm text-[color:var(--c-text)] leading-relaxed whitespace-pre-wrap">{q.questionText}</p>
      </section>

      <AnswerReveal choices={q.choices} correctAnswer={q.correctAnswer} explanationHtml={q.content} exam="jitsumu" questionSlug={slug} courseAd={<JitsumuCourseAd />} />

      <nav className="mt-8 flex justify-between items-center pt-4 border-t border-[color:var(--c-border)]">
        {prevQ ? (<a href={`/jitsumu/q/${prevQ.slug}/`} className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-pii)]">← 問{idx}</a>) : <span />}
        {fieldSlug && (<a href={`/jitsumu/field/${fieldSlug}/`} className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-pii)]">{q.field}の一覧</a>)}
        {nextQ ? (<a href={`/jitsumu/q/${nextQ.slug}/`} className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-pii)]">問{idx + 2} →</a>) : <span />}
      </nav>
    </article>
  );
}
