/**
 * 「試験前の10問」のページ本体(イベントのページと、点つきの着地ページで共通)。lib/shikenmae.ts を参照。
 */
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import ShikenmaeRun from "@/components/ShikenmaeRun";
import { findShikenmae, mdJa, mdSlash, shikenmaePath, SHIKENMAE_EVENTS, dateKey, type ShikenmaeEvent } from "@/lib/shikenmae";
import { getShikenmaeQuestions, shikenmaeFieldHrefs } from "@/lib/shikenmae-data";

function ogImage(e: ShikenmaeEvent): { url: string; alt: string } | undefined {
  const rel = `/og/shikenmae-${e.exam}-${dateKey(e.date)}.png`;
  return fs.existsSync(path.join(process.cwd(), "public", rel))
    ? { url: rel, alt: `${e.examName} 試験前の10問` }
    : undefined;
}

export function shikenmaeMetadata(exam: string, date: string, score?: number): Metadata {
  const e = findShikenmae(exam, date);
  if (!e) return {};
  return pageMetadata({
    path: shikenmaePath(e, score),
    title: `${e.examName} 試験前の10問（${mdSlash(e.date)} 試験）`,
    description: `${mdJa(e.date)}の${e.examName}試験の前の7日間、同じ10問を1回だけ。シカクモンの練習問題から選んだ10問で、登録不要・答えと解説つき。`,
    noindex: true,
    canonical: score == null,
    image: ogImage(e),
  });
}

export default async function ShikenmaePage({ exam, date, score }: { exam: string; date: string; score?: number }) {
  const e = findShikenmae(exam, date);
  if (!e) notFound();
  const questions = await getShikenmaeQuestions(e);
  if (!questions) notFound();
  const nextEvent = e.next ? SHIKENMAE_EVENTS.find((x) => x.exam === e.next!.exam && x.date === e.next!.date) : null;
  const [y, m, d] = e.date.split("-").map(Number);

  return (
    <div className="pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href={`/${e.exam}/`}>{e.examName}</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">試験前の10問</span>
      </nav>

      {score != null ? (
        <div className="mb-4">
          <p className="text-base font-bold text-[color:var(--c-ink)]">投稿した人の結果（自己採点）: 10問中{score}問</p>
          <p className="text-sm text-[color:var(--c-text-sub)] mt-1">{mdJa(e.date)}の試験の前の10問・登録不要</p>
        </div>
      ) : (
        <div className="mb-4">
          <h1 className="text-lg sm:text-xl font-bold text-[color:var(--c-ink)] font-serif leading-snug">
            {e.examName} 試験前の10問（{y}年{m}月{d}日の試験の前に）
          </h1>
          <p className="text-sm text-[color:var(--c-text-sub)] mt-2 leading-relaxed">
            シカクモンの練習問題から選んだ10問です。本試験の予想ではありません。前に解いた問題が入っていることもあります。
          </p>
        </div>
      )}

      <ShikenmaeRun
        event={e}
        questions={questions}
        posterScore={score ?? null}
        moshiPath={`/${e.exam}/moshi/`}
        fieldHrefs={shikenmaeFieldHrefs(e.exam)}
        next={nextEvent ? { examName: nextEvent.examName, date: nextEvent.date, topPath: `/${nextEvent.exam}/` } : null}
      />
    </div>
  );
}
