import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "年度別 過去問一覧",
  description: "貸金業務取扱主任者試験の過去問を年度別に一覧表示。第1回から第19回まで全問掲載。",
};

export default function ExamIndexPage() {
  const exams = Array.from({ length: 19 }, (_, i) => 19 - i);

  return (
    <div className="pb-16">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">年度別 過去問一覧</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {exams.map((n) => (
          <a key={n} href={`/exam/${n}/`} className="card p-5 hover:shadow-md transition-shadow no-underline group text-center">
            <p className="text-lg font-bold text-blue-800 group-hover:text-blue-600">第{n}回</p>
            <p className="text-xs text-slate-400 mt-1">
              {n >= 15 ? `令和${n - 13}年度` : `平成${n + 18}年度`}
            </p>
            <p className="text-xs text-slate-300 mt-1">50問</p>
          </a>
        ))}
      </div>
    </div>
  );
}
