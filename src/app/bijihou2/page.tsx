import { getAllBijihou2Questions, getBijihou2QuestionsByField } from "@/lib/bijihou2-questions";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import Bijihou2CourseAd from "@/components/Bijihou2CourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import { BIJIHOU_EXAMS } from "@/lib/exam-dates";
import ExamCountdown from "@/components/ExamCountdown";

export const metadata: Metadata = pageMetadata({
  path: "/bijihou2/",
  title: "ビジネス実務法務検定2級 試験対策｜オリジナル200問を無料で",
  description: "ビジネス実務法務検定2級のオリジナル練習問題200問を詳細解説。民法・商法・会社法・関連法規（独禁法・消費者法・知財法）を収録。",
});

const fields = [
  { name: "企業取引・契約の法務", slug: "torihiki", desc: "契約の成立と意思表示の瑕疵、代理と表見代理、債務不履行と契約不適合責任、解除、典型契約、定型約款、消滅時効（公式テキスト第1章）" },
  { name: "企業財産の管理と法務", slug: "zaisan", desc: "不動産物権変動と登記、共有、動産の即時取得、特許・意匠・商標・著作権、職務発明、営業秘密と限定提供データ、不正競争行為の類型（第2章）" },
  { name: "企業間取引の法規制", slug: "kigyoukan", desc: "独占禁止法の私的独占・不当な取引制限・不公正な取引方法、課徴金減免制度、企業結合規制、下請法の義務と禁止行為、フリーランス新法（第3章）" },
  { name: "消費者取引と広告・表示の法規制", slug: "shouhisha", desc: "消費者契約法の取消しと不当条項、特定商取引法とクーリング・オフ、割賦販売法、製造物責任法、景品表示法の優良誤認・有利誤認とステマ規制（第4・7章）" },
  { name: "情報の管理・活用とデジタル社会", slug: "jouhou", desc: "個人情報保護法の第三者提供・越境移転・漏えい報告、仮名加工情報と匿名加工情報、マイナンバー法、電子署名法、電子契約、情報流通プラットフォーム対処法（第5・6章）" },
  { name: "金融・証券業等に関する法規制", slug: "kinyuu", desc: "金融商品取引法の開示制度、インサイダー取引規制、公開買付けと大量保有報告、相場操縦、金融サービス提供法、犯罪収益移転防止法、資金決済法（第8章）" },
  { name: "債権の担保と回収", slug: "saiken", desc: "保証と個人根保証、抵当権・根抵当権、質権・譲渡担保・所有権留保、相殺、債権譲渡、債権者代位権と詐害行為取消権、強制執行と民事保全（第9・10章）" },
  { name: "倒産処理と紛争の予防・解決", slug: "tousan", desc: "破産・民事再生・会社更生・特別清算、別除権、否認権、民事訴訟の手続と既判力、支払督促、少額訴訟、民事調停、ADR、仲裁（第11・12章）" },
  { name: "株式会社の組織と運営", slug: "kaisya", desc: "設立と株式、株主総会と決議の瑕疵、取締役の義務と責任、経営判断の原則、株主代表訴訟、機関設計、計算書類と剰余金配当、組織再編（第13章）" },
  { name: "企業と従業員・地域社会・国際法務", slug: "juugyouin", desc: "労働時間と割増賃金、解雇と有期労働契約、労働者派遣、ハラスメント防止、行政手続法、環境関連法、準拠法と国際裁判管轄、CISG、国際仲裁（第14〜16章）" },
];

export default async function Bijihou2Page() {
  const allQuestions = await getAllBijihou2Questions();
  const allColumns = await getAllColumns();
  const bijihouColumns = allColumns.filter((c) => c.slug.startsWith("bijihou2-"));
  const fieldCounts = await Promise.all(
    fields.map(async (f) => {
      const qs = await getBijihou2QuestionsByField(f.name);
      return qs.length;
    })
  );

  return (
    <div className="theme-kashikin pb-16">
      <section className="-mx-4 px-4 py-10 sm:py-14 border-y mb-10" style={{ background: "var(--c-kashikin-soft)", borderColor: "var(--c-border)" }}>
        <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
          <a href="/" className="no-underline hover:underline">ホーム</a> / <span>ビジネス実務法務検定2級</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight" style={{ color: "var(--c-kashikin-ink)" }}>
          ビジネス実務法務検定2級
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-kashikin)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-kashikin-ink)" }}>
          民法・会社法・関連法規を扱う、{allQuestions.length}問のオリジナル練習問題集です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/bijihou2/q/bijihou2-001/" className="btn-accent">問題を解き始める →</a>
          <a
            href="/bijihou2/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-kashikin-soft)]"
            style={{ borderColor: "var(--c-kashikin)", color: "var(--c-kashikin-ink)" }}
          >
            模擬試験を受ける（90分・70点合格判定）→
          </a>
        </div>
      </section>

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示(東商IBT/CBTは期間制) */}
      <ExamCountdown exams={BIJIHOU_EXAMS} accent="var(--c-kashikin)" accentSoft="var(--c-kashikin-soft)" periodExam />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {fields.map((f, i) => (
            <a key={f.slug} href={`/bijihou2/field/${f.slug}/`} className="card p-5 no-underline group block" style={{ borderLeft: "3px solid var(--c-kashikin)" }}>
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
          <p><span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　多肢選択式・90分・100点満点</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　70点以上</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　IBT方式 5,500円／CBT方式 7,700円（いずれも税込）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年2回（6〜7月、10〜11月）　<a href="/column/bijihou-nittei/" className="underline hover:no-underline">詳しい日程・申込方法 →</a></p>
          <p><span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　東京商工会議所</p>
        </div>
      </section>

      <Bijihou2CourseAd />

      {/* コラム */}
      {bijihouColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {bijihouColumns.slice(0, 6).map((col) => (
              <a
                key={col.slug}
                href={`/column/${col.slug}/`}
                className="block py-2 text-sm text-[color:var(--c-text)] no-underline hover:text-[color:var(--c-kashikin)] border-b border-[color:var(--c-border)] last:border-b-0"
              >
                {col.title}
              </a>
            ))}
          </div>
          {bijihouColumns.length > 6 && (
            <a href="/column/#bijihou2" className="inline-block mt-4 text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-kashikin)] underline">
              ビジネス実務法務検定2級のコラムをすべて見る →
            </a>
          )}
        </section>
      )}
    </div>
  );
}
