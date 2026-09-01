import type { Metadata } from "next";
import StudyResumeCard from "@/components/StudyResumeCard";
import {
  nextExamDateLabel,
  KASHIKIN_EXAMS,
  PII_EXAMS,
  CHIZAI_EXAMS,
  MYNUMBER_EXAMS,
  JITSUMU_EXAMS,
  BIJIHOU_EXAMS,
  FUKUSHI2_EXAMS,
  BIJIMANE_EXAMS,
  ECO_EXAMS,
} from "@/lib/exam-dates";

export const metadata: Metadata = {
  title: { absolute: "シカクモン｜資格試験のオリジナル練習問題を無料で提供" },
  description: "シカクモンは資格試験のオリジナル練習問題を無料で提供するサイトです。貸金業務取扱主任者・個人情報保護士・知的財産管理技能検定3級/2級・マイナンバー実務検定3級・個人情報保護実務検定・ビジネス実務法務検定3級/2級・ITパスポート・賃貸不動産経営管理士・福祉住環境コーディネーター2級・ビジネスマネジャー検定・eco検定、合計3,170問。全問に根拠を含む詳細解説付き。",
  alternates: { canonical: "/" },
  // openGraphはトップレベルの浅いマージのため、部分指定するとlayout側の
  // siteName/locale/type/imagesが丸ごと消える(page-metadata.tsと同じ理由でフル指定)
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "シカクモン",
    url: "/",
    title: "シカクモン｜資格試験のオリジナル練習問題を無料で提供",
    description: "貸金業務取扱主任者・個人情報保護士・知財3級/2級・マイナンバー3級・個情保実務・ビジ法3級/2級・ITパスポート・賃管士・福祉住環境2級・ビジマネ・eco検定の13資格、合計3,170問のオリジナル練習問題を無料公開。",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "シカクモン - 資格試験の練習問題" }],
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
      date: nextExamDateLabel(KASHIKIN_EXAMS, { suffix: "（年1回）", fallback: "毎年11月（年1回）" }),
      themeVar: "var(--c-kashikin)",
      softVar: "var(--c-kashikin-soft)",
    },
    {
      name: "賃貸不動産経営管理士",
      slug: "chintai",
      count: 200,
      fieldCount: 10,
      desc: "2021年に国家資格化。賃貸住宅管理業法の登録制度とサブリース規制が主戦場で、借地借家法・建物設備・原状回復まで横断して問われます。",
      date: "年1回（11月）",
      themeVar: "var(--c-kashikin)",
      softVar: "var(--c-kashikin-soft)",
    },
    {
      name: "個人情報保護士",
      slug: "pii",
      count: 337,
      fieldCount: 3,
      desc: "個人情報保護法・マイナンバー法・情報セキュリティの3分野。企業のコンプライアンス実務者向けの認定資格。",
      date: nextExamDateLabel(PII_EXAMS, { fallback: "年4回実施" }),
      themeVar: "var(--c-pii)",
      softVar: "var(--c-pii-soft)",
    },
    {
      name: "知的財産管理技能検定3級",
      slug: "chizai",
      count: 232,
      fieldCount: 9,
      desc: "特許法・著作権法・商標法など9分野を横断する国家資格。知財の実務で最初に目指す級です。",
      date: nextExamDateLabel(CHIZAI_EXAMS, { fallback: "年3回（3月・7月・11月）" }),
      themeVar: "var(--c-chizai)",
      softVar: "var(--c-chizai-soft)",
    },
    {
      name: "知的財産管理技能検定2級",
      slug: "chizai2",
      count: 231,
      fieldCount: 9,
      desc: "3級の一歩先、実務で問われる応用レベル。特許・著作権・商標など9分野を、事例に沿ってより深く扱う国家資格です。",
      date: nextExamDateLabel(CHIZAI_EXAMS, { fallback: "年3回（3月・7月・11月）" }),
      themeVar: "var(--c-chizai)",
      softVar: "var(--c-chizai-soft)",
    },
    {
      name: "マイナンバー実務検定3級",
      slug: "mynumber",
      count: 200,
      fieldCount: 5,
      desc: "番号法・個人番号カード・特定個人情報保護を扱う民間資格。実務でマイナンバーを取り扱う方の基礎知識として。",
      date: nextExamDateLabel(MYNUMBER_EXAMS, { fallback: "年複数回実施" }),
      themeVar: "var(--c-pii)",
      softVar: "var(--c-pii-soft)",
    },
    {
      name: "個人情報保護実務検定",
      slug: "jitsumu",
      count: 200,
      fieldCount: 5,
      desc: "個人情報保護法の実務的運用を問う民間資格。コンプライアンス担当者・人事総務向け。改正法対応の実務知識を習得できます。",
      date: nextExamDateLabel(JITSUMU_EXAMS, { fallback: "年複数回実施" }),
      themeVar: "var(--c-pii)",
      softVar: "var(--c-pii-soft)",
    },
    {
      name: "ビジネス実務法務検定3級",
      slug: "bijihou",
      count: 200,
      fieldCount: 5,
      desc: "民法・商法・会社法・関連法規（独禁法・消費者法・知財）を扱う検定試験。ビジネス現場の法的リスクを把握するための公的資格。",
      date: nextExamDateLabel(BIJIHOU_EXAMS, { period: true, fallback: "年2回（6〜7月、10〜11月）" }),
      themeVar: "var(--c-kashikin)",
      softVar: "var(--c-kashikin-soft)",
    },
    {
      name: "ビジネス実務法務検定2級",
      slug: "bijihou2",
      count: 200,
      fieldCount: 10,
      desc: "3級の上位級。契約・債権回収・会社法・労働法・国際法務まで、企業法務の実務で必要な要件と効果を問われます。IBT/CBT化で過去問が公開されない試験です。",
      date: nextExamDateLabel(BIJIHOU_EXAMS, { period: true, fallback: "年2回（6〜7月、10〜11月）" }),
      themeVar: "var(--c-kashikin)",
      softVar: "var(--c-kashikin-soft)",
    },
    {
      name: "ITパスポート試験",
      slug: "itpass",
      count: 200,
      fieldCount: 10,
      desc: "IT系の入門にあたる国家試験。経営戦略・法務からセキュリティ・ネットワークまで幅広く問われます。CBT方式で通年実施され、公開される過去問は年100問だけです。",
      date: "CBT方式で通年実施",
      themeVar: "var(--c-pii)",
      softVar: "var(--c-pii-soft)",
    },
    {
      name: "福祉住環境コーディネーター2級",
      slug: "fukushi2",
      count: 230,
      fieldCount: 9,
      desc: "高齢者・障害者の暮らしを住まいから支える検定。疾患の特性・住宅改修の技術・介護保険まで、医療×福祉×建築を横断して問われます。",
      date: nextExamDateLabel(FUKUSHI2_EXAMS, { period: true, fallback: "年2回（6〜7月、10〜11月）" }),
      themeVar: "var(--c-fukushi)",
      softVar: "var(--c-fukushi-soft)",
    },
    {
      name: "ビジネスマネジャー検定",
      slug: "bijimane",
      count: 200,
      fieldCount: 10,
      desc: "管理職の土台づくりを問う検定。部下の動機づけ・人事考課・事業計画・ハラスメント対応まで、マネジャーの実務判断を横断して問われます。",
      date: nextExamDateLabel(BIJIMANE_EXAMS, { period: true, fallback: "年2回（6〜7月、10〜11月）" }),
      themeVar: "var(--c-bijimane)",
      softVar: "var(--c-bijimane-soft)",
    },
    {
      name: "eco検定（環境社会検定試験）",
      slug: "eco",
      count: 236,
      fieldCount: 10,
      desc: "環境の知識を広く体系的に問う検定。公害の歴史・気候変動・生物多様性・リサイクル・環境法まで、範囲の広さそのものが難所になります。",
      date: nextExamDateLabel(ECO_EXAMS, { period: true, fallback: "年2回（6〜7月、11〜12月）" }),
      themeVar: "var(--c-eco)",
      softVar: "var(--c-eco-soft)",
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

  // 資格を実施団体・領域ごとにまとめて並べる。
  // 13資格を平坦に並べると雑多に見えるが、実際は実施団体で4つの塊になっており、
  // 同じ団体の検定は受験者層と併願パターンが重なる。その関係を見せるための区分。
  const groups = [
    {
      key: "houmu",
      title: "法務・知的財産",
      lead: "契約や権利関係を扱う資格。条文の要件をそのまま問われるため、根拠つきの演習が効きます。貸金業と賃貸管理は受験者層が重なります。",
      slugs: ["kashikin", "chintai", "chizai", "chizai2"],
    },
    {
      key: "joho",
      title: "情報とセキュリティ",
      lead: "個人情報とマイナンバーの取扱いを問う検定群。いずれも全日本情報学習振興協会が実施しており、出題範囲が重なります。",
      slugs: ["pii", "jitsumu", "mynumber"],
    },
    {
      key: "tokyo-cci",
      title: "東京商工会議所の検定",
      lead: "同じ団体が実施する検定で、試験期間が共通のため併願する人が多い組み合わせです。",
      slugs: ["bijihou", "bijihou2", "bijimane", "eco", "fukushi2"],
    },
    {
      key: "it",
      title: "IT",
      lead: "経営戦略・法務からセキュリティまで横断する国家試験。上の法務・情報系と出題範囲が重なります。",
      slugs: ["itpass"],
    },
  ];
  const bySlug = Object.fromEntries(exams.map((e) => [e.slug, e]));

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

      {/* 前回の続き(学習履歴がある再訪者にだけ出る) */}
      <StudyResumeCard />

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
        {groups.map((group) => (
        <div key={group.key} className="mb-9 last:mb-0">
          <h3 className="text-sm font-bold text-[color:var(--c-ink)] mb-1">{group.title}</h3>
          <p className="text-xs text-[color:var(--c-text-sub)] leading-relaxed mb-4">{group.lead}</p>
          <div className="space-y-4">
          {group.slugs.map((slug) => bySlug[slug]).filter(Boolean).map((exam) => (
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
        </div>
        ))}
      </section>

      {/* Studio 案内 */}
      <section className="mb-12">
        <a
          href="https://studio.shikakumon.com/?utm_source=shikakumon&utm_medium=referral&utm_content=home_card"
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
