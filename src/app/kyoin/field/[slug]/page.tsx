import { getKyoinQuestionsByField } from "@/lib/kyoin-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { KyoinQuestionData } from "@/lib/kyoin-questions";
import { pageMetadata } from "@/lib/page-metadata";
import KyoinCourseAd from "@/components/KyoinCourseAd";
import { KYOIN_FIELDS, kyoinFieldBySlug } from "@/lib/kyoin-fields";

export async function generateStaticParams() {
  return KYOIN_FIELDS.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const field = kyoinFieldBySlug(slug);
  if (!field) return { title: "Not Found" };
  return pageMetadata({
    path: `/kyoin/field/${slug}/`,
    title: `教員採用試験｜${field.name} 練習問題`,
    description: `教員採用試験の${field.task}対策。「${field.name}」のオリジナル練習問題と詳細解説。自治体をまたいで共通する論点だけを扱っており、志望自治体を問わず使えます。`,
  });
}

function QuestionCard({ q, index }: { q: KyoinQuestionData; index: number }) {
  const diffColor = {
    A: "bg-green-100 text-green-800",
    B: "bg-amber-100 text-amber-800",
    C: "bg-red-100 text-red-800",
  }[q.difficulty];
  return (
    <a
      href={`/kyoin/q/${q.slug}/`}
      className="card p-4 flex justify-between items-center no-underline group"
      style={{ borderLeft: "3px solid var(--c-fukushi)" }}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{ background: "var(--c-fukushi-soft)", color: "var(--c-fukushi-ink)" }}
          >
            問{index}
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${diffColor}`}>{q.difficulty}</span>
        </div>
        <p className="text-sm text-[color:var(--c-text)] line-clamp-1">{q.questionText.slice(0, 60)}...</p>
      </div>
      <svg
        className="w-4 h-4 text-[color:var(--c-text-sub)] flex-shrink-0 ml-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}

export default async function KyoinFieldPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const field = kyoinFieldBySlug(slug);
  if (!field) notFound();

  const questions = await getKyoinQuestionsByField(field.name);
  const diffCounts = {
    A: questions.filter((q) => q.difficulty === "A").length,
    B: questions.filter((q) => q.difficulty === "B").length,
    C: questions.filter((q) => q.difficulty === "C").length,
  };

  return (
    <div className="theme-fukushi pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a>
        <span>/</span>
        <a href="/kyoin/">教員採用試験</a>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">{field.name}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">{field.name}</h1>
      <div className="w-12 h-1 mb-3" style={{ background: "var(--c-fukushi)" }}></div>
      <p className="text-xs text-[color:var(--c-text-sub)] mb-2">本試験の{field.task}に含まれる分野です。</p>
      <p className="text-sm text-[color:var(--c-text-sub)] mb-6 leading-relaxed">{field.desc}</p>

      <div className="grid grid-cols-4 gap-2 mb-8">
        <div className="card p-3 text-center">
          <p className="text-lg font-bold font-serif" style={{ color: "var(--c-fukushi)" }}>
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

      <div className="space-y-2">
        {questions.map((q, i) => (
          <QuestionCard key={q.slug} q={q} index={i + 1} />
        ))}
      </div>

      <KyoinCourseAd headline={`「${field.name}」でつまずくなら`} />
    </div>
  );
}
