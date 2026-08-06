import { getBijimaneQuestionsByField } from "@/lib/bijimane-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { BijimaneQuestionData } from "@/lib/bijimane-questions";
import { pageMetadata } from "@/lib/page-metadata";
import BijimaneCourseAd from "@/components/BijimaneCourseAd";

// 公式テキスト〈5th edition〉の部・章立てに対応した分野区分。
const fieldMap: Record<string, { name: string; desc: string }> = {
  "role": { name: "マネジャーの役割と心構え", desc: "マネジャーが直面するビジネス環境の変化、求められるミッションと役割、プレイヤーとの違い、マネジャーの資質と心得(公式テキスト第1部)" },
  "self-communication": { name: "マネジャー自身のマネジメントとコミュニケーション", desc: "タイムマネジメントと経験からの学び、報連相と傾聴、会議のファシリテーション、上司・他部門・社外との対応と交渉(第2部1・2・4章)" },
  "leadership": { name: "部下のマネジメントとリーダーシップ", desc: "部下への接し方と信頼関係、部下とのコミュニケーション、リーダーシップの発揮、動機づけ、多様な人材のマネジメント(第2部3章)" },
  "hr": { name: "人材育成と人事考課", desc: "人材育成の重要性と手順、OJT・Off-JT・自己啓発、人事考課の目的と評価の落とし穴、フィードバックの与え方(第2部5章)" },
  "team": { name: "チームのマネジメントと企業組織論", desc: "チームビルディングの基本、組織の文化、企業組織論の基礎(第2部6章)" },
  "strategy": { name: "経営計画・事業計画と戦略", desc: "経営計画と事業計画の位置づけ、現状分析のフレームワーク、戦略の策定(第3部7章)" },
  "operation": { name: "業務のマネジメントと問題解決", desc: "論理的思考、業績目標の設定と進捗管理、成果の検証、問題発見・問題解決の考え方(第3部8・9章)" },
  "marketing": { name: "マーケティング・イノベーションと財務の基礎", desc: "マーケティングの基礎、イノベーション、財務諸表の基本とその見方(第3部9章2節・10章)" },
  "risk": { name: "リスクマネジメントの考え方と職場のリスク", desc: "リスクの洗い出し・分析・処理、BCP・コンプライアンス・CSR、ハラスメント防止、メンタルヘルス、ワーク・ライフ・バランス、労働災害防止(第4部11・12章)" },
  "risk-operation": { name: "業務・組織・事故災害のリスクマネジメント", desc: "ヒューマンエラー、製品・サービスやAIのリスク、クレーム対応、情報漏えい・組織内不正、感染症・事件事故・自然災害への備え(第4部13〜15章)" },
};

export async function generateStaticParams() {
  return Object.keys(fieldMap).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) return { title: "Not Found" };
  return pageMetadata({
    path: `/bijimane/field/${slug}/`,
    title: `ビジネスマネジャー検定｜${field.name} 練習問題`,
    description: `ビジネスマネジャー検定試験対策。${field.name}分野のオリジナル練習問題と詳細解説。根拠を含む解説付きで効率的に学習できます。`,
  });
}

function QuestionCard({ q, index }: { q: BijimaneQuestionData; index: number }) {
  const diffColor = { A: "bg-green-100 text-green-800", B: "bg-amber-100 text-amber-800", C: "bg-red-100 text-red-800" }[q.difficulty];
  return (
    <a
      href={`/bijimane/q/${q.slug}/`}
      className="card p-4 flex justify-between items-center no-underline group"
      style={{ borderLeft: "3px solid var(--c-bijimane)" }}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{ background: "var(--c-bijimane-soft)", color: "var(--c-bijimane-ink)" }}
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

export default async function BijimaneFieldPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) notFound();

  const questions = await getBijimaneQuestionsByField(field.name);
  const diffCounts = {
    A: questions.filter(q => q.difficulty === "A").length,
    B: questions.filter(q => q.difficulty === "B").length,
    C: questions.filter(q => q.difficulty === "C").length,
  };

  return (
    <div className="theme-bijimane pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/bijimane/">ビジネスマネジャー検定</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">{field.name}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">{field.name}</h1>
      <div className="w-12 h-1 mb-3" style={{ background: "var(--c-bijimane)" }}></div>
      <p className="text-sm text-[color:var(--c-text-sub)] mb-6 leading-relaxed">{field.desc}</p>

      <div className="grid grid-cols-4 gap-2 mb-8">
        <div className="card p-3 text-center">
          <p className="text-lg font-bold font-serif" style={{ color: "var(--c-bijimane)" }}>{questions.length}</p>
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

      <BijimaneCourseAd headline={`「${field.name}」でつまずくなら`} />
    </div>
  );
}
