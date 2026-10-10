import { getAllCcmQuestions, getCcmQuestionsByField } from "@/lib/ccm-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import CcmCourseAd from "@/components/CcmCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import { CCM_FIELDS } from "@/lib/ccm-fields";
import ExamCountdown from "@/components/ExamCountdown";
import { CCM_EXAMS } from "@/lib/exam-dates";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

export const metadata: Metadata = pageMetadata({
  path: "/ccm/",
  title: "企業危機・コンプライアンス管理士 練習問題【全160問・無料】",
  description:
    "企業危機・コンプライアンス管理士認定試験（旧・企業危機管理士）のオリジナル練習問題160問を無料公開。企業の社会的責任と内部統制、リスクと危機、危機管理体制と内部通報、危機管理広報、企業不祥事、自然災害とBCPまで6課題を根拠つき解説で演習できます。",
});

export default async function CcmPage() {
  const allQuestions = await getAllCcmQuestions();
  const allColumns = await getAllColumns();
  const ccmColumns = allColumns.filter((c) => c.slug.startsWith("ccm-"));
  const fieldCounts = await Promise.all(
    CCM_FIELDS.map(async (f) => (await getCcmQuestionsByField(f.name)).length)
  );
  const aff = EXAM_AFFILIATE.ccm;

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
          / <span>企業危機・コンプライアンス管理士</span>
        </nav>
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight"
          style={{ color: "var(--c-pii-ink)" }}
        >
          企業危機・コンプライアンス管理士
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-pii-ink)" }}>
          CSRと内部統制、リスクマネジメント、内部通報と危機管理体制、記者会見とSNS炎上、企業不祥事、自然災害とBCPまで。本試験の6課題に沿った
          {allQuestions.length}問のオリジナル練習問題集です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/ccm/q/ccm-001/" className="btn-accent">
            問題を解き始める →
          </a>
          <a
            href="/ccm/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            模擬試験を受ける（80問・120分）→
          </a>
          <a
            href="/ccm/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </a>
        </div>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="ccm" placement="return_top" className="mb-8" />

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示し、協会の申込ページへ送る(isec と同じ形)。
          申込の A8 リンク(applyHref)が届くまではカウントダウンだけを出す。 */}
      <ExamCountdown
        exams={CCM_EXAMS}
        accent="var(--c-pii)"
        accentSoft="var(--c-pii-soft)"
        apply={
          aff.applyHref && aff.applyPixel
            ? { href: aff.applyHref, course: "ccm", pixel: aff.applyPixel }
            : undefined
        }
        calendar={{ examName: "企業危機・コンプライアンス管理士認定試験", path: "/ccm/" }}
      />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {CCM_FIELDS.map((f, i) => (
            <a
              key={f.slug}
              href={`/ccm/field/${f.slug}/`}
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

      {/* 2026-10-10 に協会サイト(/ccm/・SMART講座 k_ccm)の内容を検索結果経由で確認。本文は未照合。
          課題ごとの問題数・基準は案内に無い。合格基準は「合計70%以上」。 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　80問・120分
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">出題範囲</span>
            　第1課題 企業の社会的責任／第2課題 リスクと危機／第3課題 危機管理体制の構築／第4課題 危機管理広報／第5課題 企業危機各論／第6課題 自然災害と危機管理
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>
            　合計70%以上
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　11,000円（税込）／学生 8,800円（税込）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">実施機関</span>
            　一般財団法人 全日本情報学習振興協会
          </p>
          <p className="text-xs pt-2">
            ※2024年度に「企業危機管理士認定試験」から名称が変わりました。最新の日程・受験料・出題範囲は必ず協会の公式サイトでご確認ください。
          </p>
        </div>
      </section>

      {/* 合格報告(掲載済みがあれば)と、受験直後の方への報告のお願い。
          どちらも条件を満たさなければ何も出ない */}
      <ExamVoicesSection exam="ccm" />

      <CcmCourseAd />

      {/* 同じ総務・法務の読者に向けた、協会の関連試験 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">あわせて学ぶと役に立つ試験</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>
            第5課題「企業危機各論」で問われる不祥事のうち、ハラスメントを深く学ぶなら
            <a href="/had/" className="underline hover:no-underline">
              ハラスメントアドバイザー
            </a>
            、情報漏えいなら
            <a href="/pii/" className="underline hover:no-underline">
              個人情報保護士
            </a>
            や
            <a href="/isec/" className="underline hover:no-underline">
              情報・サイバーセキュリティ管理士
            </a>
            が、同じ協会の関連する試験です。
          </p>
          <p>
            契約や会社法など、企業法務の基礎から固めたい場合は
            <a href="/bijihou/" className="underline hover:no-underline">
              ビジネス実務法務検定
            </a>
            も選択肢になります。
          </p>
        </div>
      </section>

      {/* コラム */}
      {ccmColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {ccmColumns.slice(0, 6).map((col) => (
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
