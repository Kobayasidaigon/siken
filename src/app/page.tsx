import { getAllQuestions } from "@/lib/questions";
import { getAllColumns } from "@/lib/columns";

export default async function Home() {
  const questions = await getAllQuestions();
  const columns = await getAllColumns();
  const totalQuestions = questions.length;

  return (
    <div className="space-y-10 pb-16">
      {/* Hero */}
      <section className="py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
          貸金業務取扱主任者 試験対策
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
          貸金業法・利息制限法・民法・資金需要者保護の4分野から、
          全{totalQuestions}問のオリジナル練習問題を収録しています。
          1問ごとに根拠条文を含む解説付き。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/exam/0/" className="text-sm text-blue-700 font-medium no-underline hover:underline">
            全問一覧を見る →
          </a>
          <a href="/field/" className="text-sm text-slate-500 no-underline hover:underline">
            分野別に選ぶ →
          </a>
        </div>
      </section>

      {/* Field List */}
      <section>
        <h2 className="text-base font-bold text-slate-800 mb-4">分野から選ぶ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: "貸金業法", slug: "kashikingyouhou", count: questions.filter(q => q.field === "貸金業法").length },
            { name: "利息制限法・出資法", slug: "risoku", count: questions.filter(q => q.field === "利息制限法・出資法").length },
            { name: "民法・民事訴訟法", slug: "minpou", count: questions.filter(q => q.field === "民法・民事訴訟法").length },
            { name: "資金需要者等の保護", slug: "hogo", count: questions.filter(q => q.field === "資金需要者等の保護").length },
          ].map((field) => (
            <a key={field.slug} href={`/field/${field.slug}/`} className="card p-4 hover:shadow-md transition-shadow no-underline group flex items-center justify-between">
              <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600">{field.name}</p>
              <span className="text-xs text-slate-400">{field.count}問</span>
            </a>
          ))}
        </div>
      </section>

      {/* Columns */}
      {columns.length > 0 && (
        <section className="border-t border-slate-200 pt-8">
          <h2 className="text-base font-bold text-slate-800 mb-4">コラム</h2>
          <div className="space-y-3">
            {columns.slice(0, 4).map((col) => (
              <a key={col.slug} href={`/column/${col.slug}/`} className="block text-sm text-slate-700 no-underline hover:text-blue-600">
                {col.title}
              </a>
            ))}
          </div>
          {columns.length > 4 && (
            <a href="/column/" className="text-sm text-blue-700 font-medium no-underline hover:underline mt-3 inline-block">
              コラム一覧を見る →
            </a>
          )}
        </section>
      )}

      {/* Guide link */}
      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-base font-bold text-slate-800 mb-2">学習ガイド</h2>
        <p className="text-sm text-slate-500 mb-3">
          試験の概要・出題傾向・おすすめの勉強法をまとめています。
        </p>
        <a href="/guide/" className="text-sm text-blue-700 font-medium no-underline hover:underline">
          学習ガイドを読む →
        </a>
      </section>

      {/* About */}
      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-base font-bold text-slate-800 mb-2">このサイトについて</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          最新の法令に基づいたオリジナル問題を、1問ずつ丁寧に解説しています。
          すべて無料です。
        </p>
        <a href="/about/" className="text-sm text-slate-500 mt-2 inline-block no-underline hover:underline">
          運営者情報 →
        </a>
      </section>
    </div>
  );
}
