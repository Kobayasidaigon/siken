import { getAllHoikushiQuestions, getHoikushiQuestionsByField } from "@/lib/hoikushi-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import HoikushiCourseAd from "@/components/HoikushiCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import Moshi2TopLink from "@/components/Moshi2TopLink";
import { HOIKUSHI_FIELDS } from "@/lib/hoikushi-fields";
import ExamCountdown from "@/components/ExamCountdown";
import { HOIKUSHI_EXAMS } from "@/lib/exam-dates";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

export const metadata: Metadata = pageMetadata({
  path: "/hoikushi/",
  title: "保育士試験（筆記）練習問題【全%N%問・無料】".replace("%N%", String(210)),
  description: "保育士試験（筆記）のオリジナル練習問題%N%問を無料公開。保育原理・子ども家庭福祉・社会福祉・保育の心理学・教育原理・社会的養護・子どもの保健・子どもの食と栄養・保育実習理論の9科目を、根拠つきの解説で演習できます。".replace("%N%", String(210)),
});

export default async function HoikushiPage() {
  const allQuestions = await getAllHoikushiQuestions();
  const allColumns = await getAllColumns();
  const hoikushiColumns = allColumns.filter((c) => c.slug.startsWith("hoikushi-"));
  const fieldCounts = await Promise.all(
    HOIKUSHI_FIELDS.map(async (f) => (await getHoikushiQuestionsByField(f.name)).length)
  );
  const aff = EXAM_AFFILIATE.hoikushi;

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
          / <span>保育士試験（筆記）</span>
        </nav>
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight"
          style={{ color: "var(--c-pii-ink)" }}
        >
          保育士試験（筆記）
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-pii-ink)" }}>
          保育所や児童福祉施設で子どもの保育と保護者支援を行う国家資格「保育士」の筆記試験。9科目に沿った{allQuestions.length}問のオリジナル練習問題集です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/hoikushi/q/hoikushi-001/" className="btn-accent">
            問題を解き始める →
          </a>
          <a
            href="/hoikushi/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            模擬試験を受ける（9科目160問）→
          </a>
          <Moshi2TopLink certId="hoikushi" />
          <a
            href="/hoikushi/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </a>
        </div>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="hoikushi" placement="return_top" className="mb-8" />

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示。日付の出典は exam-dates.ts のコメント */}
      <ExamCountdown
        exams={HOIKUSHI_EXAMS}
        accent="var(--c-pii)"
        accentSoft="var(--c-pii-soft)"
        lead="hoikushi"
        calendar={{ examName: "保育士試験（筆記）", path: "/hoikushi/" }}
      />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {HOIKUSHI_FIELDS.map((f, i) => (
            <a
              key={f.slug}
              href={`/hoikushi/field/${f.slug}/`}
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

      {/* 試験概要。数値は仕様シート(specs/hoikushi.md)の公式確認結果。出典と確認日は下の注記と docs/new-certs-2026-10-review.md */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　全国保育士養成協議会（指定試験機関）。年2回（前期・後期）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　筆記9科目・マークシート・全問5肢。本試験は「正しい組合せを選ぶ」形式が多く、2つ・3つ選ぶ問題もある（当サイトは1つ選ぶ形式に統一）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">科目と問題数</span>　保育の心理学・保育原理・子ども家庭福祉・社会福祉・子どもの保健・子どもの食と栄養・保育実習理論は各20問（各100点・60分）、教育原理・社会的養護は各10問（各50点・30分）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　各科目で満点の6割以上でその科目に合格。教育原理と社会的養護は両方6割以上でないと合格にならない。総合点の基準はない
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">科目合格</span>　合格した年を含めて3年間有効（対象施設での勤務により最長5年まで延長可。条件は年度ごとに変わるため公式ページで確認）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験手数料</span>　12,700円（オンライン申請では事務手数料が別に必要）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験日</span>　令和8年後期は2026年10月24日・25日（申請は終了）。次の令和9年前期は2027年4月17日・18日で、申請案内は令和8年12月下旬ごろに公表予定
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">筆記の後</span>　筆記の全科目に合格した人が実技（音楽・造形・言語から2分野）に進む。実技は当サイトの対象外
          </p>
          <p className="text-xs pt-2">
            ※出典: 全国保育士養成協議会（hoyokyo.or.jp）の受験案内・科目別時間割・公開問題（令和8年前期）・受験手数料のページ（2026年10月19日確認）。出題の基準日は、令和8年度後期が令和8年4月1日以前に施行された法令・指針です。保育所保育指針等の改定は令和9年3月公布予定とされていますが未施行のため、当サイトは現行（平成29年告示）に従っています。受験者数・合格率は公式の結果ページに掲載がないため載せていません。
          </p>
        </div>
      </section>

      {/* 合格報告(掲載済みがあれば)と、受験直後の方への報告のお願い。
          どちらも条件を満たさなければ何も出ない */}
      <ExamVoicesSection exam="hoikushi" />

      <HoikushiCourseAd />

      {/* コラム */}
      {hoikushiColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {hoikushiColumns.slice(0, 6).map((col) => (
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
