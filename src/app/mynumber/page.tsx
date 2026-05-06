import { getAllMynumberQuestions, getMynumberQuestionsByField } from "@/lib/mynumber-questions";
import type { Metadata } from "next";
import MynumberCourseAd from "@/components/MynumberCourseAd";
import { MYNUMBER_TOP_AD } from "@/lib/mynumber-ad-content";

export const metadata: Metadata = {
  title: "マイナンバー実務検定3級 試験対策｜オリジナル200問を無料で",
  description: "マイナンバー実務検定3級のオリジナル練習問題200問を詳細解説。番号法・個人番号カード・特定個人情報保護・事業者の取扱いを収録。",
};

const fields = [
  { name: "番号法の概要", slug: "outline", desc: "番号法の目的、利用範囲、個人番号・法人番号の定義、本人確認" },
  { name: "個人番号カード・利用", slug: "card", desc: "個人番号カード、電子証明書、マイナポータル、社会保障分野での利用" },
  { name: "特定個人情報保護", slug: "protection", desc: "提供制限、情報提供ネットワークシステム、PIA、個人情報保護法との関係" },
  { name: "事業者の取扱い", slug: "business", desc: "本人確認、利用目的、安全管理措置、委託先の監督" },
  { name: "法人番号・罰則・実務", slug: "practice", desc: "法人番号、罰則規定、個人情報保護委員会、実務上のトラブル対応" },
];

export default async function MynumberPage() {
  const allQuestions = await getAllMynumberQuestions();

  const fieldCounts = await Promise.all(
    fields.map(async (f) => {
      const qs = await getMynumberQuestionsByField(f.name);
      return qs.length;
    })
  );

  return (
    <div className="theme-pii pb-16">
      <section
        className="-mx-4 px-4 py-10 sm:py-14 border-y mb-10"
        style={{ background: "var(--c-pii-soft)", borderColor: "var(--c-border)" }}
      >
        <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
          <a href="/" className="no-underline hover:underline">ホーム</a> / <span>マイナンバー実務検定3級</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight" style={{ color: "var(--c-pii-ink)" }}>
          マイナンバー実務検定3級
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-pii-ink)" }}>
          番号法と個人番号の基本知識を問う、{allQuestions.length}問のオリジナル練習問題集です。
        </p>
        <div className="mt-6">
          <a href="/mynumber/q/mynumber-001/" className="btn-accent">問題を解き始める →</a>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {fields.map((f, i) => (
            <a key={f.slug} href={`/mynumber/field/${f.slug}/`} className="card p-5 no-underline group block" style={{ borderLeft: "3px solid var(--c-pii)" }}>
              <div className="flex items-start justify-between mb-1 gap-3">
                <p className="text-base font-bold text-[color:var(--c-ink)] font-serif">{f.name}</p>
                <span className="text-xs text-[color:var(--c-text-sub)] shrink-0">{fieldCounts[i]}問</span>
              </div>
              <p className="text-sm text-[color:var(--c-text-sub)] mt-2 leading-relaxed">{f.desc}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p><span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　マークシート 50問・75分</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　70%以上</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　7,000円（3級・税込）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年複数回（協会の公式サイトで確認）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　全日本情報学習振興協会</p>
        </div>
      </section>

      <MynumberCourseAd headline={MYNUMBER_TOP_AD.headline} body={MYNUMBER_TOP_AD.body} />
    </div>
  );
}
