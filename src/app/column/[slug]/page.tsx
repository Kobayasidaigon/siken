import { getAllColumnSlugs, getColumn } from "@/lib/columns";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllColumnSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const col = await getColumn(slug);
  if (!col) return {};
  return {
    title: col.title,
    description: col.description,
  };
}

export default async function ColumnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const col = await getColumn(slug);
  if (!col) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: col.title,
    description: col.description,
    datePublished: col.publishedAt,
    dateModified: col.updatedAt || col.publishedAt,
    author: { "@type": "Person", name: "熊太郎" },
    publisher: {
      "@type": "Organization",
      name: "貸金業務取扱主任者 試験対策サイト",
    },
  };

  return (
    <article className="pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="breadcrumb text-xs text-slate-400 mb-4 flex flex-wrap gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/column/">コラム</a><span>/</span>
        <span className="text-slate-600">{col.title}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 leading-tight">
        {col.title}
      </h1>

      <div className="flex gap-3 text-xs text-slate-400 mb-8">
        <span>公開: {col.publishedAt}</span>
        {col.updatedAt && col.updatedAt !== col.publishedAt && (
          <span>更新: {col.updatedAt}</span>
        )}
      </div>

      <section className="prose max-w-none" dangerouslySetInnerHTML={{ __html: col.content }} />

      <div className="mt-10 pt-6 border-t border-slate-200">
        <p className="text-sm font-medium text-slate-700 mb-3">練習問題に挑戦する</p>
        <div className="flex flex-wrap gap-3">
          <a href="/exam/0/" className="text-sm text-blue-700 no-underline hover:underline">全504問を見る →</a>
          <a href="/field/" className="text-sm text-slate-500 no-underline hover:underline">分野別に選ぶ →</a>
        </div>
      </div>

      <nav className="mt-6">
        <a href="/column/" className="text-sm text-slate-500 no-underline hover:underline">← コラム一覧に戻る</a>
      </nav>
    </article>
  );
}
