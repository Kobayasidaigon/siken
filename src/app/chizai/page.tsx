import SiteLink from "@/components/SiteLink";
import { getAllChizaiQuestions, getChizaiQuestionsByField } from "@/lib/chizai-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import ChizaiCourseAd from "@/components/ChizaiCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import { CHIZAI_EXAMS } from "@/lib/exam-dates";
import ExamCountdown from "@/components/ExamCountdown";
import Moshi2TopLink from "@/components/Moshi2TopLink";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import OfficialSiteLink from "@/components/OfficialSiteLink";

export const metadata: Metadata = pageMetadata({
  path: "/chizai/",
  title: "知的財産管理技能検定3級 練習問題・過去問対策【全232問・無料】",
  description: "知的財産管理技能検定3級のオリジナル練習問題232問を無料公開。特許法・著作権法・意匠法・商標法・不正競争防止法ほか9分野を、根拠つきの詳細解説で演習できます。",
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

export default async function ChizaiPage() {
  const allQuestions = await getAllChizaiQuestions();
  const allColumns = await getAllColumns();
  const chizaiColumns = allColumns.filter((c) => c.slug.startsWith("chizai-"));

  const fieldCounts = await Promise.all(
    fields.map(async (f) => {
      const qs = await getChizaiQuestionsByField(f.name);
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
          <SiteLink href="/" className="no-underline hover:underline">ホーム</SiteLink> / <span>知的財産管理技能検定3級</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight" style={{ color: "var(--c-chizai-ink)" }}>
          知的財産管理技能検定 3級
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-chizai)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-chizai-ink)" }}>
          特許・著作権・商標…　9つの分野を横断する{allQuestions.length}問。
          知財の実務で最初に目指す国家資格です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <SiteLink href="/chizai/q/chizai-001/" className="btn-accent">問題を解き始める →</SiteLink>
          <SiteLink
            href="/chizai/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-chizai-soft)]"
            style={{ borderColor: "var(--c-chizai)", color: "var(--c-chizai-ink)" }}
          >
            模擬試験を受ける（30問・45分・合否判定）→
          </SiteLink>
          <Moshi2TopLink certId="chizai" />
          <SiteLink
            href="/chizai/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-chizai-soft)]"
            style={{ borderColor: "var(--c-chizai)", color: "var(--c-chizai-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </SiteLink>
        </div>
        <p className="mt-4 text-xs text-[color:var(--c-text-sub)]">
          3級に慣れたら <SiteLink href="/chizai2/" className="underline hover:no-underline" style={{ color: "var(--c-chizai-ink)" }}>知的財産管理技能検定2級</SiteLink> へ。
        </p>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="chizai" placement="return_top" className="mb-8" />

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示 */}
      <ExamCountdown exams={CHIZAI_EXAMS} accent="var(--c-chizai)" accentSoft="var(--c-chizai-soft)" lead="chizai" calendar={{ examName: "知的財産管理技能検定3級", path: "/chizai/" }} />

      {/* 分野 - タグクラウド風 */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="flex flex-wrap gap-3">
          {fields.map((f, i) => (
            <SiteLink
              key={f.slug}
              href={`/chizai/field/${f.slug}/`}
              className="no-underline group"
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all group-hover:shadow-sm"
                style={{
                  background: "var(--c-surface)",
                  color: "var(--c-chizai-ink)",
                  borderColor: "var(--c-chizai-soft)",
                }}
              >
                {f.name}
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{ background: "var(--c-chizai-soft)", color: "var(--c-chizai-ink)" }}
                >
                  {fieldCounts[i]}
                </span>
              </span>
            </SiteLink>
          ))}
        </div>
      </section>

      {/* 学科 vs 実技 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">学科試験と実技試験</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="card p-5">
            <p className="text-sm font-bold text-[color:var(--c-ink)] mb-2 font-serif">学科試験</p>
            <p className="text-xs text-[color:var(--c-text-sub)] leading-relaxed">
              30問・45分・マークシート方式（3肢択一式）。試験範囲は保護（ブランド・技術・コンテンツ・デザイン）、活用（契約・エンフォースメント）、関係法規です。合格基準は満点の70%以上。
            </p>
          </div>
          <div className="card p-5">
            <p className="text-sm font-bold text-[color:var(--c-ink)] mb-2 font-serif">実技試験</p>
            <p className="text-xs text-[color:var(--c-text-sub)] leading-relaxed">
              30問・45分・記述方式とマークシート方式の併用。試験範囲は保護（ブランド・技術・コンテンツ・デザイン）と活用（契約・エンフォースメント）です。合格基準は満点の70%以上。
            </p>
          </div>
        </div>
        <p className="text-xs text-[color:var(--c-text-sub)] mt-3">
          学科と実技の両方に合格すると3級知的財産管理技能士になれます。片方だけ合格した場合は、受検申請と同時に免除申請をすると、合格日の翌々年度までに行われる検定でその試験が免除されます。合格基準は配点（非公表）にもとづく得点率で、正解した問題数の割合とは異なる場合があります。
        </p>
        <p className="text-xs text-[color:var(--c-text-sub)] mt-2">
          試験会場には紙試験方式の会場とCBT方式（コンピュータで受ける方式）の会場があり、実施地区ごとにどちらの方式かが決まっています。実施地区は住所に関係なく選べます。
        </p>
      </section>

      {/* 試験概要 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p><span className="font-bold text-[color:var(--c-ink)]">試験日</span>　原則として年3回　<SiteLink href="/column/chizai-nittei/" className="underline hover:no-underline">詳しい日程・申込方法 →</SiteLink></p>
          <p><span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　学科30問（マークシート方式・3肢択一式）+ 実技30問（記述方式・マークシート方式併用）、各45分。紙試験方式とCBT方式の会場がある</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　学科・実技ともに満点の70%以上（配点は非公表）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　学科6,100円 + 実技6,100円（受検手数料は非課税）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　知的財産教育協会</p>
        </div>
        <OfficialSiteLink exam="chizai" />
      </section>

      {/* 合格報告(掲載済みがあれば)と、受験直後の方への報告のお願い。
          どちらも条件を満たさなければ何も出ない */}
      <ExamVoicesSection exam="chizai" />

      <ChizaiCourseAd
        headline="出題範囲を一通り押さえるなら"
        body="知的財産管理技能検定3級の出題範囲は、知的財産の保護・活用と関係法規にわたります。月額制のオンライン講座オンスク.JPは知財検定3級講座を提供しており、スキマ時間で範囲を順に押さえられます。"
      />

      {/* コラム */}
      {chizaiColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {chizaiColumns.slice(0, 6).map((col) => (
              <SiteLink
                key={col.slug}
                href={`/column/${col.slug}/`}
                className="block py-2 text-sm text-[color:var(--c-text)] no-underline hover:text-[color:var(--c-chizai)] border-b border-[color:var(--c-border)] last:border-b-0"
              >
                {col.title}
              </SiteLink>
            ))}
          </div>
          {chizaiColumns.length > 6 && (
            <SiteLink href="/column/#chizai" className="inline-block mt-4 text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-chizai)] underline">
              知的財産管理技能検定3級のコラムをすべて見る →
            </SiteLink>
          )}
        </section>
      )}
    </div>
  );
}
