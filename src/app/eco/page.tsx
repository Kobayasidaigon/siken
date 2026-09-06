import { getAllEcoQuestions, getEcoQuestionsByField } from "@/lib/eco-questions";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import EcoCourseAd from "@/components/EcoCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import { ECO_EXAMS, BIJIHOU_EXAMS, seasonLabel } from "@/lib/exam-dates";
import ExamCountdown from "@/components/ExamCountdown";
import Moshi2TopLink from "@/components/Moshi2TopLink";

export const metadata: Metadata = pageMetadata({
  path: "/eco/",
  title: "eco検定(環境社会検定試験) 練習問題・過去問対策【全236問・無料】",
  description: "eco検定(環境社会検定試験)のオリジナル練習問題236問を無料公開。地球環境・気候変動・生物多様性・循環型社会・環境法を根拠つき解説で演習できます。過去問が公開されない試験の対策に。",
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
          <a href="/" className="no-underline hover:underline">ホーム</a> / <span>eco検定</span>
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
          <a href="/eco/q/eco-001/" className="btn-accent">問題を解き始める →</a>
          <a
            href="/eco/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-eco-soft)]"
            style={{ borderColor: "var(--c-eco)", color: "var(--c-eco-ink)" }}
          >
            模擬試験を受ける（90分・70点合格判定）→
          </a>
          <Moshi2TopLink certId="eco" />
          <a
            href="/eco/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-eco-soft)]"
            style={{ borderColor: "var(--c-eco)", color: "var(--c-eco-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </a>
        </div>
      </section>

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示(東商IBT/CBTは期間制) */}
      <ExamCountdown exams={ECO_EXAMS} accent="var(--c-eco)" accentSoft="var(--c-eco-soft)" periodExam />

      {/* 分野 - タグクラウド風 */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="flex flex-wrap gap-3">
          {fields.map((f, i) => (
            <a key={f.slug} href={`/eco/field/${f.slug}/`} className="no-underline group">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all group-hover:shadow-sm"
                style={{ background: "var(--c-surface)", color: "var(--c-eco-ink)", borderColor: "var(--c-eco-soft)" }}
              >
                {f.name}
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "var(--c-eco-soft)", color: "var(--c-eco-ink)" }}>
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
          <p>eco検定はIBT（自宅等のパソコン受験）・CBT（テストセンター受験）で実施され、<span className="font-bold text-[color:var(--c-ink)]">試験問題は非公開・持ち帰り不可</span>です。市販の「過去問題集」で本試験そのものの問題を確認することはできません。</p>
          <p>だからこそ、出題範囲に沿ったオリジナル問題での演習量が合否を分けます。当サイトの問題はすべて解説付き・無料です。</p>
        </div>
      </section>

      {/* 合格率 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">合格率は5割台で安定しています</h2>
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
                <tr><td className="border border-[color:var(--c-border)] px-2 py-1.5">第36回（2024年度 第1シーズン）</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">16,487人</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">58.3%</td></tr>
                <tr><td className="border border-[color:var(--c-border)] px-2 py-1.5">第37回（2024年度 第2シーズン）</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">17,553人</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">58.5%</td></tr>
                <tr><td className="border border-[color:var(--c-border)] px-2 py-1.5">第38回（2025年度 第1シーズン）</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">16,184人</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">55.9%</td></tr>
                <tr><td className="border border-[color:var(--c-border)] px-2 py-1.5">第39回（2025年度 第2シーズン）</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">16,509人</td><td className="border border-[color:var(--c-border)] px-2 py-1.5">53.6%</td></tr>
              </tbody>
            </table>
          </div>
          <p>1回あたり1万6千人以上が受け、合格率は5割台で落ち着いています。同じ東商検定でも回ごとの振れが大きい試験があるなかで、<span className="font-bold text-[color:var(--c-ink)]">eco検定は「運の要素が小さく、やった分だけ返ってきやすい」試験</span>だと言えます。裏を返せば、半数近くは落ちる試験でもあります。</p>
          <p className="text-xs">出典：東京商工会議所「eco検定 受験者データ」（2026年8月確認）</p>
        </div>
      </section>

      {/* 難しさの正体 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">難しいのは中身ではなく「範囲の広さ」です</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>eco検定の一問一問は、深い専門知識を要求するものではありません。難しさは、公害の歴史・地球のしくみ・気候変動・生物多様性・リサイクル・化学物質・環境法・国際条約・企業の環境経営までを<span className="font-bold text-[color:var(--c-ink)]">1回の試験で横断する</span>という、範囲の広さの方にあります。</p>
          <p>条約名や制度名は似たものが多く、読んで分かったつもりでも選択肢に並ぶと区別がつかなくなります。当サイトが分野ごとに問題を分けているのは、この「似たものの取り違え」を潰す順序で回せるようにするためです。</p>
          <p>なお東京商工会議所は、合格者の71.4%が2か月以内に受験対策を終えていると公表しています（同「受験者データ」より）。長期戦というより、範囲を一巡させる集中力が問われる試験です。</p>
        </div>
      </section>

      {/* 試験概要 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p><span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年2シーズン（各期間中に希望日を選んで受験）　<a href="/column/eco-nittei/" className="underline hover:no-underline">詳しい日程・申込方法 →</a></p>
          <p><span className="font-bold text-[color:var(--c-ink)]">試験方式</span>　IBT（自宅等のパソコンで受験）または CBT（各地テストセンターで受験）の多肢選択式・90分</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　100点満点中70点以上</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　5,500円（税込）。CBT方式は別途テストセンター利用料2,200円（税込）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験資格</span>　制限なし（学歴・年齢・性別・国籍を問いません）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">出題範囲</span>　公式テキスト（最新版）の知識とその応用力。最近の時事問題から出題される場合もあります</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　東京商工会議所</p>
          <p className="text-xs pt-1">出題数は公式に公表されていません。当サイトの演習問題数は本試験の出題数を示すものではありません。受験料・申込期間などの最新の詳細は、必ず公式サイトでご確認ください。</p>
        </div>
      </section>

      <EcoCourseAd />

      {/* 姉妹検定 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">同じ東商検定を併願する方へ</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          {/* 日付は exam-dates.ts から組み立てる(以前は 2026年度第2シーズンの日付を直書きしており、締切後に腐っていた) */}
          <p>eco検定と<a href="/fukushi2/" className="underline hover:no-underline">福祉住環境コーディネーター2級</a>は、どちらも東京商工会議所がIBT・CBTで実施する検定で、試験期間も申込期間も同じ枠です{seasonLabel(ECO_EXAMS) ? `（${seasonLabel(ECO_EXAMS)}）` : ""}。1回の申込で2つ受けるという組み方ができます。</p>
          <p>同じ東商検定でも、<a href="/bijihou/" className="underline hover:no-underline">ビジネス実務法務検定3級</a>と<a href="/bijimane/" className="underline hover:no-underline">ビジネスマネジャー検定</a>は1つ前のシーズン{seasonLabel(BIJIHOU_EXAMS) ? `（${seasonLabel(BIJIHOU_EXAMS)}）` : ""}です。締切が別なので、まとめて受けるつもりなら申込期間を取り違えないよう注意してください。</p>
        </div>
      </section>

      {/* コラム */}
      {ecoColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {ecoColumns.slice(0, 6).map((col) => (
              <a
                key={col.slug}
                href={`/column/${col.slug}/`}
                className="block py-2 text-sm text-[color:var(--c-text)] no-underline hover:text-[color:var(--c-eco)] border-b border-[color:var(--c-border)] last:border-b-0"
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
