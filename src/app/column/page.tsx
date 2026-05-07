import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import ColumnFilter from "./ColumnFilter";

export const metadata: Metadata = {
  title: "コラム一覧｜資格試験の勉強法・合格率・試験日程",
  description: "シカクモンが扱う各資格試験のコラム。合格率・勉強法・試験日程・おすすめテキストなどの情報を資格別に整理。",
};

interface ExamGroup {
  id: string;
  examName: string;
  shortName: string;
  topPath: string;
  themeKey: "kashikin" | "pii" | "chizai";
  matcher: (slug: string) => boolean;
}

const examGroups: ExamGroup[] = [
  {
    id: "kashikin",
    examName: "貸金業務取扱主任者",
    shortName: "貸金",
    topPath: "/kashikin/",
    themeKey: "kashikin",
    matcher: (slug) =>
      slug.startsWith("kashikin-") ||
      ["goukakuritsu", "benkyouhou", "osusume-text", "shiken-nittei", "kashikingyou-toha", "benkyou-jikan", "takken-hikaku"].includes(slug),
  },
  {
    id: "pii",
    examName: "個人情報保護士",
    shortName: "個情保",
    topPath: "/pii/",
    themeKey: "pii",
    matcher: (slug) => slug.startsWith("pii-"),
  },
  {
    id: "chizai",
    examName: "知的財産管理技能検定3級",
    shortName: "知財3級",
    topPath: "/chizai/",
    themeKey: "chizai",
    matcher: (slug) => slug.startsWith("chizai-"),
  },
  {
    id: "mynumber",
    examName: "マイナンバー実務検定3級",
    shortName: "マイナンバー",
    topPath: "/mynumber/",
    themeKey: "pii",
    matcher: (slug) => slug.startsWith("mynumber-"),
  },
  {
    id: "jitsumu",
    examName: "個人情報保護実務検定3級",
    shortName: "個情保実務",
    topPath: "/jitsumu/",
    themeKey: "pii",
    matcher: (slug) => slug.startsWith("jitsumu-"),
  },
  {
    id: "bijihou",
    examName: "ビジネス実務法務検定3級",
    shortName: "ビジ法",
    topPath: "/bijihou/",
    themeKey: "kashikin",
    matcher: (slug) => slug.startsWith("bijihou-"),
  },
];

const themeColor = {
  kashikin: { main: "#c2410c", soft: "#fde6d3", ink: "#7c2d12" },
  pii: { main: "#15803d", soft: "#d7ebd9", ink: "#14532d" },
  chizai: { main: "#6d28d9", soft: "#e6ddf4", ink: "#4c1d95" },
};

export default async function ColumnIndexPage() {
  const columns = await getAllColumns();

  const groups = examGroups.map((g) => {
    const colors = themeColor[g.themeKey];
    const items = columns
      .filter((c) => g.matcher(c.slug))
      .map((c) => ({
        slug: c.slug,
        title: c.title,
        description: c.description,
        publishedAt: c.publishedAt,
        examId: g.id,
        examName: g.examName,
        themeMain: colors.main,
        themeSoft: colors.soft,
        themeInk: colors.ink,
      }));
    return {
      id: g.id,
      examName: g.examName,
      shortName: g.shortName,
      topPath: g.topPath,
      themeMain: colors.main,
      themeSoft: colors.soft,
      themeInk: colors.ink,
      items,
    };
  });

  const totalCount = columns.length;
  const examCount = groups.filter((g) => g.items.length > 0).length;

  return (
    <div className="pb-16">
      {/* ヒーローセクション */}
      <section className="-mx-4 px-4 py-10 sm:py-12 mb-2 border-b border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[color:var(--c-ink)] mb-3 font-serif leading-tight">
          コラム
        </h1>
        <p className="text-sm text-[color:var(--c-text-sub)] leading-relaxed max-w-lg">
          各資格の合格率・勉強法・試験日程など、受験者が知りたい情報をまとめています。
        </p>
        <div className="mt-6 flex gap-6 text-sm">
          <div>
            <p className="text-2xl font-bold font-serif text-[color:var(--c-ink)]">{totalCount}</p>
            <p className="text-xs text-[color:var(--c-text-sub)]">記事</p>
          </div>
          <div>
            <p className="text-2xl font-bold font-serif text-[color:var(--c-ink)]">{examCount}</p>
            <p className="text-xs text-[color:var(--c-text-sub)]">対応資格</p>
          </div>
        </div>
      </section>

      {/* 資格ハブカード */}
      <section className="mb-10 mt-8">
        <h2 className="text-sm font-bold text-[color:var(--c-text-sub)] mb-4 uppercase tracking-wider">資格から選ぶ</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {groups.map((g) => {
            if (g.items.length === 0) return null;
            return (
              <a
                key={g.id}
                href={`#${g.id}`}
                className="card p-4 no-underline group block transition-transform hover:-translate-y-0.5"
                style={{ borderTop: `3px solid ${g.themeMain}` }}
              >
                <p className="text-sm font-bold font-serif mb-1" style={{ color: g.themeInk }}>
                  {g.shortName}
                </p>
                <p className="text-xs text-[color:var(--c-text-sub)] mb-2 line-clamp-1">{g.examName}</p>
                <p className="text-[11px] text-[color:var(--c-text-sub)]">
                  <span className="font-bold" style={{ color: g.themeMain }}>{g.items.length}</span>
                  本のコラム
                </p>
              </a>
            );
          })}
        </div>
      </section>

      <ColumnFilter groups={groups} totalCount={totalCount} />
    </div>
  );
}
