import { getChizaiQuestionsByField } from "@/lib/chizai-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ChizaiQuestionData } from "@/lib/chizai-questions";

const fieldMap: Record<string, { name: string; desc: string }> = {
  "patent": { name: "特許法", desc: "発明の定義、特許要件、出願手続、権利化、侵害と救済など" },
  "copyright": { name: "著作権法", desc: "著作物の定義、著作者の権利、保護期間、著作権の制限、著作隣接権など" },
  "design": { name: "意匠法", desc: "意匠の定義、登録要件、意匠権の範囲と存続期間、関連意匠など" },
  "trademark": { name: "商標法", desc: "商標の定義、登録要件、商標権の存続期間と更新、不使用取消審判など" },
  "unfair": { name: "不正競争防止法", desc: "不正競争の類型、営業秘密の保護、形態模倣、救済措置など" },
  "related": { name: "関連法規", desc: "独占禁止法、不公正な取引方法、ライセンス契約と独禁法の関係など" },
  "utility": { name: "実用新案法・種苗法", desc: "実用新案登録、技術評価書、品種登録、育成者権など" },
  "treaty": { name: "国際条約", desc: "パリ条約、PCT、マドリッド協定、TRIPS協定、ベルヌ条約など" },
  "practice": { name: "知財実務", desc: "ライセンス契約、職務発明、知財調査、出願戦略、知財管理など" },
};

export async function generateStaticParams() {
  return Object.keys(fieldMap).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) return { title: "Not Found" };
  return {
    title: `知的財産管理技能検定3級｜${field.name} 練習問題`,
    description: `知的財産管理技能検定3級試験対策。${field.name}分野のオリジナル練習問題と詳細解説。各問に根拠条文を含む解説付きで効率的に学習できます。`,
  };
}

function QuestionCard({ q }: { q: ChizaiQuestionData }) {
  const diffColor = { A: "bg-green-100 text-green-700", B: "bg-amber-100 text-amber-700", C: "bg-red-100 text-red-700" }[q.difficulty];
  return (
    <a href={`/chizai/q/${q.slug}/`} className="card p-4 flex justify-between items-center hover:shadow-md transition-shadow no-underline group">
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

export default async function ChizaiFieldPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) notFound();

  const questions = await getChizaiQuestionsByField(field.name);
  const diffCounts = {
    A: questions.filter(q => q.difficulty === "A").length,
    B: questions.filter(q => q.difficulty === "B").length,
    C: questions.filter(q => q.difficulty === "C").length,
  };

  return (
    <div className="pb-16">
      <nav className="breadcrumb text-xs text-slate-400 mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/chizai/">知的財産管理技能検定3級</a><span>/</span>
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
