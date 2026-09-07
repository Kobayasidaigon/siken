import { getVoicesByExam } from "@/lib/voices";
import type { ExamSlug } from "@/lib/study-progress";

/**
 * 資格トップに出す「この資格の合格報告」。2026-09-05 追加。
 *
 * 掲載済みの報告(src/content/voices/*.md)が1件も無ければ何も描画しない。
 * 実在の投稿だけを載せる仕組みの詳細は src/lib/voices.ts を参照。
 *
 * なぜ置くか: 講座広告(アフィリ)は「この人たちが実際に受かっている」という文脈の中に
 * あるときだけ信用される。合格報告は同時に、試験の実像(出題形式・難易度・所要時間)の
 * 一次情報にもなる。数値の合格率は公式値しか出さない方針なので、ここでは扱わない。
 */

export default async function ExamVoices({
  exam,
  examName,
  accent,
  limit = 3,
}: {
  exam: ExamSlug;
  examName: string;
  /** テーマ色。例 "var(--c-kashikin)" */
  accent: string;
  limit?: number;
}) {
  const voices = await getVoicesByExam(exam);
  if (voices.length === 0) return null;

  const shown = voices.slice(0, limit);

  return (
    <section className="mb-12">
      <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-1 font-serif">
        {examName}の合格報告
      </h2>
      <p className="text-xs text-[color:var(--c-text-sub)] leading-relaxed mb-4">
        当サイトを使って受験した方から届いた報告です。投稿者ご本人の自己申告で、内容は編集していません。
      </p>
      <div className="space-y-3">
        {shown.map((v) => (
          <article
            key={v.slug}
            className="card p-5"
            style={{ borderLeft: `3px solid ${accent}` }}
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2 text-xs text-[color:var(--c-text-sub)]">
              <span
                className="px-2 py-0.5 rounded font-bold"
                style={{ background: "var(--c-bg-alt)", color: accent }}
              >
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
      <div className="mt-4 flex flex-wrap gap-4">
        {voices.length > limit && (
          <a href="/voice/" className="text-sm text-[color:var(--c-text-sub)] no-underline hover:underline">
            合格報告をすべて見る（{voices.length}件） →
          </a>
        )}
        <a href="/goukaku-houkoku/" className="text-sm text-[color:var(--c-text-sub)] no-underline hover:underline">
          受験された方は結果を教えてください →
        </a>
      </div>
    </section>
  );
}
