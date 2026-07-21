import { getAllChizaiQuestions, getChizaiQuestionsByField } from "@/lib/chizai-questions";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import ChizaiCourseAd from "@/components/ChizaiCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import { CHIZAI_EXAMS, nextExam, daysUntil, formatExamDateJa } from "@/lib/exam-dates";

export const metadata: Metadata = pageMetadata({
  path: "/chizai/",
  title: "知的財産管理技能検定3級 試験対策｜オリジナル200問を無料で",
  description: "知的財産管理技能検定3級のオリジナル練習問題200問を詳細解説。特許法・著作権法・意匠法・商標法・不正競争防止法・国際条約などを収録。",
});

const fields = [
  { name: "特許法", slug: "patent" },
  { name: "著作権法", slug: "copyright" },
  { name: "意匠法", slug: "design" },
  { name: "商標法", slug: "trademark" },
  { name: "不正競争防止法", slug: "unfair" },
  { name: "関連法規", slug: "related" },
  { name: "実用新案法・種苗法", slug: "utility" },
  { name: "国際条約", slug: "treaty" },
  { name: "知財実務", slug: "practice" },
];

export default async function ChizaiPage() {
  const allQuestions = await getAllChizaiQuestions();
  const allColumns = await getAllColumns();
  const chizaiColumns = allColumns.filter((c) => c.slug.startsWith("chizai-"));

  const fieldCounts = await Promise.all(
    fields.map(async (f) => {
      const qs = await getChizaiQuestionsByField(f.name);
      return qs.length;
    })
  );

  // 試験日カウントダウン (公式発表済みの日付リストから次回を自動選択)
  const upcoming = nextExam(CHIZAI_EXAMS);
  const daysLeft = upcoming ? daysUntil(upcoming) : 0;

  return (
    <div className="theme-chizai pb-16">
      {/* Hero */}
      <section
        className="-mx-4 px-4 py-10 sm:py-14 border-y mb-10"
        style={{ background: "var(--c-chizai-soft)", borderColor: "var(--c-border)" }}
      >
        <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
          <a href="/" className="no-underline hover:underline">ホーム</a> / <span>知的財産管理技能検定3級</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight" style={{ color: "var(--c-chizai-ink)" }}>
          知的財産管理技能検定 3級
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-chizai)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-chizai-ink)" }}>
          特許・著作権・商標…　9つの分野を横断する{allQuestions.length}問。
          知財の実務で最初に目指す国家資格です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/chizai/q/chizai-001/" className="btn-accent">問題を解き始める →</a>
          <a
            href="/chizai/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-chizai-soft)]"
            style={{ borderColor: "var(--c-chizai)", color: "var(--c-chizai-ink)" }}
          >
            模擬試験を受ける（30問・45分・合否判定）→
          </a>
          <a
            href="/chizai/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-chizai-soft)]"
            style={{ borderColor: "var(--c-chizai)", color: "var(--c-chizai-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </a>
        </div>
        <p className="mt-4 text-xs text-[color:var(--c-text-sub)]">
          3級に慣れたら <a href="/chizai2/" className="underline hover:no-underline" style={{ color: "var(--c-chizai-ink)" }}>知的財産管理技能検定2級</a> へ。
        </p>
      </section>

      {/* カウントダウン */}
      {upcoming && daysLeft > 0 && (
        <section className="mb-10 card p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-[color:var(--c-text-sub)] mb-1">次回試験（{upcoming.label}）まで</p>
            <p className="text-lg font-bold font-serif" style={{ color: "var(--c-chizai)" }}>あと {daysLeft} 日</p>
          </div>
          <p className="text-sm text-[color:var(--c-text-sub)]">{formatExamDateJa(upcoming)}</p>
        </section>
      )}

      {/* 分野 - タグクラウド風 */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="flex flex-wrap gap-3">
          {fields.map((f, i) => (
            <a
              key={f.slug}
              href={`/chizai/field/${f.slug}/`}
              className="no-underline group"
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all group-hover:shadow-sm"
                style={{
                  background: "var(--c-surface)",
                  color: "var(--c-chizai-ink)",
                  borderColor: "var(--c-chizai-soft)",
                }}
              >
                {f.name}
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{ background: "var(--c-chizai-soft)", color: "var(--c-chizai-ink)" }}
                >
                  {fieldCounts[i]}
                </span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* 学科 vs 実技 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">学科試験と実技試験</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="card p-5">
            <p className="text-sm font-bold text-[color:var(--c-ink)] mb-2 font-serif">学科試験</p>
            <p className="text-xs text-[color:var(--c-text-sub)] leading-relaxed">
              30問・45分・3肢択一。条文や制度の知識を問う基礎問題です。合格基準は70%以上。
            </p>
          </div>
          <div className="card p-5">
            <p className="text-sm font-bold text-[color:var(--c-ink)] mb-2 font-serif">実技試験</p>
            <p className="text-xs text-[color:var(--c-text-sub)] leading-relaxed">
              30問・45分・3肢択一。事例問題を読んで適切な対応を選ぶ、実務寄りの問題です。
            </p>
          </div>
        </div>
        <p className="text-xs text-[color:var(--c-text-sub)] mt-3">
          学科と実技はそれぞれ独立しています。両方に合格すると3級の資格が認定されます。
        </p>
        <p className="text-xs text-[color:var(--c-text-sub)] mt-2">
          第47回検定からCBT方式（コンピュータ受験）が導入され、申込時に従来の紙試験かCBT方式かを選択できます。
        </p>
      </section>

      {/* 試験概要 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p><span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年3回（3月・7月・11月）　<a href="/column/chizai-nittei/" className="underline hover:no-underline">詳しい日程・申込方法 →</a></p>
          <p><span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　学科30問 + 実技30問（各45分・3肢択一）。紙試験／CBT方式を選択可（第47回検定から）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　学科・実技ともに70%以上</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　学科6,100円 + 実技6,100円</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　知的財産教育協会</p>
        </div>
      </section>

      <ChizaiCourseAd
        headline="9分野を効率よく対策するなら"
        body="知的財産管理技能検定は出題範囲が9分野と広く、市販教材も限られる試験です。月額制のオンライン講座オンスク.JPは知財検定3級講座を提供しており、スキマ時間で全分野を体系的に押さえられます。"
      />

      {/* コラム */}
      {chizaiColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {chizaiColumns.slice(0, 6).map((col) => (
              <a
                key={col.slug}
                href={`/column/${col.slug}/`}
                className="block py-2 text-sm text-[color:var(--c-text)] no-underline hover:text-[color:var(--c-chizai)] border-b border-[color:var(--c-border)] last:border-b-0"
              >
                {col.title}
              </a>
            ))}
          </div>
          {chizaiColumns.length > 6 && (
            <a href="/column/#chizai" className="inline-block mt-4 text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-chizai)] underline">
              知的財産管理技能検定3級のコラムをすべて見る →
            </a>
          )}
        </section>
      )}
    </div>
  );
}
