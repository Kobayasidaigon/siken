import { getQuestionsByField } from "@/lib/questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const fieldMap: Record<string, { name: string; desc: string }> = {
  kashikingyouhou: { name: "貸金業法", desc: "登録制度、業務規制、帳簿管理、取立て行為の規制、書面交付義務、総量規制など" },
  risoku: { name: "利息制限法・出資法", desc: "上限金利、みなし利息、グレーゾーン金利、遅延損害金、出資法の罰則など" },
  minpou: { name: "民法・民事訴訟法", desc: "契約、意思表示、代理、保証、消滅時効、不法行為、担保物権、相続など" },
  hogo: { name: "資金需要者等の保護", desc: "個人情報保護法、消費者契約法、景品表示法、犯罪収益移転防止法、金融ADRなど" },
};

export async function generateStaticParams() {
  return Object.keys(fieldMap).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) return { title: "Not Found" };
  return {
    title: `${field.name} 練習問題一覧`,
    description: `貸金業務取扱主任者試験対策。${field.name}分野のオリジナル練習問題と詳細解説。${field.desc}。`,
  };
}

export default async function FieldPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) notFound();

  const questions = await getQuestionsByField(field.name);
  questions.sort((a, b) => a.questionNumber - b.questionNumber);

  const diffCounts = {
    A: questions.filter(q => q.difficulty === "A").length,
    B: questions.filter(q => q.difficulty === "B").length,
    C: questions.filter(q => q.difficulty === "C").length,
  };

  return (
    <div className="pb-16">
      <nav className="breadcrumb text-xs text-slate-400 mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/field/">分野別</a><span>/</span>
        <span className="text-slate-600">{field.name}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">{field.name}</h1>
      <p className="text-sm text-slate-500 mb-4">{field.desc}</p>

      {/* Stats */}
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

      {/* Question List */}
      <div className="space-y-2">
        {questions.map((q) => {
          const diffColor = { A: "bg-green-100 text-green-700", B: "bg-amber-100 text-amber-700", C: "bg-red-100 text-red-700" }[q.difficulty];
          return (
            <a
              key={q.slug}
              href={`/q/${q.slug}/`}
              className="card p-4 flex justify-between items-center hover:shadow-md transition-shadow no-underline group"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    問{q.questionNumber}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${diffColor}`}>
                    {q.difficulty}
                  </span>
                </div>
                <p className="text-sm text-slate-700 group-hover:text-blue-600 line-clamp-1">
                  {q.questionText.slice(0, 60)}...
                </p>
              </div>
              <svg className="w-4 h-4 text-slate-300 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          );
        })}
      </div>
    </div>
  );
}
