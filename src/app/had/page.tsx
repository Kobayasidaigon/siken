import { getAllHadQuestions, getHadQuestionsByField } from "@/lib/had-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import HadCourseAd from "@/components/HadCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import { HAD_FIELDS } from "@/lib/had-fields";
import ExamCountdown from "@/components/ExamCountdown";
import { HAD_EXAMS } from "@/lib/exam-dates";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

export const metadata: Metadata = pageMetadata({
  path: "/had/",
  title: "ハラスメントアドバイザー 練習問題【全160問・無料】",
  description:
    "ハラスメントアドバイザー認定試験のオリジナル練習問題160問を無料公開。パワハラ・セクハラ・マタハラ・カスハラの理解から、法的責任と懲戒、事業主の措置義務、予防と再発防止、相談業務まで5課題を根拠つき解説で演習できます。",
});

export default async function HadPage() {
  const allQuestions = await getAllHadQuestions();
  const allColumns = await getAllColumns();
  const hadColumns = allColumns.filter((c) => c.slug.startsWith("had-"));
  const fieldCounts = await Promise.all(
    HAD_FIELDS.map(async (f) => (await getHadQuestionsByField(f.name)).length)
  );
  const aff = EXAM_AFFILIATE.had;

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
          / <span>ハラスメントアドバイザー</span>
        </nav>
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight"
          style={{ color: "var(--c-pii-ink)" }}
        >
          ハラスメントアドバイザー
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-pii-ink)" }}>
          パワハラ・セクハラ・カスハラの見分け方から、法的責任と懲戒、事業主が講ずべき措置、相談窓口の対応まで。本試験の5課題に沿った
          {allQuestions.length}問のオリジナル練習問題集です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/had/q/had-001/" className="btn-accent">
            問題を解き始める →
          </a>
          <a
            href="/had/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            模擬試験を受ける（60問・90分）→
          </a>
          <a
            href="/had/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </a>
        </div>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="had" placement="return_top" className="mb-8" />

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示し、協会の申込ページへ送る(isec と同じ形)。
          申込の A8 リンク(applyHref)が届くまではカウントダウンだけを出す。 */}
      <ExamCountdown
        exams={HAD_EXAMS}
        accent="var(--c-pii)"
        accentSoft="var(--c-pii-soft)"
        apply={
          aff.applyHref && aff.applyPixel
            ? { href: aff.applyHref, course: "had", pixel: aff.applyPixel }
            : undefined
        }
        calendar={{ examName: "ハラスメントアドバイザー認定試験", path: "/had/" }}
      />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {HAD_FIELDS.map((f, i) => (
            <a
              key={f.slug}
              href={`/had/field/${f.slug}/`}
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

      {/* 2026-10-10 に協会サイト(/nsp/・/nsp/lp/had_20240501.php・/harassment-advisor/)の内容を検索結果経由で確認。本文は未照合。
          問題数は「60問」と「60問程度」の両方の表記がある。課題ごとの問題数・基準は案内に無い。 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　60問・90分
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">出題範囲</span>
            　課題Ⅰ ハラスメントの理解／課題Ⅱ ハラスメントの法的責任等／課題Ⅲ 雇用管理上講ずべき措置等／課題Ⅳ 予防・再発防止／課題Ⅴ 相談業務
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>
            　70%以上（問題の難易度により調整される場合がある）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　11,000円（税込）／学生 8,800円（税込）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年4回（1月・4月・7月・10月）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">実施機関</span>
            　日本ハラスメントカウンセラー協会（案内・申込は全日本情報学習振興協会のサイト）
          </p>
          <p className="text-xs pt-2">
            ※2026年10月1日から、カスタマーハラスメントと求職者等へのセクシュアルハラスメントの防止措置も事業主の義務になりました。最新の日程・受験料・出題範囲は必ず公式サイトでご確認ください。
          </p>
        </div>
      </section>

      {/* 合格報告(掲載済みがあれば)と、受験直後の方への報告のお願い。
          どちらも条件を満たさなければ何も出ない */}
      <ExamVoicesSection exam="had" />

      <HadCourseAd />

      {/* 同じ人事・総務の読者に向けた、協会の関連試験 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">あわせて学ぶと役に立つ試験</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>
            ハラスメントは、企業の不祥事やコンプライアンス違反の代表的な原因のひとつです。会社全体の危機管理まで広げて学ぶなら、全日本情報学習振興協会の
            <a href="/ccm/" className="underline hover:no-underline">
              企業危機・コンプライアンス管理士
            </a>
            が次の一歩になります。
          </p>
          <p>
            相談の記録や社員の情報の扱いは、
            <a href="/pii/" className="underline hover:no-underline">
              個人情報保護士
            </a>
            ・
            <a href="/jitsumu/" className="underline hover:no-underline">
              個人情報保護実務検定
            </a>
            の範囲とも重なります。
          </p>
        </div>
      </section>

      {/* コラム */}
      {hadColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {hadColumns.slice(0, 6).map((col) => (
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
