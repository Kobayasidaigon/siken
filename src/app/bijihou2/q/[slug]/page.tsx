import { getAllBijihou2Slugs, getBijihou2Question, getBijihou2QuestionsByField } from "@/lib/bijihou2-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AnswerReveal from "@/app/q/[slug]/AnswerReveal";
import BookmarkButton from "@/app/q/[slug]/BookmarkButton";
import Bijihou2CourseAd from "@/components/Bijihou2CourseAd";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/page-metadata";
import { quizJsonLd, breadcrumbJsonLd, questionPageTitle, questionPageDescription } from "@/lib/quiz-jsonld";

const fieldSlugMap: Record<string, string> = {
  "企業取引・契約の法務": "torihiki",
  "企業財産の管理と法務": "zaisan",
  "企業間取引の法規制": "kigyoukan",
  "消費者取引と広告・表示の法規制": "shouhisha",
  "情報の管理・活用とデジタル社会": "jouhou",
  "金融・証券業等に関する法規制": "kinyuu",
  "債権の担保と回収": "saiken",
  "倒産処理と紛争の予防・解決": "tousan",
  "株式会社の組織と運営": "kaisya",
  "企業と従業員・地域社会・国際法務": "juugyouin",
};

export async function generateStaticParams() {
  return getAllBijihou2Slugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const q = await getBijihou2Question(slug);
  if (!q) return {};
  return pageMetadata({
    path: `/bijihou2/q/${slug}/`,
    title: questionPageTitle(q.title, "ビジネス実務法務検定2級"),
    description: questionPageDescription(q.description, q.questionText),
  });
}

export default async function Bijihou2QuestionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = await getBijihou2Question(slug);
  if (!q) notFound();

  const fieldQuestions = await getBijihou2QuestionsByField(q.field);
  const idx = fieldQuestions.findIndex((x) => x.slug === slug);
  const fieldIndex = idx + 1;
  const fieldTotal = fieldQuestions.length;
  const prevQ = idx > 0 ? fieldQuestions[idx - 1] : null;
  const nextQ = idx < fieldQuestions.length - 1 ? fieldQuestions[idx + 1] : null;
  const fieldSlug = fieldSlugMap[q.field] || "";

  const difficultyLabel = { A: "易しい", B: "標準", C: "難しい" }[q.difficulty];
  const difficultyColor = { A: "bg-green-100 text-green-800", B: "bg-amber-100 text-amber-800", C: "bg-red-100 text-red-800" }[q.difficulty];

  const jsonLd = [
    quizJsonLd({ q, examName: "ビジネス実務法務検定2級", path: `/bijihou2/q/${slug}/` }),
    breadcrumbJsonLd([
      { name: "ホーム", path: "/" },
      { name: "ビジネス実務法務検定2級", path: "/bijihou2/" },
      ...(fieldSlug ? [{ name: q.field, path: `/bijihou2/field/${fieldSlug}/` }] : []),
      { name: `問${fieldIndex}`, path: `/bijihou2/q/${slug}/` },
    ]),
  ];

  return (
    <article className="theme-kashikin pb-16">
      <JsonLd data={jsonLd} />

      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex flex-wrap gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/bijihou2/">ビジネス実務法務検定2級</a><span>/</span>
        {fieldSlug && <><a href={`/bijihou2/field/${fieldSlug}/`}>{q.field}</a><span>/</span></>}
        <span className="text-[color:var(--c-ink)]">問{fieldIndex}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-3 leading-tight font-serif">{q.title}</h1>
      <div className="w-12 h-1 mb-4" style={{ background: "var(--c-kashikin)" }}></div>

      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: "var(--c-kashikin-soft)", color: "var(--c-kashikin-ink)" }}>
          {q.field} 問{fieldIndex}/{fieldTotal}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColor}`}>難易度{q.difficulty}（{difficultyLabel}）</span>
        <BookmarkButton exam="bijihou2" questionSlug={slug} />
      </div>

      <section className="card p-5 mb-6" style={{ borderLeft: "4px solid var(--c-kashikin)" }}>
        <h2 className="text-sm font-bold mb-3" style={{ color: "var(--c-kashikin-ink)" }}>問題文</h2>
        <p className="text-sm text-[color:var(--c-text)] leading-relaxed whitespace-pre-wrap">{q.questionText}</p>
      </section>

      <AnswerReveal nextHref={nextQ ? `/bijihou2/q/${nextQ.slug}/` : undefined} nextLabel={nextQ ? `次の問題（問${idx + 2}）へ` : undefined} choices={q.choices} correctAnswer={q.correctAnswer} explanationHtml={q.content} exam="bijihou2" questionSlug={slug} courseAd={<Bijihou2CourseAd />} />

      <nav className="mt-8 flex justify-between items-center pt-4 border-t border-[color:var(--c-border)]">
        {prevQ ? (
          <a href={`/bijihou2/q/${prevQ.slug}/`} className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-kashikin)]">← 問{idx}</a>
        ) : <span />}
        {fieldSlug && (
          <a href={`/bijihou2/field/${fieldSlug}/`} className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-kashikin)]">
            {q.field}の一覧
          </a>
        )}
        {nextQ ? (
          <a href={`/bijihou2/q/${nextQ.slug}/`} className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-kashikin)]">問{idx + 2} →</a>
        ) : <span />}
      </nav>
    </article>
  );
}
