import { getAllDxpQuestions, getDxpQuestionsByField } from "@/lib/dxp-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import DxpCourseAd from "@/components/DxpCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import { DXP_FIELDS } from "@/lib/dxp-fields";
import ExamCountdown from "@/components/ExamCountdown";
import { DXP_EXAMS } from "@/lib/exam-dates";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

export const metadata: Metadata = pageMetadata({
  path: "/dxp/",
  title: "DXパスポート試験 練習問題【全160問・無料】",
  description:
    "全日本情報学習振興協会のDXパスポート試験のオリジナル練習問題160問を無料公開。第1課題「DXの現状」と第2課題「DXの技術」（AI・ビッグデータ・IoT・クラウド・情報セキュリティ）を、本試験と同じ2択・4択で根拠つき解説とともに演習できます。",
});

export default async function DxpPage() {
  const allQuestions = await getAllDxpQuestions();
  const allColumns = await getAllColumns();
  const dxpColumns = allColumns.filter((c) => c.slug.startsWith("dxp-"));
  const fieldCounts = await Promise.all(
    DXP_FIELDS.map(async (f) => (await getDxpQuestionsByField(f.name)).length)
  );
  const aff = EXAM_AFFILIATE.dxp;

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
          / <span>DXパスポート試験</span>
        </nav>
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight"
          style={{ color: "var(--c-pii-ink)" }}
        >
          DXパスポート試験
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-pii-ink)" }}>
          DXの考え方と業種別の動き、それを支えるAI・ビッグデータ・IoT・クラウド・情報セキュリティまで。本試験の2課題・8章に沿った
          {allQuestions.length}問のオリジナル練習問題集です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/dxp/q/dxp-001/" className="btn-accent">
            問題を解き始める →
          </a>
          <a
            href="/dxp/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            模擬試験を受ける（60問・60分・課題別判定）→
          </a>
          <a
            href="/dxp/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </a>
        </div>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="dxp" placement="return_top" className="mb-8" />

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示し、協会の申込ページへ送る(isec と同じ形)。
          申込の A8 リンク(applyHref)が届くまではカウントダウンだけを出す。 */}
      <ExamCountdown
        exams={DXP_EXAMS}
        accent="var(--c-pii)"
        accentSoft="var(--c-pii-soft)"
        apply={
          aff.applyHref && aff.applyPixel
            ? { href: aff.applyHref, course: "dxp", pixel: aff.applyPixel }
            : undefined
        }
        calendar={{ examName: "DXパスポート試験", path: "/dxp/" }}
      />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {DXP_FIELDS.map((f, i) => (
            <a
              key={f.slug}
              href={`/dxp/field/${f.slug}/`}
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

      {/* 2026-10-07 に協会の dx/dx-passport/ と SMART講座ページ(dx-kentei/dx-passport.php)で照合済み。
          合格基準はどちらも「70%以上」で、課題ごとの基準は書かれていない。配点は2択問題 計120点・4択問題 計240点(合計360点)。 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　2択・4択・60問・60分（各課題30問のうち2択15問・4択15問）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">出題範囲</span>
            　第1課題 DXの現状（DX総論／業種別DXビジネスの現状／DX企業の現状）／第2課題 DXの技術（AI／ビッグデータ／IoT／クラウド／情報セキュリティ）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>
            　70%以上の得点（問題の難易度により調整される場合がある）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　9,350円（税込）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年4回実施
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">実施機関</span>
            　一般財団法人 全日本情報学習振興協会
          </p>
          <p className="text-xs pt-2">
            ※IPA などが発行する「DX推進パスポート」（ITパスポート試験などの合格で取得できるデジタルバッジ）や、他団体の「DX検定」とは別の試験です。最新の日程・受験料・出題範囲は必ず協会の公式サイトでご確認ください。
          </p>
        </div>
      </section>

      {/* 合格報告(掲載済みがあれば)と、受験直後の方への報告のお願い。
          どちらも条件を満たさなければ何も出ない */}
      <ExamVoicesSection exam="dxp" />

      <DxpCourseAd />

      {/* 同じ協会の試験。DXの技術(第2課題)の情報セキュリティから先へ進む人向け。 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">同じ協会の試験</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>
            DXパスポート試験を実施している全日本情報学習振興協会は、情報セキュリティの
            <a href="/isf/" className="underline hover:no-underline">
              情報・サイバーセキュリティ初級
            </a>
            ・
            <a href="/isec/" className="underline hover:no-underline">
              情報・サイバーセキュリティ管理士
            </a>
            や、
            <a href="/pii/" className="underline hover:no-underline">
              個人情報保護士
            </a>
            も実施しています。第2課題の「情報セキュリティ」をもう一段深く学ぶなら、初級が次の一歩になります。
          </p>
        </div>
      </section>

      {/* コラム */}
      {dxpColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {dxpColumns.slice(0, 6).map((col) => (
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
