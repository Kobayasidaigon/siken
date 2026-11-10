import SiteLink from "@/components/SiteLink";
import { getAllFukushi2Questions, getFukushi2QuestionsByField } from "@/lib/fukushi2-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import Fukushi2CourseAd from "@/components/Fukushi2CourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import { FUKUSHI2_EXAMS } from "@/lib/exam-dates";
import ExamCountdown from "@/components/ExamCountdown";
import Moshi2TopLink from "@/components/Moshi2TopLink";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import OfficialSiteLink from "@/components/OfficialSiteLink";
import ExamIntro from "@/components/ExamIntro";

export const metadata: Metadata = pageMetadata({
  path: "/fukushi2/",
  title: "福祉住環境コーディネーター2級 練習問題・過去問対策【全230問・無料】",
  description: "福祉住環境コーディネーター2級のオリジナル練習問題230問を無料公開。疾患・障害の特性、住環境整備の技術、介護保険と住宅改修まで根拠つき解説で演習でき、分野別の練習から本番形式のテスト、90分の模擬試験まで使えます。",
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
          <SiteLink href="/" className="no-underline hover:underline">ホーム</SiteLink> / <span>福祉住環境コーディネーター2級</span>
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
          <SiteLink href="/fukushi2/q/fukushi2-001/" className="btn-accent">問題を解き始める →</SiteLink>
          <SiteLink
            href="/fukushi2/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-fukushi-soft)]"
            style={{ borderColor: "var(--c-fukushi)", color: "var(--c-fukushi-ink)" }}
          >
            模擬試験を受ける（90分・70点合格判定）→
          </SiteLink>
          <Moshi2TopLink certId="fukushi2" />
          <SiteLink
            href="/fukushi2/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-fukushi-soft)]"
            style={{ borderColor: "var(--c-fukushi)", color: "var(--c-fukushi-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </SiteLink>
        </div>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="fukushi2" placement="return_top" className="mb-8" />

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示(東商IBT/CBTは期間制) */}
      <ExamCountdown exams={FUKUSHI2_EXAMS} accent="var(--c-fukushi)" accentSoft="var(--c-fukushi-soft)" periodExam calendar={{ examName: "福祉住環境コーディネーター2級", path: "/fukushi2/" }} />

      {/* 分野 - タグクラウド風 */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="flex flex-wrap gap-3">
          {fields.map((f, i) => (
            <SiteLink key={f.slug} href={`/fukushi2/field/${f.slug}/`} className="no-underline group">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all group-hover:shadow-sm"
                style={{ background: "var(--c-surface)", color: "var(--c-fukushi-ink)", borderColor: "var(--c-fukushi-soft)" }}
              >
                {f.name}
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "var(--c-fukushi-soft)", color: "var(--c-fukushi-ink)" }}>
                  {fieldCounts[i]}
                </span>
              </span>
            </SiteLink>
          ))}
        </div>
      </section>

      {/* 公式テキストと当サイトの問題(2026-11-10 書き直し。以前の「2021年度からIBT・CBTに移行」
          「試験問題は非公開・持ち帰り不可」「演習量が合否を分ける」は、公式の資料で確かめられなかった) */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">公式テキストと、当サイトの練習問題</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>2級の出題範囲は、3級の範囲と2級公式テキスト（改訂7版）の内容です。2・3級の試験は、IBT（自宅などのパソコンで受験）とCBT（テストセンターで受験）で行われます。</p>
          <p>当サイトの練習問題は、公式テキストの範囲に沿って当サイトが作ったオリジナル問題で、本試験の問題ではありません。9分野すべて解説つき・無料で解けるので、テキストを読んだあとの確認や、演習を増やしたいときに使えます。</p>
        </div>
      </section>

      {/* 勉強の進め方(src/content/exam-intros/fukushi2.md。2026-11-10 追加。分野へのリンクと概要の表だけだったトップに、範囲と分野の対応・勉強の順番を足す) */}
      <ExamIntro exam="fukushi2" />

      {/* 試験概要 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p><span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年2回（2026年度・2027年度とも、7月と11〜12月の試験期間中に希望の日時を選んで受験）　<SiteLink href="/column/fukushi2-nittei/" className="underline hover:no-underline">詳しい日程・申込方法 →</SiteLink></p>
          <p><span className="font-bold text-[color:var(--c-ink)]">試験方式</span>　IBT（自宅等のパソコンで受験）または CBT（各地テストセンターで受験）の多肢選択式・90分</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　100点満点中70点以上</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験資格</span>　制限なし（3級を飛ばしていきなり2級から受験できます）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　東京商工会議所</p>
          <p className="text-xs pt-1">受験料・申込期間などの最新の詳細は、必ず公式サイトでご確認ください。</p>
        </div>
        <OfficialSiteLink exam="fukushi2" />
      </section>

      {/* 合格報告(掲載済みがあれば)と、受験直後の方への報告のお願い。
          どちらも条件を満たさなければ何も出ない */}
      <ExamVoicesSection exam="fukushi2" />

      <Fukushi2CourseAd
        headline="広い出題範囲を体系的に押さえるなら"
        body="福祉住環境コーディネーター2級は、医療・福祉・建築にまたがる幅広い知識が問われます。独学に不安がある方は、通信講座も選択肢になります。"
      />

      {/* 次に取る資格への導線。2026-09-09 追加。
          この資格は230問あるのに、解き終えた読者の行き先がサイト内に無かった。
          社会福祉士の共通科目は介護保険・障害者福祉の論点が重なり、
          広告主(アガルート)も承認済み提携なので、読者にも収益にも無駄がない。 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">
          次の福祉の資格を考えている方へ
        </h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>
            福祉住環境コーディネーターで学ぶ介護保険制度・障害者福祉・バリアフリーの考え方は、
            <SiteLink href="/shakai/" className="underline hover:no-underline">
              社会福祉士（共通科目）
            </SiteLink>
            の「社会保障」「障害者福祉」と重なる論点があります。相談援助の仕事に進むなら次の一歩になる国家資格です。
          </p>
          <p>
            当サイトでは社会福祉士の共通科目12科目から200問を公開しています。共通科目は精神保健福祉士とも共通なので、どちらを目指す場合にも使えます。
          </p>
        </div>
      </section>

      {/* コラム */}
      {fukushi2Columns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {fukushi2Columns.slice(0, 6).map((col) => (
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
