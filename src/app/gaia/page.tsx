import { getAllGaiaQuestions, getGaiaQuestionsByField } from "@/lib/gaia-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import GaiaCourseAd from "@/components/GaiaCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import Moshi2TopLink from "@/components/Moshi2TopLink";
import { GAIA_FIELDS } from "@/lib/gaia-fields";
import ExamCountdown from "@/components/ExamCountdown";
import { GAIA_EXAMS } from "@/lib/exam-dates";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

export const metadata: Metadata = pageMetadata({
  path: "/gaia/",
  title: "生成AIアドバイザー認定試験 練習問題【全%N%問・無料】".replace("%N%", String(172)),
  description: "生成AIアドバイザー認定試験（1級・2級）のオリジナル練習問題%N%問を無料公開。AIの基礎からプロンプト、リスクと著作権、AI導入の企業課題、AI事業者ガイドラインまでの8課題を演習できます。1級100問・2級50問の模擬試験つき。".replace("%N%", String(172)),
});

export default async function GaiaPage() {
  const allQuestions = await getAllGaiaQuestions();
  const allColumns = await getAllColumns();
  const gaiaColumns = allColumns.filter((c) => c.slug.startsWith("gaia-"));
  const fieldCounts = await Promise.all(
    GAIA_FIELDS.map(async (f) => (await getGaiaQuestionsByField(f.name)).length)
  );
  const aff = EXAM_AFFILIATE.gaia;

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
          / <span>生成AIアドバイザー</span>
        </nav>
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight"
          style={{ color: "var(--c-pii-ink)" }}
        >
          生成AIアドバイザー
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-pii-ink)" }}>
          生成AIの仕組みとプロンプト、活用ケース、リスク・著作権・情報管理、企業の導入課題までを問う全日本情報学習振興協会の認定試験。8課題に沿った{allQuestions.length}問のオリジナル練習問題集です（1級・2級共通の範囲）。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/gaia/q/gaia-001/" className="btn-accent">
            問題を解き始める →
          </a>
          <a
            href="/gaia/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            1級形式の模擬試験（100問・120分）→
          </a>
          <a
            href="/gaia/moshi-2kyu/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            2級形式の模擬試験（50問・60分）→
          </a>
          <Moshi2TopLink certId="gaia" />
          <a
            href="/gaia/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </a>
        </div>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="gaia" placement="return_top" className="mb-8" />

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示。日付の出典は exam-dates.ts のコメント */}
      <ExamCountdown
        exams={GAIA_EXAMS}
        accent="var(--c-pii)"
        accentSoft="var(--c-pii-soft)"
        apply={
          aff.applyHref && aff.applyPixel
            ? { href: aff.applyHref, course: "gaia", pixel: aff.applyPixel }
            : undefined
        }
        calendar={{ examName: "生成AIアドバイザー認定試験", path: "/gaia/" }}
      />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {GAIA_FIELDS.map((f, i) => (
            <a
              key={f.slug}
              href={`/gaia/field/${f.slug}/`}
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

      {/* 試験概要。数値は仕様シート(specs/gaia.md)の公式確認結果。出典と確認日は下の注記と docs/new-certs-2026-10-review.md */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　全日本情報学習振興協会。公開会場（マークシート）・CBT・オンラインIBTから受験方式を選べる。受験資格の記載なし
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">級と形式</span>　1級: 100問・4択・120分。2級: 50問・○×と4択の混在・60分。第3回（2026年8月30日実施）から2級の出題範囲は1級と同一になり、差は難易度と深さ（2級は基礎中心、1級は応用中心）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">課題</span>　第1課題 AIの基礎理解／第2課題 生成AIの基礎理解／第3課題 プロンプトエンジニアリング／第4課題 活用ケーススタディ／第5課題 リスクと限界、倫理・著作権・情報管理／第6課題 AIと人間の役割分担／第7課題 AI導入における企業課題／第8課題 最新動向・将来展望／その他（AI事業者ガイドラインなど）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　70%以上。問題の難易度により調整し、70%以下でも合格となる場合がある。課題別の問題数・配点・最低点は公表されていない
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　1級11,000円（学割8,800円）、2級8,800円（学割7,040円）・税込。CBTは会場費1,500円、オンラインIBTはカメラ送料3,000円が別途。2027年5月開催分から1級14,300円・2級12,100円に改定
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年4回ペース。第4回 2026年11月29日（申込は10月27日で終了）、次に申し込めるのは第5回 2027年2月21日（申込は2026年11月2日〜2027年1月14日）、第6回 2027年5月23日
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験者数・合格率</span>　協会の公式ページに掲載なし
          </p>
          <p className="text-xs pt-2">
            ※出典: 全日本情報学習振興協会の生成AIアドバイザー認定試験ページ・サンプル問題・学習資料（2026年10月19日確認）。2級の○×と4択の内訳は協会が公表していません。当サイトの2級形式模試は○×30問＋4択20問の想定です。AI事業者ガイドラインは協会の学習資料の第1.1版（2025年3月28日）を基準にしています。最新の日程・受験料は公式サイトで必ず確認してください。
          </p>
        </div>
      </section>

      {/* 合格報告(掲載済みがあれば)と、受験直後の方への報告のお願い。
          どちらも条件を満たさなければ何も出ない */}
      <ExamVoicesSection exam="gaia" />

      <GaiaCourseAd />

      {/* 関連する試験 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">あわせて学ぶと役に立つ試験</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>
            AIの基礎から押さえるなら<a href="/aia/" className="underline hover:no-underline">AI活用アドバイザー</a>、DXの文脈は<a href="/dxa/" className="underline hover:no-underline">DX推進アドバイザー</a>が同じ協会の試験です。
          </p>
        </div>
      </section>

      {/* コラム */}
      {gaiaColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {gaiaColumns.slice(0, 6).map((col) => (
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
