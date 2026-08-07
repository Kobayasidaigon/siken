import { getAllMynumberSlugs, getMynumberQuestion, getMynumberQuestionsByField } from "@/lib/mynumber-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AnswerReveal from "@/app/q/[slug]/AnswerReveal";
import BookmarkButton from "@/app/q/[slug]/BookmarkButton";
import MynumberCourseAd from "@/components/MynumberCourseAd";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/page-metadata";
import { quizJsonLd, breadcrumbJsonLd, questionPageTitle, questionPageDescription } from "@/lib/quiz-jsonld";

const fieldSlugMap: Record<string, string> = {
  "番号法の概要": "outline",
  "個人番号カード・利用": "card",
  "特定個人情報保護": "protection",
  "事業者の取扱い": "business",
  "法人番号・罰則・実務": "practice",
};

export async function generateStaticParams() {
  return getAllMynumberSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const q = await getMynumberQuestion(slug);
  if (!q) return {};
  return pageMetadata({
    path: `/mynumber/q/${slug}/`,
    title: questionPageTitle(q.title, "マイナンバー実務検定3級"),
    description: questionPageDescription(q.description, q.questionText),
  });
}

export default async function MynumberQuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = await getMynumberQuestion(slug);
  if (!q) notFound();

  const fieldQuestions = await getMynumberQuestionsByField(q.field);
  const idx = fieldQuestions.findIndex((x) => x.slug === slug);
  const fieldIndex = idx + 1;
  const fieldTotal = fieldQuestions.length;
  const prevQ = idx > 0 ? fieldQuestions[idx - 1] : null;
  const nextQ = idx < fieldQuestions.length - 1 ? fieldQuestions[idx + 1] : null;
  const fieldSlug = fieldSlugMap[q.field] || "";

  const difficultyLabel = { A: "易しい", B: "標準", C: "難しい" }[q.difficulty];
  const difficultyColor = { A: "bg-green-100 text-green-800", B: "bg-amber-100 text-amber-800", C: "bg-red-100 text-red-800" }[q.difficulty];

  const jsonLd = [
    quizJsonLd({ q, examName: "マイナンバー実務検定3級", path: `/mynumber/q/${slug}/` }),
    breadcrumbJsonLd([
      { name: "ホーム", path: "/" },
      { name: "マイナンバー実務検定3級", path: "/mynumber/" },
      ...(fieldSlug ? [{ name: q.field, path: `/mynumber/field/${fieldSlug}/` }] : []),
      { name: `問${fieldIndex}`, path: `/mynumber/q/${slug}/` },
    ]),
  ];

  return (
    <article className="theme-pii pb-16">
      <JsonLd data={jsonLd} />

      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex flex-wrap gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/mynumber/">マイナンバー実務検定3級</a><span>/</span>
        {fieldSlug && <><a href={`/mynumber/field/${fieldSlug}/`}>{q.field}</a><span>/</span></>}
        <span className="text-[color:var(--c-ink)]">問{fieldIndex}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-3 leading-tight font-serif">{q.title}</h1>
      <div className="w-12 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>

      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: "var(--c-pii-soft)", color: "var(--c-pii-ink)" }}>
          {q.field} 問{fieldIndex}/{fieldTotal}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColor}`}>難易度{q.difficulty}（{difficultyLabel}）</span>
        <BookmarkButton exam="mynumber" questionSlug={slug} />
      </div>

      <section className="card p-5 mb-6" style={{ borderLeft: "4px solid var(--c-pii)" }}>
        <h2 className="text-sm font-bold mb-3" style={{ color: "var(--c-pii-ink)" }}>問題文</h2>
        <p className="text-sm text-[color:var(--c-text)] leading-relaxed whitespace-pre-wrap">{q.questionText}</p>
      </section>

      <AnswerReveal nextHref={nextQ ? `/mynumber/q/${nextQ.slug}/` : undefined} nextLabel={nextQ ? `次の問題（問${idx + 2}）へ` : undefined} choices={q.choices} correctAnswer={q.correctAnswer} explanationHtml={q.content} exam="mynumber" questionSlug={slug} courseAd={<MynumberCourseAd />} />

      <nav className="mt-8 flex justify-between items-center pt-4 border-t border-[color:var(--c-border)]">
        {prevQ ? (
          <a href={`/mynumber/q/${prevQ.slug}/`} className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-pii)]">← 問{idx}</a>
        ) : <span />}
        {fieldSlug && (
          <a href={`/mynumber/field/${fieldSlug}/`} className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-pii)]">
            {q.field}の一覧
          </a>
        )}
        {nextQ ? (
          <a href={`/mynumber/q/${nextQ.slug}/`} className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-pii)]">問{idx + 2} →</a>
        ) : <span />}
      </nav>
    </article>
  );
}
