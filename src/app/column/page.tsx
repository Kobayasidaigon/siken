import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "コラム一覧｜資格試験の勉強法・合格率・試験日程",
  description: "貸金業務取扱主任者試験に関するコラム。合格率・勉強法・試験日程・おすすめテキストなどの情報。",
};

export default async function ColumnIndexPage() {
  const columns = await getAllColumns();

  return (
    <div className="pb-16">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">コラム</h1>
      {columns.length === 0 ? (
        <p className="text-sm text-slate-400">記事を準備中です。</p>
      ) : (
        <div className="space-y-4">
          {columns.map((col) => (
            <a
              key={col.slug}
              href={`/column/${col.slug}/`}
              className="card p-5 hover:shadow-md transition-shadow no-underline group block"
            >
              <p className="text-base font-medium text-slate-800 group-hover:text-blue-600">{col.title}</p>
              <p className="text-sm text-slate-500 mt-1">{col.description}</p>
              <p className="text-xs text-slate-400 mt-2">{col.publishedAt}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
