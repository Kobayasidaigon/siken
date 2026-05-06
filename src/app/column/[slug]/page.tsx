import { getAllColumnSlugs, getColumn } from "@/lib/columns";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PiiCourseAd from "@/components/PiiCourseAd";
import { getPiiAdContent } from "@/lib/pii-ad-content";
import MynumberCourseAd from "@/components/MynumberCourseAd";
import { getMynumberAdContent } from "@/lib/mynumber-ad-content";
import JitsumuCourseAd from "@/components/JitsumuCourseAd";
import { getJitsumuAdContent } from "@/lib/jitsumu-ad-content";

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

  // PII関連コラム記事に個人情報保護士講座広告を表示
  const isPiiArticle = slug.startsWith("pii-");
  const piiAdContent = isPiiArticle ? getPiiAdContent(slug) : undefined;

  // マイナンバー関連コラム記事にマイナンバー実務検定講座広告を表示
  const isMynumberArticle = slug.startsWith("mynumber-");
  const mynumberAdContent = isMynumberArticle ? getMynumberAdContent(slug) : undefined;

  // 個人情報保護実務検定関連コラムに個情保実務検定講座広告を表示
  const isJitsumuArticle = slug.startsWith("jitsumu-");
  const jitsumuAdContent = isJitsumuArticle ? getJitsumuAdContent(slug) : undefined;

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
    <article className="pb-4">
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

      {isPiiArticle && (
        <PiiCourseAd
          headline={piiAdContent?.headline}
          body={piiAdContent?.body}
        />
      )}

      {isMynumberArticle && (
        <MynumberCourseAd
          headline={mynumberAdContent?.headline}
          body={mynumberAdContent?.body}
        />
      )}

      {isJitsumuArticle && (
        <JitsumuCourseAd
          headline={jitsumuAdContent?.headline}
          body={jitsumuAdContent?.body}
        />
      )}

      <div className="mt-10 pt-6 border-t border-slate-200">
        <p className="text-sm font-medium text-slate-700 mb-3">練習問題に挑戦する</p>
        <div className="flex flex-wrap gap-3">
          {isPiiArticle ? (
            <>
              <a href="/pii/q/pii-001/" className="text-sm text-blue-700 no-underline hover:underline">個情保 全300問を見る →</a>
              <a href="/pii/" className="text-sm text-slate-500 no-underline hover:underline">分野別に選ぶ →</a>
            </>
          ) : isMynumberArticle ? (
            <>
              <a href="/mynumber/q/mynumber-001/" className="text-sm text-blue-700 no-underline hover:underline">マイナンバー 全200問を見る →</a>
              <a href="/mynumber/" className="text-sm text-slate-500 no-underline hover:underline">分野別に選ぶ →</a>
            </>
          ) : isJitsumuArticle ? (
            <>
              <a href="/jitsumu/q/jitsumu-001/" className="text-sm text-blue-700 no-underline hover:underline">個情保実務 全200問を見る →</a>
              <a href="/jitsumu/" className="text-sm text-slate-500 no-underline hover:underline">分野別に選ぶ →</a>
            </>
          ) : (
            <>
              <a href="/exam/0/" className="text-sm text-blue-700 no-underline hover:underline">全504問を見る →</a>
              <a href="/field/" className="text-sm text-slate-500 no-underline hover:underline">分野別に選ぶ →</a>
            </>
          )}
        </div>
      </div>

      <nav className="mt-6">
        <a href="/column/" className="text-sm text-slate-500 no-underline hover:underline">← コラム一覧に戻る</a>
      </nav>
    </article>
  );
}
