"use client";

/**
 * 本番形式テスト（採点・苦手分野判定つき）。
 *
 * 監査で「複数問を解いた後のスコア結果＝最強の購入intent面」がサイトに無い、と判明したため新設。
 * フロー: intro → 出題プールからランダムN問 → 1問ずつ解答（解答中は正解非表示）→ 採点 →
 * 得点・分野別正答率・弱点判定 → その文脈で講座/無料資料請求/Studio へ送客。
 * 採点後の正誤は study-progress（/study）にも記録され、弱点が積み上がる。
 */

import { useState } from "react";
import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";
import StudioLink from "@/components/StudioLink";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";
import { recordResult, type ExamSlug } from "@/lib/study-progress";

export interface MockQuestion {
  slug: string;
  questionText: string;
  choices: string[];
  correctAnswer: number; // 1始まり
  field: string;
}

interface Props {
  exam: ExamSlug;
  examLabel: string;
  questionPathPrefix: string; // 復習リンクの接頭辞。例 "/q/"
  questions: MockQuestion[];
  size?: number;              // 出題数（既定20）
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 配色はテーマ非依存。各mockページの theme-* が --c-accent(-ink) を供給する
// （貸金=theme-kashikin なので従来色のまま／知財=theme-chizai・個情保=theme-pii で各色に）。

export default function MockExam({
  exam,
  examLabel,
  questionPathPrefix,
  questions,
  size = 20,
}: Props) {
  const [phase, setPhase] = useState<"intro" | "running" | "done">("intro");
  const [pool, setPool] = useState<MockQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const count = Math.min(size, questions.length);

  function start() {
    const picked = shuffle(questions).slice(0, count);
    setPool(picked);
    setAnswers(new Array(picked.length).fill(null));
    setIdx(0);
    setPhase("running");
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  function select(choiceNum: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = choiceNum;
      return next;
    });
  }

  function finish() {
    // 採点後の正誤を学習履歴に反映（/study に弱点・正解が積み上がる）
    pool.forEach((q, i) => {
      const sel = answers[i];
      if (sel != null) recordResult(exam, q.slug, sel === q.correctAnswer);
    });
    setPhase("done");
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  /* ===================== Intro ===================== */
  if (phase === "intro") {
    return (
      <div className="card p-6">
        <h2 className="text-lg font-bold font-serif mb-3" style={{ color: "var(--c-accent-ink)" }}>
          本番形式・腕試し
        </h2>
        <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-2">
          {examLabel}のオリジナル全{questions.length}問から<strong>{count}問</strong>をランダム出題します。
          解答中は正解を表示しません。最後に<strong>得点と苦手分野</strong>を判定します。
        </p>
        <p className="text-xs text-[color:var(--c-text-sub)] leading-relaxed mb-5">
          採点後、間違えた問題は学習履歴（<a href="/study/" className="underline">/study</a>）に自動で記録されます。
        </p>
        <button onClick={start} className="btn-accent">
          {count}問に挑戦する →
        </button>
      </div>
    );
  }

  /* ===================== Running ===================== */
  if (phase === "running") {
    const q = pool[idx];
    const selected = answers[idx];
    const isLast = idx === pool.length - 1;
    const answeredCount = answers.filter((a) => a != null).length;
    const progressPct = Math.round(((idx + 1) / pool.length) * 100);

    return (
      <div>
        <div className="flex items-center justify-between mb-2 text-xs text-[color:var(--c-text-sub)]">
          <span>問 {idx + 1} / {pool.length}</span>
          <span>{q.field}</span>
        </div>
        <div className="h-1.5 rounded-full bg-[color:var(--c-bg-alt)] mb-6 overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${progressPct}%`, background: "var(--c-accent)" }} />
        </div>

        <section className="card p-5 mb-6" style={{ borderLeft: "4px solid var(--c-accent)" }}>
          <p className="text-sm text-[color:var(--c-text)] leading-relaxed whitespace-pre-wrap">{q.questionText}</p>
        </section>

        <ol className="space-y-2 mb-6">
          {q.choices.map((choice, i) => {
            const num = i + 1;
            const isSelected = selected === num;
            const style = isSelected
              ? "bg-blue-50 border border-blue-300 text-blue-800 font-medium"
              : "bg-slate-50 text-slate-600 border border-transparent cursor-pointer hover:bg-slate-100";
            return (
              <li
                key={i}
                onClick={() => select(num)}
                className={`text-sm px-3 py-2.5 rounded-lg transition-colors flex items-start gap-2 ${style}`}
              >
                <span className="font-bold shrink-0">{num}.</span>
                <span className="flex-1">{choice}</span>
              </li>
            );
          })}
        </ol>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIdx((v) => Math.max(0, v - 1))}
            disabled={idx === 0}
            className="text-sm text-[color:var(--c-text-sub)] disabled:opacity-40 hover:text-[color:var(--c-accent)]"
          >
            ← 前へ
          </button>
          {isLast ? (
            <button
              type="button"
              onClick={finish}
              disabled={answeredCount < pool.length}
              className="btn-accent disabled:opacity-40"
              title={answeredCount < pool.length ? "すべての問題に解答すると採点できます" : undefined}
            >
              採点する（{answeredCount}/{pool.length}）
            </button>
          ) : (
            <button type="button" onClick={() => setIdx((v) => v + 1)} className="btn-accent">
              次へ →
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ===================== Done (採点結果) ===================== */
  const correctCount = pool.reduce((s, q, i) => s + (answers[i] === q.correctAnswer ? 1 : 0), 0);
  const pct = Math.round((correctCount / pool.length) * 100);

  const fieldStats: Record<string, { correct: number; total: number }> = {};
  pool.forEach((q, i) => {
    const fs = fieldStats[q.field] ?? (fieldStats[q.field] = { correct: 0, total: 0 });
    fs.total++;
    if (answers[i] === q.correctAnswer) fs.correct++;
  });
  const fieldsSorted = Object.entries(fieldStats).sort(
    (a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total,
  );
  const weakest = fieldsSorted[0];
  const allPerfect = correctCount === pool.length;
  // 合格基準（30/50＝60%）を目安にした簡易判定
  const passLikely = pct >= 60;

  return (
    <div>
      <section className="card p-6 text-center mb-6">
        <p className="text-xs text-[color:var(--c-text-sub)] mb-1">あなたのスコア</p>
        <p className="text-4xl font-bold font-serif mb-1" style={{ color: "var(--c-accent)" }}>
          {correctCount} <span className="text-2xl text-[color:var(--c-text-sub)]">/ {pool.length}</span>
        </p>
        <p className="text-sm font-bold" style={{ color: passLikely ? "#15803d" : "#b45309" }}>
          正答率 {pct}%
        </p>
        <p className="text-xs text-[color:var(--c-text-sub)] mt-2">
          {allPerfect
            ? "全問正解！この調子です。"
            : passLikely
              ? "合格ラインの目安（約60%）は超えています。弱点を詰めましょう。"
              : "合格ラインの目安（約60%）まであと一歩。苦手分野から固めましょう。"}
        </p>
      </section>

      {/* 分野別の正答率 */}
      <section className="card p-5 mb-6">
        <h3 className="text-sm font-bold mb-4" style={{ color: "var(--c-accent-ink)" }}>分野別の正答率</h3>
        <div className="space-y-3">
          {fieldsSorted.map(([field, s]) => {
            const p = Math.round((s.correct / s.total) * 100);
            return (
              <div key={field}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[color:var(--c-text)]">{field}</span>
                  <span className="text-[color:var(--c-text-sub)]">{s.correct}/{s.total}・{p}%</span>
                </div>
                <div className="h-2 rounded-full bg-[color:var(--c-bg-alt)] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${p}%`, background: p >= 60 ? "#15803d" : "#dc2626" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 弱点判定＋送客（最高intent面） */}
      {!allPerfect && weakest && (
        <aside className="card p-5 mb-6" style={{ borderLeft: "4px solid var(--c-accent)" }}>
          <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-3">
            いちばんの弱点は <strong style={{ color: "var(--c-accent-ink)" }}>{weakest[0]}</strong>
            （{weakest[1].correct}/{weakest[1].total}正解）。ここを重点的に固めると伸びます。
          </p>
          <div className="text-xs text-[color:var(--c-text-sub)] flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="tracking-wider border border-[color:var(--c-border)] px-1.5 py-0.5 rounded text-[10px]">広告</span>
            <span>苦手分野を体系的に補うなら</span>
            <FreeLeadCTA exam={exam} placement="mock_result" />
            <AffiliateLink
              href={EXAM_AFFILIATE[exam].href}
              course={EXAM_AFFILIATE[exam].course}
              placement="mock_result"
              className="text-blue-700 hover:underline font-medium"
            >
              {EXAM_AFFILIATE[exam].label} →
            </AffiliateLink>
          </div>
        </aside>
      )}

      {/* Studio 送客（間違えた問題の自動復習という文脈一致） */}
      <aside className="mb-6 p-4 rounded-lg border border-indigo-200 bg-indigo-50">
        <p className="text-xs font-bold mb-1 text-indigo-900">間違えた問題だけ、自動で復習</p>
        <p className="text-xs leading-relaxed mb-2 text-indigo-900/80">
          今回の取りこぼしを忘れる前に。資格名や手元の教材から作った問題を忘却曲線で自動復習できる姉妹サービス「シカクモン Studio」。
        </p>
        <StudioLink
          placement="mock_result"
          exam={exam}
          className="text-xs font-bold inline-flex items-center gap-1 no-underline text-indigo-600 hover:underline"
        >
          シカクモン Studio を無料で試す →
        </StudioLink>
      </aside>

      {/* 間違えた問題の復習リンク */}
      {correctCount < pool.length && (
        <section className="card p-5 mb-6">
          <h3 className="text-sm font-bold mb-3 text-red-700">間違えた問題（{pool.length - correctCount}問）</h3>
          <div className="space-y-1">
            {pool.map((q, i) =>
              answers[i] !== q.correctAnswer ? (
                <a
                  key={q.slug}
                  href={`${questionPathPrefix}${q.slug}/`}
                  className="block py-2 text-sm text-[color:var(--c-text)] no-underline hover:text-[color:var(--c-accent)] border-b border-[color:var(--c-border)] last:border-b-0"
                >
                  <span className="text-xs text-[color:var(--c-text-sub)] mr-2">{q.field}</span>
                  {q.questionText.slice(0, 48)}… →
                </a>
              ) : null,
            )}
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={start} className="btn-accent">
          もう一度（別の{count}問）→
        </button>
        <a href="/study/" className="inline-flex items-center text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-accent)]">
          学習履歴を見る →
        </a>
      </div>
    </div>
  );
}
