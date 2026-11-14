import SiteLink from "@/components/SiteLink";
import { getAllMynumber2Questions, getMynumber2QuestionsByField } from "@/lib/mynumber2-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import Mynumber2CourseAd from "@/components/Mynumber2CourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import { MYNUMBER2_FIELDS } from "@/lib/mynumber2-fields";
import ExamCountdown from "@/components/ExamCountdown";
import { MYNUMBER_EXAMS } from "@/lib/exam-dates";
import OfficialSiteLink from "@/components/OfficialSiteLink";

/** 1〜3級に共通するコラム（3級のコラムとして公開済み）。2級のトップからも案内する */
const SHARED_COLUMN_SLUGS = ["mynumber-nittei"];

/** 問題数はファイルから数える（分野ごとに足していくので、題名の数字を手で直さない） */
export async function generateMetadata(): Promise<Metadata> {
  const n = (await getAllMynumber2Questions()).length;
  return pageMetadata({
    path: "/mynumber2/",
    title:
      n > 0
        ? `マイナンバー実務検定2級 練習問題【全${n}問・無料】`
        : "マイナンバー実務検定2級 練習問題（準備中）",
    description:
      "マイナンバー実務検定2級のオリジナル練習問題を無料公開。番号法の総則と個人番号、個人番号カードと本人確認、特定個人情報の提供と収集・保管、保護評価と監督、法人番号と罰則、事業者編ガイドラインまで、協会の出題項目に沿った6分野を1問ずつの解説つきで演習できます。60問・105分の模擬試験つき。",
  });
}

export default async function Mynumber2Page() {
  const allQuestions = await getAllMynumber2Questions();
  const allColumns = await getAllColumns();
  const sharedColumns = SHARED_COLUMN_SLUGS.flatMap((slug) => allColumns.filter((c) => c.slug === slug));
  const fieldCounts = await Promise.all(
    MYNUMBER2_FIELDS.map(async (f) => (await getMynumber2QuestionsByField(f.name)).length)
  );
  // 問題が0問のあいだは、問題・模擬試験・腕試しテストへの導線を出さない(wlc のトップと同じ形)。
  const ready = allQuestions.length > 0;

  return (
    <div className="theme-pii pb-16">
      <section
        className="-mx-4 px-4 py-10 sm:py-14 border-y mb-10"
        style={{ background: "var(--c-pii-soft)", borderColor: "var(--c-border)" }}
      >
        <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
          <SiteLink href="/" className="no-underline hover:underline">
            ホーム
          </SiteLink>{" "}
          / <SiteLink href="/mynumber/" className="no-underline hover:underline">マイナンバー実務検定</SiteLink> / <span>2級</span>
        </nav>
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight"
          style={{ color: "var(--c-pii-ink)" }}
        >
          マイナンバー実務検定 2級
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-pii-ink)" }}>
          3級と同じ出題項目を、実務での使い方と制限までより深く問う級。番号法の条文と個人情報保護委員会の事業者編ガイドラインに沿った、協会の出題項目の6分野のオリジナル練習問題集です。
          {ready ? `（${allQuestions.length}問）` : "練習問題は分野ごとに準備中です。"}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {ready ? (
            <>
              <SiteLink href={`/mynumber2/q/${allQuestions[0].slug}/`} className="btn-accent">
                問題を解き始める →
              </SiteLink>
              <SiteLink
                href="/mynumber2/moshi/"
                className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
                style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
              >
                模擬試験を受ける（60問・105分・合否判定）→
              </SiteLink>
              <SiteLink
                href="/mynumber2/mock/"
                className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
                style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
              >
                腕試しテスト（ランダム20問・採点）→
              </SiteLink>
            </>
          ) : (
            <SiteLink href="/column/mynumber-nittei/" className="btn-accent">
              試験日程と申込期間を見る →
            </SiteLink>
          )}
        </div>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="mynumber2" placement="return_top" className="mb-8" />

      {/* カウントダウン: 1〜3級は同じ日に開催されるので、日程は 3級と同じ MYNUMBER_EXAMS を使う */}
      <ExamCountdown
        exams={MYNUMBER_EXAMS}
        accent="var(--c-pii)"
        accentSoft="var(--c-pii-soft)"
        calendar={{ examName: "マイナンバー実務検定2級", path: "/mynumber2/" }}
      />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {MYNUMBER2_FIELDS.map((f, i) => {
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
              <SiteLink
                key={f.slug}
                href={`/mynumber2/field/${f.slug}/`}
                className="card p-5 no-underline group block"
                style={{ borderLeft: "3px solid var(--c-pii)" }}
              >
                {body}
              </SiteLink>
            ) : (
              <div key={f.slug} className="card p-5 block" style={{ borderLeft: "3px solid var(--c-border)" }}>
                {body}
              </div>
            );
          })}
        </div>
      </section>

      {/* 2026-11-14 に全日本情報学習振興協会の試験ページ(https://www.joho-gakushu.or.jp/nns/)と
          出題内容のページ(naiyou.php)で確認 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">2級の出題範囲と、当サイトの練習問題</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>
            協会は2級の出題範囲を「基本知識に加え、実務におけるマイナンバーやマイナンバーカードの利活用と制限など」としています。出題項目の表では、番号法の背景・概要、第1章〜第9章と附則、事業者編ガイドライン、関連法令等が2級の範囲で、3級と同じ項目をより深く問う形です。行政機関等編と金融業務のガイドラインは1級だけの範囲です。
          </p>
          <p>
            当サイトの練習問題は、この出題項目を6分野に分けて当サイトが作ったオリジナル問題で、本試験の問題ではありません。正解と解説は、番号法の条文（e-Gov法令）と個人情報保護委員会の事業者編ガイドライン・Q&Aで確かめています。分野の分け方と分野ごとの問題数は当サイトの想定です。
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験日</span>　1級・2級・3級を同じ日に実施（3級と同じ回）
            <SiteLink href="/column/mynumber-nittei/" className="underline hover:no-underline">
              詳しい日程・申込期間
            </SiteLink>
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">問題数と時間</span>　60問・10:00〜11:45（105分）。公開会場はマークシート方式で、CBT・オンラインIBTでも受験できます
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　70%以上の得点（問題の難易度により調整される場合があります）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　8,800円（学割7,040円・税込）。2027年3月開催分から12,100円に改定予定。CBTは会場費1,500円、オンラインIBTはカメラ送料3,000円が別にかかります
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　一般財団法人 全日本情報学習振興協会
          </p>
          <p className="text-xs pt-1">受験料・申込期間などの最新の詳細は、必ず公式サイトでご確認ください。</p>
        </div>
        <OfficialSiteLink exam="mynumber2" />
      </section>

      {/* 合格報告(掲載済みがあれば)と、受験直後の方への報告のお願い。どちらも条件を満たさなければ何も出ない */}
      <ExamVoicesSection exam="mynumber2" />

      <Mynumber2CourseAd />

      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">3級・1級との関係</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>
            2級の出題項目は3級と同じで、3級より深く問われます。基本から確かめたい方は
            <SiteLink href="/mynumber/" className="underline hover:no-underline">
              マイナンバー実務検定3級の練習問題
            </SiteLink>
            もあわせて使えます。1級（80問）は、2級の範囲に行政機関等編と金融業務のガイドラインが加わります。1級だけの範囲は
            <SiteLink href="/mynumber1/" className="underline hover:no-underline">
              マイナンバー実務検定1級の練習問題
            </SiteLink>
            で演習できます。
          </p>
        </div>
      </section>

      {/* コラム: 1〜3級に共通するもの(3級のコラムとして公開済み) */}
      {sharedColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {sharedColumns.map((col) => (
              <SiteLink
                key={col.slug}
                href={`/column/${col.slug}/`}
                className="block py-2 text-sm text-[color:var(--c-text)] no-underline hover:text-[color:var(--c-pii)] border-b border-[color:var(--c-border)] last:border-b-0"
              >
                {col.title}
              </SiteLink>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
