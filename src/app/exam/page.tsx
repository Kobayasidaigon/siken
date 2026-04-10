import { getAllQuestions } from "@/lib/questions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "貸金業務取扱主任者 練習問題一覧｜全504問",
  description: "貸金業務取扱主任者試験のオリジナル練習問題一覧。全504問を分野・難易度別に掲載。1問ごとに根拠条文を含む解説付きで効率的に学習できます。",
};

export default async function ExamIndexPage() {
  const questions = await getAllQuestions();

  return (
    <div className="pb-16">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">問題一覧</h1>
      <a href="/exam/0/" className="card p-6 hover:shadow-md transition-shadow no-underline group block mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-blue-800 group-hover:text-blue-600">オリジナル練習問題</p>
            <p className="text-sm text-slate-500 mt-1">全{questions.length}問</p>
            <p className="text-xs text-slate-400 mt-1">貸金業法・利息制限法・出資法・民法・資金需要者保護の4分野から</p>
          </div>
          <svg className="w-5 h-5 text-slate-300 flex-shrink-0 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </a>
    </div>
  );
}
