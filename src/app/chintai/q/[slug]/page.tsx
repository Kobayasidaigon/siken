import { getAllChintaiSlugs, getChintaiQuestion, getChintaiQuestionsByField } from "@/lib/chintai-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AnswerReveal from "@/app/q/[slug]/AnswerReveal";
import BookmarkButton from "@/app/q/[slug]/BookmarkButton";
import ChintaiCourseAd from "@/components/ChintaiCourseAd";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/page-metadata";
import { quizJsonLd, breadcrumbJsonLd, questionPageTitle, questionPageDescription } from "@/lib/quiz-jsonld";

const fieldSlugMap: Record<string, string> = {
  "賃貸住宅管理業法と登録制度": "gyouhou",
  "管理受託契約": "jutaku",
  "サブリースと特定賃貸借契約": "sublease",
  "賃貸借契約と借地借家法": "keiyaku",
  "契約の終了・更新と原状回復": "shuuryou",
  "金銭の管理と会計": "kinsen",
  "建物の維持保全と設備": "setsubi",
  "入居者の募集と広告規制": "boshuu",
  "賃貸業への支援業務（税・保険・証券化）": "shien",
  "賃貸管理の意義と管理士の役割": "igi",
};

export async function generateStaticParams() {
  return getAllChintaiSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const q = await getChintaiQuestion(slug);
  if (!q) return {};
  return pageMetadata({
    path: `/chintai/q/${slug}/`,
    title: questionPageTitle(q.title, "賃貸不動産経営管理士"),
    description: questionPageDescription(q.description, q.questionText),
  });
}

export default async function ChintaiQuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = await getChintaiQuestion(slug);
  if (!q) notFound();

  const fieldQuestions = await getChintaiQuestionsByField(q.field);
  const idx = fieldQuestions.findIndex((x) => x.slug === slug);
  const fieldIndex = idx + 1;
  const fieldTotal = fieldQuestions.length;
  const prevQ = idx > 0 ? fieldQuestions[idx - 1] : null;
  const nextQ = idx < fieldQuestions.length - 1 ? fieldQuestions[idx + 1] : null;
  const fieldSlug = fieldSlugMap[q.field] || "";

  const difficultyLabel = { A: "易しい", B: "標準", C: "難しい" }[q.difficulty];
  const difficultyColor = { A: "bg-green-100 text-green-800", B: "bg-amber-100 text-amber-800", C: "bg-red-100 text-red-800" }[q.difficulty];

  const jsonLd = [
    quizJsonLd({ q, examName: "賃貸不動産経営管理士", path: `/chintai/q/${slug}/` }),
    breadcrumbJsonLd([
      { name: "ホーム", path: "/" },
      { name: "賃貸不動産経営管理士", path: "/chintai/" },
      ...(fieldSlug ? [{ name: q.field, path: `/chintai/field/${fieldSlug}/` }] : []),
      { name: `問${fieldIndex}`, path: `/chintai/q/${slug}/` },
    ]),
  ];

  return (
    <article className="theme-kashikin pb-16">
      <JsonLd data={jsonLd} />

      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex flex-wrap gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/chintai/">賃貸不動産経営管理士</a><span>/</span>
        {fieldSlug && <><a href={`/chintai/field/${fieldSlug}/`}>{q.field}</a><span>/</span></>}
        <span className="text-[color:var(--c-ink)]">問{fieldIndex}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-3 leading-tight font-serif">{q.title}</h1>
      <div className="w-12 h-1 mb-4" style={{ background: "var(--c-kashikin)" }}></div>

      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: "var(--c-kashikin-soft)", color: "var(--c-kashikin-ink)" }}>
          {q.field} 問{fieldIndex}/{fieldTotal}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColor}`}>難易度{q.difficulty}（{difficultyLabel}）</span>
        <BookmarkButton exam="chintai" questionSlug={slug} />
      </div>

      <section className="card p-5 mb-6" style={{ borderLeft: "4px solid var(--c-kashikin)" }}>
        <h2 className="text-sm font-bold mb-3" style={{ color: "var(--c-kashikin-ink)" }}>問題文</h2>
        <p className="text-sm text-[color:var(--c-text)] leading-relaxed whitespace-pre-wrap">{q.questionText}</p>
      </section>

      <AnswerReveal nextHref={nextQ ? `/chintai/q/${nextQ.slug}/` : undefined} nextLabel={nextQ ? `次の問題（問${idx + 2}）へ` : undefined} choices={q.choices} correctAnswer={q.correctAnswer} explanationHtml={q.content} exam="chintai" questionSlug={slug} courseAd={<ChintaiCourseAd />} />

      <nav className="mt-8 flex justify-between items-center pt-4 border-t border-[color:var(--c-border)]">
        {prevQ ? (
          <a href={`/chintai/q/${prevQ.slug}/`} className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-kashikin)]">← 問{idx}</a>
        ) : <span />}
        {fieldSlug && (
          <a href={`/chintai/field/${fieldSlug}/`} className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-kashikin)]">
            {q.field}の一覧
          </a>
        )}
        {nextQ ? (
          <a href={`/chintai/q/${nextQ.slug}/`} className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-kashikin)]">問{idx + 2} →</a>
        ) : <span />}
      </nav>
    </article>
  );
}
