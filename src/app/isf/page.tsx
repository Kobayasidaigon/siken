import { getAllIsfQuestions, getIsfQuestionsByField } from "@/lib/isf-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import IsfCourseAd from "@/components/IsfCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import { ISF_FIELDS } from "@/lib/isf-fields";
import ExamCountdown from "@/components/ExamCountdown";
import { ISF_EXAMS } from "@/lib/exam-dates";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

export const metadata: Metadata = pageMetadata({
  path: "/isf/",
  title: "情報・サイバーセキュリティ初級 練習問題【全160問・無料】",
  description:
    "情報・サイバーセキュリティ初級認定試験（旧・情報セキュリティ初級）のオリジナル練習問題160問を無料公開。情報セキュリティ総論、紙媒体・社員・機器の脅威と対策、インターネットと外部攻撃、コンピュータの一般知識まで4課題を根拠つき解説で演習できます。",
});

export default async function IsfPage() {
  const allQuestions = await getAllIsfQuestions();
  const allColumns = await getAllColumns();
  const isfColumns = allColumns.filter((c) => c.slug.startsWith("isf-"));
  const fieldCounts = await Promise.all(
    ISF_FIELDS.map(async (f) => (await getIsfQuestionsByField(f.name)).length)
  );
  const aff = EXAM_AFFILIATE.isf;

  return (
    <div className="theme-pii pb-16">
      <section
        className="-mx-4 px-4 py-10 sm:py-14 border-y mb-10"
        style={{ background: "var(--c-pii-soft)", borderColor: "var(--c-border)" }}
      >
        <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
          <a href="/" className="no-underline hover:underline">
            ホーム
          </a>{" "}
          / <span>情報・サイバーセキュリティ初級</span>
        </nav>
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight"
          style={{ color: "var(--c-pii-ink)" }}
        >
          情報・サイバーセキュリティ初級
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-pii-ink)" }}>
          職場の書類やパソコン、メール、スマートフォンの扱い方から、外部からの攻撃、コンピュータの基礎まで。本試験の4課題に沿った
          {allQuestions.length}問のオリジナル練習問題集です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/isf/q/isf-001/" className="btn-accent">
            問題を解き始める →
          </a>
          <a
            href="/isf/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            模擬試験を受ける（80問・60分・課題別判定）→
          </a>
          <a
            href="/isf/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </a>
        </div>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="isf" placement="return_top" className="mb-8" />

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示し、協会の申込ページへ送る(isec と同じ形)。
          申込の A8 リンク(applyHref)が届くまではカウントダウンだけを出す。 */}
      <ExamCountdown
        exams={ISF_EXAMS}
        accent="var(--c-pii)"
        accentSoft="var(--c-pii-soft)"
        apply={
          aff.applyHref && aff.applyPixel
            ? { href: aff.applyHref, course: "isf", pixel: aff.applyPixel }
            : undefined
        }
        calendar={{ examName: "情報・サイバーセキュリティ初級認定試験", path: "/isf/" }}
      />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {ISF_FIELDS.map((f, i) => (
            <a
              key={f.slug}
              href={`/isf/field/${f.slug}/`}
              className="card p-5 no-underline group block"
              style={{ borderLeft: "3px solid var(--c-pii)" }}
            >
              <div className="flex items-start justify-between mb-1 gap-3">
                <p className="text-base font-bold text-[color:var(--c-ink)] font-serif">
                  <span
                    className="text-xs font-normal mr-2 px-1.5 py-0.5 rounded align-middle"
                    style={{ background: "var(--c-pii-soft)", color: "var(--c-pii-ink)" }}
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

      {/* 2026-10-07 に協会の /isme/・/isme/naiyou.php と SMART講座ページ(k_isf)で照合済み(80問・60分・受験料・課題名)。
          合格基準は、協会の試験ページが「70%以上」、講座ページが「I〜IV 各々70%以上」と書いている。下は講座ページの表記。 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　四肢択一・80問・60分
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">出題範囲</span>
            　課題Ⅰ 情報セキュリティ総論／課題Ⅱ 脅威と情報セキュリティ対策／課題Ⅲ サイバーセキュリティ対策／課題Ⅳ
            コンピュータの一般知識
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>
            　各課題とも70%以上（問題の難易度により調整される場合がある）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　8,800円（税込）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年4回実施
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">実施機関</span>
            　一般財団法人 全日本情報学習振興協会
          </p>
          <p className="text-xs pt-2">
            ※旧称は「情報セキュリティ初級認定試験」です。最新の日程・受験料・出題範囲は必ず協会の公式サイトでご確認ください。
          </p>
        </div>
      </section>

      {/* 合格報告(掲載済みがあれば)と、受験直後の方への報告のお願い。
          どちらも条件を満たさなければ何も出ない */}
      <ExamVoicesSection exam="isf" />

      <IsfCourseAd />

      {/* 次に受ける試験。初級は協会の情報セキュリティ系の入口で、上位が管理士。 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">初級のあとに受ける試験</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>
            初級の上位にあたるのが、同じ協会の
            <a href="/isec/" className="underline hover:no-underline">
              情報・サイバーセキュリティ管理士
            </a>
            です。課題Ⅰ〜Ⅲ（情報セキュリティ総論・脅威と情報セキュリティ対策・サイバーセキュリティ対策）は初級と同じ柱で、管理士には課題Ⅳ（コンピュータの一般知識）が無いかわりに、180問・120分でより深く問われます。違いは
            <a href="/column/isec-isf-hikaku/" className="underline hover:no-underline">
              初級と管理士の違い
            </a>
            にまとめています。
          </p>
          <p>
            個人情報の扱いまで広げるなら、
            <a href="/pii/" className="underline hover:no-underline">
              個人情報保護士
            </a>
            ・
            <a href="/mynumber/" className="underline hover:no-underline">
              マイナンバー実務検定
            </a>
            も同じ協会が実施しています。
          </p>
        </div>
      </section>

      {/* コラム */}
      {isfColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {isfColumns.slice(0, 6).map((col) => (
              <a
                key={col.slug}
                href={`/column/${col.slug}/`}
                className="block py-2 text-sm text-[color:var(--c-text)] no-underline hover:text-[color:var(--c-pii)] border-b border-[color:var(--c-border)] last:border-b-0"
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
