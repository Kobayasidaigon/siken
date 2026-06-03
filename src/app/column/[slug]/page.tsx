import { getAllColumnSlugs, getColumn } from "@/lib/columns";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PiiCourseAd from "@/components/PiiCourseAd";
import { getPiiAdContent } from "@/lib/pii-ad-content";
import MynumberCourseAd from "@/components/MynumberCourseAd";
import { getMynumberAdContent } from "@/lib/mynumber-ad-content";
import BijihouCourseAd from "@/components/BijihouCourseAd";
import { getBijihouAdContent } from "@/lib/bijihou-ad-content";
import JitsumuCourseAd from "@/components/JitsumuCourseAd";
import { getJitsumuAdContent } from "@/lib/jitsumu-ad-content";
import TextAffiliateAd from "@/components/TextAffiliateAd";
import { pageMetadata } from "@/lib/page-metadata";

export async function generateStaticParams() {
  return getAllColumnSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const col = await getColumn(slug);
  if (!col) return {};
  return pageMetadata({
    path: `/column/${slug}/`,
    title: col.title,
    description: col.description,
  });
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

  // ビジネス実務法務検定関連コラムにビジネス実務法務検定講座広告を表示
  const isBijihouArticle = slug.startsWith("bijihou-");
  const bijihouAdContent = isBijihouArticle ? getBijihouAdContent(slug) : undefined;

  // 貸金系コラム（SMART講座広告が無い記事）にアガルート貸金業務取扱主任者講座を表示。
  // アガルートは貸金業務取扱主任者講座を実際に提供している（agaroot.jp/kashikin）。
  // 知財3級はアガルートに講座が存在しないため広告を設置しない（誤誘導防止）。
  // osusume-text / takken-hikaku は別途アガルート個別素材を設置済みのため除外。
  const kashikinAdSlugs = new Set([
    "goukakuritsu",
    "benkyouhou",
    "shiken-nittei",
    "kashikingyou-toha",
    "benkyou-jikan",
  ]);
  const isKashikinGeneralArticle =
    (slug.startsWith("kashikin-") || kashikinAdSlugs.has(slug)) &&
    slug !== "osusume-text" &&
    slug !== "takken-hikaku";

  // 知財3級コラム。chizai-benrishi-hikaku（知財検定 vs 弁理士）は文脈一致する
  // アガルート弁理士講座（既存提携・高単価）、その他はオンスク知財3級講座（暫定）。
  const isBenrishiArticle = slug === "chizai-benrishi-hikaku";
  const isChizaiGeneralArticle = slug.startsWith("chizai-") && !isBenrishiArticle;

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

      {/* 広告は本文を読み終えた直後（最も関心が高い位置）に配置。免責の注意書きは広告の下へ。 */}
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

      {isBijihouArticle && (
        <BijihouCourseAd
          headline={bijihouAdContent?.headline}
          body={bijihouAdContent?.body}
        />
      )}

      {/* GSC上位記事への追加アフィリエイト（アガルートアカデミー） */}
      {slug === "osusume-text" && (
        <TextAffiliateAd
          headline="市販テキスト＋通信講座の併用も選択肢に"
          body="市販テキストだけでは独学に不安が残る方は、スキマ時間を活用できるオンライン講座も検討してみてください。テキストとスマホ講義を組み合わせた学習スタイルです。"
          linkHref="https://px.a8.net/svt/ejp?a8mat=4B3N6P+AWY41E+44M0+5YRHE"
          linkText="スキマ時間も有効活用できるオンライン講座"
          pixelSrc="https://www17.a8.net/0.gif?a8mat=4B3N6P+AWY41E+44M0+5YRHE"
        />
      )}

      {slug === "takken-hikaku" && (
        <TextAffiliateAd
          headline="宅建側の対策をお探しの方へ"
          body="貸金業務取扱主任者と宅建のダブルライセンスを狙うなら、宅建側もきちんと準備しておく必要があります。フルカラーテキストと動画講義で、ゼロから1年合格を目指せるカリキュラムです。"
          linkHref="https://px.a8.net/svt/ejp?a8mat=4B3N6P+AWY41E+44M0+61Z82"
          linkText="宅建士講座・ゼロから始めて1年合格！"
          pixelSrc="https://www11.a8.net/0.gif?a8mat=4B3N6P+AWY41E+44M0+61Z82"
        />
      )}

      {isKashikinGeneralArticle && (
        <TextAffiliateAd
          headline="独学に不安があれば"
          body="貸金業務取扱主任者は市販の問題集が少なく、独学で進めにくい試験です。通信講座のアガルートアカデミーは貸金業務取扱主任者講座を提供しており、頻出論点と法改正への対応を体系的に押さえられます。"
          linkHref="https://px.a8.net/svt/ejp?a8mat=4B3N6P+AWY41E+44M0+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.agaroot.jp%2Fkashikin%2F"
          linkText="アガルートの貸金業務取扱主任者講座を見る"
          pixelSrc="https://www14.a8.net/0.gif?a8mat=4B3N6P+AWY41E+44M0+BW8O2"
        />
      )}

      {isBenrishiArticle && (
        <TextAffiliateAd
          headline="弁理士を視野に入れている方へ"
          body="知財検定3級から弁理士を目指すなら、早い段階で弁理士試験の出題範囲を把握しておくと学習計画が立てやすくなります。アガルートアカデミーは弁理士試験講座を提供しています。"
          linkHref="https://px.a8.net/svt/ejp?a8mat=4B3N6P+AWY41E+44M0+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.agaroot.jp%2Fbenri%2F"
          linkText="アガルートの弁理士試験講座を見る"
          pixelSrc="https://www12.a8.net/0.gif?a8mat=4B3N6P+AWY41E+44M0+BW8O2"
        />
      )}

      {isChizaiGeneralArticle && (
        <TextAffiliateAd
          headline="知財検定の対策講座をお探しの方へ"
          body="知的財産管理技能検定は市販教材が限られる試験です。月額制のオンライン講座オンスク.JPは知財検定3級講座を提供しており、スキマ時間で出題範囲を体系的に押さえられます。"
          linkHref="https://px.a8.net/svt/ejp?a8mat=4B3TF4+BJKL0Y+408S+BW8O2&a8ejpredirect=https%3A%2F%2Fonsuku.jp%2Ftraining%2Fchizai3"
          linkText="知的財産管理技能検定3級の対策講座を見る"
          pixelSrc="https://www11.a8.net/0.gif?a8mat=4B3TF4+BJKL0Y+408S+BW8O2"
        />
      )}

      <aside className="mt-8 p-4 rounded border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)] text-xs text-[color:var(--c-text-sub)] leading-relaxed">
        <p className="mb-1"><span className="font-bold">記事の前提</span></p>
        <p>
          本記事は{col.updatedAt || col.publishedAt}時点の法令・試験制度に基づいて作成しています。
          受験料・試験日程・出題範囲・改正法対応などの最新情報は、各実施機関の公式サイトで必ずご確認ください。
        </p>
      </aside>

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
          ) : isBijihouArticle ? (
            <>
              <a href="/bijihou/q/bijihou-001/" className="text-sm text-blue-700 no-underline hover:underline">ビジ法 全200問を見る →</a>
              <a href="/bijihou/" className="text-sm text-slate-500 no-underline hover:underline">分野別に選ぶ →</a>
            </>
          ) : (
            <>
              <a href="/exam/0/" className="text-sm text-blue-700 no-underline hover:underline">全504問を見る →</a>
              <a href="/field/" className="text-sm text-slate-500 no-underline hover:underline">分野別に選ぶ →</a>
            </>
          )}
        </div>
      </div>

      {/* Studio 関連サービス案内 (記事末固定) */}
      <aside
        className="mt-10 p-4 rounded-lg border"
        style={{
          background: "var(--c-chizai-soft)",
          borderColor: "var(--c-chizai)",
        }}
      >
        <p className="text-xs font-bold mb-1" style={{ color: "var(--c-chizai-ink)" }}>
          自分の教材から問題を作りたい人へ
        </p>
        <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--c-chizai-ink)" }}>
          シカクモン本体に無い資格や、手元のテキスト・PDF からも AI が問題を生成する別サイト「シカクモン Studio」を運営しています。
          忘却曲線に沿った復習や AI への質問にも対応しています。
        </p>
        <a
          href="https://shikakumon-studio.vercel.app/?utm_source=shikakumon&utm_medium=column_footer"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold inline-flex items-center gap-1 no-underline"
          style={{ color: "var(--c-chizai)" }}
        >
          シカクモン Studio を見る
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </aside>

      <nav className="mt-6">
        <a href="/column/" className="text-sm text-slate-500 no-underline hover:underline">← コラム一覧に戻る</a>
      </nav>
    </article>
  );
}
