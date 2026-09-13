"use client";

/**
 * 結果画面の分岐パネル。2026-09-13 追加(方針: docs/direction-2026-09.md §5-1)。
 *
 * 模試(MoshiExam)と本番形式テスト(MockExam)の結果画面を、
 * 「講座(アフィリエイト)」と「弱点だけ復習(Studio)」の分岐点にする。
 *
 * 書き方の決まり(§7):
 *   得点の事実 → 弱点 → 選択肢、の順で、煽らない。合格保証めいた表現は書かない。
 *   文言にはその人の数字(正解数・正答率・あと何問・弱点分野の内訳)を使う。
 *   統計の話はしない(この面はその人の結果だけ)。
 *
 * 出し分け(lib/growth/score-band.ts):
 *   low   目安まで15ポイント超  … 講座 → Studio → 解き直し
 *   mid   目安まで15ポイント以内 … 申込締切が迫っていれば講座を上、それ以外は Studio を上
 *   high  目安に届いている      … 取りこぼしの解き直し → Studio → 講座
 *
 * 計測:
 *   result_view(exam, placement, band, score_bucket, passed) を1回。
 *   affiliate_click / studio_click は既存の placement 語彙のまま band を添える。
 *   Studio への utm_content は `{placement}_{cert}_{band}`。
 *
 * 講座の行は、提携している資格にだけ出す(§7「案件が無い資格には無理に出さない」)。
 * A8 の計測付きリンクを持たない fukushi2(ユーキャン提携待ち)・bijimane・eco は出ない。
 * 提携が取れて affiliate-links.ts の href が a8.net になれば、自動で出る。
 */

import { useEffect, useRef, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";
import StudioLink from "@/components/StudioLink";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";
import { decideCtaPriority } from "@/lib/cta-priority";
import { questionHref, startDrill } from "@/lib/review-drill";
import { hasStudioLp, studioResultHref } from "@/lib/studio-cta";
import type { ExamSlug } from "@/lib/study-progress";
import { daysUntil, getUpcomingExamDate } from "@/lib/growth/exam-date";
import { questionsToPass, scoreBand, scoreBucket, type ScoreBand } from "@/lib/growth/score-band";

/** 提携済みの講座オファーがあるか。A8 の計測付きリンク(px.a8.net)を持つ資格だけ */
export function hasCourseOffer(exam: ExamSlug): boolean {
  const t = EXAM_AFFILIATE[exam];
  return Boolean(t && /a8\.net/.test(t.href));
}

export interface Weakest {
  field: string;
  correct: number;
  total: number;
}

interface Props {
  exam: ExamSlug;
  placement: "mock_result" | "moshi_result";
  correct: number;
  total: number;
  /** 正答率(0–100)。問別配点の試験でも「問数ベース」の値を渡す */
  pct: number;
  /** 合格の目安(0–100) */
  passPct: number;
  /**
   * 合格基準の問数(分かっているとき)。「あと何問」はパーセントから逆算せず、
   * この値から数える(lib/growth/score-band.ts の questionsToPass 参照)
   */
  passCount?: number;
  /** 合否判定(課題別基準・問別配点の試験はそちらの判定を渡す) */
  passed: boolean;
  /** 合格基準の表示文。例「70点／100点満点 以上」。無ければ passPct% を出す */
  passLabel?: string;
  weakest: Weakest | null;
  /** この回で間違えた問題(問題ページがあるものだけ)。解き直しドリルに使う */
  wrongSlugs: string[];
}

function track(name: string, params: Record<string, unknown>) {
  try {
    sendGAEvent("event", name, params);
  } catch {
    /* GA未ロードでも結果表示は妨げない */
  }
}

const BAND_NOTE: Record<ScoreBand, string> = {
  high: "合格の目安には届いています。取りこぼした分野を潰す段階です。",
  mid: "合格の目安まで、あと少しです。",
  low: "合格の目安まで、分野ごとに積み上げる段階です。",
};

export default function ResultDecisionPanel({
  exam,
  placement,
  correct,
  total,
  pct,
  passPct,
  passCount,
  passed,
  passLabel,
  weakest,
  wrongSlugs,
}: Props) {
  const band = scoreBand(pct, passPct, passed);
  // 合否が別の基準(配点・課題別)で決まる試験では、問数の「あと何問」は合否と
  // 食い違いうる。合格していれば 0 にし、「届いています」と「あとN問」を並べない
  const toPass = passed ? 0 : questionsToPass(correct, total, passPct, passCount);
  const course = hasCourseOffer(exam) ? EXAM_AFFILIATE[exam] : null;
  const ctaPhase = decideCtaPriority(exam).phase;
  const applyOpen = ctaPhase === "apply_open" || ctaPhase === "apply_urgent";

  // 試験日(利用者が設定したもの)。localStorage を読むので初期描画では出さない
  const [examDays, setExamDays] = useState<number | null>(null);
  useEffect(() => {
    const e = getUpcomingExamDate(exam);
    setExamDays(e ? daysUntil(e.ymd) : null);
  }, [exam]);

  const viewed = useRef(false);
  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    track("result_view", {
      exam,
      placement,
      band,
      score_bucket: scoreBucket(correct, total),
      passed: passed ? "yes" : "no",
    });
  }, [exam, placement, band, correct, total, passed]);

  function redo() {
    if (wrongSlugs.length === 0) return;
    const state = startDrill(exam, wrongSlugs, "drill");
    if (!state) return;
    track("drill_start", { exam, size: wrongSlugs.length, bronze: wrongSlugs.length, silver: 0, from: placement });
    window.location.href = questionHref(exam, wrongSlugs[0]);
  }

  /* ---- 選択肢(行) ---- */
  const courseRow = course ? (
    <li key="course" className="py-3 border-b border-[color:var(--c-border)] last:border-b-0">
      <p className="text-xs text-[color:var(--c-text-sub)] flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="tracking-wider border border-[color:var(--c-border)] px-1.5 py-0.5 rounded text-[10px]">広告</span>
        <span>
          {band === "low"
            ? `${weakest ? weakest.field + "から" : "分野ごとに"}体系的に積み上げ直すなら`
            : band === "mid"
              ? toPass > 0
                ? `あと${toPass}問ぶんを講義で埋めるなら`
                : "届かなかった基準を講義で埋めるなら"
              : "仕上げに講義で確認するなら"}
        </span>
        <FreeLeadCTA exam={exam} placement={placement} />
        <AffiliateLink
          href={course.href}
          course={course.course}
          placement={placement}
          band={band}
          className="text-blue-700 hover:underline font-medium"
        >
          {course.label} →
        </AffiliateLink>
      </p>
    </li>
  ) : null;

  const studioRow = (
    <li key="studio" className="py-3 border-b border-[color:var(--c-border)] last:border-b-0">
      <p className="text-xs text-[color:var(--c-text-sub)] mb-1">
        {weakest
          ? `${weakest.field}（${weakest.correct}/${weakest.total}）だけを、AIが作った別の問題で復習するなら`
          : "今回の問題を忘却曲線で自動的に再出題させるなら"}
      </p>
      <StudioLink
        href={studioResultHref(exam, placement, band, weakest?.field)}
        placement={placement}
        exam={exam}
        band={band}
        className="text-xs font-bold inline-flex items-center gap-1 no-underline text-indigo-700 hover:underline"
      >
        {weakest ? `${weakest.field}を Studio で復習する →` : "シカクモン Studio で復習を組む →"}
      </StudioLink>
      <span className="block text-[11px] text-[color:var(--c-text-sub)] mt-0.5">
        {/* 登録なしの1問は資格別 LP にだけある(lib/studio-cta.ts)。無い資格に書かない */}
        {hasStudioLp(exam) ? "姉妹サービス。登録なしで1問試せます。" : "姉妹サービス。AIが作った問題を忘却曲線で復習できます。"}
      </span>
    </li>
  );

  const redoRow =
    wrongSlugs.length > 0 ? (
      <li key="redo" className="py-3 border-b border-[color:var(--c-border)] last:border-b-0">
        <p className="text-xs text-[color:var(--c-text-sub)] mb-1">
          間違えた{wrongSlugs.length}問を、解説を読みながら順に解き直すなら
        </p>
        <button
          type="button"
          onClick={redo}
          className="text-xs font-bold text-[color:var(--c-accent-ink,var(--c-ink))] hover:underline"
        >
          {wrongSlugs.length}問をいま解き直す →
        </button>
      </li>
    ) : null;

  let rows: (React.ReactNode | null)[];
  if (band === "high") {
    rows = [redoRow, studioRow, courseRow];
  } else if (band === "mid") {
    rows = ctaPhase === "apply_urgent" ? [courseRow, studioRow, redoRow] : [studioRow, courseRow, redoRow];
  } else {
    rows = [courseRow, studioRow, redoRow];
  }

  return (
    <aside className="card p-5 mb-6" style={{ borderLeft: "4px solid var(--c-accent)" }}>
      {/* 1. 得点の事実 */}
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed">
        <strong style={{ color: "var(--c-accent-ink)" }}>
          {correct}/{total}問正解（{pct}%）
        </strong>
        。
        {passed
          ? `合格の目安（${passLabel ?? `${passPct}%`}）に届いています。`
          : `合格の目安は${passLabel ?? `${passPct}%`}${toPass > 0 ? `で、あと${toPass}問です。` : "です。"}`}
        {examDays != null && examDays >= 0 && (
          <span className="text-[color:var(--c-text-sub)]">
            {" "}
            試験日まで{examDays === 0 ? "本日" : `あと${examDays}日`}。
          </span>
        )}
      </p>
      <p className="text-xs text-[color:var(--c-text-sub)] mt-1">{BAND_NOTE[band]}</p>

      {/* 2. 弱点 */}
      {weakest ? (
        <p className="text-sm text-[color:var(--c-text)] leading-relaxed mt-3">
          いちばんの弱点は{" "}
          <strong style={{ color: "var(--c-accent-ink)" }}>{weakest.field}</strong>（
          {weakest.correct}/{weakest.total}正解）。ここを固めると得点が動きます。
        </p>
      ) : (
        <p className="text-sm text-[color:var(--c-text)] leading-relaxed mt-3">
          取りこぼしはありませんでした。別の問題でも同じ結果が出るかを確かめる段階です。
        </p>
      )}

      {/* 3. 選択肢 */}
      <ul className="mt-3 border-t border-[color:var(--c-border)]">{rows.filter(Boolean)}</ul>

      {/* 実施団体が広告主の資格(SMART系)は、申込受付中のときだけ協会申込の導線を添える */}
      {course?.applyHref && applyOpen && (
        <div className="mt-3 pt-3 border-t border-[color:var(--c-border)] text-xs text-[color:var(--c-text-sub)] flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="tracking-wider border border-[color:var(--c-border)] px-1.5 py-0.5 rounded text-[10px]">広告</span>
          <span>受験する回を決めたら</span>
          <AffiliateLink
            href={course.applyHref}
            course={course.course}
            placement={`${placement}_apply`}
            band={band}
            className="text-blue-700 hover:underline font-medium"
          >
            {course.applyLabel ?? "協会公式サイトで申し込む"} →
          </AffiliateLink>
          {course.applyPixel && (
            <img width={1} height={1} src={course.applyPixel} alt="" style={{ position: "absolute", border: 0 }} />
          )}
        </div>
      )}
    </aside>
  );
}
