import { getAllAiaQuestions, getAiaQuestionsByField } from "@/lib/aia-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import AiaCourseAd from "@/components/AiaCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import Moshi2TopLink from "@/components/Moshi2TopLink";
import { AIA_FIELDS } from "@/lib/aia-fields";
import ExamCountdown from "@/components/ExamCountdown";
import { AIA_EXAMS } from "@/lib/exam-dates";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

export const metadata: Metadata = pageMetadata({
  path: "/aia/",
  title: "AI活用アドバイザー認定試験 練習問題【全%N%問・無料】".replace("%N%", String(144)),
  description: "AI活用アドバイザー認定試験のオリジナル練習問題%N%問を無料公開。AIの基礎・技術・生成AI・導入事例・人材動向・制度政策の7課題を、2択・4択の本試験形式で演習できます。本試験と同じ100問・105分の模擬試験つき。".replace("%N%", String(144)),
});

export default async function AiaPage() {
  const allQuestions = await getAllAiaQuestions();
  const allColumns = await getAllColumns();
  const aiaColumns = allColumns.filter((c) => c.slug.startsWith("aia-"));
  const fieldCounts = await Promise.all(
    AIA_FIELDS.map(async (f) => (await getAiaQuestionsByField(f.name)).length)
  );
  const aff = EXAM_AFFILIATE.aia;

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
          / <span>AI活用アドバイザー</span>
        </nav>
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight"
          style={{ color: "var(--c-pii-ink)" }}
        >
          AI活用アドバイザー
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-pii-ink)" }}>
          AIの基礎から生成AI、企業の導入事例、人材・制度の動向までを問う全日本情報学習振興協会の認定試験。本試験の7課題に沿った{allQuestions.length}問のオリジナル練習問題集です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/aia/q/aia-001/" className="btn-accent">
            問題を解き始める →
          </a>
          <a
            href="/aia/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            模擬試験を受ける（100問・105分）→
          </a>
          <Moshi2TopLink certId="aia" />
          <a
            href="/aia/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </a>
        </div>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="aia" placement="return_top" className="mb-8" />

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示。日付の出典は exam-dates.ts のコメント */}
      <ExamCountdown
        exams={AIA_EXAMS}
        accent="var(--c-pii)"
        accentSoft="var(--c-pii-soft)"
        apply={
          aff.applyHref && aff.applyPixel
            ? { href: aff.applyHref, course: "aia", pixel: aff.applyPixel }
            : undefined
        }
        calendar={{ examName: "AI活用アドバイザー認定試験", path: "/aia/" }}
      />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {AIA_FIELDS.map((f, i) => (
            <a
              key={f.slug}
              href={`/aia/field/${f.slug}/`}
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

      {/* 試験概要。数値は仕様シート(specs/aia.md)の公式確認結果。出典と確認日は下の注記と docs/new-certs-2026-10-review.md */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　全日本情報学習振興協会。公開会場（マークシート）・CBT・オンラインIBTから受験方式を選べる。受験資格の記載なし
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　100問（2択48問×1点＋4択52問×2点＝152点満点）・105分（10:00〜11:45）。7課題（第3課題の生成AIは第13回から追加）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">課題別の問題数</span>　公式の表で数字が書かれているのは 第1課題30問・第3課題10問・第4課題5問・第5課題35問・第6課題20問。第2課題と第7課題は表の結合セルで、第1・第2課題で30問、第6・第7課題で20問とみられる（公式の明言はない）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　70%以上（107点以上）。問題の難易度により調整される場合がある。課題別の最低点の記載なし
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　11,000円（学割8,800円・税込）。CBTは会場費1,500円、オンラインIBTはカメラ送料3,000円が別途。2027年4月開催分から14,300円に改定予定
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年2回。第14回は2026年10月18日に実施済み。次は第15回 2027年3月14日（申込は2026年11月16日〜2027年1月28日）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験者数・合格率</span>　協会の公式ページに掲載なし
          </p>
          <p className="text-xs pt-2">
            ※出典: 全日本情報学習振興協会のAI活用アドバイザー認定試験ページ（2026年10月19日確認）。協会のSMART講座ページには「5課題・90分」の旧記載が残っていますが、現行の試験は7課題・105分です。最新の日程・受験料は公式サイトで必ず確認してください。
          </p>
        </div>
      </section>

      {/* 合格報告(掲載済みがあれば)と、受験直後の方への報告のお願い。
          どちらも条件を満たさなければ何も出ない */}
      <ExamVoicesSection exam="aia" />

      <AiaCourseAd />

      {/* 関連する試験 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">あわせて学ぶと役に立つ試験</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>
            AIの周辺は、<a href="/gaia/" className="underline hover:no-underline">生成AIアドバイザー</a>と<a href="/dxa/" className="underline hover:no-underline">DX推進アドバイザー</a>の範囲とも重なります。
          </p>
        </div>
      </section>

      {/* コラム */}
      {aiaColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {aiaColumns.slice(0, 6).map((col) => (
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
