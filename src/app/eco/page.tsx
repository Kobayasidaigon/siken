import SiteLink from "@/components/SiteLink";
import { getAllEcoQuestions, getEcoQuestionsByField } from "@/lib/eco-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import EcoCourseAd from "@/components/EcoCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import { ECO_EXAMS, BIJIHOU_EXAMS, seasonLabel } from "@/lib/exam-dates";
import ExamCountdown from "@/components/ExamCountdown";
import Moshi2TopLink from "@/components/Moshi2TopLink";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import OfficialSiteLink from "@/components/OfficialSiteLink";
import ExamIntro from "@/components/ExamIntro";

export const metadata: Metadata = pageMetadata({
  path: "/eco/",
  title: "eco検定(環境社会検定試験) 練習問題・過去問対策【全236問・無料】",
  description: "eco検定(環境社会検定試験)のオリジナル練習問題236問を無料公開。地球環境・気候変動・生物多様性・循環型社会・環境法を根拠つき解説で演習でき、分野別の練習から本番形式のテスト、90分の模擬試験まで使えます。",
});

const fields = [
  { name: "持続可能な社会と環境問題の歴史", slug: "history" },
  { name: "地球の基礎知識と生態系", slug: "earth" },
  { name: "いま地球で起きていること", slug: "now" },
  { name: "気候変動とエネルギー", slug: "climate" },
  { name: "生物多様性と自然共生社会", slug: "biodiversity" },
  { name: "循環型社会と廃棄物・3R", slug: "recycle" },
  { name: "地域の環境問題と化学物質", slug: "local" },
  { name: "環境政策の原則・法体系・アセスメント", slug: "policy" },
  { name: "国際的な枠組みと条約", slug: "international" },
  { name: "各主体の役割(企業の環境経営・行政・市民・金融)", slug: "actors" },
];

export default async function EcoPage() {
  const allQuestions = await getAllEcoQuestions();
  const allColumns = await getAllColumns();
  const ecoColumns = allColumns.filter((c) => c.slug.startsWith("eco-"));

  const fieldCounts = await Promise.all(
    fields.map(async (f) => {
      const qs = await getEcoQuestionsByField(f.name);
      return qs.length;
    })
  );

  return (
    <div className="theme-eco pb-16">
      {/* Hero */}
      <section
        className="-mx-4 px-4 py-10 sm:py-14 border-y mb-10"
        style={{ background: "var(--c-eco-soft)", borderColor: "var(--c-border)" }}
      >
        <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
          <SiteLink href="/" className="no-underline hover:underline">ホーム</SiteLink> / <span>eco検定</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight" style={{ color: "var(--c-eco-ink)" }}>
          eco検定（環境社会検定試験）
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-eco)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-eco-ink)" }}>
          環境の知識を「広く・体系的に」問う東京商工会議所の検定。
          公害の歴史から気候変動、生物多様性、リサイクル、環境法まで、範囲の全体を{allQuestions.length}問で通します。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <SiteLink href="/eco/q/eco-001/" className="btn-accent">問題を解き始める →</SiteLink>
          <SiteLink
            href="/eco/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-eco-soft)]"
            style={{ borderColor: "var(--c-eco)", color: "var(--c-eco-ink)" }}
          >
            模擬試験を受ける（90分・70点合格判定）→
          </SiteLink>
          <Moshi2TopLink certId="eco" />
          <SiteLink
            href="/eco/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-eco-soft)]"
            style={{ borderColor: "var(--c-eco)", color: "var(--c-eco-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </SiteLink>
        </div>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="eco" placement="return_top" className="mb-8" />

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示(東商IBT/CBTは期間制) */}
      <ExamCountdown exams={ECO_EXAMS} accent="var(--c-eco)" accentSoft="var(--c-eco-soft)" periodExam calendar={{ examName: "eco検定(環境社会検定試験)", path: "/eco/" }} />

      {/* 分野 - タグクラウド風 */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="flex flex-wrap gap-3">
          {fields.map((f, i) => (
            <SiteLink key={f.slug} href={`/eco/field/${f.slug}/`} className="no-underline group">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all group-hover:shadow-sm"
                style={{ background: "var(--c-surface)", color: "var(--c-eco-ink)", borderColor: "var(--c-eco-soft)" }}
              >
                {f.name}
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "var(--c-eco-soft)", color: "var(--c-eco-ink)" }}>
                  {fieldCounts[i]}
                </span>
              </span>
            </SiteLink>
          ))}
        </div>
      </section>

      {/* 公式問題集と当サイトの問題(2026-11-10 書き直し。以前の「試験問題は非公開・持ち帰り不可」
          「演習量が合否を分ける」は、公式の資料で確かめられなかった) */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">公式問題集と、当サイトの練習問題</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>東京商工会議所の公式サイトによると、eco検定の公式問題集（2026年版）は、受験ガイド、出題傾向・学習ガイド、模擬問題1〜5と解答解説で構成されています。</p>
          <p>当サイトの練習問題は、公式テキストの範囲に沿って当サイトが作ったオリジナル問題で、本試験の問題ではありません。すべて解説つき・無料で、分野ごとに解けるので、テキストを読んだあとの確認や、公式問題集の模擬問題と合わせた演習に使えます。</p>
        </div>
      </section>

      {/* 合格率 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">合格率は5割台で推移しています</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-3">
          <p>東京商工会議所が公表している合格率（全国分）です。</p>
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
                <tr><td className="border border-[color:var(--c-border)] px-2 py-1.5">第38回（2025年度 第1シーズン）</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">16,184人</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">55.9%</td></tr>
                <tr><td className="border border-[color:var(--c-border)] px-2 py-1.5">第39回（2025年度 第2シーズン）</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">16,509人</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">53.6%</td></tr>
                <tr><td className="border border-[color:var(--c-border)] px-2 py-1.5">第40回（2026年度 第1シーズン）</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">13,547人</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">56.7%</td></tr>
              </tbody>
            </table>
          </div>
          <p>直近3回の実受験者数は1万3千〜1万6千人台で、合格率は5割台で推移しています。<span className="font-bold text-[color:var(--c-ink)]">半数近くが不合格になる試験</span>でもあるので、当サイトでは、範囲を一巡したうえで本番形式の問題に慣れておくことをおすすめします。</p>
          <p className="text-xs">出典：東京商工会議所「eco検定 受験者データ」（2026年11月確認）</p>
        </div>
      </section>

      {/* 難しさの正体 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">気をつけたいのは「範囲の広さ」です</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>eco検定は、公害の歴史・地球のしくみ・気候変動・生物多様性・リサイクル・化学物質・環境法・国際条約・企業の環境経営までを<span className="font-bold text-[color:var(--c-ink)]">1回の試験で横断します</span>。当サイトでは、一問ごとの深さよりも、この範囲の広さに気をつけて準備することをおすすめします。</p>
          <p>条約名や制度名は似たものが多く、読んで分かったつもりでも選択肢に並ぶと区別がつかなくなります。当サイトが分野ごとに問題を分けているのは、この「似たものの取り違え」を潰す順序で回せるようにするためです。</p>
          <p>なお東京商工会議所の「受験者データ」のページでは、eco検定合格者へのアンケートで、学習時間が「２ヶ月以内」という回答が71.4%だったと紹介されています（公式も、あくまで目安としての参考情報としています）。</p>
        </div>
      </section>

      {/* 勉強の進め方(src/content/exam-intros/eco.md。2026-11-10 追加。分野へのリンクと概要の表だけだったトップに、範囲と分野の対応・勉強の順番を足す) */}
      <ExamIntro exam="eco" />

      {/* 試験概要 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p><span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年2シーズン（各期間中に希望日を選んで受験）　<SiteLink href="/column/eco-nittei/" className="underline hover:no-underline">詳しい日程・申込方法 →</SiteLink></p>
          <p><span className="font-bold text-[color:var(--c-ink)]">試験方式</span>　IBT（自宅等のパソコンで受験）または CBT（各地テストセンターで受験）の多肢選択式・90分</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　100点満点中70点以上</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　5,500円（税込）。CBT方式は別途テストセンター利用料2,200円（税込）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験資格</span>　制限なし（学歴・年齢・性別・国籍を問いません）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">出題範囲</span>　公式テキスト（改訂10版）の知識とその応用力。最近の時事問題も出題されます</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　東京商工会議所</p>
          <p className="text-xs pt-1">出題数は公式に公表されていません。当サイトの演習問題数は本試験の出題数を示すものではありません。受験料・申込期間などの最新の詳細は、必ず公式サイトでご確認ください。</p>
        </div>
        <OfficialSiteLink exam="eco" />
      </section>

      {/* 合格報告(掲載済みがあれば)と、受験直後の方への報告のお願い。
          どちらも条件を満たさなければ何も出ない */}
      <ExamVoicesSection exam="eco" />

      <EcoCourseAd />

      {/* 姉妹検定 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">同じ東商検定を併願する方へ</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          {/* 日付は exam-dates.ts から組み立てる(以前は 2026年度第2シーズンの日付を直書きしており、締切後に腐っていた) */}
          <p>eco検定と<SiteLink href="/fukushi2/" className="underline hover:no-underline">福祉住環境コーディネーター2級</SiteLink>は、どちらも東京商工会議所がIBT・CBTで実施する検定で、試験期間も申込期間も同じ枠です{seasonLabel(ECO_EXAMS) ? `（${seasonLabel(ECO_EXAMS)}）` : ""}。申込はそれぞれの検定で行いますが、同じ試験期間の中で両方を受ける予定を組めます。</p>
          <p>同じ東商検定でも、<SiteLink href="/bijihou/" className="underline hover:no-underline">ビジネス実務法務検定3級</SiteLink>と<SiteLink href="/bijimane/" className="underline hover:no-underline">ビジネスマネジャー検定</SiteLink>は、同じシーズンでも申込期間・試験期間ともeco検定より早い枠です{seasonLabel(BIJIHOU_EXAMS) ? `（${seasonLabel(BIJIHOU_EXAMS)}）` : ""}。締切が別なので、まとめて受けるつもりなら申込期間を取り違えないよう注意してください。</p>
        </div>
      </section>

      {/* コラム */}
      {ecoColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {ecoColumns.slice(0, 6).map((col) => (
              <SiteLink
                key={col.slug}
                href={`/column/${col.slug}/`}
                className="block py-2 text-sm text-[color:var(--c-text)] no-underline hover:text-[color:var(--c-eco)] border-b border-[color:var(--c-border)] last:border-b-0"
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
