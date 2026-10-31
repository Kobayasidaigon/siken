import { getAllLlcQuestions, getLlcQuestionsByField } from "@/lib/llc-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import LlcCourseAd from "@/components/LlcCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import { LLC_FIELDS } from "@/lib/llc-fields";
import ExamCountdown from "@/components/ExamCountdown";
import { LLC_EXAMS } from "@/lib/exam-dates";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

export const metadata: Metadata = pageMetadata({
  path: "/llc/",
  title: "労働法務士 練習問題・試験日程【無料】",
  description:
    "労働法務士認定試験のオリジナル練習問題と試験日程・申込締切をまとめたページ。労働契約・労働時間と賃金・安全衛生から、労働組合法、雇用保障、労働紛争の解決まで。",
});

export default async function LlcPage() {
  const allQuestions = await getAllLlcQuestions();
  const allColumns = await getAllColumns();
  const llcColumns = allColumns.filter((c) => c.slug.startsWith("llc-"));
  const fieldCounts = await Promise.all(
    LLC_FIELDS.map(async (f) => (await getLlcQuestionsByField(f.name)).length)
  );
  // 問題は分野ごとに順次公開する(2026-10-31 時点は準備中)。0問のあいだは問題・模試への導線を出さない。
  const ready = allQuestions.length > 0;
  const aff = EXAM_AFFILIATE.llc;

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
          / <span>労働法務士</span>
        </nav>
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight"
          style={{ color: "var(--c-pii-ink)" }}
        >
          労働法務士
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-pii-ink)" }}>
          労働契約・労働時間と賃金・安全衛生から、労働組合法、雇用保障、労働紛争の解決まで。本試験の出題範囲に沿ったオリジナル練習問題集です。
          {ready ? `（${allQuestions.length}問）` : "練習問題は分野ごとに準備中です。先に試験日程と申込締切をまとめています。"}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {ready ? (
            <>
              <a href="/llc/q/llc-001/" className="btn-accent">
                問題を解き始める →
              </a>
              <a
                href="/llc/moshi/"
                className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
                style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
              >
                模擬試験を受ける（60問）→
              </a>
              <a
                href="/llc/mock/"
                className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
                style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
              >
                本番形式で腕試し（20問・採点）→
              </a>
            </>
          ) : (
            <a href="/column/llc-nittei/" className="btn-accent">
              試験日程と申込締切を見る →
            </a>
          )}
        </div>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="llc" placement="return_top" className="mb-8" />

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示し、協会の申込ページへ送る(dxa と同じ形) */}
      <ExamCountdown
        exams={LLC_EXAMS}
        accent="var(--c-pii)"
        accentSoft="var(--c-pii-soft)"
        apply={
          aff.applyHref && aff.applyPixel
            ? { href: aff.applyHref, course: "llc", pixel: aff.applyPixel }
            : undefined
        }
        calendar={{ examName: "労働法務士認定試験", path: "/llc/" }}
      />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {LLC_FIELDS.map((f, i) => {
            const body = (
              <>
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
                  <span className="text-xs text-[color:var(--c-text-sub)] shrink-0">
                    {fieldCounts[i] > 0 ? `${fieldCounts[i]}問` : "準備中"}
                  </span>
                </div>
                <p className="text-sm text-[color:var(--c-text-sub)] mt-2 leading-relaxed">{f.desc}</p>
              </>
            );
            return fieldCounts[i] > 0 ? (
              <a
                key={f.slug}
                href={`/llc/field/${f.slug}/`}
                className="card p-5 no-underline group block"
                style={{ borderLeft: "3px solid var(--c-pii)" }}
              >
                {body}
              </a>
            ) : (
              <div key={f.slug} className="card p-5 block" style={{ borderLeft: "3px solid var(--c-border)" }}>
                {body}
              </div>
            );
          })}
        </div>
      </section>

      {/* 2026-10-31 に協会の公式ページ(https://www.joho-gakushu.or.jp/llc/)と試験日程の一覧(schedule/2026.php)で確認 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　60問・150分
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">出題範囲</span>　労働法総論（労働法の意義と沿革・憲法上の基本規定）／雇用関係法（労働契約の法理・労働条件の最低基準・安全と健康・災害補償・人権保障と差別の禁止）／労使関係法（労働組合法）／雇用保障法／労働紛争解決のシステム（労働関係調整法など）／その他（外国人労働者に関する法規）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　70%以上（問題の難易度により調整し、70%未満でも合格とする場合がある）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　一般 16,500円／学割 13,200円（税込）。CBTは会場費1,500円、オンラインIBTはカメラ送料3,000円が別途
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年4回（3月・7月・11月・12月ごろ）。
            <a href="/column/llc-nittei/" className="underline hover:no-underline">
              詳しい日程・申込方法
            </a>
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験方式</span>　公開会場（マークシート）・CBT・オンラインIBT
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　一般財団法人 全日本情報学習振興協会
          </p>
          <p className="text-xs pt-2">※最新の日程・受験料・出題範囲は必ず公式サイトでご確認ください。</p>
        </div>
      </section>

      {/* 合格報告(掲載済みがあれば)と、受験直後の方への報告のお願い。どちらも条件を満たさなければ何も出ない */}
      <ExamVoicesSection exam="llc" />

      <LlcCourseAd />

      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">あわせて学ぶと役に立つ試験</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed">
          <p>
            労働法務士は、人事・労務・総務の担当者、労務管理をする経営者・管理職、社会保険労務士を目指す方に向いた試験です。関連する試験の問題集もあります:{" "}
            <a href="/had/" className="underline hover:no-underline">ハラスメントアドバイザー</a>・
            <a href="/wlc/" className="underline hover:no-underline">ワークライフ・コーディネーター</a>・
            <a href="/ccc/" className="underline hover:no-underline">民法法務士</a>・
            <a href="/cac/" className="underline hover:no-underline">会社法法務士</a>
          </p>
        </div>
      </section>

      {/* コラム */}
      {llcColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {llcColumns.slice(0, 6).map((col) => (
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
