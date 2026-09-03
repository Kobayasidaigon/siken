import { getAllFukushi2Questions, getFukushi2QuestionsByField } from "@/lib/fukushi2-questions";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import Fukushi2CourseAd from "@/components/Fukushi2CourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import { FUKUSHI2_EXAMS } from "@/lib/exam-dates";
import ExamCountdown from "@/components/ExamCountdown";
import Moshi2TopLink from "@/components/Moshi2TopLink";

export const metadata: Metadata = pageMetadata({
  path: "/fukushi2/",
  title: "福祉住環境コーディネーター2級 練習問題・過去問対策【全230問・無料】",
  description: "福祉住環境コーディネーター2級のオリジナル練習問題230問を無料公開。疾患・障害の特性、住環境整備の技術、介護保険と住宅改修まで根拠つき解説で演習できます。過去問が公開されない試験の対策に。",
});

const fields = [
  { name: "高齢社会と住環境整備", slug: "society" },
  { name: "相談援助と連携", slug: "consultation" },
  { name: "障害とリハビリテーション", slug: "rehabilitation" },
  { name: "疾患・障害別の特性", slug: "disease" },
  { name: "住環境整備の基本技術", slug: "basic" },
  { name: "場所別の住環境整備", slug: "place" },
  { name: "福祉用具", slug: "equipment" },
  { name: "介護保険と住宅改修", slug: "kaigohoken" },
  { name: "関連法制度・施策", slug: "law" },
];

export default async function Fukushi2Page() {
  const allQuestions = await getAllFukushi2Questions();
  const allColumns = await getAllColumns();
  const fukushi2Columns = allColumns.filter((c) => c.slug.startsWith("fukushi2-"));

  const fieldCounts = await Promise.all(
    fields.map(async (f) => {
      const qs = await getFukushi2QuestionsByField(f.name);
      return qs.length;
    })
  );

  return (
    <div className="theme-fukushi pb-16">
      {/* Hero */}
      <section
        className="-mx-4 px-4 py-10 sm:py-14 border-y mb-10"
        style={{ background: "var(--c-fukushi-soft)", borderColor: "var(--c-border)" }}
      >
        <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
          <a href="/" className="no-underline hover:underline">ホーム</a> / <span>福祉住環境コーディネーター2級</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight" style={{ color: "var(--c-fukushi-ink)" }}>
          福祉住環境コーディネーター 2級
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-fukushi)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-fukushi-ink)" }}>
          高齢者・障害者の暮らしを住まいから支える東京商工会議所の検定。
          疾患の特性から手すりの寸法、介護保険の住宅改修まで、実務の判断力を問う{allQuestions.length}問です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/fukushi2/q/fukushi2-001/" className="btn-accent">問題を解き始める →</a>
          <a
            href="/fukushi2/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-fukushi-soft)]"
            style={{ borderColor: "var(--c-fukushi)", color: "var(--c-fukushi-ink)" }}
          >
            模擬試験を受ける（90分・70点合格判定）→
          </a>
          <Moshi2TopLink certId="fukushi2" />
          <a
            href="/fukushi2/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-fukushi-soft)]"
            style={{ borderColor: "var(--c-fukushi)", color: "var(--c-fukushi-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </a>
        </div>
      </section>

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示(東商IBT/CBTは期間制) */}
      <ExamCountdown exams={FUKUSHI2_EXAMS} accent="var(--c-fukushi)" accentSoft="var(--c-fukushi-soft)" periodExam />

      {/* 分野 - タグクラウド風 */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="flex flex-wrap gap-3">
          {fields.map((f, i) => (
            <a key={f.slug} href={`/fukushi2/field/${f.slug}/`} className="no-underline group">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all group-hover:shadow-sm"
                style={{ background: "var(--c-surface)", color: "var(--c-fukushi-ink)", borderColor: "var(--c-fukushi-soft)" }}
              >
                {f.name}
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "var(--c-fukushi-soft)", color: "var(--c-fukushi-ink)" }}>
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
          <p>福祉住環境コーディネーター検定は2021年度からIBT・CBT方式（パソコン受験）に移行し、<span className="font-bold text-[color:var(--c-ink)]">試験問題は非公開・持ち帰り不可</span>になりました。市販の「過去問題集」で本試験の問題を確認することはできません。</p>
          <p>だからこそ、出題範囲に沿ったオリジナル問題での演習量が合否を分けます。当サイトの問題はすべて解説付き・無料です。</p>
        </div>
      </section>

      {/* 試験概要 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p><span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年2シーズン（例年6〜7月、10〜11月の各期間中に受験）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">試験方式</span>　IBT（自宅等のパソコンで受験）または CBT（各地テストセンターで受験）の多肢選択式・90分</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　100点満点中70点以上</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験資格</span>　制限なし（3級を飛ばしていきなり2級から受験できます）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　東京商工会議所</p>
          <p className="text-xs pt-1">受験料・申込期間などの最新の詳細は、必ず公式サイトでご確認ください。</p>
        </div>
      </section>

      <Fukushi2CourseAd
        headline="広い出題範囲を体系的に押さえるなら"
        body="福祉住環境コーディネーター2級は、医療・福祉・建築にまたがる幅広い知識が問われます。ユーキャンの通信講座は開講20年以上の定番講座で、公式テキストの改訂にも対応しています。独学に不安がある方は検討してみてください。"
      />

      {/* コラム */}
      {fukushi2Columns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {fukushi2Columns.slice(0, 6).map((col) => (
              <a
                key={col.slug}
                href={`/column/${col.slug}/`}
                className="block py-2 text-sm text-[color:var(--c-text)] no-underline hover:text-[color:var(--c-fukushi)] border-b border-[color:var(--c-border)] last:border-b-0"
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
