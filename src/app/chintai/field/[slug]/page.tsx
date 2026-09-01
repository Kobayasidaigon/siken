import { getChintaiQuestionsByField } from "@/lib/chintai-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ChintaiQuestionData } from "@/lib/chintai-questions";
import { pageMetadata } from "@/lib/page-metadata";
import ChintaiCourseAd from "@/components/ChintaiCourseAd";

const fieldMap: Record<string, { name: string; desc: string }> = {
  "gyouhou": { name: "賃貸住宅管理業法と登録制度", desc: "登録が必要な事業者と管理戸数200戸の基準、登録の有効期間5年、業務管理者の選任義務、再委託の制限、分別管理、定期報告、国土交通大臣の監督と罰則" },
  "jutaku": { name: "管理受託契約", desc: "管理受託方式とサブリース方式の違い、締結前の重要事項説明と締結時書面、委任の規律と善管注意義務、標準管理委託契約書、再委託と定期報告" },
  "sublease": { name: "サブリースと特定賃貸借契約", desc: "特定転貸事業者と勧誘者、登録の有無にかかわらず適用される規制、誇大広告等の禁止、不当な勧誘等の禁止、特定賃貸借契約の重要事項説明、借賃減額請求" },
  "keiyaku": { name: "賃貸借契約と借地借家法", desc: "普通借家と定期借家、賃貸人の修繕義務、一部滅失による賃料の当然減額、賃借権の譲渡・転貸と承諾、対抗要件、個人根保証の極度額、敷金の意義" },
  "shuuryou": { name: "契約の終了・更新と原状回復", desc: "更新拒絶の通知期間と正当事由、法定更新、解約申入れ、信頼関係破壊の法理、通常損耗・経年変化を除く原状回復、ガイドラインの考え方、自力救済の禁止" },
  "kinsen": { name: "金銭の管理と会計", desc: "家賃・敷金・共益費・礼金の性質、借賃増減額請求と特約の効力、滞納対応と時効、家賃債務保証、分別管理義務、複式簿記の基礎、利回りの計算" },
  "setsubi": { name: "建物の維持保全と設備", desc: "構造と耐震基準、修繕計画、給水方式の違い、排水トラップと封水、電気・ガス設備、換気の3方式、消防用設備、エレベーターの保守、定期調査報告" },
  "boshuu": { name: "入居者の募集と広告規制", desc: "宅建業法の適用と重要事項説明・37条書面、媒介報酬の制限、広告開始時期、おとり広告の禁止、公正競争規約の表示ルール、入居審査とセーフティネット住宅" },
  "shien": { name: "賃貸業への支援業務（税・保険・証券化）", desc: "不動産所得と減価償却、固定資産税と住宅用地の特例、居住用家賃の消費税非課税、貸家建付地の評価、火災保険と地震保険、借家人賠償責任保険、不動産証券化とPM・AM" },
  "igi": { name: "賃貸管理の意義と管理士の役割", desc: "賃貸住宅を取り巻く社会情勢、管理の外部委託の進行、賃貸不動産経営管理士の倫理憲章、守秘義務と個人情報保護、反社会的勢力の排除、住宅セーフティネット制度" },
};

export async function generateStaticParams() {
  return Object.keys(fieldMap).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) return { title: "Not Found" };
  return pageMetadata({
    path: `/chintai/field/${slug}/`,
    title: `賃貸不動産経営管理士｜${field.name} 練習問題`,
    description: `賃貸不動産経営管理士対策。${field.name}分野のオリジナル練習問題と詳細解説。各問に根拠条文を含む解説付きで効率的に学習できます。`,
  });
}

function QuestionCard({ q, index }: { q: ChintaiQuestionData; index: number }) {
  const diffColor = { A: "bg-green-100 text-green-800", B: "bg-amber-100 text-amber-800", C: "bg-red-100 text-red-800" }[q.difficulty];
  return (
    <a href={`/chintai/q/${q.slug}/`} className="card p-4 flex justify-between items-center no-underline group" style={{ borderLeft: "3px solid var(--c-kashikin)" }}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "var(--c-kashikin-soft)", color: "var(--c-kashikin-ink)" }}>問{index}</span>
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

export default async function ChintaiFieldPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) notFound();

  const questions = await getChintaiQuestionsByField(field.name);
  const diffCounts = {
    A: questions.filter(q => q.difficulty === "A").length,
    B: questions.filter(q => q.difficulty === "B").length,
    C: questions.filter(q => q.difficulty === "C").length,
  };

  return (
    <div className="theme-kashikin pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/chintai/">賃貸不動産経営管理士</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">{field.name}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">{field.name}</h1>
      <div className="w-12 h-1 mb-3" style={{ background: "var(--c-kashikin)" }}></div>
      <p className="text-sm text-[color:var(--c-text-sub)] mb-6 leading-relaxed">{field.desc}</p>

      <div className="grid grid-cols-4 gap-2 mb-8">
        <div className="card p-3 text-center">
          <p className="text-lg font-bold font-serif" style={{ color: "var(--c-kashikin)" }}>{questions.length}</p>
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

      <ChintaiCourseAd headline={`「${field.name}」でつまずくなら`} />
    </div>
  );
}
