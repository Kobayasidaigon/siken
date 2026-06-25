import { getAllQuestions } from "@/lib/questions";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import KashikinCourseAd from "@/components/KashikinCourseAd";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  path: "/kashikin/",
  title: "貸金業務取扱主任者 試験対策｜オリジナル504問を無料で",
  description: "貸金業務取扱主任者試験のオリジナル練習問題504問を詳細解説。分野別に整理し、根拠条文を添えた解説付きで本試験に備えられます。",
});

export default async function KashikinPage() {
  const questions = await getAllQuestions();
  const columns = await getAllColumns();
  const totalQuestions = questions.length;

  // 試験日カウントダウン（2026年11月第3日曜日 = 2026/11/15）
  const examDate = new Date("2026-11-15");
  const today = new Date();
  const daysLeft = Math.max(0, Math.floor((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  const fields = [
    { name: "貸金業法", slug: "kashikingyouhou", topic: "登録・監督・業務規制・取立てルール", count: questions.filter(q => q.field === "貸金業法").length },
    { name: "利息制限法・出資法", slug: "risoku", topic: "上限金利と超過利息の罰則", count: questions.filter(q => q.field === "利息制限法・出資法").length },
    { name: "民法・民事訴訟法", slug: "minpou", topic: "契約・保証・時効・強制執行", count: questions.filter(q => q.field === "民法・民事訴訟法").length },
    { name: "資金需要者等の保護", slug: "hogo", topic: "個人情報保護と消費者契約", count: questions.filter(q => q.field === "資金需要者等の保護").length },
  ];

  return (
    <div className="theme-kashikin pb-16">
      {/* Hero */}
      <section
        className="-mx-4 px-4 py-10 sm:py-14 border-y mb-10"
        style={{ background: "var(--c-kashikin-soft)", borderColor: "var(--c-border)" }}
      >
        <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
          <a href="/" className="no-underline hover:underline">ホーム</a> / <span>貸金業務取扱主任者</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight" style={{ color: "var(--c-kashikin-ink)" }}>
          貸金業務取扱主任者
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-kashikin)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-kashikin-ink)" }}>
          {totalQuestions}問、4分野。年1回の本試験まで逆算して解く、オリジナル練習問題集です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/exam/0/" className="btn-accent">問題を解き始める →</a>
          <a
            href="/kashikin/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-kashikin-soft)]"
            style={{ borderColor: "var(--c-kashikin)", color: "var(--c-kashikin-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </a>
        </div>
      </section>

      {/* カウントダウン（貸金固有） */}
      {daysLeft > 0 && (
        <section className="mb-10 card p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-[color:var(--c-text-sub)] mb-1">次回本試験まで</p>
            <p className="text-lg font-bold font-serif" style={{ color: "var(--c-kashikin)" }}>あと {daysLeft} 日</p>
          </div>
          <p className="text-sm text-[color:var(--c-text-sub)]">2026年11月15日（日）予定</p>
        </section>
      )}

      {/* 分野別 */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map((f) => (
            <a
              key={f.slug}
              href={`/field/${f.slug}/`}
              className="card p-4 no-underline group block"
              style={{ borderLeft: "3px solid var(--c-kashikin)" }}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-[color:var(--c-ink)]">{f.name}</p>
                <span className="text-xs text-[color:var(--c-text-sub)]">{f.count}問</span>
              </div>
              <p className="text-xs text-[color:var(--c-text-sub)]">{f.topic}</p>
            </a>
          ))}
        </div>
      </section>

      {/* 試験概要 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p><span className="font-bold text-[color:var(--c-ink)]">試験日</span>　毎年11月第3日曜日（年1回）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　四肢択一 50問・2時間</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　概ね30/50点以上</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　8,500円</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　日本貸金業協会</p>
        </div>
      </section>

      <KashikinCourseAd
        headline="本試験まで逆算で対策するなら"
        body="貸金業務取扱主任者は市販の問題集が少なく、独学で進めにくい試験です。通信講座のアガルートアカデミーは貸金業務取扱主任者講座を提供しており、頻出論点と法改正への対応を体系的に押さえられます。"
      />

      {/* コラム（貸金関連のみ） */}
      {(() => {
        const kashikinSlugSet = new Set([
          "goukakuritsu", "benkyouhou", "osusume-text", "shiken-nittei",
          "kashikingyou-toha", "benkyou-jikan", "takken-hikaku",
        ]);
        const kashikinColumns = columns.filter(
          (c) => c.slug.startsWith("kashikin-") || kashikinSlugSet.has(c.slug)
        );
        if (kashikinColumns.length === 0) return null;
        return (
          <section className="border-t border-[color:var(--c-border)] pt-8">
            <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
            <div className="space-y-2">
              {kashikinColumns.slice(0, 6).map((col) => (
                <a
                  key={col.slug}
                  href={`/column/${col.slug}/`}
                  className="block py-2 text-sm text-[color:var(--c-text)] no-underline hover:text-[color:var(--c-kashikin)] border-b border-[color:var(--c-border)] last:border-b-0"
                >
                  {col.title}
                </a>
              ))}
            </div>
            {kashikinColumns.length > 6 && (
              <a href="/column/#kashikin" className="inline-block mt-4 text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-kashikin)] underline">
                貸金業務取扱主任者のコラムをすべて見る →
              </a>
            )}
          </section>
        );
      })()}
    </div>
  );
}
