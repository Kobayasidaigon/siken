import { getAllPiiQuestions, getPiiQuestionsByField } from "@/lib/pii-questions";
import type { Metadata } from "next";
import PiiCourseAd from "@/components/PiiCourseAd";

export const metadata: Metadata = {
  title: "個人情報保護士 試験対策｜オリジナル300問を無料で",
  description: "個人情報保護士認定試験のオリジナル練習問題300問を詳細解説。個人情報保護法・マイナンバー法・情報セキュリティの3分野を収録。",
};

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

  const fieldCounts = await Promise.all(
    fields.map(async (f) => {
      const qs = await getPiiQuestionsByField(f.name);
      return qs.length;
    })
  );

  // 試験日カウントダウン（2026年6月21日）
  const examDate = new Date("2026-06-21");
  const today = new Date();
  const daysLeft = Math.max(0, Math.floor((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

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
        <div className="mt-6">
          <a href="/pii/q/pii-001/" className="btn-accent">問題を解き始める →</a>
        </div>
      </section>

      {/* カウントダウン */}
      {daysLeft > 0 && (
        <section className="mb-10 card p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-[color:var(--c-text-sub)] mb-1">次回試験まで</p>
            <p className="text-lg font-bold font-serif" style={{ color: "var(--c-pii)" }}>あと {daysLeft} 日</p>
          </div>
          <p className="text-sm text-[color:var(--c-text-sub)]">2026年6月21日（日）</p>
        </section>
      )}

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
          <p><span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年3〜4回（6月・9月・12月・3月頃）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　マークシート 100問（課題Ⅰ 50問 + 課題Ⅱ 50問）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">試験時間</span>　150分</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　各課題70%以上</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　11,000円（税込）</p>
        </div>
      </section>

      <PiiCourseAd />
    </div>
  );
}
