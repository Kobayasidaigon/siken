import { getAllDxoQuestions, getDxoQuestionsByField } from "@/lib/dxo-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import DxoCourseAd from "@/components/DxoCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import { DXO_FIELDS } from "@/lib/dxo-fields";
import ExamCountdown from "@/components/ExamCountdown";
import { DXO_EXAMS } from "@/lib/exam-dates";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

export const metadata: Metadata = pageMetadata({
  path: "/dxo/",
  title: "DXオフィサー 練習問題・試験日程【無料】",
  description:
    "DXオフィサー認定試験のオリジナル練習問題と試験日程・申込締切をまとめたページ。DXの現状と業種別の事例、AI・ビッグデータ・IoT・クラウドなどの技術、DX人材と制度まで。",
});

export default async function DxoPage() {
  const allQuestions = await getAllDxoQuestions();
  const allColumns = await getAllColumns();
  const dxoColumns = allColumns.filter((c) => c.slug.startsWith("dxo-"));
  const fieldCounts = await Promise.all(
    DXO_FIELDS.map(async (f) => (await getDxoQuestionsByField(f.name)).length)
  );
  // 問題は分野ごとに順次公開する(2026-10-31 時点は準備中)。0問のあいだは問題・模試への導線を出さない。
  const ready = allQuestions.length > 0;
  const aff = EXAM_AFFILIATE.dxo;

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
          / <span>DXオフィサー</span>
        </nav>
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight"
          style={{ color: "var(--c-pii-ink)" }}
        >
          DXオフィサー
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-pii-ink)" }}>
          DXの現状と業種別の事例、AI・ビッグデータ・IoT・クラウドなどの技術、DX人材と制度まで。本試験の3課題に沿ったオリジナル練習問題集です。
          {ready ? `（${allQuestions.length}問）` : "練習問題は分野ごとに準備中です。先に試験日程と申込締切をまとめています。"}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {ready ? (
            <>
              <a href="/dxo/q/dxo-001/" className="btn-accent">
                問題を解き始める →
              </a>
              <a
                href="/dxo/moshi/"
                className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
                style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
              >
                模擬試験を受ける（100問）→
              </a>
              <a
                href="/dxo/mock/"
                className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
                style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
              >
                本番形式で腕試し（20問・採点）→
              </a>
            </>
          ) : (
            <a href="/column/dxo-nittei/" className="btn-accent">
              試験日程と申込締切を見る →
            </a>
          )}
        </div>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="dxo" placement="return_top" className="mb-8" />

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示し、協会の申込ページへ送る(dxa と同じ形) */}
      <ExamCountdown
        exams={DXO_EXAMS}
        accent="var(--c-pii)"
        accentSoft="var(--c-pii-soft)"
        apply={
          aff.applyHref && aff.applyPixel
            ? { href: aff.applyHref, course: "dxo", pixel: aff.applyPixel }
            : undefined
        }
        calendar={{ examName: "DXオフィサー認定試験", path: "/dxo/" }}
      />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {DXO_FIELDS.map((f, i) => {
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
                href={`/dxo/field/${f.slug}/`}
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

      {/* 2026-10-31 に協会の公式ページ(https://www.joho-gakushu.or.jp/dx/dxo/)と試験日程の一覧(schedule/2026.php)で確認 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　100問・10:00〜12:15
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">出題範囲</span>　第1課題 DXの現状（DX総論・業種別DXビジネスの現状・DX企業の現状）30問／第2課題 DXの技術（AI・ビッグデータ・IoT・クラウド・その他のIT技術・デジタルマーケティング・情報セキュリティ）50問／第3課題 DXの展開（DX人材・DXの方法論・DX関連の制度と政策）20問
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　70%以上（問題の難易度により調整する場合がある）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　一般 13,200円／学割 10,560円（税込）。CBTは会場費1,500円、オンラインIBTはカメラ送料3,000円が別途。2027年5月の回から一般16,500円に改定。DX推進アドバイザーの合格者は20%割引（昇級特別価格）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年3回（1月・5月・10月ごろ）。
            <a href="/column/dxo-nittei/" className="underline hover:no-underline">
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
      <ExamVoicesSection exam="dxo" />

      <DxoCourseAd />

      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">あわせて学ぶと役に立つ試験</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed">
          <p>
            DXオフィサーは、DX推進の担当者・管理職、DX推進アドバイザーの次の資格を考えている方に向いた試験です。関連する試験の問題集もあります:{" "}
            <a href="/dxa/" className="underline hover:no-underline">DX推進アドバイザー</a>・
            <a href="/aia/" className="underline hover:no-underline">AI活用アドバイザー</a>・
            <a href="/gaia/" className="underline hover:no-underline">生成AIアドバイザー</a>・
            <a href="/isec/" className="underline hover:no-underline">情報・サイバーセキュリティ管理士</a>
          </p>
        </div>
      </section>

      {/* コラム */}
      {dxoColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {dxoColumns.slice(0, 6).map((col) => (
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
