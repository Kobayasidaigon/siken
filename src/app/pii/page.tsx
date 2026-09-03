import { getAllPiiQuestions, getPiiQuestionsByField } from "@/lib/pii-questions";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import PiiCourseAd from "@/components/PiiCourseAd";
import { PII_TOP_AD } from "@/lib/pii-ad-content";
import { pageMetadata } from "@/lib/page-metadata";
import { PII_EXAMS } from "@/lib/exam-dates";
import ExamCountdown from "@/components/ExamCountdown";
import Moshi2TopLink from "@/components/Moshi2TopLink";

export const metadata: Metadata = pageMetadata({
  path: "/pii/",
  title: "個人情報保護士 練習問題・過去問対策【全337問・無料】",
  description: "個人情報保護士認定試験のオリジナル練習問題337問を無料公開。個人情報保護法・マイナンバー法・情報セキュリティの3分野を、根拠条文つきの詳細解説で演習できます。",
});

const fields = [
  {
    name: "個人情報保護法",
    slug: "hogo-law",
    task: "課題Ⅰ",
    desc: "個人情報の定義、取扱いルール、安全管理措置、第三者提供、本人の権利",
  },
  {
    name: "マイナンバー法",
    slug: "mynumber",
    task: "課題Ⅰ",
    desc: "個人番号の取扱い、特定個人情報の安全管理、利用範囲",
  },
  {
    name: "情報セキュリティ",
    slug: "security",
    task: "課題Ⅱ",
    desc: "脅威と対策、組織・人的・物理的・技術的セキュリティ、暗号と認証",
  },
];

export default async function PiiPage() {
  const allQuestions = await getAllPiiQuestions();
  const allColumns = await getAllColumns();
  const piiColumns = allColumns.filter((c) => c.slug.startsWith("pii-"));

  const fieldCounts = await Promise.all(
    fields.map(async (f) => {
      const qs = await getPiiQuestionsByField(f.name);
      return qs.length;
    })
  );

  // 試験日カウントダウン (公式発表済みの日付リストから次回を自動選択)
  return (
    <div className="theme-pii pb-16">
      {/* Hero */}
      <section
        className="-mx-4 px-4 py-10 sm:py-14 border-y mb-10"
        style={{ background: "var(--c-pii-soft)", borderColor: "var(--c-border)" }}
      >
        <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
          <a href="/" className="no-underline hover:underline">ホーム</a> / <span>個人情報保護士</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight" style={{ color: "var(--c-pii-ink)" }}>
          個人情報保護士
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-pii-ink)" }}>
          個人情報を守る側の視点で解く、{allQuestions.length}問。
          法律と情報セキュリティ、両方の知識が問われる認定試験です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/pii/q/pii-001/" className="btn-accent">問題を解き始める →</a>
          <a
            href="/pii/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            模擬試験を受ける（100問・150分・課題別判定）→
          </a>
          <Moshi2TopLink certId="pii" />
          <a
            href="/pii/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </a>
        </div>
      </section>

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示 */}
      <ExamCountdown
        exams={PII_EXAMS}
        accent="var(--c-pii)"
        accentSoft="var(--c-pii-soft)"
        apply={{
          href: "https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.joho-gakushu.or.jp%2Fpiip%2F",
          course: "pii",
          pixel: "https://www11.a8.net/0.gif?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2",
        }}
      />

      {/* 分野 - 縦1列の大きめカード */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {fields.map((f, i) => (
            <a
              key={f.slug}
              href={`/pii/field/${f.slug}/`}
              className="card p-5 no-underline group block"
              style={{ borderLeft: "3px solid var(--c-pii)" }}
            >
              <div className="flex items-start justify-between mb-1 gap-3">
                <div>
                  <p className="text-base font-bold text-[color:var(--c-ink)] font-serif">{f.name}</p>
                  <p className="text-xs text-[color:var(--c-text-sub)] mt-0.5">出題：{f.task}</p>
                </div>
                <span className="text-xs text-[color:var(--c-text-sub)] shrink-0">{fieldCounts[i]}問</span>
              </div>
              <p className="text-sm text-[color:var(--c-text-sub)] mt-2 leading-relaxed">{f.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* この資格を受けるのは */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">この資格を受けるのはどんな人</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>個人情報保護の担当者、コンプライアンス部門の方、企業の法務・総務の方がよく受験されています。</p>
          <p>最近は、マーケティング担当者やシステム開発者が受けるケースも増えています。個人データの扱いが業務に関わる方なら、取得しておいて損はない資格です。</p>
        </div>
      </section>

      {/* 試験概要 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p><span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年4回（6月・9月・12月・3月頃）　<a href="/column/pii-nittei/" className="underline hover:no-underline">詳しい日程・申込方法 →</a></p>
          <p><span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　マークシート 100問（課題Ⅰ 50問 + 課題Ⅱ 50問）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">試験時間</span>　150分</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　各課題70%以上</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　11,000円（公開会場・税込）／CBT会場 +1,500円／オンラインIBT +3,000円</p>
        </div>
      </section>

      <PiiCourseAd headline={PII_TOP_AD.headline} body={PII_TOP_AD.body} />

      {/* コラム */}
      {piiColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {piiColumns.slice(0, 6).map((col) => (
              <a
                key={col.slug}
                href={`/column/${col.slug}/`}
                className="block py-2 text-sm text-[color:var(--c-text)] no-underline hover:text-[color:var(--c-pii)] border-b border-[color:var(--c-border)] last:border-b-0"
              >
                {col.title}
              </a>
            ))}
          </div>
          {piiColumns.length > 6 && (
            <a href="/column/#pii" className="inline-block mt-4 text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-pii)] underline">
              個人情報保護士のコラムをすべて見る →
            </a>
          )}
        </section>
      )}
    </div>
  );
}
