import { getAllQuestions } from "@/lib/questions";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "貸金業務取扱主任者 試験対策｜オリジナル504問を無料で",
  description: "貸金業務取扱主任者試験のオリジナル練習問題504問を詳細解説。分野別に整理し、合格に必要な知識をわかりやすく解説。",
};

export default async function KashikinPage() {
  const questions = await getAllQuestions();
  const columns = await getAllColumns();
  const totalQuestions = questions.length;

  return (
    <div className="space-y-10 pb-16">
      <section className="py-6">
        <nav className="text-xs text-slate-400 mb-4"><a href="/">ホーム</a> / <span className="text-slate-600">貸金業務取扱主任者</span></nav>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">貸金業務取扱主任者 試験対策</h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
          全{totalQuestions}問のオリジナル練習問題を収録。1問ごとに根拠条文を含む解説付き。
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="/exam/0/" className="text-sm text-blue-700 font-medium no-underline hover:underline">全問一覧を見る →</a>
          <a href="/field/" className="text-sm text-slate-500 no-underline hover:underline">分野別に選ぶ →</a>
        </div>
      </section>

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

      {columns.length > 0 && (
        <section className="border-t border-slate-200 pt-8">
          <h2 className="text-base font-bold text-slate-800 mb-4">コラム</h2>
          <div className="space-y-3">
            {columns.slice(0, 4).map((col) => (
              <a key={col.slug} href={`/column/${col.slug}/`} className="block text-sm text-slate-700 no-underline hover:text-blue-600">{col.title}</a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
