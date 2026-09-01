import { getBijihou2QuestionsByField } from "@/lib/bijihou2-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Bijihou2QuestionData } from "@/lib/bijihou2-questions";
import { pageMetadata } from "@/lib/page-metadata";
import Bijihou2CourseAd from "@/components/Bijihou2CourseAd";

const fieldMap: Record<string, { name: string; desc: string }> = {
  "torihiki": { name: "企業取引・契約の法務", desc: "契約の成立と意思表示の瑕疵、代理と表見代理、債務不履行と契約不適合責任、解除、典型契約、定型約款、消滅時効（公式テキスト第1章）" },
  "zaisan": { name: "企業財産の管理と法務", desc: "不動産物権変動と登記、共有、動産の即時取得、特許・意匠・商標・著作権、職務発明、営業秘密と限定提供データ、不正競争行為の類型（第2章）" },
  "kigyoukan": { name: "企業間取引の法規制", desc: "独占禁止法の私的独占・不当な取引制限・不公正な取引方法、課徴金減免制度、企業結合規制、下請法の義務と禁止行為、フリーランス新法（第3章）" },
  "shouhisha": { name: "消費者取引と広告・表示の法規制", desc: "消費者契約法の取消しと不当条項、特定商取引法とクーリング・オフ、割賦販売法、製造物責任法、景品表示法の優良誤認・有利誤認とステマ規制（第4・7章）" },
  "jouhou": { name: "情報の管理・活用とデジタル社会", desc: "個人情報保護法の第三者提供・越境移転・漏えい報告、仮名加工情報と匿名加工情報、マイナンバー法、電子署名法、電子契約、情報流通プラットフォーム対処法（第5・6章）" },
  "kinyuu": { name: "金融・証券業等に関する法規制", desc: "金融商品取引法の開示制度、インサイダー取引規制、公開買付けと大量保有報告、相場操縦、金融サービス提供法、犯罪収益移転防止法、資金決済法（第8章）" },
  "saiken": { name: "債権の担保と回収", desc: "保証と個人根保証、抵当権・根抵当権、質権・譲渡担保・所有権留保、相殺、債権譲渡、債権者代位権と詐害行為取消権、強制執行と民事保全（第9・10章）" },
  "tousan": { name: "倒産処理と紛争の予防・解決", desc: "破産・民事再生・会社更生・特別清算、別除権、否認権、民事訴訟の手続と既判力、支払督促、少額訴訟、民事調停、ADR、仲裁（第11・12章）" },
  "kaisya": { name: "株式会社の組織と運営", desc: "設立と株式、株主総会と決議の瑕疵、取締役の義務と責任、経営判断の原則、株主代表訴訟、機関設計、計算書類と剰余金配当、組織再編（第13章）" },
  "juugyouin": { name: "企業と従業員・地域社会・国際法務", desc: "労働時間と割増賃金、解雇と有期労働契約、労働者派遣、ハラスメント防止、行政手続法、環境関連法、準拠法と国際裁判管轄、CISG、国際仲裁（第14〜16章）" },
};

export async function generateStaticParams() {
  return Object.keys(fieldMap).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) return { title: "Not Found" };
  return pageMetadata({
    path: `/bijihou2/field/${slug}/`,
    title: `ビジネス実務法務検定2級｜${field.name} 練習問題`,
    description: `ビジネス実務法務検定2級試験対策。${field.name}分野のオリジナル練習問題と詳細解説。各問に根拠条文を含む解説付きで効率的に学習できます。`,
  });
}

function QuestionCard({ q, index }: { q: Bijihou2QuestionData; index: number }) {
  const diffColor = { A: "bg-green-100 text-green-800", B: "bg-amber-100 text-amber-800", C: "bg-red-100 text-red-800" }[q.difficulty];
  return (
    <a href={`/bijihou2/q/${q.slug}/`} className="card p-4 flex justify-between items-center no-underline group" style={{ borderLeft: "3px solid var(--c-kashikin)" }}>
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

export default async function Bijihou2FieldPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) notFound();

  const questions = await getBijihou2QuestionsByField(field.name);
  const diffCounts = {
    A: questions.filter(q => q.difficulty === "A").length,
    B: questions.filter(q => q.difficulty === "B").length,
    C: questions.filter(q => q.difficulty === "C").length,
  };

  return (
    <div className="theme-kashikin pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/bijihou2/">ビジネス実務法務検定2級</a><span>/</span>
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

      <Bijihou2CourseAd headline={`「${field.name}」でつまずくなら`} />
    </div>
  );
}
