"use client";

import { useEffect, useState } from "react";
import type { UpcomingExam } from "@/lib/exam-dates";
import { nextExam, nextApplyDeadline, daysUntilYmd, formatYmdJa, todayStart } from "@/lib/exam-dates";
import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";
import CountdownPing from "@/components/CountdownPing";
import ExamCalendarLinks from "@/components/ExamCalendarLinks";
import type { ExamSlug } from "@/lib/study-progress";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

/**
 * 試験カウントダウンカードの本体。使い方と設計の経緯は ExamCountdown.tsx(サーバー側の入口)を参照。
 *
 * 2026-10-10: ページはビルド時に静的生成されるため、サーバーで計算した「あと◯日」と
 * 「どの回の締切を出すか」はビルドした日のまま固定されていた(10/10 の本番が「あと13日」=10/9 の値)。
 * 締切を過ぎても次のデプロイまで締切と申込リンクが出続ける。そこで、
 *   1. 最初の描画はビルド時の日付(asOf)で行う(静的HTMLと同じ内容にしてハイドレーションを揃える)
 *   2. ブラウザで表示した直後に、閲覧日(JST)で計算し直して差し替える
 * の2段にした。日付が同じなら見た目は変わらない。
 */

export interface ExamCountdownProps {
  exams: UpcomingExam[];
  accent: string; // 例 "var(--c-pii)"
  accentSoft: string; // 例 "var(--c-pii-soft)"。締切間近の強調背景に使う
  examWord?: string; // 試験日表示の名詞。既定「次回試験」(貸金は「次回本試験」)
  periodExam?: boolean; // 東商IBT/CBTの期間制: 「試験期間の開始まで」+日付末尾に「〜」
  apply?: { href: string; course: string; pixel: string };
  applyPlacement?: string; // GA4で設置面を区別する。既定は資格トップの "top_apply"
  lead?: ExamSlug; // 締切表示時に無料オファー(freeHref)を添える資格。apply が無い資格向け
  leadPlacement?: string; // 既定は資格トップの "top_lead"。コラムは "column_countdown_lead"
  /**
   * 締切・試験日をカレンダーに入れる一行を出す。2026-09-07 追加。
   * 資格トップだけに付ける(コラムにも置くと同じ予定への導線が何本も並ぶため)。
   * examName は予定のタイトルに、path は予定に載せる戻り先URLに使う。
   */
  calendar?: { examName: string; path: string };
}

// 締切がこの日数以内に迫ったら強調表示に切り替える。
// 強調は「淡色背景+左罫線+日数の級数アップ」まで(赤・アニメーション等は設計言語に反するため使わない)。
const URGENT_DAYS = 10;

export default function ExamCountdownCard({
  asOf,
  exams,
  accent,
  accentSoft,
  examWord = "次回試験",
  periodExam = false,
  apply,
  applyPlacement = "top_apply",
  lead,
  leadPlacement = "top_lead",
  calendar,
}: ExamCountdownProps & { asOf: number }) {
  // 閲覧日(JSTの0時)。null の間(サーバー描画とハイドレーション)はビルド時の asOf で描く。
  const [viewedOn, setViewedOn] = useState<number | null>(null);
  useEffect(() => {
    setViewedOn(todayStart());
  }, []);
  const today = viewedOn ?? asOf;
  // 表示計測(countdown_view)は閲覧日で確定してから1回だけ送る。
  // ビルド時の内容のまま送ると、締切を過ぎた回の表示を数えてしまう。
  const counted = viewedOn !== null;

  const deadline = nextApplyDeadline(exams, today);
  if (deadline && deadline.applyEnd) {
    const daysLeft = daysUntilYmd(deadline.applyEnd, today);
    const urgent = daysLeft <= URGENT_DAYS;
    return (
      <section
        className="mb-10 card p-5"
        style={urgent ? { background: accentSoft, borderLeft: `3px solid ${accent}` } : undefined}
      >
        {counted && <CountdownPing mode="apply" ymd={deadline.applyEnd} />}
        {/* モバイルは縦積み(日付が長く横並びだとはみ出すため)、sm以上で横並び */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <p className="text-xs text-[color:var(--c-text-sub)] mb-1">{deadline.label} 申込締切まで</p>
            <p className={`${urgent ? "text-2xl" : "text-lg"} font-bold font-serif`} style={{ color: accent }}>
              {daysLeft === 0 ? "本日締切" : <>あと {daysLeft} 日</>}
            </p>
          </div>
          <div className="text-sm text-[color:var(--c-text-sub)] sm:text-right">
            <p>締切 {formatYmdJa(deadline.applyEnd)}</p>
            <p className="mt-1">試験日 {formatYmdJa(deadline.date)}{periodExam ? "〜" : ""}</p>
          </div>
        </div>
        {apply && (
          <p className="mt-4 pt-3 border-t border-[color:var(--c-border)] text-sm flex items-center gap-2">
            <span className="text-[10px] tracking-wider text-[color:var(--c-text-sub)] border border-[color:var(--c-border)] px-1.5 py-0.5 rounded shrink-0">
              広告
            </span>
            <AffiliateLink href={apply.href} course={apply.course} placement={applyPlacement} className="underline hover:no-underline">
              協会公式サイトで申し込む →
            </AffiliateLink>
            <img width={1} height={1} src={apply.pixel} alt="" style={{ position: "absolute", border: 0 }} />
          </p>
        )}
        {!apply && lead && (
          <LeadRow exam={lead} placement={leadPlacement} />
        )}
        {calendar && (
          <ExamCalendarLinks
            examName={calendar.examName}
            kind="apply"
            ymd={deadline.applyEnd}
            label={deadline.label}
            path={calendar.path}
            placement="top_countdown_apply"
          />
        )}
      </section>
    );
  }

  const upcoming = nextExam(exams, today);
  if (!upcoming) return null;
  const daysLeft = daysUntilYmd(upcoming.date, today);
  if (daysLeft <= 0) return null;
  return (
    <section className="mb-10 card p-5">
      {counted && <CountdownPing mode="exam" ymd={upcoming.date} />}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[color:var(--c-text-sub)] mb-1">
            {periodExam ? `${examWord}期間（${upcoming.label}）の開始まで` : `${examWord}（${upcoming.label}）まで`}
          </p>
          <p className="text-lg font-bold font-serif" style={{ color: accent }}>あと {daysLeft} 日</p>
        </div>
        <p className="text-sm text-[color:var(--c-text-sub)]">{formatYmdJa(upcoming.date)}{periodExam ? "〜" : ""}</p>
      </div>
      {calendar && (
        <ExamCalendarLinks
          examName={calendar.examName}
          kind="exam"
          ymd={upcoming.date}
          label={upcoming.label}
          path={calendar.path}
          placement="top_countdown_exam"
        />
      )}
    </section>
  );
}

/**
 * 無料オファー行。FreeLeadCTA は freeHref が無い資格では null を返すので、
 * その場合は「広告」ラベルごと出さないよう、ここで先に有無を確認する。
 */
function LeadRow({ exam, placement }: { exam: ExamSlug; placement: string }) {
  if (!EXAM_AFFILIATE[exam]?.freeHref) return null;
  return (
    <p className="mt-4 pt-3 border-t border-[color:var(--c-border)] text-sm flex items-center gap-2">
      <span className="text-[10px] tracking-wider text-[color:var(--c-text-sub)] border border-[color:var(--c-border)] px-1.5 py-0.5 rounded shrink-0">
        広告
      </span>
      <FreeLeadCTA exam={exam} placement={placement} className="underline hover:no-underline" />
    </p>
  );
}
