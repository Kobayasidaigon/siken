import { getAllBijimaneQuestions, getBijimaneQuestionsByField } from "@/lib/bijimane-questions";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import BijimaneCourseAd from "@/components/BijimaneCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import { BIJIMANE_EXAMS } from "@/lib/exam-dates";
import ExamCountdown from "@/components/ExamCountdown";

export const metadata: Metadata = pageMetadata({
  path: "/bijimane/",
  title: "ビジネスマネジャー検定 試験対策｜オリジナル200問を無料で",
  description:
    "ビジネスマネジャー検定試験のオリジナル練習問題を詳細解説付きで無料公開。IBT・CBT化で過去問が公開されない試験です。マネジャーの役割から人材育成、業務のマネジメント、リスクマネジメントまで分野別に演習できます。",
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
          <a href="/" className="no-underline hover:underline">ホーム</a> / <span>ビジネスマネジャー検定</span>
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
          <a href="/bijimane/q/bijimane-001/" className="btn-accent">問題を解き始める →</a>
          <a
            href="/bijimane/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-bijimane-soft)]"
            style={{ borderColor: "var(--c-bijimane)", color: "var(--c-bijimane-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </a>
        </div>
      </section>

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示(東商IBT/CBTは期間制) */}
      <ExamCountdown exams={BIJIMANE_EXAMS} accent="var(--c-bijimane)" accentSoft="var(--c-bijimane-soft)" periodExam />

      {/* 分野 - タグクラウド風 */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="flex flex-wrap gap-3">
          {fields.map((f, i) => (
            <a key={f.slug} href={`/bijimane/field/${f.slug}/`} className="no-underline group">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all group-hover:shadow-sm"
                style={{ background: "var(--c-surface)", color: "var(--c-bijimane-ink)", borderColor: "var(--c-bijimane-soft)" }}
              >
                {f.name}
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "var(--c-bijimane-soft)", color: "var(--c-bijimane-ink)" }}>
                  {fieldCounts[i]}
                </span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* 過去問が手に入らない試験 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">「過去問」が手に入らない試験です</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>ビジネスマネジャー検定はIBT（自宅等のパソコン受験）・CBT（テストセンター受験）で実施され、<span className="font-bold text-[color:var(--c-ink)]">試験問題は非公開・持ち帰り不可</span>です。市販の「過去問題集」で本試験そのものの問題を確認することはできません。</p>
          <p>だからこそ、出題範囲に沿ったオリジナル問題での演習量が合否を分けます。当サイトの問題はすべて解説付き・無料です。</p>
        </div>
      </section>

      {/* 合格率の振れ幅 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">合格率は「回によって別の試験」くらい違います</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-3">
          <p>東京商工会議所が公表している合格率（全国分）を並べると、直近2年でこれだけ動いています。</p>
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
                <tr><td className="border border-[color:var(--c-border)] px-2 py-1.5">第19回（2024年度 第1シーズン）</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">5,723人</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">41.7%</td></tr>
                <tr><td className="border border-[color:var(--c-border)] px-2 py-1.5">第20回（2024年度 第2シーズン）</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">5,991人</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">23.3%</td></tr>
                <tr><td className="border border-[color:var(--c-border)] px-2 py-1.5">第21回（2025年度 第1シーズン）</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">5,863人</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">74.8%</td></tr>
                <tr><td className="border border-[color:var(--c-border)] px-2 py-1.5">第22回（2025年度 第2シーズン）</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">5,959人</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">67.9%</td></tr>
              </tbody>
            </table>
          </div>
          <p>2024年度は年度計32.3%、2025年度は年度計71.3%。<span className="font-bold text-[color:var(--c-ink)]">「合格率◯%の試験」と一つの数字で語れる試験ではありません。</span>次の回がどちらに寄るかは事前には分からないので、易しい回を前提にした準備は避けるのが無難です。</p>
          <p className="text-xs">出典：東京商工会議所「ビジネスマネジャー検定試験 受験者データ」（2026年8月確認）</p>
        </div>
      </section>

      {/* 試験概要 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p><span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年2シーズン（例年6〜7月、10〜11月の各期間中に希望日を選んで受験）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">試験方式</span>　IBT（自宅等のパソコンで受験）または CBT（各地テストセンターで受験）の多肢選択式・90分</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　100点満点中70点以上</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　7,700円（税込）。CBT方式は別途テストセンター利用料2,200円（税込）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験資格</span>　制限なし（学歴・年齢・性別・国籍を問いません）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">出題範囲</span>　公式テキスト（最新版）の基礎知識とその応用力。最近の時事問題から出題される場合もあります</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　東京商工会議所</p>
          <p className="text-xs pt-1">出題数は公式に公表されていません。当サイトの演習問題数は本試験の出題数を示すものではありません。受験料・申込期間などの最新の詳細は、必ず公式サイトでご確認ください。</p>
        </div>
      </section>

      <BijimaneCourseAd
        headline="400ページ超のテキストを体系的に押さえるなら"
        body="ビジネスマネジャー検定の公式テキストは400ページを超え、マネジメント理論から労務・リスク対応まで範囲が広い試験です。東京商工会議所の公式通信講座（産業能率大学）は試験に準拠した構成で、独学の順序づけに不安がある方の選択肢になります。"
      />

      {/* 姉妹検定 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">同じ東商検定を併願する方へ</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>ビジネスマネジャー検定と<a href="/bijihou/" className="underline hover:no-underline">ビジネス実務法務検定3級</a>は、どちらも東京商工会議所がIBT・CBTで実施する検定で、2026年度第2シーズンは試験期間（10月22日〜11月9日）も申込期間（9月16日〜9月29日）も同じです。</p>
          <p>出題範囲も一部重なります。ビジマネ第4部の「リスクのマネジメント」で扱うコンプライアンス・ハラスメント・情報漏えい・製品事故といった論点は、ビジ法の企業法務と地続きです。片方の学習がもう片方の下地になるため、同一シーズンでの併願は現実的な選択肢です。</p>
        </div>
      </section>

      {/* コラム */}
      {bijimaneColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {bijimaneColumns.slice(0, 6).map((col) => (
              <a
                key={col.slug}
                href={`/column/${col.slug}/`}
                className="block py-2 text-sm text-[color:var(--c-text)] no-underline hover:text-[color:var(--c-bijimane)] border-b border-[color:var(--c-border)] last:border-b-0"
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
