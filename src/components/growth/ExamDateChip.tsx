"use client";

/**
 * 試験日のワンタップ設定。2026-09-13 追加(方針: docs/direction-2026-09.md §5-2)。
 *
 * 資格トップのカウントダウンカードの中に置く。公式日程の「次の回」を1回タップで
 * 自分の試験日にできる(別の日付も入れられる)。設定すると、
 *   - 残り日数
 *   - 今日の3問(/today/)
 *   - 毎朝の3問をメール／プッシュで受け取る(Studio。接続機能が有効なときだけ)
 * が出る。試験日は端末内にだけ保存する(lib/growth/exam-date.ts)。
 *
 * Studio へのリマインド案内には匿名IDを付けない。匿名IDを Studio に渡すのは
 * /study/ の「履歴を引き継ぐ」を本人が操作したときだけ(プライバシーポリシーの記載どおり)。
 *
 * 初期HTMLは説明文だけで固定し、日付の候補と設定済みの表示はマウント後に出す。
 * 候補は「今日以降の回」で決まるので、ビルド時の今日と閲覧時の今日が違うと
 * サーバーの描画結果と食い違い hydration が壊れる。日付に依存する部分は全部
 * マウント後に計算する。
 */

import { useEffect, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import type { ExamSlug } from "@/lib/study-progress";
import type { UpcomingExam } from "@/lib/exam-dates";
import { formatYmdJa } from "@/lib/exam-dates";
import StudioLink from "@/components/StudioLink";
import { studioConnectHref } from "@/lib/studio-cta";
import {
  clearExamDate,
  daysUntil,
  getUpcomingExamDate,
  setExamDate,
  todayYmdJst,
  type ExamDateEntry,
} from "@/lib/growth/exam-date";
import { STUDIO_CONNECT_ENABLED } from "@/lib/growth/flags";

interface Props {
  exam: ExamSlug;
  examName: string;
  /** 公式日程(exam-dates.ts)。無い資格は空配列(自分で日付を入れる欄だけ出る) */
  exams: UpcomingExam[];
  /** 東商IBT/CBT の期間制(日付は試験期間の初日) */
  periodExam?: boolean;
  /** GA の placement。既定は資格トップ */
  placement?: string;
  /** カードにこの欄しか無いとき(日程を持たない資格)。上の罫線と余白を出さない */
  standalone?: boolean;
}

function track(name: string, params: Record<string, unknown>) {
  try {
    sendGAEvent("event", name, params);
  } catch {
    /* GA未ロードでも設定は妨げない */
  }
}

export default function ExamDateChip({
  exam,
  examName,
  exams,
  periodExam = false,
  placement = "top",
  standalone = false,
}: Props) {
  const [entry, setEntry] = useState<ExamDateEntry | null>(null);
  const [mounted, setMounted] = useState(false);
  // 設定済みの日付を持ったまま、候補を出し直している状態
  const [editing, setEditing] = useState(false);
  const [custom, setCustom] = useState(false);
  const [customYmd, setCustomYmd] = useState("");
  // JST の今日。マウント後にだけ確定させる(上のコメント参照)
  const [today, setToday] = useState<string>("");

  useEffect(() => {
    setEntry(getUpcomingExamDate(exam));
    setToday(todayYmdJst());
    setMounted(true);
  }, [exam]);

  // 公式日程のうち今日以降の回(最大2つ)。日付順。マウント前は空
  const candidates = mounted ? exams.filter((e) => e.date >= today).slice(0, 2) : [];

  const wrap = standalone ? "text-xs text-[color:var(--c-text-sub)]" : "mt-3 pt-3 border-t border-[color:var(--c-border)] text-xs text-[color:var(--c-text-sub)]";

  function choose(ymd: string, source: "schedule" | "custom", label?: string) {
    const saved = setExamDate(exam, ymd, source, label);
    if (!saved) return;
    setEntry(saved);
    setEditing(false);
    setCustom(false);
    track("exam_date_set", { exam, source, days_left: daysUntil(ymd), placement });
  }

  if (mounted && entry && !editing) {
    const left = daysUntil(entry.ymd);
    return (
      <div className={wrap}>
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-bold text-[color:var(--c-ink)]">
            あなたの試験日 {formatYmdJa(entry.ymd)}
            {entry.label ? `（${entry.label}）` : ""}
          </span>
          <span>{left === 0 ? "本日" : `あと ${left} 日`}</span>
          <button type="button" onClick={() => setEditing(true)} className="underline hover:no-underline">
            変更
          </button>
          <button
            type="button"
            onClick={() => {
              clearExamDate(exam);
              setEntry(null);
            }}
            className="underline hover:no-underline"
          >
            解除
          </button>
        </p>
        <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <a href={`/today/?exam=${exam}`} className="text-blue-700 hover:underline">
            今日の3問を解く →
          </a>
          {STUDIO_CONNECT_ENABLED && (
            <StudioLink
              href={studioConnectHref(exam, "reminder", { examDate: entry.ymd })}
              placement="exam_date_reminder"
              exam={exam}
              className="text-blue-700 hover:underline"
            >
              毎朝の3問をメール・通知で受け取る（Studio）→
            </StudioLink>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className={wrap}>
      <p className="mb-2">
        {editing && entry
          ? `いまの試験日は ${formatYmdJa(entry.ymd)} です。別の回か日付を選ぶと置き換わります。`
          : "受験する回を決めると、残り日数と「今日の3問」がこのページに出ます。保存先はこのブラウザだけです。"}
      </p>
      {mounted && (
        <div className="flex flex-wrap items-center gap-2">
          {candidates.map((c) => (
            <button
              key={c.date}
              type="button"
              onClick={() => choose(c.date, "schedule", c.label)}
              className="px-3 py-1.5 rounded-full border border-[color:var(--c-border-strong)] text-[color:var(--c-ink)] hover:bg-[color:var(--c-bg-alt)] transition-colors"
            >
              {c.label} {formatYmdJa(c.date)}
              {periodExam ? "〜" : ""} を受ける
            </button>
          ))}
          {!custom ? (
            <button
              type="button"
              onClick={() => setCustom(true)}
              className="px-3 py-1.5 rounded-full border border-[color:var(--c-border)] hover:bg-[color:var(--c-bg-alt)] transition-colors"
            >
              {candidates.length > 0 ? "別の日付を入れる" : `${examName}の試験日を入れる`}
            </button>
          ) : (
            <span className="inline-flex items-center gap-2">
              <input
                type="date"
                value={customYmd}
                min={today}
                onChange={(e) => setCustomYmd(e.target.value)}
                className="border border-[color:var(--c-border-strong)] rounded px-2 py-1 text-[color:var(--c-ink)] bg-[color:var(--c-surface)]"
                aria-label="試験日"
              />
              <button
                type="button"
                disabled={!customYmd || customYmd < today}
                onClick={() => choose(customYmd, "custom")}
                className="px-3 py-1.5 rounded-full border border-[color:var(--c-border-strong)] text-[color:var(--c-ink)] disabled:opacity-40 hover:bg-[color:var(--c-bg-alt)]"
              >
                この日にする
              </button>
            </span>
          )}
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setCustom(false);
              }}
              className="underline hover:no-underline"
            >
              そのままにする
            </button>
          )}
        </div>
      )}
    </div>
  );
}
