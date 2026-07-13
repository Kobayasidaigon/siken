import { getFukushi2QuestionsByField } from "@/lib/fukushi2-questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Fukushi2QuestionData } from "@/lib/fukushi2-questions";
import { pageMetadata } from "@/lib/page-metadata";
import Fukushi2CourseAd from "@/components/Fukushi2CourseAd";

const fieldMap: Record<string, { name: string; desc: string }> = {
  "society": { name: "高齢社会と住環境整備", desc: "超高齢社会の現状、住環境整備の意義、地域包括ケアシステム、高齢者住宅施策の流れなど" },
  "consultation": { name: "相談援助と連携", desc: "福祉住環境コーディネーターの役割、相談援助の進め方、ケアマネジャー・OT・PT・建築士など関連職との連携" },
  "rehabilitation": { name: "障害とリハビリテーション", desc: "ICF(国際生活機能分類)、ノーマライゼーション、自立支援、リハビリテーションの理念と実際など" },
  "disease": { name: "疾患・障害別の特性", desc: "脳血管障害、認知症、パーキンソン病、関節リウマチ、脊髄損傷、内部障害、視覚・聴覚障害などの特性と住環境配慮" },
  "basic": { name: "住環境整備の基本技術", desc: "段差の解消、手すりの取付け(径・高さ)、廊下幅員、スロープ勾配、床材・建具・照明の選択など" },
  "place": { name: "場所別の住環境整備", desc: "玄関・アプローチ、廊下・階段、トイレ、洗面・浴室、キッチン、寝室ごとの整備ポイント" },
  "equipment": { name: "福祉用具", desc: "杖・歩行器・車いす、特殊寝台、移動用リフト、排泄・入浴関連用具の種類と選定" },
  "kaigohoken": { name: "介護保険と住宅改修", desc: "介護保険制度の仕組み、住宅改修費の支給(上限20万円)、対象工事、申請手続き、福祉用具貸与・販売" },
  "law": { name: "関連法制度・施策", desc: "バリアフリー法、住生活基本法、障害者総合支援法、建築基準法、住宅改修関連の補助施策など" },
};

export async function generateStaticParams() {
  return Object.keys(fieldMap).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) return { title: "Not Found" };
  return pageMetadata({
    path: `/fukushi2/field/${slug}/`,
    title: `福祉住環境コーディネーター2級｜${field.name} 練習問題`,
    description: `福祉住環境コーディネーター2級試験対策。${field.name}分野のオリジナル練習問題と詳細解説。根拠を含む解説付きで効率的に学習できます。`,
  });
}

function QuestionCard({ q, index }: { q: Fukushi2QuestionData; index: number }) {
  const diffColor = { A: "bg-green-100 text-green-800", B: "bg-amber-100 text-amber-800", C: "bg-red-100 text-red-800" }[q.difficulty];
  return (
    <a
      href={`/fukushi2/q/${q.slug}/`}
      className="card p-4 flex justify-between items-center no-underline group"
      style={{ borderLeft: "3px solid var(--c-fukushi)" }}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{ background: "var(--c-fukushi-soft)", color: "var(--c-fukushi-ink)" }}
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

export default async function Fukushi2FieldPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const field = fieldMap[slug];
  if (!field) notFound();

  const questions = await getFukushi2QuestionsByField(field.name);
  const diffCounts = {
    A: questions.filter(q => q.difficulty === "A").length,
    B: questions.filter(q => q.difficulty === "B").length,
    C: questions.filter(q => q.difficulty === "C").length,
  };

  return (
    <div className="theme-fukushi pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/fukushi2/">福祉住環境コーディネーター2級</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">{field.name}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">{field.name}</h1>
      <div className="w-12 h-1 mb-3" style={{ background: "var(--c-fukushi)" }}></div>
      <p className="text-sm text-[color:var(--c-text-sub)] mb-6 leading-relaxed">{field.desc}</p>

      <div className="grid grid-cols-4 gap-2 mb-8">
        <div className="card p-3 text-center">
          <p className="text-lg font-bold font-serif" style={{ color: "var(--c-fukushi)" }}>{questions.length}</p>
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

      <Fukushi2CourseAd headline={`「${field.name}」でつまずくなら`} />
    </div>
  );
}
