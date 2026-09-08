import { getAllKyoinQuestions, getKyoinQuestionsByField } from "@/lib/kyoin-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import KyoinCourseAd from "@/components/KyoinCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import { KYOIN_FIELDS } from "@/lib/kyoin-fields";

export const metadata: Metadata = pageMetadata({
  path: "/kyoin/",
  title: "教員採用試験 教職教養 練習問題【全200問・無料】",
  description:
    "教員採用試験の教職教養・一般教養のオリジナル練習問題200問を無料公開。教育法規・教育原理・教育心理・教育史・教育時事を、自治体をまたいで共通する論点に絞り、根拠条文つきの解説で演習できます。志望自治体を問わず使えます。",
});

export default async function KyoinPage() {
  const allQuestions = await getAllKyoinQuestions();
  const allColumns = await getAllColumns();
  const kyoinColumns = allColumns.filter((c) => c.slug.startsWith("kyoin-"));
  const fieldCounts = await Promise.all(
    KYOIN_FIELDS.map(async (f) => (await getKyoinQuestionsByField(f.name)).length)
  );

  return (
    <div className="theme-fukushi pb-16">
      <section
        className="-mx-4 px-4 py-10 sm:py-14 border-y mb-10"
        style={{ background: "var(--c-fukushi-soft)", borderColor: "var(--c-border)" }}
      >
        <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
          <a href="/" className="no-underline hover:underline">
            ホーム
          </a>{" "}
          / <span>教員採用試験</span>
        </nav>
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight"
          style={{ color: "var(--c-fukushi-ink)" }}
        >
          教員採用試験（教職教養）
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-fukushi)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-fukushi-ink)" }}>
          教育法規・教育原理・教育心理・教育史・教育時事に一般教養を加えた
          {allQuestions.length}問のオリジナル練習問題集です。自治体をまたいで共通する論点だけを扱っているので、志望自治体を問わず使えます。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/kyoin/q/kyoin-001/" className="btn-accent">
            問題を解き始める →
          </a>
          <a
            href="/kyoin/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-fukushi-soft)]"
            style={{ borderColor: "var(--c-fukushi)", color: "var(--c-fukushi-ink)" }}
          >
            模擬試験を受ける（60問・60分・分野別判定）→
          </a>
          <a
            href="/kyoin/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-fukushi-soft)]"
            style={{ borderColor: "var(--c-fukushi)", color: "var(--c-fukushi-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </a>
        </div>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="kyoin" placement="return_top" className="mb-8" />

      {/* カウントダウンは置かない。試験日・出願期間が自治体ごとに違うので、
          全国共通の「次回試験」を1つ出すと大半の読者にとって誤った日付になる。 */}

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {KYOIN_FIELDS.map((f, i) => (
            <a
              key={f.slug}
              href={`/kyoin/field/${f.slug}/`}
              className="card p-5 no-underline group block"
              style={{ borderLeft: "3px solid var(--c-fukushi)" }}
            >
              <div className="flex items-start justify-between mb-1 gap-3">
                <p className="text-base font-bold text-[color:var(--c-ink)] font-serif">
                  <span
                    className="text-xs font-normal mr-2 px-1.5 py-0.5 rounded align-middle"
                    style={{ background: "var(--c-fukushi-soft)", color: "var(--c-fukushi-ink)" }}
                  >
                    {f.task}
                  </span>
                  {f.name}
                </p>
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
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">実施機関</span>
            　各都道府県・政令指定都市の教育委員会（自治体ごとに独立して実施）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験の構成</span>
            　一次で筆記（教職教養・一般教養・専門教養）、二次で面接・模擬授業・実技などが一般的
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">教職教養の範囲</span>
            　教育原理／教育法規／教育心理／教育史／教育時事の5分野
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">出題形式</span>
            　自治体により四肢択一・五肢択一・空欄補充・正誤判定などが混在（本サイトは全問4肢択一に統一）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">実施時期</span>
            　一次は夏に実施する自治体が多い。出願期間・試験日・科目・配点はすべて自治体ごとに異なる
          </p>
          <p className="text-xs pt-2">
            ※日程・出願方法・出題科目・配点は必ず志望自治体の教育委員会が公表する実施要項でご確認ください。本サイトは自治体固有の制度は扱わず、全国共通の論点に絞っています。
          </p>
        </div>
      </section>

      {/* 合格報告(掲載済みがあれば)と、受験直後の方への報告のお願い。
          どちらも条件を満たさなければ何も出ない */}
      <ExamVoicesSection exam="kyoin" />

      <KyoinCourseAd />

      {/* コラム */}
      {kyoinColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {kyoinColumns.slice(0, 6).map((col) => (
              <a
                key={col.slug}
                href={`/column/${col.slug}/`}
                className="block py-2 text-sm text-[color:var(--c-text)] no-underline hover:text-[color:var(--c-fukushi)] border-b border-[color:var(--c-border)] last:border-b-0"
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
