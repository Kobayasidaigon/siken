import { getAllIsecQuestions, getIsecQuestionsByField } from "@/lib/isec-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import IsecCourseAd from "@/components/IsecCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import { ISEC_FIELDS } from "@/lib/isec-fields";
import ExamCountdown from "@/components/ExamCountdown";
import { ISEC_EXAMS } from "@/lib/exam-dates";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

export const metadata: Metadata = pageMetadata({
  path: "/isec/",
  title: "情報・サイバーセキュリティ管理士 練習問題【全200問・無料】",
  description:
    "情報・サイバーセキュリティ管理士認定試験（旧・情報セキュリティ管理士）のオリジナル練習問題を無料公開。2026年2月からの新しい出題範囲（課題Ⅰ〜Ⅲ）に沿って、情報セキュリティ総論・関連法規から脅威と対策、サイバー攻撃とインシデント対応までを根拠つき解説で演習できます。",
});

export default async function IsecPage() {
  const allQuestions = await getAllIsecQuestions();
  const allColumns = await getAllColumns();
  const isecColumns = allColumns.filter((c) => c.slug.startsWith("isec-"));
  const fieldCounts = await Promise.all(
    ISEC_FIELDS.map(async (f) => (await getIsecQuestionsByField(f.name)).length)
  );
  const scopeQuestionCount = ISEC_FIELDS.reduce((sum, f, i) => (f.outOfScope ? sum : sum + fieldCounts[i]), 0);

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
          / <span>情報・サイバーセキュリティ管理士</span>
        </nav>
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight"
          style={{ color: "var(--c-pii-ink)" }}
        >
          情報・サイバーセキュリティ管理士
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-pii-ink)" }}>
          情報セキュリティ総論・関連法規から、脅威と対策、サイバー攻撃とインシデント対応まで。本試験の課題Ⅰ〜Ⅲに沿った
          {scopeQuestionCount}問に、ネットワークとコンピュータの基礎の参考問題{allQuestions.length - scopeQuestionCount}問を加えたオリジナル練習問題集です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/isec/q/isec-001/" className="btn-accent">
            問題を解き始める →
          </a>
          <a
            href="/isec/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            模擬試験を受ける（90問・60分・課題別の正答率つき）→
          </a>
          <a
            href="/isec/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </a>
        </div>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="isec" placement="return_top" className="mb-8" />

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示し、協会の申込ページへ送る。
          pii / mynumber / jitsumu と同じ形。実施団体(協会)がそのまま A8 の広告主なので、
          ドリル読者の必然行動である受験申込が成果地点になる。 */}
      <ExamCountdown
        exams={ISEC_EXAMS}
        accent="var(--c-pii)"
        accentSoft="var(--c-pii-soft)"
        apply={{
          href: EXAM_AFFILIATE.isec.applyHref!,
          course: "isec",
          pixel: EXAM_AFFILIATE.isec.applyPixel!,
        }}
        calendar={{ examName: "情報・サイバーセキュリティ管理士認定試験", path: "/isec/" }}
      />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {ISEC_FIELDS.map((f, i) => f.outOfScope ? null : (
            <a
              key={f.slug}
              href={`/isec/field/${f.slug}/`}
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

        {/* 旧課題Ⅳ。2026年2月の試験から管理士の出題範囲外(初級だけに残った)。問題とURLは参考として残す */}
        <h3 className="text-sm font-bold text-[color:var(--c-ink)] mt-8 mb-2 font-serif">参考：ネットワークとコンピュータの基礎</h3>
        <p className="text-xs text-[color:var(--c-text-sub)] mb-3 leading-relaxed">
          旧課題Ⅳ「コンピュータの一般知識」の分野です。2026年2月の試験から管理士では出題されなくなり、
          <a href="/isf/" className="underline hover:no-underline">
            初級
          </a>
          だけの範囲になりました。課題Ⅲのサイバー攻撃（DNSやWebへの攻撃など）を理解する土台として残しています。
        </p>
        <div className="space-y-2">
          {ISEC_FIELDS.map((f, i) => !f.outOfScope ? null : (
            <a
              key={f.slug}
              href={`/isec/field/${f.slug}/`}
              className="card p-4 no-underline group flex items-start justify-between gap-3"
            >
              <p className="text-sm font-bold text-[color:var(--c-ink)] font-serif">{f.name}</p>
              <span className="text-xs text-[color:var(--c-text-sub)] shrink-0">{fieldCounts[i]}問</span>
            </a>
          ))}
        </div>
      </section>

      {/* 2026-10-10 に現行の形式へ更新。出典は協会の /isme/・/isme/naiyou.php(2026-10-07 に Cowork が照合、
          10-10 に検索結果でも 180問/120分・課題Ⅰ〜Ⅲ・正答率70% を確認)。課題ごとの基準は案内に無い。 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　マークシート・180問・120分
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">出題範囲</span>
            　課題Ⅰ 情報セキュリティ総論／課題Ⅱ 脅威と情報セキュリティ対策／課題Ⅲ サイバーセキュリティ対策
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>
            　正答率70%（問題の難易度により調整される場合がある）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　11,000円（税込）／学生 8,800円（税込）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年4回実施
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">実施機関</span>
            　一般財団法人 全日本情報学習振興協会
          </p>
          <p className="text-xs pt-2">
            ※2026年2月の試験で「情報セキュリティ管理士認定試験」から名称が変わり、出題範囲も課題Ⅰ〜Ⅲに見直されました（課題Ⅳ「コンピュータの一般知識」は初級だけに残りました）。最新の日程・受験料は必ず協会の公式サイトでご確認ください。
          </p>
        </div>
      </section>

      {/* 合格報告(掲載済みがあれば)と、受験直後の方への報告のお願い。
          どちらも条件を満たさなければ何も出ない */}
      <ExamVoicesSection exam="isec" />

      <IsecCourseAd setPrice />

      {/* 姉妹検定。同じ協会が同じ日程で実施する3試験へ内部で送る。
          bijimane / eco の「同じ東商検定を併願する方へ」と同じ役割。 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">
          同じ協会の検定を併願する方へ
        </h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>
            情報・サイバーセキュリティ管理士を実施している全日本情報学習振興協会は、
            <a href="/pii/" className="underline hover:no-underline">
              個人情報保護士
            </a>
            ・
            <a href="/jitsumu/" className="underline hover:no-underline">
              個人情報保護実務検定
            </a>
            ・
            <a href="/mynumber/" className="underline hover:no-underline">
              マイナンバー実務検定
            </a>
            も実施しています。申込先は同じ協会です。
            試験日は、個人情報保護実務検定と
            <a href="/isf/" className="underline hover:no-underline">
              初級
            </a>
            が管理士と同じ日（2月・5月・8月・11月）、個人情報保護士とマイナンバー実務検定は別の月（3月・6月・9月・12月）です。
          </p>
          <p>
            出題範囲も重なります。本試験の課題Ⅰで問われる情報セキュリティの管理体制・関連法規は、個人情報保護士の課題Ⅱ「情報セキュリティ」とほぼ同じ論点です。
            個人情報保護法の安全管理措置は3試験すべてで問われます。片方の学習がもう片方の下地になるので、続けて受ける・併願するのは現実的な選択肢です。
          </p>
        </div>
      </section>

      {/* コラム */}
      {isecColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {isecColumns.slice(0, 6).map((col) => (
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
