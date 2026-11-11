import SiteLink from "@/components/SiteLink";
import { getAllFukushi3Questions, getFukushi3QuestionsByField } from "@/lib/fukushi3-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import Fukushi3CourseAd from "@/components/Fukushi3CourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import { FUKUSHI3_FIELDS } from "@/lib/fukushi3-fields";
import ExamCountdown from "@/components/ExamCountdown";
import { FUKUSHI2_EXAMS } from "@/lib/exam-dates";
import OfficialSiteLink from "@/components/OfficialSiteLink";

/** 2級・3級の両方に関わるコラム（2級のコラムとして公開済み）。3級のトップからも案内する */
const SHARED_COLUMN_SLUGS = ["fukushi2-3kyu-hikaku", "fukushi2-nittei"];

/** 問題数はファイルから数える（分野ごとに足していくので、題名の数字を手で直さない） */
export async function generateMetadata(): Promise<Metadata> {
  const n = (await getAllFukushi3Questions()).length;
  return pageMetadata({
    path: "/fukushi3/",
    title:
      n > 0
        ? `福祉住環境コーディネーター3級 練習問題【全${n}問・無料】`
        : "福祉住環境コーディネーター3級 練習問題（準備中）",
    description:
      "福祉住環境コーディネーター検定試験3級のオリジナル練習問題を無料公開。少子高齢社会と介護保険、健康と障害のとらえ方、バリアフリーとユニバーサルデザイン、住まいの整備、まちづくりまで、公式テキストの章に沿った6分野を1問ずつの解説つきで演習できます。",
  });
}

export default async function Fukushi3Page() {
  const allQuestions = await getAllFukushi3Questions();
  const allColumns = await getAllColumns();
  const sharedColumns = SHARED_COLUMN_SLUGS.flatMap((slug) => allColumns.filter((c) => c.slug === slug));
  const fieldCounts = await Promise.all(
    FUKUSHI3_FIELDS.map(async (f) => (await getFukushi3QuestionsByField(f.name)).length)
  );
  // 問題は分野ごとに順次公開する。0問のあいだは問題・腕試しテストへの導線を出さない(wlc と同じ形)。
  const ready = allQuestions.length > 0;
  // 腕試しテストは20問を出すので、20問そろってから案内する
  const mockReady = allQuestions.length >= 20;

  return (
    <div className="theme-fukushi pb-16">
      <section
        className="-mx-4 px-4 py-10 sm:py-14 border-y mb-10"
        style={{ background: "var(--c-fukushi-soft)", borderColor: "var(--c-border)" }}
      >
        <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
          <SiteLink href="/" className="no-underline hover:underline">
            ホーム
          </SiteLink>{" "}
          / <span>福祉住環境コーディネーター3級</span>
        </nav>
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight"
          style={{ color: "var(--c-fukushi-ink)" }}
        >
          福祉住環境コーディネーター 3級
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-fukushi)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-fukushi-ink)" }}>
          高齢者や障害のある人が暮らしやすい住まいを考える、東京商工会議所の検定の入門の級。少子高齢社会と介護保険から、手すりや段差の整備、まちづくりまで、3級公式テキストの章に沿ったオリジナル練習問題集です。
          {ready ? `（${allQuestions.length}問）` : "練習問題は分野ごとに準備中です。"}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {ready ? (
            <>
              <SiteLink href={`/fukushi3/q/${allQuestions[0].slug}/`} className="btn-accent">
                問題を解き始める →
              </SiteLink>
              {mockReady ? (
                <SiteLink
                  href="/fukushi3/mock/"
                  className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-fukushi-soft)]"
                  style={{ borderColor: "var(--c-fukushi)", color: "var(--c-fukushi-ink)" }}
                >
                  腕試しテスト（ランダム20問・採点）→
                </SiteLink>
              ) : null}
            </>
          ) : (
            <SiteLink href="/column/fukushi2-nittei/" className="btn-accent">
              試験日程と申込期間を見る →
            </SiteLink>
          )}
        </div>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="fukushi3" placement="return_top" className="mb-8" />

      {/* カウントダウン: 2級と3級は同じ回・同じ試験期間なので、日程は FUKUSHI2_EXAMS を共有する(東商IBT/CBTは期間制) */}
      <ExamCountdown
        exams={FUKUSHI2_EXAMS}
        accent="var(--c-fukushi)"
        accentSoft="var(--c-fukushi-soft)"
        periodExam
        calendar={{ examName: "福祉住環境コーディネーター3級", path: "/fukushi3/" }}
      />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {FUKUSHI3_FIELDS.map((f, i) => {
            const body = (
              <>
                <div className="flex items-start justify-between mb-1 gap-3">
                  <p className="text-base font-bold text-[color:var(--c-ink)] font-serif">
                    <span
                      className="text-xs font-normal mr-2 px-1.5 py-0.5 rounded align-middle"
                      style={{ background: "var(--c-fukushi-soft)", color: "var(--c-fukushi-ink)" }}
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
                href={`/fukushi3/field/${f.slug}/`}
                className="card p-5 no-underline group block"
                style={{ borderLeft: "3px solid var(--c-fukushi)" }}
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

      {/* 2026-11-12 に東京商工会議所の受験案内(https://kentei.tokyo-cci.or.jp/fukushi/exam-info/)と
          公式テキストのページ(support/official-text.html)で確認 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">公式テキストと、当サイトの練習問題</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>
            3級の出題範囲は、3級公式テキスト（改訂7版）の内容です。テキストは「暮らしやすい生活環境をめざして」「健康と障害のとらえ方」「バリアフリーとユニバーサルデザイン」「安全・安心・快適な住まい」「安全で安心できる住生活とまちづくり」の5章でできています。
          </p>
          <p>
            当サイトの練習問題は、この5章を6分野に分けて当サイトが作ったオリジナル問題で、本試験の問題ではありません。どの問題も解説つき・無料で解けるので、テキストを読んだあとの確認に使えます。
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年2回（2級と同じ回。試験期間のなかで希望の日時を選んで受験）
            <SiteLink href="/column/fukushi2-nittei/" className="underline hover:no-underline">
              詳しい日程・申込期間
            </SiteLink>
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験方式</span>　IBT（自宅などのパソコンで受験）または CBT（各地のテストセンターで受験）の多肢選択式・90分
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　100点満点中70点以上
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　5,500円（税込）。CBTで受ける場合は、CBT利用料2,200円（税込）が別にかかります
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験資格</span>　制限なし（2級から受けることも、2級と3級を同じ回で受けることもできます）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　東京商工会議所
          </p>
          <p className="text-xs pt-1">受験料・申込期間などの最新の詳細は、必ず公式サイトでご確認ください。</p>
        </div>
        <OfficialSiteLink exam="fukushi3" />
      </section>

      {/* 合格報告(掲載済みがあれば)と、受験直後の方への報告のお願い。どちらも条件を満たさなければ何も出ない */}
      <ExamVoicesSection exam="fukushi3" />

      {/* ユーキャンの講座広告は、数値を伴う合格率・合格者数を書いた面には出さない(lib/ucan-policy.ts)。このページには合格率の数字を書かない */}
      <Fukushi3CourseAd />

      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">2級を受ける方へ</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>
            2級の出題範囲には、3級の範囲も含まれます。2級を受ける方も、3級の練習問題で基礎を確かめてから
            <SiteLink href="/fukushi2/" className="underline hover:no-underline">
              福祉住環境コーディネーター2級の練習問題
            </SiteLink>
            に進む使い方ができます。
          </p>
        </div>
      </section>

      {/* コラム: 2級・3級の両方に関わるもの(2級のコラムとして公開済み) */}
      {sharedColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {sharedColumns.map((col) => (
              <SiteLink
                key={col.slug}
                href={`/column/${col.slug}/`}
                className="block py-2 text-sm text-[color:var(--c-text)] no-underline hover:text-[color:var(--c-fukushi)] border-b border-[color:var(--c-border)] last:border-b-0"
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
