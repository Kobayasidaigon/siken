import { getAllChizai2Questions, getChizai2QuestionsByField } from "@/lib/chizai2-questions";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import Chizai2CourseAd from "@/components/Chizai2CourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import { CHIZAI_EXAMS } from "@/lib/exam-dates";
import ExamCountdown from "@/components/ExamCountdown";
import Moshi2TopLink from "@/components/Moshi2TopLink";

export const metadata: Metadata = pageMetadata({
  path: "/chizai2/",
  title: "知的財産管理技能検定2級 練習問題・過去問対策【全231問・無料】",
  description: "知的財産管理技能検定2級のオリジナル練習問題231問を無料公開。3級の一歩先、実務レベルの事例判断まで問われる範囲を、根拠つきの詳細解説で演習できます。",
});

const fields = [
  { name: "特許法", slug: "patent" },
  { name: "著作権法", slug: "copyright" },
  { name: "意匠法", slug: "design" },
  { name: "商標法", slug: "trademark" },
  { name: "不正競争防止法", slug: "unfair" },
  { name: "関連法規", slug: "related" },
  { name: "実用新案法・種苗法", slug: "utility" },
  { name: "国際条約", slug: "treaty" },
  { name: "知財実務", slug: "practice" },
];

export default async function Chizai2Page() {
  const allQuestions = await getAllChizai2Questions();
  const allColumns = await getAllColumns();
  const chizai2Columns = allColumns.filter((c) => c.slug.startsWith("chizai2-"));

  const fieldCounts = await Promise.all(
    fields.map(async (f) => {
      const qs = await getChizai2QuestionsByField(f.name);
      return qs.length;
    })
  );

  return (
    <div className="theme-chizai pb-16">
      {/* Hero */}
      <section
        className="-mx-4 px-4 py-10 sm:py-14 border-y mb-10"
        style={{ background: "var(--c-chizai-soft)", borderColor: "var(--c-border)" }}
      >
        <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
          <a href="/" className="no-underline hover:underline">ホーム</a> / <span>知的財産管理技能検定2級</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight" style={{ color: "var(--c-chizai-ink)" }}>
          知的財産管理技能検定 2級
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-chizai)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-chizai-ink)" }}>
          3級の一歩先、実務で使える知財の力を測る国家資格。
          特許・著作権・商標などを、事例に沿ってより深く問う{allQuestions.length}問です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/chizai2/q/chizai2-001/" className="btn-accent">問題を解き始める →</a>
          <a
            href="/chizai2/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-chizai-soft)]"
            style={{ borderColor: "var(--c-chizai)", color: "var(--c-chizai-ink)" }}
          >
            模擬試験を受ける（40問・60分・合否判定）→
          </a>
          <Moshi2TopLink certId="chizai2" />
          <a
            href="/chizai2/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-chizai-soft)]"
            style={{ borderColor: "var(--c-chizai)", color: "var(--c-chizai-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </a>
        </div>
        <p className="mt-4 text-xs text-[color:var(--c-text-sub)]">
          まず3級から、という方は <a href="/chizai/" className="underline hover:no-underline" style={{ color: "var(--c-chizai-ink)" }}>知的財産管理技能検定3級（オリジナル200問）</a> へ。
        </p>
      </section>

      {/* カウントダウン: 2級と3級は同一機関・同一試験日のため3級の日程を共用。申込期間中は「申込締切まで」を優先表示 */}
      <ExamCountdown exams={CHIZAI_EXAMS} accent="var(--c-chizai)" accentSoft="var(--c-chizai-soft)" />

      {/* 分野 - タグクラウド風 */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="flex flex-wrap gap-3">
          {fields.map((f, i) => (
            <a key={f.slug} href={`/chizai2/field/${f.slug}/`} className="no-underline group">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all group-hover:shadow-sm"
                style={{ background: "var(--c-surface)", color: "var(--c-chizai-ink)", borderColor: "var(--c-chizai-soft)" }}
              >
                {f.name}
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "var(--c-chizai-soft)", color: "var(--c-chizai-ink)" }}>
                  {fieldCounts[i]}
                </span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* 3級との違い */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">3級との違い</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>3級が知識の基礎を問うのに対し、<span className="font-bold text-[color:var(--c-ink)]">2級は事例（実技）を通じて、実務での判断力</span>まで問われます。合格基準も3級より高く設定されています。</p>
          <p>いきなり2級から受けることもできますが、多くの方は3級で全体像をつかんでから2級に進みます。</p>
        </div>
      </section>

      {/* 試験概要 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p><span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年3回（3月・7月・11月）　3級と同日</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">試験区分</span>　学科試験と実技試験（それぞれに合格すると2級技能士に認定）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験資格</span>　3級技能検定の合格者、知的財産に関する業務に2年以上従事した方 など（＝誰でも受けられる3級と異なり、受験資格が必要）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　知的財産教育協会</p>
          <p className="text-xs pt-1">受験料・出題数・合格基準などの最新の詳細は、必ず公式サイトでご確認ください。</p>
        </div>
      </section>

      <Chizai2CourseAd
        headline="2級レンジの論点を体系的に押さえるなら"
        body="知的財産管理技能検定2級は出題範囲が広く、実務寄りの応用まで問われます。資格スクールLEC東京リーガルマインドは2級の対策講座を提供しており、頻出論点を講義で体系的に押さえられます。"
      />

      {/* コラム */}
      {chizai2Columns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {chizai2Columns.slice(0, 6).map((col) => (
              <a
                key={col.slug}
                href={`/column/${col.slug}/`}
                className="block py-2 text-sm text-[color:var(--c-text)] no-underline hover:text-[color:var(--c-chizai)] border-b border-[color:var(--c-border)] last:border-b-0"
              >
                {col.title}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
