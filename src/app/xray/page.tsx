import { getAllXrayQuestions, getXrayQuestionsByField } from "@/lib/xray-questions";
import RecentCourseReminder from "@/components/RecentCourseReminder";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import XrayCourseAd from "@/components/XrayCourseAd";
import { pageMetadata } from "@/lib/page-metadata";
import ExamVoicesSection from "@/components/ExamVoicesSection";
import Moshi2TopLink from "@/components/Moshi2TopLink";
import { XRAY_FIELDS } from "@/lib/xray-fields";
import ExamCountdown from "@/components/ExamCountdown";
import { XRAY_EXAMS } from "@/lib/exam-dates";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";
import { sisterSite } from "@/lib/sister-sites";

export const metadata: Metadata = pageMetadata({
  path: "/xray/",
  title: "エックス線作業主任者 練習問題【全%N%問・無料】".replace("%N%", String(160)),
  description: "エックス線作業主任者免許試験のオリジナル練習問題%N%問を無料公開。エックス線の管理・関係法令・測定・生体に与える影響の4科目を、条文と計算の過程つきの解説で演習できます。本試験と同じ40問・240分の模擬試験つき。".replace("%N%", String(160)),
});

export default async function XrayPage() {
  const allQuestions = await getAllXrayQuestions();
  const allColumns = await getAllColumns();
  const xrayColumns = allColumns.filter((c) => c.slug.startsWith("xray-"));
  const fieldCounts = await Promise.all(
    XRAY_FIELDS.map(async (f) => (await getXrayQuestionsByField(f.name)).length)
  );
  const aff = EXAM_AFFILIATE.xray;
  const eisei = sisterSite("eisei");
  const setsubi = sisterSite("setsubi");

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
          / <span>エックス線作業主任者</span>
        </nav>
        <h1
          className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight"
          style={{ color: "var(--c-pii-ink)" }}
        >
          エックス線作業主任者
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-pii-ink)" }}>
          エックス線装置を使う作業の管理者に必要な国家資格（労働安全衛生法に基づく免許）。本試験の4科目に沿った{allQuestions.length}問のオリジナル練習問題集です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/xray/q/xray-001/" className="btn-accent">
            問題を解き始める →
          </a>
          <a
            href="/xray/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            模擬試験を受ける（40問・240分）→
          </a>
          <Moshi2TopLink certId="xray" />
          <a
            href="/xray/mock/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            本番形式で腕試し（20問・採点）→
          </a>
        </div>
      </section>

      {/* 前回チェックした講座(再訪者の再クリック導線。記録が無ければ何も出ない) */}
      <RecentCourseReminder exam="xray" placement="return_top" className="mb-8" />

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示。日付の出典は exam-dates.ts のコメント */}
      <ExamCountdown
        exams={XRAY_EXAMS}
        accent="var(--c-pii)"
        accentSoft="var(--c-pii-soft)"
        lead="xray"
        calendar={{ examName: "エックス線作業主任者免許試験", path: "/xray/" }}
      />

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {XRAY_FIELDS.map((f, i) => (
            <a
              key={f.slug}
              href={`/xray/field/${f.slug}/`}
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

      {/* 試験概要。数値は仕様シート(specs/xray.md)の公式確認結果。出典と確認日は下の注記と docs/new-certs-2026-10-review.md */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　安全衛生技術試験協会（全国7センター）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　学科試験のみ・40問（4科目×各10問）・全問五肢択一のマークシート。受験資格は不要（18歳未満は免許を受けられない）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験時間</span>　全科目受験は4時間（12:30〜16:30・休憩なし）。科目免除者は3時間（1科目免除）・2時間（2科目免除）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">配点</span>　エックス線の管理 30点／関係法令 20点／エックス線の測定 25点／生体に与える影響 25点（計100点）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　科目ごとに満点の40%以上、かつ合計60%以上（60点以上）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験手数料</span>　8,800円（非課税。協会の手数料ページは「令和5年6月1日現在」の表示）
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">試験日</span>　センターごとに日が違い、令和8年度は年4〜6回。次は2026年11月20日（北海道・関東・中部・大阪・中国四国・九州）、2027年1月19日、3月3日
          </p>
          <p>
            <span className="font-bold text-[color:var(--c-ink)]">受験者数・合格率</span>　令和7年度 受験者6,064人・合格者2,771人・合格率45.7%（協会の公表値）
          </p>
          <p className="text-xs pt-2">
            ※出典: 安全衛生技術試験協会（exam.or.jp）の試験案内・日程・手数料・合格率の各ページ、電離放射線障害防止規則（2026年10月19日確認）。電卓は使えますが関数電卓・スマホは不可です。令和7年の電離則等の改正で作業主任者の職務が段階的に変わります（2026年4月1日と2027年10月1日施行）。最新の日程・手数料は協会の公式サイトで必ず確認してください。
          </p>
        </div>
      </section>

      {/* 合格報告(掲載済みがあれば)と、受験直後の方への報告のお願い。
          どちらも条件を満たさなければ何も出ない */}
      <ExamVoicesSection exam="xray" />

      <XrayCourseAd />

      {/* 関連する試験。
          2026-10-31: 以前は「同じ労働安全衛生分野の国家資格は、設備資格ドリルの電験・電工などの問題集と合わせて学べます」と
          書いていたが、電験・電工は電気技術者試験センターの試験で、労働安全衛生法の免許ではない(setsubi-shikaku/src/data/certs.ts の
          denko2・denken3 の authority)。同じ協会の免許試験である衛生管理者・二級ボイラー技士への案内に直した。
          実施団体の確認: eisei-shikaku/src/data/certs.ts(eisei1・eisei2)と setsubi-shikaku/src/data/certs.ts(boiler2)の authority
          「公益財団法人 安全衛生技術試験協会」。協会の「【公表試験問題】労働安全衛生法に基づく免許試験」
          (https://www.exam.or.jp/lckohyo/)と「統計」(https://www.exam.or.jp/h_gokakuritsu/)に、第一種・第二種衛生管理者・
          二級ボイラー技士・エックス線作業主任者が並んでいることを、2026-10-31 に公式ドメインの検索抜粋で照合(exam.or.jp への直接取得は不可)。 */}
      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">あわせて学ぶと役に立つ試験</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] leading-relaxed space-y-2">
          <p>
            管理区域や被ばく限度、作業主任者の選任は、労働安全衛生法令の理解が土台です。同じ安全衛生技術試験協会が実施する労働安全衛生法の免許試験には、衛生管理者（第一種・第二種）や二級ボイラー技士があります。姉妹サイトの
            <a href={eisei.href} className="underline hover:no-underline">{eisei.name}</a>
            ・
            <a href={`${setsubi.href}boiler2/`} className="underline hover:no-underline">{setsubi.name}（二級ボイラー技士）</a>
            で練習問題を公開しています。
          </p>
        </div>
      </section>

      {/* コラム */}
      {xrayColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {xrayColumns.slice(0, 6).map((col) => (
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
