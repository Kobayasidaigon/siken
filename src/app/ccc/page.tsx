import { getAllCccQuestions, getCccQuestionsByField } from "@/lib/ccc-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import CccCourseAd from "@/components/CccCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import { CCC_FIELDS } from "@/lib/ccc-fields";
import ExamCountdown from "@/components/ExamCountdown";
import { CCC_EXAMS } from "@/lib/exam-dates";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

export const metadata: Metadata = pageMetadata({
  path: "/ccc/",
  title: "民法法務士 練習問題・試験日程【無料】",
  description:
    "民法法務士認定試験のオリジナル練習問題と試験日程・申込締切をまとめたページ。民法総則・物権・債権総論・債権各論・親族・相続まで、民法の全体を問う認定試験。",
});

export default async function CccPage() {
  const allQuestions = await getAllCccQuestions();
  const allColumns = await getAllColumns();
  const cccColumns = allColumns.filter((c) => c.slug.startsWith("ccc-"));
  const fieldCounts = await Promise.all(
    CCC_FIELDS.map(async (f) => (await getCccQuestionsByField(f.name)).length)
  );
  // 問題は分野ごとに順次公開する(2026-10-31 時点は準備中)。0問のあいだは問題・模試への導線を出さない。
  const ready = allQuestions.length > 0;
  const aff = EXAM_AFFILIATE.ccc;

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
          / <span>民法法務士</span>
        </nav>
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight"
          style={{ color: "var(--c-pii-ink)" }}
        >
          民法法務士
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-pii-ink)" }}>
          民法総則・物権・債権総論・債権各論・親族・相続まで、民法の全体を問う認定試験。本試験の出題範囲に沿ったオリジナル練習問題集です。
          {ready ? `（${allQuestions.length}問）` : "練習問題は分野ごとに準備中です。先に試験日程と申込締切をまとめています。"}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {ready ? (
            <>
              <a href="/ccc/q/ccc-001/" className="btn-accent">
                問題を解き始める →
              </a>
              <a
                href="/ccc/moshi/"
                className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
                style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
              >
                模擬試験を受ける（70問）→
              </a>
              <a
                href="/ccc/mock/"
                className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
                style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
              >
                本番形式で腕試し（20問・採点）→
              </a>
            </>
          ) : (
            <a href="/column/ccc-nittei/" className="btn-accent">
              試験日程と申込締切を見る →
            </a>
          )}
        </div>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="ccc" placement="return_top" className="mb-8" />

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示し、協会の申込ページへ送る(dxa と同じ形) */}
      <ExamCountdown
        exams={CCC_EXAMS}
        accent="var(--c-pii)"
        accentSoft="var(--c-pii-soft)"
        apply={
          aff.applyHref && aff.applyPixel
            ? { href: aff.applyHref, course: "ccc", pixel: aff.applyPixel }
            : undefined
        }
        calendar={{ examName: "民法法務士認定試験", path: "/ccc/" }}
      />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {CCC_FIELDS.map((f, i) => {
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
                href={`/ccc/field/${f.slug}/`}
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

      {/* 2026-10-31 に協会の公式ページ(https://www.joho-gakushu.or.jp/ccc/)と試験日程の一覧(schedule/2026.php)で確認 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　70問・150分（10:00〜12:45）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">出題範囲</span>　民法総則（人・法律行為・期間の計算・時効）／物権（占有権・所有権・地上権・永小作権など）／債権総論（債権の目的・効力・多数当事者・債権譲渡など）／債権各論（総則・売買・消費貸借・使用貸借など）／親族（婚姻）／相続（相続人・相続の効力・承認と放棄・遺言など）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　70%以上（問題の難易度により調整し、70%未満でも合格とする場合がある）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　一般 16,500円／学割 13,200円（税込）。CBTは会場費1,500円、オンラインIBTはカメラ送料3,000円が別途。民法債権法務士の合格者は11,000円
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年3回（1月・5月・11月ごろ）。
            <a href="/column/ccc-nittei/" className="underline hover:no-underline">
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
      <ExamVoicesSection exam="ccc" />

      <CccCourseAd />

      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">あわせて学ぶと役に立つ試験</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed">
          <p>
            民法法務士は、金融・保険・不動産・IT・人材など契約を扱う仕事の方、行政書士・司法書士の民法対策をしたい方に向いた試験です。関連する試験の問題集もあります:{" "}
            <a href="/bijihou/" className="underline hover:no-underline">ビジネス実務法務検定3級</a>・
            <a href="/bijihou2/" className="underline hover:no-underline">ビジネス実務法務検定2級</a>・
            <a href="/cac/" className="underline hover:no-underline">会社法法務士</a>・
            <a href="/llc/" className="underline hover:no-underline">労働法務士</a>
          </p>
        </div>
      </section>

      {/* コラム */}
      {cccColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {cccColumns.slice(0, 6).map((col) => (
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
