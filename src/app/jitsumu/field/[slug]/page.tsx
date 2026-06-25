import { getJitsumuQuestionsByField } from "@/lib/jitsumu-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { JitsumuQuestionData } from "@/lib/jitsumu-questions";
import { pageMetadata } from "@/lib/page-metadata";
import JitsumuCourseAd from "@/components/JitsumuCourseAd";

const fieldMap: Record<string, { name: string; desc: string }> = {
  "basic": { name: "個人情報保護法の基礎", desc: "目的・定義、個人情報・個人データ・保有個人データの違い、要配慮個人情報、事業者の義務" },
  "acquisition": { name: "取得・利用", desc: "利用目的の特定・通知・公表、適正取得、利用目的による制限、不適正利用の禁止" },
  "security": { name: "安全管理・第三者提供", desc: "安全管理措置、従業者・委託先監督、第三者提供制限、外国移転、記録義務" },
  "rights": { name: "本人の権利・漏えい対応", desc: "開示・訂正・利用停止請求、漏えい等報告、仮名加工情報、匿名加工情報" },
  "practice": { name: "実務・関連法", desc: "苦情処理、個人情報保護委員会、認定団体、関連法規、実務上のトラブル対応" },
};

export async function generateStaticParams() {
  return Object.keys(fieldMap).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) return { title: "Not Found" };
  return pageMetadata({
    path: `/jitsumu/field/${slug}/`,
    title: `個人情報保護実務検定｜${field.name} 練習問題`,
    description: `個人情報保護実務検定試験対策。${field.name}分野のオリジナル練習問題と詳細解説。各問に根拠条文を含む解説付きで効率的に学習できます。`,
  });
}

function QuestionCard({ q, index }: { q: JitsumuQuestionData; index: number }) {
  const diffColor = { A: "bg-green-100 text-green-800", B: "bg-amber-100 text-amber-800", C: "bg-red-100 text-red-800" }[q.difficulty];
  return (
    <a href={`/jitsumu/q/${q.slug}/`} className="card p-4 flex justify-between items-center no-underline group" style={{ borderLeft: "3px solid var(--c-pii)" }}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "var(--c-pii-soft)", color: "var(--c-pii-ink)" }}>問{index}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${diffColor}`}>{q.difficulty}</span>
        </div>
        <p className="text-sm text-[color:var(--c-text)] line-clamp-1">{q.questionText.slice(0, 60)}...</p>
      </div>
      <svg className="w-4 h-4 text-[color:var(--c-text-sub)] flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}

export default async function JitsumuFieldPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) notFound();
  const questions = await getJitsumuQuestionsByField(field.name);
  const diffCounts = {
    A: questions.filter(q => q.difficulty === "A").length,
    B: questions.filter(q => q.difficulty === "B").length,
    C: questions.filter(q => q.difficulty === "C").length,
  };

  return (
    <div className="theme-pii pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/jitsumu/">個人情報保護実務検定</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">{field.name}</span>
      </nav>
      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">{field.name}</h1>
      <div className="w-12 h-1 mb-3" style={{ background: "var(--c-pii)" }}></div>
      <p className="text-sm text-[color:var(--c-text-sub)] mb-6 leading-relaxed">{field.desc}</p>
      <div className="grid grid-cols-4 gap-2 mb-8">
        <div className="card p-3 text-center"><p className="text-lg font-bold font-serif" style={{ color: "var(--c-pii)" }}>{questions.length}</p><p className="text-xs text-[color:var(--c-text-sub)] mt-1">全問</p></div>
        <div className="card p-3 text-center"><p className="text-lg font-bold text-green-700 font-serif">{diffCounts.A}</p><p className="text-xs text-[color:var(--c-text-sub)] mt-1">基礎 A</p></div>
        <div className="card p-3 text-center"><p className="text-lg font-bold text-amber-700 font-serif">{diffCounts.B}</p><p className="text-xs text-[color:var(--c-text-sub)] mt-1">標準 B</p></div>
        <div className="card p-3 text-center"><p className="text-lg font-bold text-red-700 font-serif">{diffCounts.C}</p><p className="text-xs text-[color:var(--c-text-sub)] mt-1">応用 C</p></div>
      </div>
      <div className="space-y-2">{questions.map((q, i) => <QuestionCard key={q.slug} q={q} index={i + 1} />)}</div>

      <JitsumuCourseAd headline={`「${field.name}」でつまずくなら`} />
    </div>
  );
}
