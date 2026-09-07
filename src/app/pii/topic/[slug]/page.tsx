import { getAllPiiQuestions, type PiiQuestionData } from "@/lib/pii-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { PII_TOPIC_HUBS, topicOfTitle } from "@/lib/topic-hubs";
import { breadcrumbJsonLd } from "@/lib/quiz-jsonld";
import JsonLd from "@/components/JsonLd";
import PiiCourseAd from "@/components/PiiCourseAd";
import ExamVoicesSection from "@/components/ExamVoicesSection";

/**
 * 論点別のまとめページ。2026-09-07 追加。
 *
 * 「匿名加工情報」のように問題が10問ある論点は、これまで問題ページ10枚が
 * ほぼ同じタイトルで並んでいて、同じ検索語に対して互いに順位を食い合っていた。
 * 検索語に答える面をここ1枚に集約し、個々の問題へはここから辿らせる。
 *
 * 本文に書くのは、問題データから機械的に出せる事実だけにする
 * (論点名・分野・問題数・難易度の内訳・各問の問題文の冒頭)。
 * 論点の解説文をここで新しく書き起こすと、解説の出典が問題ページと二重になり、
 * 内容がずれたときにどちらが正しいのか分からなくなる。
 */

const fieldSlugMap: Record<string, string> = {
  "個人情報保護法": "hogo-law",
  "マイナンバー法": "mynumber",
  "情報セキュリティ": "security",
};

export async function generateStaticParams() {
  return PII_TOPIC_HUBS.map((h) => ({ slug: h.slug }));
}

async function questionsOf(topic: string): Promise<PiiQuestionData[]> {
  const all = await getAllPiiQuestions();
  return all.filter((q) => topicOfTitle(q.title) === topic);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const hub = PII_TOPIC_HUBS.find((h) => h.slug === slug);
  if (!hub) return {};
  const questions = await questionsOf(hub.topic);
  return pageMetadata({
    path: `/pii/topic/${slug}/`,
    title: `${hub.topic}｜個人情報保護士 練習問題${questions.length}問`,
    description: `個人情報保護士試験の「${hub.topic}」に関するオリジナル練習問題${questions.length}問をまとめました。${hub.field}分野の論点で、1問ごとに根拠法令を含む解説がついています。登録不要・無料。`,
  });
}

export default async function PiiTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hub = PII_TOPIC_HUBS.find((h) => h.slug === slug);
  if (!hub) notFound();

  const questions = await questionsOf(hub.topic);
  if (questions.length === 0) notFound();

  const diff = {
    A: questions.filter((q) => q.difficulty === "A").length,
    B: questions.filter((q) => q.difficulty === "B").length,
    C: questions.filter((q) => q.difficulty === "C").length,
  };
  const fieldSlug = fieldSlugMap[hub.field];

  const jsonLd = breadcrumbJsonLd([
    { name: "ホーム", path: "/" },
    { name: "個人情報保護士", path: "/pii/" },
    ...(fieldSlug ? [{ name: hub.field, path: `/pii/field/${fieldSlug}/` }] : []),
    { name: hub.topic, path: `/pii/topic/${slug}/` },
  ]);

  return (
    <div className="theme-pii pb-16">
      <JsonLd data={jsonLd} />

      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex flex-wrap gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/pii/">個人情報保護士</a><span>/</span>
        {fieldSlug && <><a href={`/pii/field/${fieldSlug}/`}>{hub.field}</a><span>/</span></>}
        <span className="text-[color:var(--c-ink)]">{hub.topic}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif leading-tight">
        {hub.topic}の練習問題
      </h1>
      <div className="w-12 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>

      <p className="text-sm text-[color:var(--c-text-sub)] mb-6 leading-relaxed">
        個人情報保護士試験の{hub.field}分野のうち、「{hub.topic}」に関する
        オリジナル練習問題{questions.length}問です。1問ごとに根拠法令を含む解説がついています。
        登録は不要で、解いた記録はブラウザに残ります。
      </p>

      <div className="grid grid-cols-4 gap-2 mb-8">
        <div className="card p-3 text-center">
          <p className="text-lg font-bold font-serif" style={{ color: "var(--c-pii)" }}>{questions.length}</p>
          <p className="text-xs text-[color:var(--c-text-sub)] mt-1">全問</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-green-700 font-serif">{diff.A}</p>
          <p className="text-xs text-[color:var(--c-text-sub)] mt-1">基礎 A</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-amber-700 font-serif">{diff.B}</p>
          <p className="text-xs text-[color:var(--c-text-sub)] mt-1">標準 B</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-red-700 font-serif">{diff.C}</p>
          <p className="text-xs text-[color:var(--c-text-sub)] mt-1">応用 C</p>
        </div>
      </div>

      <ol className="space-y-2 mb-8">
        {questions.map((q, i) => {
          const diffColor = { A: "bg-green-100 text-green-800", B: "bg-amber-100 text-amber-800", C: "bg-red-100 text-red-800" }[q.difficulty];
          return (
            <li key={q.slug}>
              <a
                href={`/pii/q/${q.slug}/`}
                className="card p-4 flex justify-between items-center no-underline group"
                style={{ borderLeft: "3px solid var(--c-pii)" }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ background: "var(--c-pii-soft)", color: "var(--c-pii-ink)" }}
                    >
                      {i + 1}問目
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${diffColor}`}>{q.difficulty}</span>
                  </div>
                  <p className="text-sm text-[color:var(--c-text)] leading-snug">
                    {q.questionText.slice(0, 70)}
                    {q.questionText.length > 70 ? "…" : ""}
                  </p>
                </div>
                <svg className="w-4 h-4 text-[color:var(--c-text-sub)] flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </li>
          );
        })}
      </ol>

      <nav className="mb-8 text-sm flex flex-wrap gap-x-5 gap-y-2">
        {fieldSlug && (
          <a href={`/pii/field/${fieldSlug}/`} className="text-blue-700 hover:underline">
            {hub.field}の問題をすべて見る →
          </a>
        )}
        <a href="/pii/mock/" className="text-blue-700 hover:underline">
          本番形式テストで力試しする →
        </a>
      </nav>

      <ExamVoicesSection exam="pii" />

      <PiiCourseAd headline={`「${hub.topic}」でつまずくなら`} />
    </div>
  );
}
