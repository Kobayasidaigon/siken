import { getAllJitsumuQuestions, getJitsumuQuestionsByField } from "@/lib/jitsumu-questions";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import JitsumuCourseAd from "@/components/JitsumuCourseAd";
import { JITSUMU_TOP_AD } from "@/lib/jitsumu-ad-content";
import { pageMetadata } from "@/lib/page-metadata";
import { JITSUMU_EXAMS } from "@/lib/exam-dates";
import ExamCountdown from "@/components/ExamCountdown";

export const metadata: Metadata = pageMetadata({
  path: "/jitsumu/",
  title: "個人情報保護実務検定 試験対策｜オリジナル200問を無料で",
  description: "個人情報保護実務検定のオリジナル練習問題200問を詳細解説。個人情報保護法の基礎・取得利用・安全管理・本人の権利を収録。",
});

const fields = [
  { name: "個人情報保護法の基礎", slug: "basic", desc: "目的・定義、個人情報・個人データ・保有個人データ、要配慮個人情報、事業者の義務" },
  { name: "取得・利用", slug: "acquisition", desc: "利用目的の特定・通知、適正取得、利用目的による制限、不適正利用の禁止" },
  { name: "安全管理・第三者提供", slug: "security", desc: "安全管理措置、従業者・委託先監督、第三者提供制限、外国移転、記録義務" },
  { name: "本人の権利・漏えい対応", slug: "rights", desc: "開示・訂正・利用停止請求、漏えい等報告、仮名加工情報、匿名加工情報" },
  { name: "実務・関連法", slug: "practice", desc: "苦情処理、個人情報保護委員会、認定団体、関連法規（マイナンバー法・GDPR）、実務トラブル対応" },
];

export default async function JitsumuPage() {
  const allQuestions = await getAllJitsumuQuestions();
  const allColumns = await getAllColumns();
  const jitsumuColumns = allColumns.filter((c) => c.slug.startsWith("jitsumu-"));
  const fieldCounts = await Promise.all(fields.map(async (f) => (await getJitsumuQuestionsByField(f.name)).length));

  return (
    <div className="theme-pii pb-16">
      <section className="-mx-4 px-4 py-10 sm:py-14 border-y mb-10" style={{ background: "var(--c-pii-soft)", borderColor: "var(--c-border)" }}>
        <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
          <a href="/" className="no-underline hover:underline">ホーム</a> / <span>個人情報保護実務検定</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight" style={{ color: "var(--c-pii-ink)" }}>
          個人情報保護実務検定
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-pii-ink)" }}>
          個人情報保護法の実務知識を問う、{allQuestions.length}問のオリジナル練習問題集です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/jitsumu/q/jitsumu-001/" className="btn-accent">問題を解き始める →</a>
          <a
            href="/jitsumu/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            模擬試験を受ける（2級形式80問・90分）→
          </a>
        </div>
      </section>

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示 */}
      <ExamCountdown
        exams={JITSUMU_EXAMS}
        accent="var(--c-pii)"
        accentSoft="var(--c-pii-soft)"
        apply={{
          href: "https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.joho-gakushu.or.jp%2Fpipl%2F",
          course: "jitsumu",
          pixel: "https://www11.a8.net/0.gif?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2",
        }}
      />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {fields.map((f, i) => (
            <a key={f.slug} href={`/jitsumu/field/${f.slug}/`} className="card p-5 no-underline group block" style={{ borderLeft: "3px solid var(--c-pii)" }}>
              <div className="flex items-start justify-between mb-1 gap-3">
                <p className="text-base font-bold text-[color:var(--c-ink)] font-serif">{f.name}</p>
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
          <p><span className="font-bold text-[color:var(--c-ink)]">級区分</span>　1級・2級（マークシート方式）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　1級 100問・120分／2級 80問・90分</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　正答率70%以上</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　1級 11,000円／2級 8,800円（税込）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">試験日</span>　年4回（5月・8月・11月・2月頃）　<a href="/column/jitsumu-nittei/" className="underline hover:no-underline">詳しい日程・申込方法 →</a></p>
          <p><span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　全日本情報学習振興協会</p>
        </div>
        <p className="text-xs text-[color:var(--c-text-sub)] mt-3 leading-relaxed">
          ※当サイトの練習問題は、個人情報保護法の基礎を中心に2級・1級の両方に通じる内容で構成しています。最新の試験範囲・日程は公式サイトで必ずご確認ください。
        </p>
      </section>

      <JitsumuCourseAd headline={JITSUMU_TOP_AD.headline} body={JITSUMU_TOP_AD.body} />

      {/* コラム */}
      {jitsumuColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {jitsumuColumns.slice(0, 6).map((col) => (
              <a
                key={col.slug}
                href={`/column/${col.slug}/`}
                className="block py-2 text-sm text-[color:var(--c-text)] no-underline hover:text-[color:var(--c-pii)] border-b border-[color:var(--c-border)] last:border-b-0"
              >
                {col.title}
              </a>
            ))}
          </div>
          {jitsumuColumns.length > 6 && (
            <a href="/column/#jitsumu" className="inline-block mt-4 text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-pii)] underline">
              個人情報保護実務検定のコラムをすべて見る →
            </a>
          )}
        </section>
      )}
    </div>
  );
}
