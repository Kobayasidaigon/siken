import SiteLink from "@/components/SiteLink";
import { getAllBijimaneQuestions, getBijimaneQuestionsByField } from "@/lib/bijimane-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import BijimaneCourseAd from "@/components/BijimaneCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import { BIJIMANE_EXAMS, seasonLabel } from "@/lib/exam-dates";
import ExamCountdown from "@/components/ExamCountdown";
import Moshi2TopLink from "@/components/Moshi2TopLink";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import OfficialSiteLink from "@/components/OfficialSiteLink";
import ExamIntro from "@/components/ExamIntro";

export const metadata: Metadata = pageMetadata({
  path: "/bijimane/",
  title: "ビジネスマネジャー検定 練習問題・過去問対策【全200問・無料】",
  description: "ビジネスマネジャー検定のオリジナル練習問題200問を無料公開。マネジャーの役割・人材育成・経営計画・リスクマネジメントを根拠つき解説で演習でき、分野別の練習からランダム出題のテスト、90分の模擬試験まで使えます。",
});

const fields = [
  { name: "マネジャーの役割と心構え", slug: "role" },
  { name: "マネジャー自身のマネジメントとコミュニケーション", slug: "self-communication" },
  { name: "部下のマネジメントとリーダーシップ", slug: "leadership" },
  { name: "人材育成と人事考課", slug: "hr" },
  { name: "チームのマネジメントと企業組織論", slug: "team" },
  { name: "経営計画・事業計画と戦略", slug: "strategy" },
  { name: "業務のマネジメントと問題解決", slug: "operation" },
  { name: "マーケティング・イノベーションと財務の基礎", slug: "marketing" },
  { name: "リスクマネジメントの考え方と職場のリスク", slug: "risk" },
  { name: "業務・組織・事故災害のリスクマネジメント", slug: "risk-operation" },
];

export default async function BijimanePage() {
  const allQuestions = await getAllBijimaneQuestions();
  const allColumns = await getAllColumns();
  const bijimaneColumns = allColumns.filter((c) => c.slug.startsWith("bijimane-"));

  const fieldCounts = await Promise.all(
    fields.map(async (f) => {
      const qs = await getBijimaneQuestionsByField(f.name);
      return qs.length;
    })
  );

  return (
    <div className="theme-bijimane pb-16">
      {/* Hero */}
      <section
        className="-mx-4 px-4 py-10 sm:py-14 border-y mb-10"
        style={{ background: "var(--c-bijimane-soft)", borderColor: "var(--c-border)" }}
      >
        <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
          <SiteLink href="/" className="no-underline hover:underline">ホーム</SiteLink> / <span>ビジネスマネジャー検定</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight" style={{ color: "var(--c-bijimane-ink)" }}>
          ビジネスマネジャー検定試験
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-bijimane)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-bijimane-ink)" }}>
          管理職の土台づくりを問う東京商工会議所の検定。
          部下の動機づけから事業計画、ハラスメント対応まで、現場の判断力を問う{allQuestions.length}問です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <SiteLink href="/bijimane/q/bijimane-001/" className="btn-accent">問題を解き始める →</SiteLink>
          <SiteLink
            href="/bijimane/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-bijimane-soft)]"
            style={{ borderColor: "var(--c-bijimane)", color: "var(--c-bijimane-ink)" }}
          >
            模擬試験を受ける（90分・70点合格判定）→
          </SiteLink>
          <Moshi2TopLink certId="bijimane" />
          <SiteLink
            href="/bijimane/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-bijimane-soft)]"
            style={{ borderColor: "var(--c-bijimane)", color: "var(--c-bijimane-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </SiteLink>
        </div>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="bijimane" placement="return_top" className="mb-8" />

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示(東商IBT/CBTは期間制) */}
      <ExamCountdown exams={BIJIMANE_EXAMS} accent="var(--c-bijimane)" accentSoft="var(--c-bijimane-soft)" periodExam calendar={{ examName: "ビジネスマネジャー検定", path: "/bijimane/" }} />

      {/* 分野 - タグクラウド風 */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="flex flex-wrap gap-3">
          {fields.map((f, i) => (
            <SiteLink key={f.slug} href={`/bijimane/field/${f.slug}/`} className="no-underline group">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all group-hover:shadow-sm"
                style={{ background: "var(--c-surface)", color: "var(--c-bijimane-ink)", borderColor: "var(--c-bijimane-soft)" }}
              >
                {f.name}
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "var(--c-bijimane-soft)", color: "var(--c-bijimane-ink)" }}>
                  {fieldCounts[i]}
                </span>
              </span>
            </SiteLink>
          ))}
        </div>
      </section>

      {/* 公式問題集と当サイトの問題(2026-11-10 書き直し。以前は「過去問が手に入らない試験」としていたが、
          公式問題集2026年版の Part1 は「過去問題＆模擬問題（IBT・CBT対策）」で、事実と違っていた) */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">公式問題集と、当サイトの練習問題</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>東京商工会議所の公式サイトによると、公式問題集（2026年版）は、Part1「過去問題＆模擬問題（IBT・CBT対策）」とPart2「模擬問題（分野別形式）」で構成されています。本試験の形式に近い問題は、まず公式問題集で確かめられます。</p>
          <p>当サイトの練習問題は、公式テキストの範囲に沿って当サイトが作ったオリジナル問題で、本試験の問題ではありません。すべて解説つき・無料で、分野ごとに解けるので、テキストを読んだあとの確認や、公式問題集と合わせて演習を増やしたいときに使えます。</p>
        </div>
      </section>

      {/* 合格率の振れ幅 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">合格率は「回によって別の試験」くらい違います</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-3">
          <p>東京商工会議所が公表している合格率（全国分）を並べると、第21回から第23回までの3回でこれだけ動いています。</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="border border-[color:var(--c-border)] px-2 py-1.5 text-left bg-[color:var(--c-bg-alt)]">実施回</th>
                  <th className="border border-[color:var(--c-border)] px-2 py-1.5 text-left bg-[color:var(--c-bg-alt)]">実受験者数</th>
                  <th className="border border-[color:var(--c-border)] px-2 py-1.5 text-left bg-[color:var(--c-bg-alt)]">合格率</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-[color:var(--c-border)] px-2 py-1.5">第21回（2025年度 第1シーズン）</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">5,863人</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">74.8%</td></tr>
                <tr><td className="border border-[color:var(--c-border)] px-2 py-1.5">第22回（2025年度 第2シーズン）</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">5,959人</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">67.9%</td></tr>
                <tr><td className="border border-[color:var(--c-border)] px-2 py-1.5">第23回（2026年度 第1シーズン）</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">5,785人</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">47.9%</td></tr>
              </tbody>
            </table>
          </div>
          <p>2025年度は年度計71.3%でしたが、2026年度の第23回は47.9%でした。<span className="font-bold text-[color:var(--c-ink)]">「合格率◯%の試験」と一つの数字で語れる試験ではありません。</span>次の回がどちらに寄るかは事前には分からないので、易しい回を前提にした準備は避けるのが無難です。</p>
          <p className="text-xs">出典：東京商工会議所「ビジネスマネジャー検定試験 受験者データ」（2026年11月確認。実受験者数）</p>
        </div>
      </section>

      {/* 勉強の進め方(src/content/exam-intros/bijimane.md。2026-11-10 追加。分野へのリンクと概要の表だけだったトップに、範囲と分野の対応・勉強の順番を足す) */}
      <ExamIntro exam="bijimane" />

      {/* 試験概要 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p><span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年2回（2026年度・2027年度とも、6〜7月と10〜11月の試験期間中に希望の日時を選んで受験）　<SiteLink href="/column/bijimane-nittei/" className="underline hover:no-underline">詳しい日程・申込方法 →</SiteLink></p>
          <p><span className="font-bold text-[color:var(--c-ink)]">試験方式</span>　IBT（自宅等のパソコンで受験）または CBT（各地テストセンターで受験）の多肢選択式・90分</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　100点満点中70点以上</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　7,700円（税込）。CBT方式は別途テストセンター利用料2,200円（税込）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験資格</span>　制限なし（学歴・年齢・性別・国籍を問いません）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">出題範囲</span>　公式テキスト（最新版）の基礎知識とその応用力。最近の時事問題から出題される場合もあります</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　東京商工会議所</p>
          <p className="text-xs pt-1">出題数は公式に公表されていません。当サイトの演習問題数は本試験の出題数を示すものではありません。受験料・申込期間などの最新の詳細は、必ず公式サイトでご確認ください。</p>
        </div>
        <OfficialSiteLink exam="bijimane" />
      </section>

      {/* 合格報告(掲載済みがあれば)と、受験直後の方への報告のお願い。
          どちらも条件を満たさなければ何も出ない */}
      <ExamVoicesSection exam="bijimane" />

      <BijimaneCourseAd
        headline="広い出題範囲を体系的に押さえるなら"
        body="ビジネスマネジャー検定は、マネジャーの役割から人と組織、業務、リスクのマネジメントまで範囲が広い試験です。通信講座は、独学の順序づけに不安がある方の選択肢になります。"
      />

      {/* 姉妹検定 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">同じ東商検定を併願する方へ</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          {/* 日付は exam-dates.ts から組み立てる(以前は 2026年度第2シーズンの日付を直書きしており、締切後に腐っていた) */}
          <p>ビジネスマネジャー検定と<SiteLink href="/bijihou/" className="underline hover:no-underline">ビジネス実務法務検定3級</SiteLink>は、どちらも東京商工会議所がIBT・CBTで実施する検定で、試験期間も申込期間も同じ枠です{seasonLabel(BIJIMANE_EXAMS) ? `（${seasonLabel(BIJIMANE_EXAMS)}）` : ""}。</p>
          <p>出題範囲も一部重なります。ビジマネ公式テキストの第4部「リスクのマネジメント」は、職場・業務・組織・事故や災害にかかわるリスクを扱い、コンプライアンスやハラスメントへの対応はビジ法の企業法務と地続きの論点です。当サイトでは、片方の学習がもう片方の下地になるので、同じ試験期間での併願も現実的な選択肢だと考えています。</p>
        </div>
      </section>

      {/* コラム */}
      {bijimaneColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {bijimaneColumns.slice(0, 6).map((col) => (
              <SiteLink
                key={col.slug}
                href={`/column/${col.slug}/`}
                className="block py-2 text-sm text-[color:var(--c-text)] no-underline hover:text-[color:var(--c-bijimane)] border-b border-[color:var(--c-border)] last:border-b-0"
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
