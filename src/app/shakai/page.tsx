import { getAllShakaiQuestions, getShakaiQuestionsByField } from "@/lib/shakai-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import ShakaiCourseAd from "@/components/ShakaiCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import { SHAKAI_FIELDS } from "@/lib/shakai-fields";

export const metadata: Metadata = pageMetadata({
  path: "/shakai/",
  title: "社会福祉士 共通科目 練習問題【全200問・無料】",
  description:
    "社会福祉士国家試験の共通科目12科目のオリジナル練習問題200問を無料公開。社会福祉の原理と政策、社会保障、権利擁護、地域福祉、障害者福祉、医学・心理、社会学・調査、ソーシャルワークを根拠つき解説で演習できます。精神保健福祉士との共通科目です。",
});

export default async function ShakaiPage() {
  const allQuestions = await getAllShakaiQuestions();
  const allColumns = await getAllColumns();
  const shakaiColumns = allColumns.filter((c) => c.slug.startsWith("shakai-"));
  const fieldCounts = await Promise.all(
    SHAKAI_FIELDS.map(async (f) => (await getShakaiQuestionsByField(f.name)).length)
  );

  return (
    <div className="theme-eco pb-16">
      <section
        className="-mx-4 px-4 py-10 sm:py-14 border-y mb-10"
        style={{ background: "var(--c-eco-soft)", borderColor: "var(--c-border)" }}
      >
        <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
          <a href="/" className="no-underline hover:underline">
            ホーム
          </a>{" "}
          / <span>社会福祉士</span>
        </nav>
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight"
          style={{ color: "var(--c-eco-ink)" }}
        >
          社会福祉士（共通科目）
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-eco)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-eco-ink)" }}>
          国家試験の共通科目12科目を8分野に束ねた{allQuestions.length}問のオリジナル練習問題集です。共通科目は
          <strong>精神保健福祉士と共通の出題範囲</strong>なので、どちらの受験にも使えます。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/shakai/q/shakai-001/" className="btn-accent">
            問題を解き始める →
          </a>
          <a
            href="/shakai/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-eco-soft)]"
            style={{ borderColor: "var(--c-eco)", color: "var(--c-eco-ink)" }}
          >
            模擬試験を受ける（60問・75分・分野別判定）→
          </a>
          <a
            href="/shakai/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-eco-soft)]"
            style={{ borderColor: "var(--c-eco)", color: "var(--c-eco-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </a>
        </div>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="shakai" placement="return_top" className="mb-8" />

      {/* カウントダウンは置かない。試験日は例年2月上旬の日曜だが、回ごとの正確な日付と
          受験申込期間(例年9月上旬〜下旬)を本環境から試験センターのサイトで確認できていない。
          誤った締切を出すくらいなら出さない。日程が確認できたら exam-dates.ts に追加すること。 */}

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {SHAKAI_FIELDS.map((f, i) => (
            <a
              key={f.slug}
              href={`/shakai/field/${f.slug}/`}
              className="card p-5 no-underline group block"
              style={{ borderLeft: "3px solid var(--c-eco)" }}
            >
              <div className="flex items-start justify-between mb-1 gap-3">
                <p className="text-base font-bold text-[color:var(--c-ink)] font-serif">
                  <span
                    className="text-xs font-normal mr-2 px-1.5 py-0.5 rounded align-middle"
                    style={{ background: "var(--c-eco-soft)", color: "var(--c-eco-ink)" }}
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

      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">実施機関</span>
            　公益財団法人 社会福祉振興・試験センター
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験形式</span>
            　129問・225分（新カリキュラム、第37回試験から）。五肢択一が中心で一部に複数選択
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">出題科目</span>
            　全19科目（共通科目12・専門科目7）。午前が共通科目、午後が専門科目
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>
            　総得点の約60%（難易度により補正）、かつ6つの科目群すべてで得点があること
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">科目免除</span>
            　精神保健福祉士を持っている場合は共通科目が免除される
          </p>
          <p className="text-xs pt-2">
            ※本サイトが扱うのは共通科目12科目です。専門科目7科目（高齢者福祉・児童家庭福祉・貧困に対する支援・保健医療と福祉・ソーシャルワーク（専門）・福祉サービスの組織と経営）は収録していません。試験日程・受験申込期間・受験資格は必ず試験センターの公式発表でご確認ください。
          </p>
        </div>
      </section>

      {/* 合格報告(掲載済みがあれば)と、受験直後の方への報告のお願い。
          どちらも条件を満たさなければ何も出ない */}
      <ExamVoicesSection exam="shakai" />

      <ShakaiCourseAd />

      {/* 姉妹資格。福祉住環境コーディネーター2級の読者を受け止める。
          fukushi2 は230問あるのに次に進む先が無かった。 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">
          福祉の資格を続けて取る方へ
        </h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>
            共通科目は<strong>精神保健福祉士と共通の出題範囲</strong>です。どちらを受けるにしてもこの200問はそのまま使えますし、社会福祉士を持っていれば精神保健福祉士の受験時に共通科目が免除されます（逆も同じです）。
          </p>
          <p>
            福祉分野の入口として
            <a href="/fukushi2/" className="underline hover:no-underline">
              福祉住環境コーディネーター2級
            </a>
            の練習問題230問も公開しています。介護保険制度・障害者福祉・バリアフリーの考え方は本試験の「社会保障」「障害者福祉」と重なるので、先に解いておくと下地になります。
          </p>
        </div>
      </section>

      {/* コラム */}
      {shakaiColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {shakaiColumns.slice(0, 6).map((col) => (
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
