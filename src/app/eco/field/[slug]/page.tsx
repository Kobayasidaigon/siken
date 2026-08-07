import { getEcoQuestionsByField } from "@/lib/eco-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { EcoQuestionData } from "@/lib/eco-questions";
import { pageMetadata } from "@/lib/page-metadata";
import EcoCourseAd from "@/components/EcoCourseAd";

// 公式テキスト〈改訂10版〉の章立てに対応した分野区分。
const fieldMap: Record<string, { name: string; desc: string }> = {
  "history": { name: "持続可能な社会と環境問題の歴史", desc: "足尾銅山鉱毒事件から高度経済成長期の産業公害と四大公害病、公害対策基本法から環境基本法への流れ、ストックホルム会議・地球サミット・SDGsまでの国際的な歩み（公式テキスト第1章）" },
  "earth": { name: "地球の基礎知識と生態系", desc: "大気と水の循環、物質循環、地球のエネルギー収支と温室効果のしくみ、生態系の構成と食物連鎖、生物濃縮、生態系サービス（第2章前半）" },
  "now": { name: "いま地球で起きていること", desc: "人口増加と都市化の圧力、食料問題と食品ロス、水資源の偏在、資源・エネルギーの有限性、貧困と環境の悪循環、南北問題（第2章後半）" },
  "climate": { name: "気候変動とエネルギー", desc: "地球温暖化のしくみと影響、緩和策と適応策、気候変動枠組条約・京都議定書・パリ協定、カーボンニュートラルとカーボンプライシング、再生可能エネルギーと省エネルギーの手法（第3章）" },
  "biodiversity": { name: "生物多様性と自然共生社会", desc: "生物多様性の3つのレベルと4つの危機、外来種問題、レッドリスト、生物多様性条約と名古屋議定書、里地里山と森林の多面的機能、自然保護の法制度と各種認証（第3章）" },
  "recycle": { name: "循環型社会と廃棄物・3R", desc: "大量生産・大量廃棄からの転換、3Rと処理の優先順位、循環型社会形成推進基本法と各リサイクル法、拡大生産者責任、静脈産業と不法投棄・海洋プラスチック（第3章）" },
  "local": { name: "地域の環境問題と化学物質", desc: "大気汚染・水質汚濁・土壌汚染・騒音などの典型七公害、化学物質のリスクとPRTR、有害廃棄物、ヒートアイランド、放射性物質と環境（第3章）" },
  "policy": { name: "環境政策の原則・法体系・アセスメント", desc: "汚染者負担原則・予防原則・拡大生産者責任などの原則、環境基本法を頂点とする法体系、環境基本計画、環境アセスメント、環境マネジメントシステムと環境ラベル（第4章）" },
  "international": { name: "国際的な枠組みと条約", desc: "国連環境計画と主要な国際会議、ラムサール・ワシントン・バーゼル・ウィーン・モントリオール・ストックホルム・水俣の各条約が守るもの、SDGsと国際協力（第4章）" },
  "actors": { name: "各主体の役割(企業の環境経営・行政・市民・金融)", desc: "企業の環境経営とサプライチェーン、CSRとESG投資・グリーンファイナンス、行政の役割、市民・NPOの活動、消費者としての選択とエシカル消費（第5・6章）" },
};

export async function generateStaticParams() {
  return Object.keys(fieldMap).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) return { title: "Not Found" };
  return pageMetadata({
    path: `/eco/field/${slug}/`,
    title: `eco検定｜${field.name} 練習問題`,
    description: `eco検定（環境社会検定試験）対策。${field.name}分野のオリジナル練習問題と詳細解説。根拠を含む解説付きで効率的に学習できます。`,
  });
}

function QuestionCard({ q, index }: { q: EcoQuestionData; index: number }) {
  const diffColor = { A: "bg-green-100 text-green-800", B: "bg-amber-100 text-amber-800", C: "bg-red-100 text-red-800" }[q.difficulty];
  return (
    <a
      href={`/eco/q/${q.slug}/`}
      className="card p-4 flex justify-between items-center no-underline group"
      style={{ borderLeft: "3px solid var(--c-eco)" }}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{ background: "var(--c-eco-soft)", color: "var(--c-eco-ink)" }}
          >
            問{index}
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${diffColor}`}>{q.difficulty}</span>
        </div>
        <p className="text-sm text-[color:var(--c-text)] line-clamp-1">{q.questionText.slice(0, 60)}...</p>
      </div>
      <svg className="w-4 h-4 text-[color:var(--c-text-sub)] flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}

export default async function EcoFieldPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) notFound();

  const questions = await getEcoQuestionsByField(field.name);
  const diffCounts = {
    A: questions.filter(q => q.difficulty === "A").length,
    B: questions.filter(q => q.difficulty === "B").length,
    C: questions.filter(q => q.difficulty === "C").length,
  };

  return (
    <div className="theme-eco pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/eco/">eco検定</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">{field.name}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">{field.name}</h1>
      <div className="w-12 h-1 mb-3" style={{ background: "var(--c-eco)" }}></div>
      <p className="text-sm text-[color:var(--c-text-sub)] mb-6 leading-relaxed">{field.desc}</p>

      <div className="grid grid-cols-4 gap-2 mb-8">
        <div className="card p-3 text-center">
          <p className="text-lg font-bold font-serif" style={{ color: "var(--c-eco)" }}>{questions.length}</p>
          <p className="text-xs text-[color:var(--c-text-sub)] mt-1">全問</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-green-700 font-serif">{diffCounts.A}</p>
          <p className="text-xs text-[color:var(--c-text-sub)] mt-1">基礎 A</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-amber-700 font-serif">{diffCounts.B}</p>
          <p className="text-xs text-[color:var(--c-text-sub)] mt-1">標準 B</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-red-700 font-serif">{diffCounts.C}</p>
          <p className="text-xs text-[color:var(--c-text-sub)] mt-1">応用 C</p>
        </div>
      </div>

      <div className="space-y-2">
        {questions.map((q, i) => <QuestionCard key={q.slug} q={q} index={i + 1} />)}
      </div>

      <EcoCourseAd headline={`「${field.name}」でつまずくなら`} />
    </div>
  );
}
