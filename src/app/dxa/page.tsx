import { getAllDxaQuestions, getDxaQuestionsByField } from "@/lib/dxa-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import DxaCourseAd from "@/components/DxaCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import Moshi2TopLink from "@/components/Moshi2TopLink";
import { DXA_FIELDS } from "@/lib/dxa-fields";
import ExamCountdown from "@/components/ExamCountdown";
import { DXA_EXAMS } from "@/lib/exam-dates";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

export const metadata: Metadata = pageMetadata({
  path: "/dxa/",
  title: "DX推進アドバイザー認定試験 練習問題【全%N%問・無料】".replace("%N%", String(136)),
  description: "DX推進アドバイザー認定試験のオリジナル練習問題%N%問を無料公開。DXの現状・DXの技術・DXの展開の3課題を、2択・4択の本試験形式で演習できます。本試験と同じ100問・105分の模擬試験つき。".replace("%N%", String(136)),
});

export default async function DxaPage() {
  const allQuestions = await getAllDxaQuestions();
  const allColumns = await getAllColumns();
  const dxaColumns = allColumns.filter((c) => c.slug.startsWith("dxa-"));
  const fieldCounts = await Promise.all(
    DXA_FIELDS.map(async (f) => (await getDxaQuestionsByField(f.name)).length)
  );
  const aff = EXAM_AFFILIATE.dxa;

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
          / <span>DX推進アドバイザー</span>
        </nav>
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight"
          style={{ color: "var(--c-pii-ink)" }}
        >
          DX推進アドバイザー
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-pii-ink)" }}>
          DXの現状から技術、人材・制度までを問う全日本情報学習振興協会の認定試験。本試験の3課題に沿った{allQuestions.length}問のオリジナル練習問題集です（2択と4択を本試験と同じ比率で出題）。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/dxa/q/dxa-001/" className="btn-accent">
            問題を解き始める →
          </a>
          <a
            href="/dxa/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            模擬試験を受ける（100問・105分）→
          </a>
          <Moshi2TopLink certId="dxa" />
          <a
            href="/dxa/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </a>
        </div>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="dxa" placement="return_top" className="mb-8" />

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示。日付の出典は exam-dates.ts のコメント */}
      <ExamCountdown
        exams={DXA_EXAMS}
        accent="var(--c-pii)"
        accentSoft="var(--c-pii-soft)"
        apply={
          aff.applyHref && aff.applyPixel
            ? { href: aff.applyHref, course: "dxa", pixel: aff.applyPixel }
            : undefined
        }
        calendar={{ examName: "DX推進アドバイザー認定試験", path: "/dxa/" }}
      />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {DXA_FIELDS.map((f, i) => (
            <a
              key={f.slug}
              href={`/dxa/field/${f.slug}/`}
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

      {/* 試験概要。数値は仕様シート(specs/dxa.md)の公式確認結果。出典と確認日は下の注記と docs/new-certs-2026-10-review.md */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　全日本情報学習振興協会。公開会場（マークシート）・CBT・オンラインIBTから受験方式を選べる。受験資格の記載なし
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　100問（2択35問＋4択65問）・105分（10:00〜11:45）。第1課題 DXの現状40問／第2課題 DXの技術50問／第3課題 DXの展開10問
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">配点と合格基準</span>　2択140点＋4択520点の660点満点。70%以上（約462点）で合格。問題の難易度により調整される場合がある。課題別の最低点の記載なし
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　11,000円（学割8,800円・税込）。CBTは会場費1,500円、オンラインIBTはカメラ送料3,000円が別途。2027年3月開催分から14,300円に改定
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年4回ペース。次は第22回 2026年12月13日（申込は2026年10月29日まで）、第23回 2027年3月14日、第24回 2027年6月27日
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験者数・合格率</span>　協会の公式ページに掲載なし
          </p>
          <p className="text-xs pt-2">
            ※出典: 全日本情報学習振興協会のDX推進アドバイザー認定試験ページ・DX検定一覧（2026年10月19日確認）。SMART講座ページには「90分」の旧記載がありますが、試験案内の第22回は10:00〜11:45です。同じ協会の「DXパスポート」「DXオフィサー」とは別の試験です。最新の日程・受験料は公式サイトで必ず確認してください。
          </p>
        </div>
      </section>

      {/* 合格報告(掲載済みがあれば)と、受験直後の方への報告のお願い。
          どちらも条件を満たさなければ何も出ない */}
      <ExamVoicesSection exam="dxa" />

      <DxaCourseAd />

      {/* 関連する試験 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">あわせて学ぶと役に立つ試験</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>
            同じ協会の<a href="/dxp/" className="underline hover:no-underline">DXパスポート試験</a>は入門の位置づけです。AIの分野は<a href="/aia/" className="underline hover:no-underline">AI活用アドバイザー</a>・<a href="/gaia/" className="underline hover:no-underline">生成AIアドバイザー</a>の範囲とも重なります。
          </p>
        </div>
      </section>

      {/* コラム */}
      {dxaColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {dxaColumns.slice(0, 6).map((col) => (
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
