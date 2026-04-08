import { getAllPiiQuestions, getPiiQuestionsByField } from "@/lib/pii-questions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "個人情報保護士 試験対策｜オリジナル300問を無料で",
  description: "個人情報保護士認定試験のオリジナル練習問題300問を詳細解説。個人情報保護法・マイナンバー法・情報セキュリティを網羅。",
};

const fields = [
  { name: "個人情報保護法", slug: "hogo-law" },
  { name: "マイナンバー法", slug: "mynumber" },
  { name: "情報セキュリティ", slug: "security" },
];

export default async function PiiPage() {
  const allQuestions = await getAllPiiQuestions();

  const fieldCounts = await Promise.all(
    fields.map(async (f) => {
      const qs = await getPiiQuestionsByField(f.name);
      return qs.length;
    })
  );

  return (
    <div className="space-y-10 pb-16">
      <section className="py-6">
        <nav className="text-xs text-slate-400 mb-4"><a href="/">ホーム</a> / <span className="text-slate-600">個人情報保護士</span></nav>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">個人情報保護士 試験対策</h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
          全{allQuestions.length}問のオリジナル練習問題を収録。
          個人情報保護法・マイナンバー法・情報セキュリティの3分野を網羅。
        </p>
        <p className="text-xs text-slate-400 mt-2">次回試験: 2026年6月21日（日）</p>
        <div className="mt-4">
          <a href="/pii/q/pii-001/" className="text-sm text-blue-700 font-medium no-underline hover:underline">問題を解き始める →</a>
        </div>
      </section>

      <section>
        <h2 className="text-base font-bold text-slate-800 mb-4">分野から選ぶ</h2>
        <div className="space-y-3">
          {fields.map((f, i) => (
            <a key={f.slug} href={`/pii/field/${f.slug}/`} className="card p-4 hover:shadow-md transition-shadow no-underline group flex items-center justify-between block">
              <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600">{f.name}</p>
              <span className="text-xs text-slate-400">{fieldCounts[i]}問</span>
            </a>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-base font-bold text-slate-800 mb-3">試験の概要</h2>
        <div className="text-sm text-slate-600 space-y-1">
          <p>試験形式: マークシート 100問（課題I 50問 + 課題II 50問）</p>
          <p>試験時間: 150分</p>
          <p>合格基準: 各課題70%以上</p>
          <p>受験料: 11,000円（税込）</p>
        </div>
      </section>
    </div>
  );
}
