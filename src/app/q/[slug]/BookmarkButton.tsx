"use client";
import { useEffect, useState } from "react";
import { isBookmarked, toggleBookmark, type ExamSlug } from "@/lib/study-progress";

export default function BookmarkButton({
  exam,
  questionSlug,
}: {
  exam: ExamSlug;
  questionSlug: string;
}) {
  const [marked, setMarked] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMarked(isBookmarked(exam, questionSlug));
    setHydrated(true);
  }, [exam, questionSlug]);

  const handleClick = () => {
    const next = toggleBookmark(exam, questionSlug);
    setMarked(next);
  };

  if (!hydrated) {
    return (
      <button
        type="button"
        disabled
        className="text-xs px-3 py-1.5 rounded-full border border-[color:var(--c-border)] text-[color:var(--c-text-sub)]"
        aria-hidden="true"
      >
        ブックマーク
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={marked}
      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
        marked
          ? "border-amber-400 bg-amber-50 text-amber-800"
          : "border-[color:var(--c-border)] bg-[color:var(--c-surface)] text-[color:var(--c-text-sub)] hover:bg-[color:var(--c-bg-alt)]"
      }`}
    >
      {marked ? "★ ブックマーク中" : "☆ あとで見直す"}
    </button>
  );
}
