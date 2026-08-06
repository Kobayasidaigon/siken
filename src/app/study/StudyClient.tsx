"use client";
import { useEffect, useState } from "react";
import { loadProgress, clearProgress, medalCounts, EXAM_LIST, type AllProgress, type ExamSlug } from "@/lib/study-progress";
import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

// 弱点連動広告を出す誤答数のしきい値（高intent面なので露出母数を確保するため緩めに）
const STUDY_AD_WRONG_THRESHOLD = 2;
// 1ページに出す弱点広告の最大資格数（過密回避）
const STUDY_AD_MAX = 3;

export interface QuestionMeta {
  questionNumber: number;
  field: string;
  topic: string;
}

const PREVIEW_LIMIT = 10;

type SectionKind = "wrong" | "bookmarks" | "correct";

export default function StudyClient({
  questionMeta,
}: {
  questionMeta: Record<ExamSlug, Record<string, QuestionMeta>>;
}) {
  const [progress, setProgress] = useState<AllProgress | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [fieldFilter, setFieldFilter] = useState<Record<ExamSlug, string | null>>({
    kashikin: null,
    pii: null,
    chizai: null,
    chizai2: null,
    mynumber: null,
    jitsumu: null,
    bijihou: null,
    fukushi2: null,
    bijimane: null,
  });

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
  const accuracyPct = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  const totalGold = EXAM_LIST.reduce((sum, e) => sum + medalCounts(progress[e.slug]).gold, 0);

  // 弱点連動広告の対象資格: 誤答数が多い順、wrong>=しきい値、最大STUDY_AD_MAX資格に絞る（過密回避）
  const adExams = new Set(
    EXAM_LIST
      .filter((e) => progress[e.slug].wrong.length >= STUDY_AD_WRONG_THRESHOLD)
      .sort((a, b) => progress[b.slug].wrong.length - progress[a.slug].wrong.length)
      .slice(0, STUDY_AD_MAX)
      .map((e) => e.slug),
  );

  // 正答率サマリ直下CTAの対象＝誤答が最も多い資格。最もスコア結果に近い高intent面を
  // 未収益化のまま放置しないための導線（誤答が一定数たまってから出す）。
  const topWrongExam =
    EXAM_LIST
      .filter((e) => progress[e.slug].wrong.length > 0)
      .sort((a, b) => progress[b.slug].wrong.length - progress[a.slug].wrong.length)[0]?.slug ?? null;

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

  const toggleExpanded = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  function fieldCounts(exam: ExamSlug, slugs: string[]): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const s of slugs) {
      const meta = questionMeta[exam]?.[s];
      const field = meta?.field ?? "(分野不明)";
      counts[field] = (counts[field] ?? 0) + 1;
    }
    return counts;
  }

  function applyFilter(exam: ExamSlug, slugs: string[]): string[] {
    const filter = fieldFilter[exam];
    if (!filter) return slugs;
    return slugs.filter((s) => questionMeta[exam]?.[s]?.field === filter);
  }

  function renderQuestionRow(exam: ExamSlug, slug: string, prefix: string, accentClass: string) {
    const meta = questionMeta[exam]?.[slug];
    const examInfo = EXAM_LIST.find((ex) => ex.slug === exam);
    const href = `${examInfo?.questionPathPrefix ?? "/"}${slug}/`;
    return (
      <a
        key={slug}
        href={href}
        className="block py-2 no-underline border-b border-[color:var(--c-border)] last:border-b-0 hover:bg-[color:var(--c-bg-alt)] -mx-2 px-2 rounded-sm"
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

  function renderSection(
    exam: ExamSlug,
    kind: SectionKind,
    rawSlugs: string[],
    label: string,
    accentClass: string,
    bgClass: string,
    prefix: string,
    defaultOpen: boolean,
    ctaLabel?: string,
  ) {
    if (rawSlugs.length === 0) return null;

    // 新しい順に表示（push される順序の逆）
    const reversed = [...rawSlugs].reverse();
    const filtered = applyFilter(exam, reversed);
    const expandKey = `${exam}-${kind}`;
    const isExpanded = expanded[expandKey];
    const visibleSlugs = isExpanded ? filtered : filtered.slice(0, PREVIEW_LIMIT);
    const hiddenCount = filtered.length - visibleSlugs.length;
    const counts = fieldCounts(exam, rawSlugs);
    const fields = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    const filterValue = fieldFilter[exam];
    const filterAvailable = fields.length > 1;
    const ctaTarget = filtered[0];

    return (
      <details className="mt-3" open={defaultOpen}>
        <summary className={`text-sm font-bold cursor-pointer ${accentClass} mb-2`}>
          {label} ({rawSlugs.length})
          {filterValue && <span className="ml-2 text-xs font-normal">— {filterValue} {filtered.length}件</span>}
        </summary>

        {filterAvailable && (
          <div className="mt-2 mb-3 flex flex-wrap gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setFieldFilter((p) => ({ ...p, [exam]: null }))}
              className={`px-2 py-0.5 rounded-full border transition-colors ${
                filterValue === null
                  ? "border-[color:var(--c-ink)] bg-[color:var(--c-ink)] text-white"
                  : "border-[color:var(--c-border)] text-[color:var(--c-text-sub)] hover:bg-[color:var(--c-bg-alt)]"
              }`}
            >
              すべて ({rawSlugs.length})
            </button>
            {fields.map((field) => (
              <button
                key={field}
                type="button"
                onClick={() => setFieldFilter((p) => ({ ...p, [exam]: filterValue === field ? null : field }))}
                className={`px-2 py-0.5 rounded-full border transition-colors ${
                  filterValue === field
                    ? "border-[color:var(--c-ink)] bg-[color:var(--c-ink)] text-white"
                    : "border-[color:var(--c-border)] text-[color:var(--c-text-sub)] hover:bg-[color:var(--c-bg-alt)]"
                }`}
              >
                {field} ({counts[field]})
              </button>
            ))}
          </div>
        )}

        <div className="mt-2">
          {visibleSlugs.map((slug) => renderQuestionRow(exam, slug, prefix, accentClass))}
          {filtered.length === 0 && (
            <p className="text-sm text-[color:var(--c-text-sub)] py-2">該当する問題はありません。</p>
          )}
        </div>

        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => toggleExpanded(expandKey)}
            className="text-xs text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] underline mt-3"
          >
            残り {hiddenCount} 件をすべて表示
          </button>
        )}
        {isExpanded && filtered.length > PREVIEW_LIMIT && (
          <button
            type="button"
            onClick={() => toggleExpanded(expandKey)}
            className="text-xs text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] underline mt-3 ml-3"
          >
            折りたたむ
          </button>
        )}

        {ctaLabel && ctaTarget && (
          <div className="mt-3">
            <a
              href={`${EXAM_LIST.find((e) => e.slug === exam)?.questionPathPrefix ?? "/"}${ctaTarget}/`}
              className={`inline-block text-xs px-3 py-1.5 rounded-full border ${bgClass} no-underline`}
            >
              {ctaLabel}
            </a>
          </div>
        )}
      </details>
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
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <div>
            <p className="text-2xl font-bold font-serif text-[color:var(--c-ink)]">{totalAttempted}</p>
            <p className="text-xs text-[color:var(--c-text-sub)]">解いた問題</p>
          </div>
          <div>
            <p className="text-2xl font-bold font-serif" style={{ color: totalAttempted > 0 ? "var(--c-ink)" : "var(--c-text-sub)" }}>{totalAttempted > 0 ? `${accuracyPct}%` : "—"}</p>
            <p className="text-xs text-[color:var(--c-text-sub)]">正答率</p>
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
          <div>
            <p className="text-2xl font-bold font-serif" style={{ color: totalGold > 0 ? "#ca8a04" : "var(--c-text-sub)" }}>🥇{totalGold}</p>
            <p className="text-xs text-[color:var(--c-text-sub)]">金メダル</p>
          </div>
        </div>
        {totalAttempted > 0 && (
          <p className="mt-4 text-xs text-[color:var(--c-text-sub)] leading-relaxed max-w-lg">
            正解すると🥈銀、もう一度正解で🥇金になります。間違えると🥉銅に戻ります。すべて金にするのが目標です。
          </p>
        )}

        {/* 正答率サマリ直下＝最もスコア結果に近い高intent面。誤答が一定数たまった人に、
            誤答が最も多い資格の講座／無料資料請求を提示（freeHref未設定なら無料CTAは非表示）。 */}
        {topWrongExam && totalWrong >= STUDY_AD_WRONG_THRESHOLD && (
          <aside className="mt-6 p-4 rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-bg)] text-xs text-[color:var(--c-text-sub)] flex flex-wrap items-baseline gap-x-2 gap-y-1 max-w-lg">
            <span className="tracking-wider border border-[color:var(--c-border)] px-1.5 py-0.5 rounded text-[10px]">広告</span>
            <span>正答率が伸び悩む分野は、講座で体系的に補うと近道です。</span>
            <FreeLeadCTA exam={topWrongExam} placement="study_summary" />
            <AffiliateLink
              href={EXAM_AFFILIATE[topWrongExam].href}
              course={EXAM_AFFILIATE[topWrongExam].course}
              placement="study_summary"
              className="text-blue-700 hover:underline font-medium"
            >
              {EXAM_AFFILIATE[topWrongExam].label} →
            </AffiliateLink>
          </aside>
        )}
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

            {renderSection(
              e.slug,
              "wrong",
              p.wrong,
              "間違えた問題",
              "text-red-700",
              "bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
              "✗",
              true,
              "間違えた問題から再挑戦 →",
            )}

            {/* 弱点連動広告（誤答が多い資格＝講座CVに最も近い文脈。控えめに1枠） */}
            {adExams.has(e.slug) && (
              <aside className="mt-3 p-3 rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)] text-xs text-[color:var(--c-text-sub)] flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="tracking-wider border border-[color:var(--c-border)] px-1.5 py-0.5 rounded text-[10px]">広告</span>
                <span>間違えた問題が続く分野は、講座で体系的に補うのも手です。</span>
                <FreeLeadCTA exam={e.slug} placement="study" />
                <AffiliateLink
                  href={EXAM_AFFILIATE[e.slug].href}
                  course={EXAM_AFFILIATE[e.slug].course}
                  placement="study"
                  className="text-blue-700 hover:underline font-medium"
                >
                  {EXAM_AFFILIATE[e.slug].label} →
                </AffiliateLink>
              </aside>
            )}

            {renderSection(
              e.slug,
              "bookmarks",
              p.bookmarks,
              "ブックマーク",
              "text-amber-800",
              "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100",
              "★",
              true,
              "ブックマークから見直す →",
            )}

            {renderSection(
              e.slug,
              "correct",
              p.correct,
              "正解した問題",
              "text-green-700",
              "bg-green-50 border-green-200 text-green-700 hover:bg-green-100",
              "✓",
              false,
              undefined,
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
          ブラウザのデータを削除すると履歴も消えます。一覧は新しい順に表示しています。
        </p>
      </section>
    </div>
  );
}
