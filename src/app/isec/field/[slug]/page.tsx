import SiteLink from "@/components/SiteLink";
import { getIsecQuestionsByField } from "@/lib/isec-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { IsecQuestionData } from "@/lib/isec-questions";
import { pageMetadata } from "@/lib/page-metadata";
import FieldGuide from "@/components/FieldGuide";
import { hasFieldGuide } from "@/lib/field-guides";
import { ISEC_FIELDS, isecFieldBySlug } from "@/lib/isec-fields";
import MedalMark, { MedalLegend } from "@/components/MedalMark";

export async function generateStaticParams() {
  return ISEC_FIELDS.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const field = isecFieldBySlug(slug);
  if (!field) return { title: "Not Found" };
  const guide = hasFieldGuide("isec", slug);
  return pageMetadata({
    path: `/isec/field/${slug}/`,
    title: `情報・サイバーセキュリティ管理士｜${field.name} 練習問題`,
    description: field.outOfScope
      ? `情報・サイバーセキュリティ管理士の参考問題「${field.name}」。2026年2月の試験から管理士の出題範囲外になった旧課題Ⅳの分野で、サイバー攻撃の仕組みを理解する土台として残しているオリジナル問題と解説です。`
      : `情報・サイバーセキュリティ管理士認定試験対策。${field.task}「${field.name}」の${guide ? "要点のまとめと、" : ""}オリジナル練習問題の一覧。1問ずつ解いて、答えと解説を確認できます。`,
    // 要点の本文(src/content/field-guides/)が無い分野ページは、問題へのリンク一覧だけなので検索に出さない(2026-11-10)
    noindex: !guide,
  });
}

function QuestionCard({ q, index }: { q: IsecQuestionData; index: number }) {
  const diffColor = {
    A: "bg-green-100 text-green-800",
    B: "bg-amber-100 text-amber-800",
    C: "bg-red-100 text-red-800",
  }[q.difficulty];
  return (
    <SiteLink
      href={`/isec/q/${q.slug}/`}
      className="card p-4 flex justify-between items-center no-underline group"
      style={{ borderLeft: "3px solid var(--c-pii)" }}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{ background: "var(--c-pii-soft)", color: "var(--c-pii-ink)" }}
          >
            問{index}
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${diffColor}`}>{q.difficulty}</span>
        </div>
        <p className="text-sm text-[color:var(--c-text)] line-clamp-1">{q.questionText.slice(0, 60)}...</p>
      </div>
      <MedalMark exam="isec" slug={q.slug} />
      <svg
        className="w-4 h-4 text-[color:var(--c-text-sub)] flex-shrink-0 ml-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </SiteLink>
  );
}

export default async function IsecFieldPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const field = isecFieldBySlug(slug);
  if (!field) notFound();

  const questions = await getIsecQuestionsByField(field.name);
  const diffCounts = {
    A: questions.filter((q) => q.difficulty === "A").length,
    B: questions.filter((q) => q.difficulty === "B").length,
    C: questions.filter((q) => q.difficulty === "C").length,
  };

  return (
    <div className="theme-pii pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <SiteLink href="/">ホーム</SiteLink>
        <span>/</span>
        <SiteLink href="/isec/">情報・サイバーセキュリティ管理士</SiteLink>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">{field.name}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">{field.name}</h1>
      <div className="w-12 h-1 mb-3" style={{ background: "var(--c-pii)" }}></div>
      {field.outOfScope ? (
        <p className="text-xs text-[color:var(--c-text-sub)] mb-2 leading-relaxed">
          旧課題Ⅳ「コンピュータの一般知識」の分野です。2026年2月の試験から管理士の出題範囲は課題Ⅰ〜Ⅲになり、この分野は
          <SiteLink href="/isf/" className="underline hover:no-underline">
            情報・サイバーセキュリティ初級
          </SiteLink>
          だけで出題されます。サイバー攻撃の仕組みを理解する土台として、問題は参考に残しています（模擬試験・本番形式テストには出題しません）。
        </p>
      ) : (
        <p className="text-xs text-[color:var(--c-text-sub)] mb-2">本試験の{field.task}に対応する分野です。</p>
      )}
      <p className="text-sm text-[color:var(--c-text-sub)] mb-6 leading-relaxed">{field.desc}</p>
      <FieldGuide exam="isec" slug={slug} />

      <div className="grid grid-cols-4 gap-2 mb-8">
        <div className="card p-3 text-center">
          <p className="text-lg font-bold font-serif" style={{ color: "var(--c-pii)" }}>
            {questions.length}
          </p>
          <p className="text-xs text-[color:var(--c-text-sub)] mt-1">全問</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-green-700 font-serif">{diffCounts.A}</p>
          <p className="text-xs text-[color:var(--c-text-sub)] mt-1">基礎 A</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-amber-700 font-serif">{diffCounts.B}</p>
          <p className="text-xs text-[color:var(--c-text-sub)] mt-1">標準 B</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-red-700 font-serif">{diffCounts.C}</p>
          <p className="text-xs text-[color:var(--c-text-sub)] mt-1">応用 C</p>
        </div>
      </div>

      <MedalLegend />
      <div className="space-y-2">
        {questions.map((q, i) => (
          <QuestionCard key={q.slug} q={q} index={i + 1} />
        ))}
      </div>
    </div>
  );
}
