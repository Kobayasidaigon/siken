import { getAllTouhanQuestions, getTouhanQuestionsByField } from "@/lib/touhan-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import TouhanCourseAd from "@/components/TouhanCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import Moshi2TopLink from "@/components/Moshi2TopLink";
import { TOUHAN_FIELDS } from "@/lib/touhan-fields";
import ExamCountdown from "@/components/ExamCountdown";
import { TOUHAN_EXAMS } from "@/lib/exam-dates";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

export const metadata: Metadata = pageMetadata({
  path: "/touhan/",
  title: "登録販売者試験 練習問題【全%N%問・無料】".replace("%N%", String(240)),
  description: "登録販売者試験のオリジナル練習問題%N%問を無料公開。第1章〜第5章の全分野を、手引き（令和8年4月改訂）に沿った根拠つきの解説で演習できます。本試験と同じ120問・240分の模擬試験つき。".replace("%N%", String(240)),
});

export default async function TouhanPage() {
  const allQuestions = await getAllTouhanQuestions();
  const allColumns = await getAllColumns();
  const touhanColumns = allColumns.filter((c) => c.slug.startsWith("touhan-"));
  const fieldCounts = await Promise.all(
    TOUHAN_FIELDS.map(async (f) => (await getTouhanQuestionsByField(f.name)).length)
  );
  const aff = EXAM_AFFILIATE.touhan;

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
          / <span>登録販売者</span>
        </nav>
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight"
          style={{ color: "var(--c-pii-ink)" }}
        >
          登録販売者
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-pii-ink)" }}>
          薬局やドラッグストアで一般用医薬品（第二類・第三類）を販売できる資格。試験は都道府県ごとに実施され、全国共通の「試験問題作成に関する手引き」に沿った{allQuestions.length}問のオリジナル練習問題集です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/touhan/q/touhan-001/" className="btn-accent">
            問題を解き始める →
          </a>
          <a
            href="/touhan/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            模擬試験を受ける（120問・240分）→
          </a>
          <Moshi2TopLink certId="touhan" />
          <a
            href="/touhan/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </a>
        </div>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="touhan" placement="return_top" className="mb-8" />

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示。日付の出典は exam-dates.ts のコメント */}
      <ExamCountdown
        exams={TOUHAN_EXAMS}
        accent="var(--c-pii)"
        accentSoft="var(--c-pii-soft)"
        lead="touhan"
        calendar={{ examName: "登録販売者試験", path: "/touhan/" }}
      />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {TOUHAN_FIELDS.map((f, i) => (
            <a
              key={f.slug}
              href={`/touhan/field/${f.slug}/`}
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

      {/* 試験概要。数値は仕様シート(specs/touhan.md)の公式確認結果。出典と確認日は下の注記と docs/new-certs-2026-10-review.md */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　都道府県（ブロックごとに共同実施。東京都は首都圏、関西広域連合、愛知県は東海・北陸など）。問題は全国共通の厚生労働省の手引きに基づく
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験資格</span>　学歴・実務経験は不要（誰でも受験できる）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　筆記（マークシート）・120問・全問5肢択一・1問1点。5章構成で、問題数は 第1章20問・第2章20問・第3章40問・第4章20問・第5章20問
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験時間</span>　午前120分＋午後120分の計240分。午前・午後に入る章は都道府県により異なる
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　総合で7割以上（84点以上）、かつ各章の得点が3.5割以上（県により4割以上）。1つの章でも下回ると不合格
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験手数料</span>　確認できた令和8年度は13,000円〜17,600円（県により異なる。福岡・鹿児島13,000円、愛知・埼玉15,000円、秋田17,600円など）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験日</span>　例年8月下旬〜12月ごろ（都道府県・ブロックにより異なる）。令和8年度は関西広域連合8月30日・愛知9月2日・東京9月6日・九州沖縄12月20日
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験者数・合格率</span>　令和7年度 全国計 受験者58,996人・合格者24,004人・合格率40.7%（厚生労働省。延べ人数）。県による差が大きい
          </p>
          <p className="text-xs pt-2">
            ※出典: 厚生労働省「試験問題作成に関する手引き」（令和8年4月一部改訂）、同省の登録販売者試験実施状況、東京都・福岡県・鹿児島県・愛知県・関西広域連合などの令和8年度試験案内（2026年10月19日確認）。章の名称は手引きの現行表記に合わせています（旧称は第4章「薬事関係法規・制度」、第5章「医薬品の適正使用・安全対策」）。受験料・合格基準・午前午後の章割りは都道府県ごとに違うため、受験する県の案内で必ず確認してください。令和9年度の日程は2026年10月19日時点で公表を確認できていません。
          </p>
        </div>
      </section>

      {/* 合格報告(掲載済みがあれば)と、受験直後の方への報告のお願い。
          どちらも条件を満たさなければ何も出ない */}
      <ExamVoicesSection exam="touhan" />

      <TouhanCourseAd />

      {/* コラム */}
      {touhanColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {touhanColumns.slice(0, 6).map((col) => (
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
