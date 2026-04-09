import { getAllChizaiQuestions, getChizaiQuestionsByField } from "@/lib/chizai-questions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "知的財産管理技能検定3級 試験対策｜オリジナル200問を無料で",
  description: "知的財産管理技能検定3級のオリジナル練習問題200問を詳細解説。特許法・著作権法・意匠法・商標法・不正競争防止法・国際条約を網羅。",
};

const fields = [
  { name: "特許法", slug: "patent" },
  { name: "著作権法", slug: "copyright" },
  { name: "意匠法", slug: "design" },
  { name: "商標法", slug: "trademark" },
  { name: "不正競争防止法", slug: "unfair" },
  { name: "関連法規", slug: "related" },
  { name: "実用新案法・種苗法", slug: "utility" },
  { name: "国際条約", slug: "treaty" },
  { name: "知財実務", slug: "practice" },
];

export default async function ChizaiPage() {
  const allQuestions = await getAllChizaiQuestions();

  const fieldCounts = await Promise.all(
    fields.map(async (f) => {
      const qs = await getChizaiQuestionsByField(f.name);
      return qs.length;
    })
  );

  return (
    <div className="space-y-10 pb-16">
      <section className="py-6">
        <nav className="text-xs text-slate-400 mb-4"><a href="/">ホーム</a> / <span className="text-slate-600">知的財産管理技能検定3級</span></nav>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">知的財産管理技能検定3級 試験対策</h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
          全{allQuestions.length}問のオリジナル練習問題を収録。
          特許法・著作権法・意匠法・商標法・不正競争防止法・国際条約を網羅しています。
        </p>
        <p className="text-xs text-slate-400 mt-2">次回試験: 2026年7月12日（日）</p>
        <div className="mt-4">
          <a href="/chizai/q/chizai-001/" className="text-sm text-blue-700 font-medium no-underline hover:underline">問題を解き始める →</a>
        </div>
      </section>

      <section>
        <h2 className="text-base font-bold text-slate-800 mb-4">分野から選ぶ</h2>
        <div className="space-y-3">
          {fields.map((f, i) => (
            <a key={f.slug} href={`/chizai/field/${f.slug}/`} className="card p-4 hover:shadow-md transition-shadow no-underline group flex items-center justify-between block">
              <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600">{f.name}</p>
              <span className="text-xs text-slate-400">{fieldCounts[i]}問</span>
            </a>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-base font-bold text-slate-800 mb-3">試験の概要</h2>
        <div className="text-sm text-slate-600 space-y-1">
          <p>試験形式: 学科30問（3肢択一・45分）+ 実技30問（3肢択一・45分）</p>
          <p>合格基準: 学科・実技ともに70%以上</p>
          <p>受験料: 学科6,100円 + 実技6,100円（税込）</p>
          <p>実施機関: 知的財産教育協会</p>
        </div>
      </section>
    </div>
  );
}
