import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "シカクモン｜資格試験のオリジナル練習問題を無料で提供" },
  description: "シカクモンは資格試験のオリジナル練習問題を無料で提供するサイトです。貸金業務取扱主任者・個人情報保護士・知的財産管理技能検定3級/2級・マイナンバー実務検定3級・個人情報保護実務検定・ビジネス実務法務検定3級、合計1,804問。全問に根拠法令を含む詳細解説付き。",
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: "シカクモン｜資格試験のオリジナル練習問題を無料で提供",
    description: "貸金業務取扱主任者・個人情報保護士・知財3級・マイナンバー3級・個情保実務3級・ビジ法3級の6資格、合計1604問のオリジナル練習問題を無料公開。",
  },
};

export default function Home() {
  const exams = [
    {
      name: "貸金業務取扱主任者",
      slug: "kashikin",
      count: 504,
      fieldCount: 4,
      desc: "貸金業法・利息制限法・民法・資金需要者保護の4分野。貸金業者の営業所に設置義務がある国家資格です。",
      date: "2026年11月（年1回）",
      themeVar: "var(--c-kashikin)",
      softVar: "var(--c-kashikin-soft)",
    },
    {
      name: "個人情報保護士",
      slug: "pii",
      count: 300,
      fieldCount: 3,
      desc: "個人情報保護法・マイナンバー法・情報セキュリティの3分野。企業のコンプライアンス実務者向けの認定資格。",
      date: "2026年6月21日 / 9月27日",
      themeVar: "var(--c-pii)",
      softVar: "var(--c-pii-soft)",
    },
    {
      name: "知的財産管理技能検定3級",
      slug: "chizai",
      count: 200,
      fieldCount: 9,
      desc: "特許法・著作権法・商標法など9分野を横断する国家資格。知財の実務で最初に目指す級です。",
      date: "2026年7月12日",
      themeVar: "var(--c-chizai)",
      softVar: "var(--c-chizai-soft)",
    },
    {
      name: "知的財産管理技能検定2級",
      slug: "chizai2",
      count: 200,
      fieldCount: 9,
      desc: "3級の一歩先、実務で問われる応用レベル。特許・著作権・商標など9分野を、事例に沿ってより深く扱う国家資格です。",
      date: "2026年7月12日",
      themeVar: "var(--c-chizai)",
      softVar: "var(--c-chizai-soft)",
    },
    {
      name: "マイナンバー実務検定3級",
      slug: "mynumber",
      count: 200,
      fieldCount: 5,
      desc: "番号法・個人番号カード・特定個人情報保護を扱う民間資格。実務でマイナンバーを取り扱う方の基礎知識として。",
      date: "年複数回実施",
      themeVar: "var(--c-pii)",
      softVar: "var(--c-pii-soft)",
    },
    {
      name: "個人情報保護実務検定",
      slug: "jitsumu",
      count: 200,
      fieldCount: 5,
      desc: "個人情報保護法の実務的運用を問う民間資格。コンプライアンス担当者・人事総務向け。改正法対応の実務知識を習得できます。",
      date: "年複数回実施",
      themeVar: "var(--c-pii)",
      softVar: "var(--c-pii-soft)",
    },
    {
      name: "ビジネス実務法務検定3級",
      slug: "bijihou",
      count: 200,
      fieldCount: 5,
      desc: "民法・商法・会社法・関連法規（独禁法・消費者法・知財）を扱う検定試験。ビジネス現場の法的リスクを把握するための公的資格。",
      date: "年2回（6〜7月、10〜11月）",
      themeVar: "var(--c-kashikin)",
      softVar: "var(--c-kashikin-soft)",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://shikakumon.com/#organization",
        name: "シカクモン",
        url: "https://shikakumon.com",
      },
      {
        "@type": "WebSite",
        "@id": "https://shikakumon.com/#website",
        url: "https://shikakumon.com",
        name: "シカクモン",
        description: "資格試験のオリジナル練習問題を無料で提供するサイト。",
        publisher: { "@id": "https://shikakumon.com/#organization" },
        inLanguage: "ja",
      },
    ],
  };

  const totalCount = exams.reduce((sum, e) => sum + e.count, 0);
  const totalFieldCount = exams.reduce((sum, e) => sum + e.fieldCount, 0);
  const examCount = exams.length;
  const updateDate = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long" });

  return (
    <div className="pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="-mx-4 px-4 py-12 sm:py-16 bg-[color:var(--c-bg-alt)] border-y border-[color:var(--c-border)] mb-12">
        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-4xl font-bold text-[color:var(--c-ink)] mb-4 font-serif leading-tight">
            資格試験の練習問題を、<br />ひとつずつ。
          </h1>
          <p className="text-[color:var(--c-text-sub)] text-sm sm:text-base leading-relaxed max-w-lg">
            市販の問題集が少ない資格を、個人で作って公開しています。
            どの問題にも、なぜその答えになるのかを条文とセットで書きました。
          </p>
          <p className="text-[color:var(--c-text-sub)] text-xs mt-5 italic">
            熊太郎と申します。自分が受験したとき欲しかった問題集を、そのまま作りました。
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="mb-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-[color:var(--c-ink)] font-serif">{totalCount}</p>
            <p className="text-xs text-[color:var(--c-text-sub)] mt-1">問題数</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[color:var(--c-ink)] font-serif">{totalFieldCount}</p>
            <p className="text-xs text-[color:var(--c-text-sub)] mt-1">分野</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[color:var(--c-ink)] font-serif">{examCount}</p>
            <p className="text-xs text-[color:var(--c-text-sub)] mt-1">対応資格</p>
          </div>
          <div>
            <p className="text-sm font-bold text-[color:var(--c-ink)] font-serif pt-1.5">{updateDate}</p>
            <p className="text-xs text-[color:var(--c-text-sub)] mt-1">最終更新</p>
          </div>
        </div>
      </section>

      {/* Exams */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">いま解ける試験</h2>
        <div className="space-y-4">
          {exams.map((exam) => (
            <a
              key={exam.slug}
              href={`/${exam.slug}/`}
              className="card p-5 no-underline group block"
              style={{ borderLeft: `4px solid ${exam.themeVar}` }}
            >
              <div className="flex items-start justify-between mb-2 gap-3">
                <p className="text-base font-bold text-[color:var(--c-ink)] font-serif">{exam.name}</p>
                <span
                  className="text-xs px-2.5 py-1 rounded font-bold shrink-0"
                  style={{ background: exam.softVar, color: exam.themeVar }}
                >
                  {exam.count}問
                </span>
              </div>
              <p className="text-sm text-[color:var(--c-text-sub)] leading-relaxed">{exam.desc}</p>
              <p className="text-xs text-[color:var(--c-text-sub)] mt-3">次回試験：{exam.date}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Studio 案内 */}
      <section className="mb-12">
        <a
          href="https://studio.shikakumon.com/?utm_source=shikakumon&utm_medium=home_card"
          target="_blank"
          rel="noopener noreferrer"
          className="card p-6 no-underline block group"
          style={{ borderLeft: "4px solid var(--c-chizai)" }}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-xs font-bold mb-1" style={{ color: "var(--c-chizai)" }}>関連サービス</p>
              <h2 className="text-lg font-bold text-[color:var(--c-ink)] font-serif">
                シカクモン Studio
              </h2>
            </div>
            <span
              className="text-[10px] px-2 py-1 rounded font-bold shrink-0"
              style={{ background: "var(--c-chizai-soft)", color: "var(--c-chizai-ink)" }}
            >
              AI 学習補助
            </span>
          </div>
          <p className="text-sm text-[color:var(--c-text-sub)] leading-relaxed mb-3">
            シカクモンに無い資格や、自分のテキスト・ノートからも問題を作りたい人向けに、
            AI が出題と解説を生成する学習ツールを別サイトで運営しています。
            忘却曲線に沿った復習や、苦手分野の特訓にも使えます。
          </p>
          <p className="text-sm font-bold inline-flex items-center gap-1" style={{ color: "var(--c-chizai)" }}>
            シカクモン Studio を見る
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </p>
        </a>
      </section>

      {/* About teaser */}
      <section className="border-t border-[color:var(--c-border)] pt-8">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-3 font-serif">このサイトについて</h2>
        <p className="text-sm text-[color:var(--c-text-sub)] leading-relaxed">
          受験勉強をしていて、市販の問題集が見つからない資格に何度もぶつかりました。
          それならと、自分で問題と解説を書いて公開したのがこのサイトです。
          すべて無料で使えます。誤りに気づかれたら、お問い合わせから教えてください。すぐ直します。
        </p>
        <a href="/about/" className="text-sm text-[color:var(--c-ink)] mt-3 inline-block no-underline hover:underline">
          運営者について →
        </a>
      </section>
    </div>
  );
}
