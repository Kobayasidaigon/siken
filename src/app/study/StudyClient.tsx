"use client";
import { useEffect, useState } from "react";
import { loadProgress, clearProgress, EXAM_LIST, type AllProgress, type ExamSlug } from "@/lib/study-progress";

export interface QuestionMeta {
  questionNumber: number;
  field: string;
  topic: string;
}

export default function StudyClient({
  questionMeta,
}: {
  questionMeta: Record<ExamSlug, Record<string, QuestionMeta>>;
}) {
  const [progress, setProgress] = useState<AllProgress | null>(null);

  useEffect(() => {
    const refresh = () => setProgress(loadProgress());
    refresh();
    const handleUpdate = () => refresh();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "shikakumon-study-v1") refresh();
    };
    window.addEventListener("shikakumon-progress-update", handleUpdate);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("shikakumon-progress-update", handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  if (!progress) {
    return (
      <p className="text-sm text-[color:var(--c-text-sub)]">読み込み中...</p>
    );
  }

  const totalBookmarks = EXAM_LIST.reduce((sum, e) => sum + progress[e.slug].bookmarks.length, 0);
  const totalWrong = EXAM_LIST.reduce((sum, e) => sum + progress[e.slug].wrong.length, 0);
  const totalCorrect = EXAM_LIST.reduce((sum, e) => sum + progress[e.slug].correct.length, 0);
  const totalAttempted = totalWrong + totalCorrect;

  const handleClearAll = () => {
    if (confirm("すべての学習履歴を削除します。よろしいですか？")) {
      clearProgress();
      setProgress(loadProgress());
    }
  };

  const handleClearExam = (exam: ExamSlug, examName: string) => {
    if (confirm(`${examName}の学習履歴を削除します。よろしいですか？`)) {
      clearProgress(exam);
      setProgress(loadProgress());
    }
  };

  function renderQuestionRow(exam: ExamSlug, slug: string, prefix: string, accentClass: string) {
    const meta = questionMeta[exam]?.[slug];
    const examInfo = EXAM_LIST.find((e) => e.slug === exam);
    const href = `${examInfo?.questionPathPrefix ?? "/"}${slug}/`;
    return (
      <a
        key={slug}
        href={href}
        className={`block py-2 no-underline border-b border-[color:var(--c-border)] last:border-b-0 hover:bg-[color:var(--c-bg-alt)] -mx-2 px-2 rounded-sm`}
      >
        {meta ? (
          <>
            <div className="flex items-baseline gap-2">
              <span className={`text-xs font-bold shrink-0 ${accentClass}`}>{prefix}問{meta.questionNumber}</span>
              <span className="text-xs text-[color:var(--c-text-sub)] shrink-0">{meta.field}</span>
            </div>
            <p className="text-sm text-[color:var(--c-text)] mt-0.5 leading-snug">{meta.topic}</p>
          </>
        ) : (
          <span className={`text-sm ${accentClass}`}>
            {prefix} {slug}
          </span>
        )}
      </a>
    );
  }

  return (
    <div className="pb-16">
      <section className="-mx-4 px-4 py-10 sm:py-12 mb-6 border-b border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[color:var(--c-ink)] mb-3 font-serif leading-tight">
          学習履歴
        </h1>
        <p className="text-sm text-[color:var(--c-text-sub)] leading-relaxed max-w-lg">
          ブックマークした問題と、解答時の正誤履歴を表示します。すべてブラウザ内に保存されており、サーバには送信されません。
        </p>
        <div className="mt-6 flex gap-6 text-sm">
          <div>
            <p className="text-2xl font-bold font-serif text-[color:var(--c-ink)]">{totalAttempted}</p>
            <p className="text-xs text-[color:var(--c-text-sub)]">解いた問題</p>
          </div>
          <div>
            <p className="text-2xl font-bold font-serif" style={{ color: totalWrong > 0 ? "#b91c1c" : "var(--c-text-sub)" }}>{totalWrong}</p>
            <p className="text-xs text-[color:var(--c-text-sub)]">不正解</p>
          </div>
          <div>
            <p className="text-2xl font-bold font-serif" style={{ color: totalCorrect > 0 ? "#15803d" : "var(--c-text-sub)" }}>{totalCorrect}</p>
            <p className="text-xs text-[color:var(--c-text-sub)]">正解</p>
          </div>
          <div>
            <p className="text-2xl font-bold font-serif" style={{ color: totalBookmarks > 0 ? "#b45309" : "var(--c-text-sub)" }}>{totalBookmarks}</p>
            <p className="text-xs text-[color:var(--c-text-sub)]">ブックマーク</p>
          </div>
        </div>
      </section>

      {totalAttempted === 0 && totalBookmarks === 0 && (
        <section className="card p-6 mb-8">
          <p className="text-sm text-[color:var(--c-text-sub)] mb-4">
            まだ学習履歴がありません。問題を解くと、自動的にここに記録されます。
          </p>
          <p className="text-sm text-[color:var(--c-text-sub)]">
            まずは練習問題から始めてみてください：
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {EXAM_LIST.map((e) => (
              <a key={e.slug} href={e.topPath} className="text-sm px-3 py-1.5 rounded-full border border-[color:var(--c-border)] text-[color:var(--c-text)] no-underline hover:bg-[color:var(--c-bg-alt)]">
                {e.name}
              </a>
            ))}
          </div>
        </section>
      )}

      {EXAM_LIST.map((e) => {
        const p = progress[e.slug];
        const total = p.bookmarks.length + p.wrong.length + p.correct.length;
        if (total === 0) return null;
        const firstWrong = p.wrong[0];
        const firstBookmark = p.bookmarks[0];
        return (
          <section key={e.slug} className="mb-8 card p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h2 className="text-base font-bold text-[color:var(--c-ink)] font-serif mb-1">{e.name}</h2>
                <p className="text-xs text-[color:var(--c-text-sub)]">
                  解いた {p.wrong.length + p.correct.length} 問・正解 {p.correct.length}・不正解 {p.wrong.length}・ブックマーク {p.bookmarks.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleClearExam(e.slug, e.name)}
                className="text-xs text-[color:var(--c-text-sub)] hover:text-red-700 underline shrink-0"
              >
                この資格の履歴を削除
              </button>
            </div>

            {p.wrong.length > 0 && (
              <details className="mt-3" open>
                <summary className="text-sm font-bold cursor-pointer text-red-700 mb-2">
                  間違えた問題 ({p.wrong.length})
                </summary>
                <div className="mt-2">
                  {p.wrong.map((slug) => renderQuestionRow(e.slug, slug, "✗", "text-red-700"))}
                </div>
                {firstWrong && (
                  <a
                    href={`${e.questionPathPrefix}${firstWrong}/`}
                    className="inline-block mt-3 text-xs px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 no-underline hover:bg-red-100"
                  >
                    間違えた問題から再挑戦 →
                  </a>
                )}
              </details>
            )}

            {p.bookmarks.length > 0 && (
              <details className="mt-3" open>
                <summary className="text-sm font-bold cursor-pointer text-amber-800 mb-2">
                  ブックマーク ({p.bookmarks.length})
                </summary>
                <div className="mt-2">
                  {p.bookmarks.map((slug) => renderQuestionRow(e.slug, slug, "★", "text-amber-800"))}
                </div>
                {firstBookmark && (
                  <a
                    href={`${e.questionPathPrefix}${firstBookmark}/`}
                    className="inline-block mt-3 text-xs px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 no-underline hover:bg-amber-100"
                  >
                    ブックマークから見直す →
                  </a>
                )}
              </details>
            )}

            {p.correct.length > 0 && (
              <details className="mt-3">
                <summary className="text-sm font-bold cursor-pointer text-green-700 mb-2">
                  正解した問題 ({p.correct.length})
                </summary>
                <div className="mt-2">
                  {p.correct.map((slug) => renderQuestionRow(e.slug, slug, "✓", "text-green-700"))}
                </div>
              </details>
            )}
          </section>
        );
      })}

      {(totalAttempted > 0 || totalBookmarks > 0) && (
        <section className="mt-10 pt-6 border-t border-[color:var(--c-border)]">
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-[color:var(--c-text-sub)] hover:text-red-700 underline"
          >
            すべての学習履歴を削除
          </button>
        </section>
      )}

      <section className="mt-10 pt-6 border-t border-[color:var(--c-border)]">
        <p className="text-xs text-[color:var(--c-text-sub)] leading-relaxed">
          学習履歴はあなたのブラウザにのみ保存されています。シークレットモードや別の端末では引き継がれません。
          ブラウザのデータを削除すると履歴も消えます。
        </p>
      </section>
    </div>
  );
}
