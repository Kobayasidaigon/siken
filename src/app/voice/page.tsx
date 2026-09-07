import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getAllVoices } from "@/lib/voices";
import { EXAM_LIST, type ExamSlug } from "@/lib/study-progress";

/**
 * 合格報告の一覧。掲載済みの報告(src/content/voices/*.md)が1件も無い間は、
 * 報告のお願いだけを出し、noindex にする(中身の無いページを検索結果に出さない)。
 * sitemap にも 0 件のうちは載せない(scripts/generate-sitemap.js)。
 */

export async function generateMetadata(): Promise<Metadata> {
  const voices = await getAllVoices();
  const base = pageMetadata({
    path: "/voice/",
    title:
      voices.length > 0
        ? `合格報告｜利用者${voices.length}人の受験レポート`
        : "合格報告",
    description:
      voices.length > 0
        ? "シカクモンの練習問題で学習し、実際に受験した方から届いた報告です。学習期間・使った教材・本試験の手ごたえを、投稿された文章のまま掲載しています。"
        : "シカクモンの練習問題で学習し、受験された方からの報告を掲載するページです。",
  });
  return voices.length > 0 ? base : { ...base, robots: { index: false, follow: true } };
}

/** 資格の並びは EXAM_LIST の順（トップページと同じ並び）に揃える */
const EXAM_ORDER = new Map<string, number>(EXAM_LIST.map((e, i) => [e.slug, i]));

export default async function VoiceIndexPage() {
  const voices = await getAllVoices();

  const byExam = new Map<ExamSlug, typeof voices>();
  for (const v of voices) {
    const list = byExam.get(v.exam);
    if (list) list.push(v);
    else byExam.set(v.exam, [v]);
  }
  const groups = [...byExam.entries()].sort(
    (a, b) => (EXAM_ORDER.get(a[0]) ?? 99) - (EXAM_ORDER.get(b[0]) ?? 99),
  );

  return (
    <div className="pb-16">
      <section className="-mx-4 px-4 py-10 sm:py-12 mb-8 border-b border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)]">
        <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
          <a href="/" className="no-underline hover:underline">ホーム</a> / <span>合格報告</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold text-[color:var(--c-ink)] mb-3 font-serif leading-tight">
          合格報告
        </h1>
        <p className="text-sm text-[color:var(--c-text-sub)] leading-relaxed max-w-lg">
          当サイトの練習問題で学習し、実際に受験した方から届いた報告です。
          投稿された文章をそのまま掲載しています（投稿者ご本人の自己申告です）。
        </p>
        {voices.length > 0 && (
          <p className="mt-5 text-sm">
            <span className="text-2xl font-bold font-serif text-[color:var(--c-ink)] mr-2">
              {voices.length}
            </span>
            <span className="text-xs text-[color:var(--c-text-sub)]">件の報告</span>
          </p>
        )}
      </section>

      {voices.length === 0 ? (
        <section className="card p-6">
          <p className="text-sm font-bold text-[color:var(--c-ink)] font-serif mb-2">
            最初の報告をお待ちしています
          </p>
          <p className="text-sm text-[color:var(--c-text-sub)] leading-relaxed mb-4">
            まだ掲載できる報告が届いていません。当サイトの問題で学習して受験された方は、
            結果と手ごたえを教えてください。合格・不合格どちらの報告も歓迎します。
          </p>
          <a href="/goukaku-houkoku/" className="btn-accent">受験の結果を報告する →</a>
        </section>
      ) : (
        <>
          {groups.map(([exam, list]) => {
            const info = EXAM_LIST.find((e) => e.slug === exam);
            return (
              <section key={exam} id={exam} className="mb-10">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                  <h2 className="text-lg font-bold text-[color:var(--c-ink)] font-serif">
                    {info?.name ?? exam}
                  </h2>
                  {info && (
                    <a href={info.topPath} className="text-xs text-[color:var(--c-text-sub)] no-underline hover:underline">
                      この資格の練習問題を見る →
                    </a>
                  )}
                </div>
                <div className="space-y-3">
                  {list.map((v) => (
                    <article key={v.slug} className="card p-5">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2 text-xs text-[color:var(--c-text-sub)]">
                        <span className="px-2 py-0.5 rounded font-bold bg-[color:var(--c-bg-alt)] text-[color:var(--c-ink)]">
                          {v.result === "pass" ? "合格" : "不合格"}
                        </span>
                        <span>{v.examPeriod} 受験</span>
                        {v.studyPeriod && <span>学習期間 {v.studyPeriod}</span>}
                        {v.score && <span>{v.score}</span>}
                      </div>
                      <div
                        className="prose prose-sm max-w-none text-[color:var(--c-text)]"
                        dangerouslySetInnerHTML={{ __html: v.content }}
                      />
                      <p className="mt-3 text-xs text-[color:var(--c-text-sub)]">
                        {v.displayName} さん
                        {v.verified && <span className="ml-2">（運営で本人に確認済み）</span>}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}

          <section className="card p-5 mt-10">
            <p className="text-sm font-bold text-[color:var(--c-ink)] font-serif mb-1.5">
              受験された方へ
            </p>
            <p className="text-xs text-[color:var(--c-text-sub)] leading-relaxed mb-3">
              出題の傾向や、当サイトの問題が本試験とどれくらい近かったかを教えてください。
              これから受ける方のための情報になります。
            </p>
            <a href="/goukaku-houkoku/" className="text-sm font-medium text-[color:var(--c-accent-ink)] no-underline hover:underline">
              受験の結果を報告する →
            </a>
          </section>
        </>
      )}

      <p className="mt-8 text-xs text-[color:var(--c-text-sub)] leading-relaxed">
        ※ 掲載内容は投稿者ご本人の自己申告であり、当サイトが合否や点数を確認したものではありません
        （運営で本人に確認できたものには、その旨を添えています）。
        試験制度・合格基準の正確な情報は、各実施機関の公式サイトでご確認ください。
      </p>
    </div>
  );
}
