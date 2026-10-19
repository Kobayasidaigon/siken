import { getAllHoikushiSlugs, getHoikushiQuestion, getHoikushiQuestionsByField } from "@/lib/hoikushi-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AnswerReveal from "@/app/q/[slug]/AnswerReveal";
import BookmarkButton from "@/app/q/[slug]/BookmarkButton";
import HoikushiCourseAd from "@/components/HoikushiCourseAd";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/page-metadata";
import { quizJsonLd, breadcrumbJsonLd, questionPageTitle, questionPageDescription } from "@/lib/quiz-jsonld";
import { HOIKUSHI_FIELD_SLUG_BY_NAME } from "@/lib/hoikushi-fields";

const EXAM_NAME = "保育士試験（筆記）";

export async function generateStaticParams() {
  return getAllHoikushiSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const q = await getHoikushiQuestion(slug);
  if (!q) return {};
  return pageMetadata({
    path: `/hoikushi/q/${slug}/`,
    title: questionPageTitle(q.title, EXAM_NAME),
    description: questionPageDescription(q.description, q.questionText),
    // 問題ページは検索の入口にしない(資格トップ・分野・コラムに寄せる)。経緯は CHANGELOG 2026-09-25
    noindex: true,
  });
}

export default async function HoikushiQuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = await getHoikushiQuestion(slug);
  if (!q) notFound();

  const fieldQuestions = await getHoikushiQuestionsByField(q.field);
  const idx = fieldQuestions.findIndex((x) => x.slug === slug);
  const fieldIndex = idx + 1;
  const fieldTotal = fieldQuestions.length;
  const prevQ = idx > 0 ? fieldQuestions[idx - 1] : null;
  const nextQ = idx < fieldQuestions.length - 1 ? fieldQuestions[idx + 1] : null;
  const fieldSlug = HOIKUSHI_FIELD_SLUG_BY_NAME[q.field] || "";

  const difficultyLabel = { A: "易しい", B: "標準", C: "難しい" }[q.difficulty];
  const difficultyColor = {
    A: "bg-green-100 text-green-800",
    B: "bg-amber-100 text-amber-800",
    C: "bg-red-100 text-red-800",
  }[q.difficulty];

  const jsonLd = [
    quizJsonLd({ q, examName: EXAM_NAME, path: `/hoikushi/q/${slug}/` }),
    breadcrumbJsonLd([
      { name: "ホーム", path: "/" },
      { name: EXAM_NAME, path: "/hoikushi/" },
      ...(fieldSlug ? [{ name: q.field, path: `/hoikushi/field/${fieldSlug}/` }] : []),
      { name: `問${fieldIndex}`, path: `/hoikushi/q/${slug}/` },
    ]),
  ];

  return (
    <article className="theme-pii pb-16">
      <JsonLd data={jsonLd} />

      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex flex-wrap gap-1">
        <a href="/">ホーム</a>
        <span>/</span>
        <a href="/hoikushi/">{EXAM_NAME}</a>
        <span>/</span>
        {fieldSlug && (
          <>
            <a href={`/hoikushi/field/${fieldSlug}/`}>{q.field}</a>
            <span>/</span>
          </>
        )}
        <span className="text-[color:var(--c-ink)]">問{fieldIndex}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-3 leading-tight font-serif">{q.title}</h1>
      <div className="w-12 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>

      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <span
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={{ background: "var(--c-pii-soft)", color: "var(--c-pii-ink)" }}
        >
          {q.field} 問{fieldIndex}/{fieldTotal}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColor}`}>
          難易度{q.difficulty}（{difficultyLabel}）
        </span>
        <BookmarkButton exam="hoikushi" questionSlug={slug} />
      </div>

      <section className="card p-5 mb-6" style={{ borderLeft: "4px solid var(--c-pii)" }}>
        <h2 className="text-sm font-bold mb-3" style={{ color: "var(--c-pii-ink)" }}>
          問題文
        </h2>
        <p className="text-sm text-[color:var(--c-text)] leading-relaxed whitespace-pre-wrap">{q.questionText}</p>
      </section>

      <AnswerReveal
        nextHref={nextQ ? `/hoikushi/q/${nextQ.slug}/` : undefined}
        nextLabel={nextQ ? `次の問題（問${idx + 2}）へ` : undefined}
        choices={q.choices}
        correctAnswer={q.correctAnswer}
        explanationHtml={q.content}
        exam="hoikushi"
        questionSlug={slug}
        courseAd={<HoikushiCourseAd />}
      />

      <nav className="mt-8 flex justify-between items-center pt-4 border-t border-[color:var(--c-border)]">
        {prevQ ? (
          <a
            href={`/hoikushi/q/${prevQ.slug}/`}
            className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-pii)]"
          >
            ← 問{idx}
          </a>
        ) : (
          <span />
        )}
        {fieldSlug && (
          <a
            href={`/hoikushi/field/${fieldSlug}/`}
            className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-pii)]"
          >
            {q.field}の一覧
          </a>
        )}
        {nextQ ? (
          <a
            href={`/hoikushi/q/${nextQ.slug}/`}
            className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-pii)]"
          >
            問{idx + 2} →
          </a>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
