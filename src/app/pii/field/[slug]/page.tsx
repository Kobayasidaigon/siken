import { getPiiQuestionsByField } from "@/lib/pii-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { PiiQuestionData } from "@/lib/pii-questions";

const fieldMap: Record<string, { name: string; desc: string }> = {
  "hogo-law": { name: "個人情報保護法", desc: "個人情報の定義、利用目的、安全管理措置、第三者提供、開示請求、仮名加工情報、匿名加工情報など" },
  "mynumber": { name: "マイナンバー法", desc: "個人番号の定義、特定個人情報の安全管理措置、利用範囲（社会保障・税・災害対策）など" },
  "security": { name: "情報セキュリティ", desc: "脅威と対策、組織的・人的・物理的セキュリティ、暗号化、ネットワーク、クラウド・IoTなど" },
};

export async function generateStaticParams() {
  return Object.keys(fieldMap).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) return { title: "Not Found" };
  return {
    title: `個人情報保護士｜${field.name} 練習問題`,
    description: `個人情報保護士試験対策。${field.name}分野のオリジナル練習問題と詳細解説。各問に根拠法令を含む解説付きで効率的に学習できます。`,
  };
}

function QuestionCard({ q }: { q: PiiQuestionData }) {
  const diffColor = { A: "bg-green-100 text-green-700", B: "bg-amber-100 text-amber-700", C: "bg-red-100 text-red-700" }[q.difficulty];
  return (
    <a href={`/pii/q/${q.slug}/`} className="card p-4 flex justify-between items-center hover:shadow-md transition-shadow no-underline group">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">問{q.questionNumber}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${diffColor}`}>{q.difficulty}</span>
        </div>
        <p className="text-sm text-slate-700 group-hover:text-blue-600 line-clamp-1">{q.questionText.slice(0, 60)}...</p>
      </div>
      <svg className="w-4 h-4 text-slate-300 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}

export default async function PiiFieldPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) notFound();

  const questions = await getPiiQuestionsByField(field.name);
  const diffCounts = {
    A: questions.filter(q => q.difficulty === "A").length,
    B: questions.filter(q => q.difficulty === "B").length,
    C: questions.filter(q => q.difficulty === "C").length,
  };

  return (
    <div className="pb-16">
      <nav className="breadcrumb text-xs text-slate-400 mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/pii/">個人情報保護士</a><span>/</span>
        <span className="text-slate-600">{field.name}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">{field.name}</h1>
      <p className="text-sm text-slate-500 mb-4">{field.desc}</p>

      <div className="grid grid-cols-4 gap-2 mb-6">
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-blue-700">{questions.length}</p>
          <p className="text-xs text-slate-400">全問</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-green-600">{diffCounts.A}</p>
          <p className="text-xs text-slate-400">基礎 A</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-amber-600">{diffCounts.B}</p>
          <p className="text-xs text-slate-400">標準 B</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-red-600">{diffCounts.C}</p>
          <p className="text-xs text-slate-400">応用 C</p>
        </div>
      </div>

      <div className="space-y-2">
        {questions.map((q) => <QuestionCard key={q.slug} q={q} />)}
      </div>
    </div>
  );
}
