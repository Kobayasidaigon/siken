import { getItpassQuestionsByField } from "@/lib/itpass-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ItpassQuestionData } from "@/lib/itpass-questions";
import { pageMetadata } from "@/lib/page-metadata";
import ItpassCourseAd from "@/components/ItpassCourseAd";

const fieldMap: Record<string, { name: string; desc: string }> = {
  "kigyou": { name: "企業活動と法務", desc: "企業理念とCSR、組織形態、財務諸表と損益分岐点、QC七つ道具、知的財産権、個人情報保護法、労働関連法規、標準化（ストラテジ系「企業と法務」）" },
  "senryaku": { name: "経営戦略とビジネスインダストリ", desc: "SWOT分析・PPM・競争戦略、CSF/KGI/KPI、CRM・SCM・ERP、MOTとイノベーション、電子商取引、IoT活用、AI・生成AIのビジネス活用（ストラテジ系「経営戦略」）" },
  "system-senryaku": { name: "システム戦略とシステム企画", desc: "業務モデリング、BPRとRPA、SaaS・PaaS・IaaSの違い、DX、要件定義、RFI・RFP・RFQの使い分け、ベンダ選定（ストラテジ系「システム戦略」）" },
  "kaihatsu": { name: "システム開発と開発管理技術", desc: "開発工程とテストの種類、レビュー、ウォータフォールとアジャイル、スクラムの役割とイベント、DevOps、リファクタリング（マネジメント系「開発技術」）" },
  "project": { name: "プロジェクトマネジメント", desc: "スコープとWBS、アローダイアグラムとクリティカルパス、ガントチャート、コスト見積り、リスク対応の4分類、ステークホルダマネジメント（マネジメント系）" },
  "service": { name: "サービスマネジメントとシステム監査", desc: "ITILとSLA・SLM、インシデント管理と問題管理の違い、サービスデスク、ファシリティマネジメント、システム監査の手順、内部統制、BCPとRTO・RPO（マネジメント系）" },
  "kiso": { name: "基礎理論とアルゴリズム", desc: "2進数・16進数の変換、論理演算、確率と期待値、統計と相関、機械学習の3分類、フローチャート、探索と整列、スタックとキュー（テクノロジ系「基礎理論」）" },
  "computer": { name: "コンピュータシステムとハードウェア", desc: "5大装置とCPU、記憶階層、RAIDと冗長化、稼働率とMTBF・MTTRの計算、フェールセーフとフールプルーフ、OSとファイルシステム、OSSライセンス（テクノロジ系）" },
  "tech": { name: "情報デザイン・データベース・ネットワーク", desc: "ユニバーサルデザインとUX、画像・動画の形式と圧縮、関係データベースと正規化、トランザクション、TCP/IPとIPアドレス、DNS、5GとLPWA（テクノロジ系「技術要素」）" },
  "security": { name: "情報セキュリティ", desc: "機密性・完全性・可用性、マルウェアと攻撃手法、共通鍵暗号と公開鍵暗号、デジタル署名と電子証明書、多要素認証、ファイアウォールとゼロトラスト、ISMS（テクノロジ系・最頻出）" },
};

export async function generateStaticParams() {
  return Object.keys(fieldMap).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) return { title: "Not Found" };
  return pageMetadata({
    path: `/itpass/field/${slug}/`,
    title: `ITパスポート｜${field.name} 練習問題`,
    description: `ITパスポート試験対策。${field.name}分野のオリジナル練習問題と詳細解説。各問に根拠条文を含む解説付きで効率的に学習できます。`,
  });
}

function QuestionCard({ q, index }: { q: ItpassQuestionData; index: number }) {
  const diffColor = { A: "bg-green-100 text-green-800", B: "bg-amber-100 text-amber-800", C: "bg-red-100 text-red-800" }[q.difficulty];
  return (
    <a href={`/itpass/q/${q.slug}/`} className="card p-4 flex justify-between items-center no-underline group" style={{ borderLeft: "3px solid var(--c-pii)" }}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "var(--c-pii-soft)", color: "var(--c-pii-ink)" }}>問{index}</span>
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

export default async function ItpassFieldPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) notFound();

  const questions = await getItpassQuestionsByField(field.name);
  const diffCounts = {
    A: questions.filter(q => q.difficulty === "A").length,
    B: questions.filter(q => q.difficulty === "B").length,
    C: questions.filter(q => q.difficulty === "C").length,
  };

  return (
    <div className="theme-pii pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/itpass/">ITパスポート</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">{field.name}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">{field.name}</h1>
      <div className="w-12 h-1 mb-3" style={{ background: "var(--c-pii)" }}></div>
      <p className="text-sm text-[color:var(--c-text-sub)] mb-6 leading-relaxed">{field.desc}</p>

      <div className="grid grid-cols-4 gap-2 mb-8">
        <div className="card p-3 text-center">
          <p className="text-lg font-bold font-serif" style={{ color: "var(--c-pii)" }}>{questions.length}</p>
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

      <ItpassCourseAd headline={`「${field.name}」でつまずくなら`} />
    </div>
  );
}
