import { getKangyoQuestionsByField } from "@/lib/kangyo-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { KangyoQuestionData } from "@/lib/kangyo-questions";
import { pageMetadata } from "@/lib/page-metadata";
import KangyoCourseAd from "@/components/KangyoCourseAd";

const fieldMap: Record<string, { name: string; desc: string }> = {
  "kubun1": { name: "区分所有法（専有部分・共用部分・敷地・管理者）", desc: "区分所有権の成立、共用部分の持分と管理、分離処分の禁止、敷地利用権、先取特権と特定承継人の責任、管理者の権限、管理組合法人、区分所有者の責務と管理不全対策（2026年施行の改正法対応）" },
  "kubun2": { name: "区分所有法（集会・規約・義務違反・復旧建替え）", desc: "集会の招集と決議要件、議決権行使、規約の設定変更、義務違反者への措置、復旧と建替え決議、団地。所在等不明区分所有者の除外や建替え要件の緩和など改正法の論点を含む" },
  "kiyaku": { name: "マンション標準管理規約", desc: "専有部分の範囲、専用使用権、管理費と修繕積立金の区分経理、総会の招集と決議要件、理事会の権限、役員の職務と利益相反、専有部分の修繕承認、帳票の保管・閲覧" },
  "itaku": { name: "管理委託契約と標準管理委託契約書", desc: "基幹事務の内容、再委託の制限、管理事務の報告、滞納督促の範囲、有害行為の中止要求、緊急時の業務、契約の解除・更新・解約申入れ、免責事項、反社会的勢力の排除" },
  "minpou": { name: "民法と関連法令", desc: "意思表示と代理、管理費債権の消滅時効、契約不適合責任、委任と請負、工作物責任、共有、相続と滞納の承継、宅建業法・品確法・消費者契約法・不動産登記法との接続" },
  "kaikei": { name: "管理組合の会計と仕訳", desc: "予算準拠主義と区分経理、発生主義、未収金・前受金・未払金・前払金の仕訳、修繕積立金の取崩し、収支報告書と貸借対照表、次期繰越収支差額、会計監査" },
  "tekiseika": { name: "マンション管理適正化法", desc: "管理業者の登録、管理業務主任者の設置基準と主任者証、重要事項説明と説明会、契約成立時書面、管理事務の報告、財産の分別管理、基幹事務の再委託制限、管理計画認定制度、監督処分" },
  "hozen": { name: "建物の構造と維持保全", desc: "鉄筋コンクリートの劣化と中性化、耐震基準と診断、ひび割れ・剥落・白華、外壁調査、防水、大規模修繕の方式、長期修繕計画作成ガイドライン、修繕積立金ガイドライン、定期報告" },
  "setsubi": { name: "建築設備", desc: "給水方式と受水槽、排水とトラップ・通気、給湯・ガス、受変電と幹線、消防用設備と点検報告、防火管理者、昇降機の検査と保守契約、機械式駐車場、換気、防犯設備" },
  "kenchiku": { name: "建築関連法規とその他", desc: "建築基準法の確認・容積率・避難規定・界壁、耐震改修促進法、マンション建替え円滑化法と権利変換・敷地売却、被災区分所有法、バリアフリー法、住宅宿泊事業法と管理規約" },
};

export async function generateStaticParams() {
  return Object.keys(fieldMap).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) return { title: "Not Found" };
  return pageMetadata({
    path: `/kangyo/field/${slug}/`,
    title: `管理業務主任者｜${field.name} 練習問題`,
    description: `管理業務主任者対策。${field.name}分野のオリジナル練習問題と詳細解説。各問に根拠条文を含む解説付きで効率的に学習できます。`,
  });
}

function QuestionCard({ q, index }: { q: KangyoQuestionData; index: number }) {
  const diffColor = { A: "bg-green-100 text-green-800", B: "bg-amber-100 text-amber-800", C: "bg-red-100 text-red-800" }[q.difficulty];
  return (
    <a href={`/kangyo/q/${q.slug}/`} className="card p-4 flex justify-between items-center no-underline group" style={{ borderLeft: "3px solid var(--c-kashikin)" }}>
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

export default async function KangyoFieldPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) notFound();

  const questions = await getKangyoQuestionsByField(field.name);
  const diffCounts = {
    A: questions.filter(q => q.difficulty === "A").length,
    B: questions.filter(q => q.difficulty === "B").length,
    C: questions.filter(q => q.difficulty === "C").length,
  };

  return (
    <div className="theme-kashikin pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/kangyo/">管理業務主任者</a><span>/</span>
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

      <KangyoCourseAd headline={`「${field.name}」でつまずくなら`} />
    </div>
  );
}
