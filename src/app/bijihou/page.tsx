import { getAllBijihouQuestions, getBijihouQuestionsByField } from "@/lib/bijihou-questions";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import BijihouCourseAd from "@/components/BijihouCourseAd";
import { BIJIHOU_TOP_AD } from "@/lib/bijihou-ad-content";
import { pageMetadata } from "@/lib/page-metadata";
import { BIJIHOU_EXAMS } from "@/lib/exam-dates";
import ExamCountdown from "@/components/ExamCountdown";
import Moshi2TopLink from "@/components/Moshi2TopLink";

export const metadata: Metadata = pageMetadata({
  path: "/bijihou/",
  title: "ビジネス実務法務検定3級 練習問題・過去問対策【全200問・無料】",
  description: "ビジネス実務法務検定3級のオリジナル練習問題200問を無料公開。民法・商法・会社法・関連法規を根拠つき解説で演習できます。IBT・CBT化で過去問が公開されない試験の演習量確保に。",
});

const fields = [
  { name: "法体系・取引の基礎", slug: "kiso", desc: "公法/私法、行為能力、代理、契約成立、意思表示、消滅時効" },
  { name: "民法（債権・契約）", slug: "minpou-saiken", desc: "売買、賃貸借、請負・委任、債務不履行、連帯保証、抵当権、債権譲渡" },
  { name: "民法（物権・担保・相続）", slug: "minpou-bukken", desc: "所有権、共有、占有、担保物権、不法行為、不当利得、親族・相続" },
  { name: "商法・会社法", slug: "kaisya", desc: "株式会社、機関設計、商行為、商業登記、手形・小切手" },
  { name: "関連法規", slug: "kanren", desc: "消費者契約法、独占禁止法、知的財産法、個人情報保護法、労働法" },
];

export default async function BijihouPage() {
  const allQuestions = await getAllBijihouQuestions();
  const allColumns = await getAllColumns();
  const bijihouColumns = allColumns.filter((c) => c.slug.startsWith("bijihou-"));
  const fieldCounts = await Promise.all(
    fields.map(async (f) => {
      const qs = await getBijihouQuestionsByField(f.name);
      return qs.length;
    })
  );

  return (
    <div className="theme-kashikin pb-16">
      <section className="-mx-4 px-4 py-10 sm:py-14 border-y mb-10" style={{ background: "var(--c-kashikin-soft)", borderColor: "var(--c-border)" }}>
        <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
          <a href="/" className="no-underline hover:underline">ホーム</a> / <span>ビジネス実務法務検定3級</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight" style={{ color: "var(--c-kashikin-ink)" }}>
          ビジネス実務法務検定3級
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-kashikin)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-kashikin-ink)" }}>
          民法・会社法・関連法規を扱う、{allQuestions.length}問のオリジナル練習問題集です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/bijihou/q/bijihou-001/" className="btn-accent">問題を解き始める →</a>
          <a
            href="/bijihou/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-kashikin-soft)]"
            style={{ borderColor: "var(--c-kashikin)", color: "var(--c-kashikin-ink)" }}
          >
            模擬試験を受ける（90分・70点合格判定）→
          </a>
          <Moshi2TopLink certId="bijihou" />
        </div>
      </section>

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示(東商IBT/CBTは期間制) */}
      <ExamCountdown exams={BIJIHOU_EXAMS} accent="var(--c-kashikin)" accentSoft="var(--c-kashikin-soft)" periodExam lead="bijihou" />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {fields.map((f, i) => (
            <a key={f.slug} href={`/bijihou/field/${f.slug}/`} className="card p-5 no-underline group block" style={{ borderLeft: "3px solid var(--c-kashikin)" }}>
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

      <BijihouCourseAd headline={BIJIHOU_TOP_AD.headline} body={BIJIHOU_TOP_AD.body} />

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
            <a href="/column/#bijihou" className="inline-block mt-4 text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-kashikin)] underline">
              ビジネス実務法務検定3級のコラムをすべて見る →
            </a>
          )}
        </section>
      )}
    </div>
  );
}
