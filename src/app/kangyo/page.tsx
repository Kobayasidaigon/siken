import { getAllKangyoQuestions, getKangyoQuestionsByField } from "@/lib/kangyo-questions";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import KangyoCourseAd from "@/components/KangyoCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import { KANGYO_EXAMS } from "@/lib/exam-dates";
import ExamCountdown from "@/components/ExamCountdown";

export const metadata: Metadata = pageMetadata({
  path: "/kangyo/",
  title: "管理業務主任者 練習問題・過去問対策【全200問・無料】",
  description: "管理業務主任者のオリジナル練習問題200問を無料公開。区分所有法(2026年4月施行の改正法対応)・標準管理規約・管理委託契約・管理組合の会計仕訳・建築設備まで10分野を根拠つき解説で演習できます。",
});

const fields = [
  { name: "区分所有法（専有部分・共用部分・敷地・管理者）", slug: "kubun1", desc: "区分所有権の成立、共用部分の持分と管理、分離処分の禁止、敷地利用権、先取特権と特定承継人の責任、管理者の権限、管理組合法人、区分所有者の責務と管理不全対策（2026年施行の改正法対応）" },
  { name: "区分所有法（集会・規約・義務違反・復旧建替え）", slug: "kubun2", desc: "集会の招集と決議要件、議決権行使、規約の設定変更、義務違反者への措置、復旧と建替え決議、団地。所在等不明区分所有者の除外や建替え要件の緩和など改正法の論点を含む" },
  { name: "マンション標準管理規約", slug: "kiyaku", desc: "専有部分の範囲、専用使用権、管理費と修繕積立金の区分経理、総会の招集と決議要件、理事会の権限、役員の職務と利益相反、専有部分の修繕承認、帳票の保管・閲覧" },
  { name: "管理委託契約と標準管理委託契約書", slug: "itaku", desc: "基幹事務の内容、再委託の制限、管理事務の報告、滞納督促の範囲、有害行為の中止要求、緊急時の業務、契約の解除・更新・解約申入れ、免責事項、反社会的勢力の排除" },
  { name: "民法と関連法令", slug: "minpou", desc: "意思表示と代理、管理費債権の消滅時効、契約不適合責任、委任と請負、工作物責任、共有、相続と滞納の承継、宅建業法・品確法・消費者契約法・不動産登記法との接続" },
  { name: "管理組合の会計と仕訳", slug: "kaikei", desc: "予算準拠主義と区分経理、発生主義、未収金・前受金・未払金・前払金の仕訳、修繕積立金の取崩し、収支報告書と貸借対照表、次期繰越収支差額、会計監査" },
  { name: "マンション管理適正化法", slug: "tekiseika", desc: "管理業者の登録、管理業務主任者の設置基準と主任者証、重要事項説明と説明会、契約成立時書面、管理事務の報告、財産の分別管理、基幹事務の再委託制限、管理計画認定制度、監督処分" },
  { name: "建物の構造と維持保全", slug: "hozen", desc: "鉄筋コンクリートの劣化と中性化、耐震基準と診断、ひび割れ・剥落・白華、外壁調査、防水、大規模修繕の方式、長期修繕計画作成ガイドライン、修繕積立金ガイドライン、定期報告" },
  { name: "建築設備", slug: "setsubi", desc: "給水方式と受水槽、排水とトラップ・通気、給湯・ガス、受変電と幹線、消防用設備と点検報告、防火管理者、昇降機の検査と保守契約、機械式駐車場、換気、防犯設備" },
  { name: "建築関連法規とその他", slug: "kenchiku", desc: "建築基準法の確認・容積率・避難規定・界壁、耐震改修促進法、マンション建替え円滑化法と権利変換・敷地売却、被災区分所有法、バリアフリー法、住宅宿泊事業法と管理規約" },
];

export default async function KangyoPage() {
  const allQuestions = await getAllKangyoQuestions();
  const allColumns = await getAllColumns();
  const kangyoColumns = allColumns.filter((c) => c.slug.startsWith("kangyo-"));
  const fieldCounts = await Promise.all(
    fields.map(async (f) => {
      const qs = await getKangyoQuestionsByField(f.name);
      return qs.length;
    })
  );

  return (
    <div className="theme-kashikin pb-16">
      <section className="-mx-4 px-4 py-10 sm:py-14 border-y mb-10" style={{ background: "var(--c-kashikin-soft)", borderColor: "var(--c-border)" }}>
        <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
          <a href="/" className="no-underline hover:underline">ホーム</a> / <span>管理業務主任者</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight" style={{ color: "var(--c-kashikin-ink)" }}>
          管理業務主任者
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-kashikin)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-kashikin-ink)" }}>
          区分所有法・標準管理規約・管理委託契約・会計仕訳・建築設備まで10分野。{allQuestions.length}問のオリジナル練習問題集です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/kangyo/q/kangyo-001/" className="btn-accent">問題を解き始める →</a>
          <a
            href="/kangyo/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-kashikin-soft)]"
            style={{ borderColor: "var(--c-kashikin)", color: "var(--c-kashikin-ink)" }}
          >
            模擬試験を受ける（50問・120分・合格点判定）→
          </a>
        </div>
      </section>

      {/* カウントダウン: 申込期間中(8/3〜9/30)は「申込締切まで」を優先表示。A8の成果は締切直前に集中する */}
      <ExamCountdown exams={KANGYO_EXAMS} accent="var(--c-kashikin)" accentSoft="var(--c-kashikin-soft)" />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {fields.map((f, i) => (
            <a key={f.slug} href={`/kangyo/field/${f.slug}/`} className="card p-5 no-underline group block" style={{ borderLeft: "3px solid var(--c-kashikin)" }}>
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
          {/* 2026-09-05: ITパスポートの雛形(東商IBT/CBT・70点合格)が残ったままの誤記を、
              マンション管理業協会の令和8年度試験案内(予備校3社の転載で確認)に合わせて修正 */}
          <p><span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　四肢択一・50問・120分（マンション管理士試験の合格者は5問免除・45問・110分）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　年度ごとに決定（令和7年度は50問中36点・合格率19.6%）　<a href="/column/kangyo-chokuzen/" className="underline hover:no-underline">直前対策と合格点の推移 →</a></p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　8,900円（非課税）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年1回・12月第1日曜（令和8年度は12月6日、申込は8月3日〜9月30日）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　一般社団法人マンション管理業協会</p>
        </div>
      </section>

      <KangyoCourseAd />

      {/* コラム */}
      {kangyoColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {kangyoColumns.slice(0, 6).map((col) => (
              <a
                key={col.slug}
                href={`/column/${col.slug}/`}
                className="block py-2 text-sm text-[color:var(--c-text)] no-underline hover:text-[color:var(--c-kashikin)] border-b border-[color:var(--c-border)] last:border-b-0"
              >
                {col.title}
              </a>
            ))}
          </div>
          {kangyoColumns.length > 6 && (
            <a href="/column/#kangyo" className="inline-block mt-4 text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-kashikin)] underline">
              管理業務主任者のコラムをすべて見る →
            </a>
          )}
        </section>
      )}
    </div>
  );
}
