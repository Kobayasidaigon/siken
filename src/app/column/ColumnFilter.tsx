"use client";

import { useState, useMemo } from "react";

interface ColumnItem {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  examId: string;
  examName: string;
  themeMain: string;
  themeSoft: string;
  themeInk: string;
}

interface Group {
  id: string;
  examName: string;
  shortName: string;
  topPath: string;
  themeMain: string;
  themeSoft: string;
  themeInk: string;
  items: ColumnItem[];
}

interface Props {
  groups: Group[];
  totalCount: number;
}

export default function ColumnFilter({ groups, totalCount }: Props) {
  const [query, setQuery] = useState("");
  const [activeExam, setActiveExam] = useState<string>("all");

  const filtered = useMemo(() => {
    return groups.map((g) => {
      let items = g.items;
      if (activeExam !== "all" && activeExam !== g.id) {
        items = [];
      }
      if (query.trim()) {
        const q = query.toLowerCase();
        items = items.filter(
          (it) =>
            it.title.toLowerCase().includes(q) ||
            it.description.toLowerCase().includes(q)
        );
      }
      return { ...g, items };
    });
  }, [groups, query, activeExam]);

  const filteredCount = filtered.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <>
      {/* 検索＋フィルタバー */}
      <div className="mb-8 sticky top-16 z-30 bg-[color:var(--c-bg)] py-3 border-b border-[color:var(--c-border)] -mx-4 px-4">
        <div className="relative mb-3">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--c-text-sub)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="記事を検索（合格率、勉強法、過去問など）"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-surface)] focus:outline-none focus:border-[color:var(--c-ink)] transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setActiveExam("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeExam === "all"
                ? "bg-[color:var(--c-ink)] text-white"
                : "bg-[color:var(--c-surface)] text-[color:var(--c-text-sub)] border border-[color:var(--c-border)] hover:border-[color:var(--c-ink)]"
            }`}
          >
            すべて
          </button>
          {groups.map((g) => {
            const isActive = activeExam === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setActiveExam(g.id)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all border"
                style={{
                  background: isActive ? g.themeMain : "var(--c-surface)",
                  color: isActive ? "white" : g.themeInk,
                  borderColor: isActive ? g.themeMain : g.themeSoft,
                }}
              >
                {g.shortName}
                <span className="ml-1.5 text-[10px] opacity-70">{g.items.length}</span>
              </button>
            );
          })}
        </div>
        {(query || activeExam !== "all") && (
          <p className="text-xs text-[color:var(--c-text-sub)] mt-3">
            {filteredCount}件 表示中{" "}
            <button
              onClick={() => {
                setQuery("");
                setActiveExam("all");
              }}
              className="text-[color:var(--c-ink)] underline ml-2"
            >
              リセット
            </button>
          </p>
        )}
      </div>

      {/* セクション一覧 */}
      <div className="space-y-12">
        {filtered.map((g) => {
          if (g.items.length === 0) return null;
          const featured = g.items[0];
          const rest = g.items.slice(1);

          return (
            <section key={g.id} id={g.id} className="scroll-mt-32">
              <div className="flex items-baseline gap-3 mb-5">
                <div className="w-1 h-5 rounded-full" style={{ background: g.themeMain }}></div>
                <h2 className="text-lg font-bold font-serif" style={{ color: g.themeInk }}>
                  {g.examName}
                </h2>
                <span className="text-xs text-[color:var(--c-text-sub)]">{g.items.length}本</span>
                <a
                  href={g.topPath}
                  className="text-xs text-[color:var(--c-text-sub)] hover:underline ml-auto no-underline"
                >
                  試験ページへ →
                </a>
              </div>

              {/* フィーチャー記事 */}
              <a
                href={`/column/${featured.slug}/`}
                className="card no-underline group block mb-3 overflow-hidden"
                style={{ borderLeft: `4px solid ${g.themeMain}` }}
              >
                <div className="p-5">
                  <div
                    className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-2"
                    style={{ background: g.themeSoft, color: g.themeInk }}
                  >
                    PICK UP
                  </div>
                  <h3 className="text-base sm:text-lg font-bold font-serif text-[color:var(--c-ink)] mb-2 leading-snug group-hover:opacity-80 transition-opacity">
                    {featured.title}
                  </h3>
                  <p className="text-sm text-[color:var(--c-text-sub)] line-clamp-2 leading-relaxed">
                    {featured.description}
                  </p>
                  <p className="text-[11px] text-[color:var(--c-text-sub)] mt-3 opacity-70">
                    {featured.publishedAt}
                  </p>
                </div>
              </a>

              {/* 残りの記事 */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {rest.map((col) => (
                    <a
                      key={col.slug}
                      href={`/column/${col.slug}/`}
                      className="card p-3 no-underline group block transition-transform hover:-translate-y-0.5"
                      style={{ borderLeft: `2px solid ${g.themeMain}` }}
                    >
                      <p className="text-sm font-medium text-[color:var(--c-ink)] mb-1 line-clamp-2 leading-snug group-hover:opacity-80 transition-opacity">
                        {col.title}
                      </p>
                      <p className="text-[11px] text-[color:var(--c-text-sub)] line-clamp-1">
                        {col.description}
                      </p>
                    </a>
                  ))}
                </div>
              )}
            </section>
          );
        })}

        {filteredCount === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-[color:var(--c-text-sub)]">該当する記事がありません</p>
            <button
              onClick={() => {
                setQuery("");
                setActiveExam("all");
              }}
              className="mt-3 text-sm text-[color:var(--c-ink)] underline"
            >
              フィルタをリセット
            </button>
          </div>
        )}
      </div>

      {/* 件数フッター */}
      {filteredCount > 0 && filteredCount < totalCount && (
        <p className="text-xs text-[color:var(--c-text-sub)] text-center mt-12">
          {totalCount}本中 {filteredCount}本を表示中
        </p>
      )}
    </>
  );
}
