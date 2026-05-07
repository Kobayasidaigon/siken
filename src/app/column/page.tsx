import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import type { ColumnData } from "@/lib/types";

export const metadata: Metadata = {
  title: "コラム一覧｜資格試験の勉強法・合格率・試験日程",
  description: "シカクモンが扱う各資格試験のコラム。合格率・勉強法・試験日程・おすすめテキストなどの情報を資格別に整理。",
};

interface ExamGroup {
  examName: string;
  topPath: string;
  themeKey: "kashikin" | "pii" | "chizai";
  matcher: (slug: string) => boolean;
}

const examGroups: ExamGroup[] = [
  {
    examName: "貸金業務取扱主任者",
    topPath: "/kashikin/",
    themeKey: "kashikin",
    matcher: (slug) =>
      slug.startsWith("kashikin-") ||
      ["goukakuritsu", "benkyouhou", "osusume-text", "shiken-nittei", "kashikingyou-toha", "benkyou-jikan", "takken-hikaku"].includes(slug),
  },
  {
    examName: "個人情報保護士",
    topPath: "/pii/",
    themeKey: "pii",
    matcher: (slug) => slug.startsWith("pii-"),
  },
  {
    examName: "知的財産管理技能検定3級",
    topPath: "/chizai/",
    themeKey: "chizai",
    matcher: (slug) => slug.startsWith("chizai-"),
  },
  {
    examName: "マイナンバー実務検定3級",
    topPath: "/mynumber/",
    themeKey: "pii",
    matcher: (slug) => slug.startsWith("mynumber-"),
  },
  {
    examName: "個人情報保護実務検定3級",
    topPath: "/jitsumu/",
    themeKey: "pii",
    matcher: (slug) => slug.startsWith("jitsumu-"),
  },
  {
    examName: "ビジネス実務法務検定3級",
    topPath: "/bijihou/",
    themeKey: "kashikin",
    matcher: (slug) => slug.startsWith("bijihou-"),
  },
];

const themeColor = {
  kashikin: { main: "var(--c-kashikin)", soft: "var(--c-kashikin-soft)", ink: "var(--c-kashikin-ink)" },
  pii: { main: "var(--c-pii)", soft: "var(--c-pii-soft)", ink: "var(--c-pii-ink)" },
  chizai: { main: "var(--c-chizai)", soft: "var(--c-chizai-soft)", ink: "var(--c-chizai-ink)" },
};

export default async function ColumnIndexPage() {
  const columns = await getAllColumns();

  // Group columns by exam
  const grouped: { group: ExamGroup; items: ColumnData[] }[] = examGroups.map((group) => ({
    group,
    items: columns.filter((c) => group.matcher(c.slug)),
  }));

  // Find columns not matching any exam (fallback)
  const unmatched = columns.filter((c) => !examGroups.some((g) => g.matcher(c.slug)));

  return (
    <div className="pb-16">
      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">コラム</h1>
      <p className="text-sm text-[color:var(--c-text-sub)] mb-8">資格別に整理しています。気になる資格のセクションから読んでみてください。</p>

      {columns.length === 0 ? (
        <p className="text-sm text-[color:var(--c-text-sub)]">記事を準備中です。</p>
      ) : (
        <div className="space-y-12">
          {grouped.map(({ group, items }) => {
            if (items.length === 0) return null;
            const colors = themeColor[group.themeKey];
            return (
              <section key={group.examName}>
                <div
                  className="flex items-baseline gap-3 mb-4 pb-2 border-b"
                  style={{ borderColor: "var(--c-border)" }}
                >
                  <h2 className="text-base font-bold font-serif" style={{ color: colors.ink }}>
                    {group.examName}
                  </h2>
                  <span className="text-xs text-[color:var(--c-text-sub)]">{items.length}本</span>
                  <a
                    href={group.topPath}
                    className="text-xs text-[color:var(--c-text-sub)] hover:underline ml-auto no-underline"
                  >
                    試験ページへ →
                  </a>
                </div>
                <div className="space-y-3">
                  {items.map((col) => (
                    <a
                      key={col.slug}
                      href={`/column/${col.slug}/`}
                      className="card p-4 no-underline group block"
                      style={{ borderLeft: `3px solid ${colors.main}` }}
                    >
                      <p className="text-sm font-bold text-[color:var(--c-ink)] group-hover:text-[color:var(--c-text-sub)] transition-colors">
                        {col.title}
                      </p>
                      <p className="text-xs text-[color:var(--c-text-sub)] mt-1 line-clamp-2 leading-relaxed">{col.description}</p>
                      <p className="text-[10px] text-[color:var(--c-text-sub)] mt-2">{col.publishedAt}</p>
                    </a>
                  ))}
                </div>
              </section>
            );
          })}

          {unmatched.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-[color:var(--c-ink)] font-serif mb-4 pb-2 border-b border-[color:var(--c-border)]">
                その他
              </h2>
              <div className="space-y-3">
                {unmatched.map((col) => (
                  <a key={col.slug} href={`/column/${col.slug}/`} className="card p-4 no-underline group block">
                    <p className="text-sm font-bold text-[color:var(--c-ink)]">{col.title}</p>
                    <p className="text-xs text-[color:var(--c-text-sub)] mt-1 line-clamp-2">{col.description}</p>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
