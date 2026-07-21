"use client";

/**
 * 模擬試験の受験画面(全資格共通)。
 *
 * /{exam}/mock/ の腕試し(ランダム出題・時間無制限)と違い、こちらは本試験再現:
 * 固定問題・カウントダウン・本試験の合格基準で合否判定。有料化前の需要検証面のため、
 * 開始/完了/時間切れを GA イベントで計測する(判断基準: 4週間で開始30件・完了率50%)。
 *
 * 途中リロード対策として解答状況を localStorage に保存する。制限時間は
 * startedAt 起点の実時間で進む(リロードしても止まらない＝本番と同じ)。
 *
 * - sections: 個人情報保護士のような「課題ごとに70%」の試験用。指定時は
 *   全セクションの基準クリアで合格判定になる。
 * - pointsPerQuestion: ビジ法/福祉住環境のような100点満点試験用の換算点表示。
 * - explanationHtml: 未指定の問題は結果画面で問題ページへのリンクのみ表示
 *   (80問超の試験はページ重量対策で詳解を同梱しない)。
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";
import { recordResult, type ExamSlug } from "@/lib/study-progress";

export interface MoshiQuestion {
  slug: string;
  questionText: string;
  choices: string[];
  correctAnswer: number; // 1始まり
  field: string;
  explanationHtml?: string;
}

export interface MoshiSection {
  label: string;     // 例 "課題Ⅰ（個人情報保護の理解）"
  start: number;     // 0始まりの開始index
  count: number;
  passCount: number; // このセクション単独の合格基準(問数)
}

interface Props {
  exam: ExamSlug;
  round: number;
  sessionKey: string;         // localStorage キー(資格・回ごとに一意)
  questions: MoshiQuestion[]; // 固定ペーパー順
  timeLimitMin: number;
  passCount: number;          // 総合の合格基準(問数)
  passLabel: string;          // 例 "70%（30問中21問）以上"
  choiceLabel: string;        // 例 "3肢択一"
  questionPathPrefix: string; // 例 "/chizai/q/"
  topPath: string;            // 例 "/chizai/"
  sections?: MoshiSection[];
  pointsPerQuestion?: number;
}

interface SavedSession {
  startedAt: number;
  answers: (number | null)[];
}

const STUDIO_URL =
  "https://studio.shikakumon.com/?utm_source=shikakumon&utm_medium=moshi_result";

function loadSession(key: string): SavedSession | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const s = JSON.parse(raw) as SavedSession;
    if (typeof s.startedAt !== "number" || !Array.isArray(s.answers)) return null;
    return s;
  } catch {
    return null;
  }
}

function saveSession(key: string, s: SavedSession): void {
  try {
    localStorage.setItem(key, JSON.stringify(s));
  } catch {
    /* quota exceeded etc — silently ignore */
  }
}

function clearSession(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function formatRemaining(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function MoshiExam({
  exam,
  round,
  sessionKey,
  questions,
  timeLimitMin,
  passCount,
  passLabel,
  choiceLabel,
  questionPathPrefix,
  topPath,
  sections,
  pointsPerQuestion,
}: Props) {
  const limitMs = timeLimitMin * 60 * 1000;

  const [phase, setPhase] = useState<"intro" | "running" | "done">("intro");
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [idx, setIdx] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [remainingSec, setRemainingSec] = useState(timeLimitMin * 60);
  const [resumable, setResumable] = useState<SavedSession | null>(null);
  const [expiredNote, setExpiredNote] = useState(false);
  const [result, setResult] = useState<{ timeout: boolean; elapsedMin: number } | null>(null);
  const submittedRef = useRef(false);

  // 中断セッションの検出(intro 表示用)。期限切れは破棄して注記だけ出す
  useEffect(() => {
    const saved = loadSession(sessionKey);
    if (!saved) return;
    if (Date.now() - saved.startedAt < limitMs) {
      setResumable(saved);
    } else {
      clearSession(sessionKey);
      setExpiredNote(true);
    }
  }, [sessionKey, limitMs]);

  const isPassed = useCallback(
    (ans: (number | null)[]) => {
      if (sections && sections.length > 0) {
        return sections.every((sec) => {
          let c = 0;
          for (let i = sec.start; i < sec.start + sec.count; i++) {
            if (ans[i] === questions[i].correctAnswer) c++;
          }
          return c >= sec.passCount;
        });
      }
      const score = questions.reduce((s, q, i) => s + (ans[i] === q.correctAnswer ? 1 : 0), 0);
      return score >= passCount;
    },
    [questions, sections, passCount],
  );

  const submit = useCallback(
    (timeout: boolean) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      // 学習履歴へ反映(未解答はスキップ＝腕試しと同じ扱い)
      questions.forEach((q, i) => {
        const sel = answers[i];
        if (sel != null) recordResult(exam, q.slug, sel === q.correctAnswer);
      });
      const score = questions.reduce(
        (s, q, i) => s + (answers[i] === q.correctAnswer ? 1 : 0),
        0,
      );
      const elapsedMin = startedAt
        ? Math.min(timeLimitMin, Math.round((Date.now() - startedAt) / 60000))
        : timeLimitMin;
      sendGAEvent("event", "moshi_complete", {
        exam,
        round,
        score,
        passed: isPassed(answers) ? "yes" : "no",
        timeout: timeout ? "yes" : "no",
        minutes: elapsedMin,
      });
      setResult({ timeout, elapsedMin });
      clearSession(sessionKey);
      setPhase("done");
      window.scrollTo({ top: 0 });
    },
    [questions, answers, startedAt, timeLimitMin, exam, round, sessionKey, isPassed],
  );

  // カウントダウン。実時間(startedAt 起点)なのでリロードしても縮み続ける
  useEffect(() => {
    if (phase !== "running" || startedAt == null) return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((startedAt + limitMs - Date.now()) / 1000));
      setRemainingSec(left);
      if (left <= 0) submit(true);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [phase, startedAt, limitMs, submit]);

  function start(mode: "new" | "resume") {
    const now = Date.now();
    if (mode === "resume" && resumable) {
      setAnswers(questions.map((_, i) => resumable.answers[i] ?? null));
      setStartedAt(resumable.startedAt);
      const firstBlank = resumable.answers.findIndex((a) => a == null);
      setIdx(firstBlank >= 0 && firstBlank < questions.length ? firstBlank : 0);
    } else {
      const blank = new Array(questions.length).fill(null) as (number | null)[];
      setAnswers(blank);
      setStartedAt(now);
      setIdx(0);
      saveSession(sessionKey, { startedAt: now, answers: blank });
    }
    submittedRef.current = false;
    setResult(null);
    setPhase("running");
    sendGAEvent("event", "moshi_start", { exam, round, mode });
    window.scrollTo({ top: 0 });
  }

  function select(choiceNum: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = choiceNum;
      if (startedAt != null) saveSession(sessionKey, { startedAt, answers: next });
      return next;
    });
  }

  function confirmSubmit() {
    const unanswered = answers.filter((a) => a == null).length;
    if (
      unanswered > 0 &&
      !window.confirm(`未解答が${unanswered}問あります。未解答は不正解として採点されます。このまま採点しますか？`)
    ) {
      return;
    }
    submit(false);
  }

  /* ===================== Intro ===================== */
  if (phase === "intro") {
    return (
      <div className="card p-6">
        <h2 className="text-lg font-bold font-serif mb-3" style={{ color: "var(--c-accent-ink)" }}>
          受験上の注意
        </h2>
        <ul className="text-sm text-[color:var(--c-text)] leading-relaxed mb-4 space-y-1.5 list-disc pl-5">
          <li><strong>{questions.length}問・{timeLimitMin}分・{choiceLabel}</strong>です。開始と同時にタイマーが動き出します。</li>
          <li>合格基準は<strong>{passLabel}</strong>。終了後に合否判定と全問の解説が出ます。</li>
          <li>解答中は正解・解説を確認できません。問題番号の一覧からいつでも前の問題に戻れます。</li>
          <li>途中でページを閉じても解答は保存され再開できます。ただし<strong>制限時間は止まりません</strong>(本番と同じ条件です)。</li>
          <li>時間切れになった時点で自動的に採点されます。未解答は不正解扱いです。</li>
        </ul>
        {expiredNote && (
          <p className="text-xs text-amber-700 mb-4">
            前回の途中データは制限時間を過ぎていたため無効になりました。最初からの受験になります。
          </p>
        )}
        {resumable ? (
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => start("resume")} className="btn-accent">
              続きから再開する(残り {formatRemaining(Math.max(0, Math.ceil((resumable.startedAt + limitMs - Date.now()) / 1000)))})→
            </button>
            <button
              onClick={() => {
                clearSession(sessionKey);
                setResumable(null);
                start("new");
              }}
              className="text-sm text-[color:var(--c-text-sub)] underline hover:no-underline"
            >
              破棄して最初から
            </button>
          </div>
        ) : (
          <button onClick={() => start("new")} className="btn-accent">
            試験を開始する({timeLimitMin}分)→
          </button>
        )}
      </div>
    );
  }

  /* ===================== Running ===================== */
  if (phase === "running") {
    const q = questions[idx];
    const selected = answers[idx];
    const answeredCount = answers.filter((a) => a != null).length;
    const isLast = idx === questions.length - 1;
    const timeWarning = remainingSec <= 5 * 60;
    const gridCols = questions.length > 60 ? "grid-cols-10 sm:grid-cols-20" : "grid-cols-10";

    return (
      <div>
        {/* タイマー＋進捗(スクロールしても見えるよう sticky) */}
        <div
          className="sticky top-0 z-10 -mx-4 px-4 py-2 mb-4 border-b border-[color:var(--c-border)]"
          style={{ background: "var(--c-bg)" }}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-xs text-[color:var(--c-text-sub)]">
              問 {idx + 1} / {questions.length}　解答済 {answeredCount}
            </span>
            <span
              className="font-bold tabular-nums"
              style={{ color: timeWarning ? "#dc2626" : "var(--c-accent-ink)" }}
            >
              残り {formatRemaining(remainingSec)}
            </span>
          </div>
        </div>

        {/* 問題番号ナビ(マークシート風) */}
        <div className={`grid ${gridCols} gap-1 mb-5`}>
          {questions.map((_, i) => {
            const isCurrent = i === idx;
            const isAnswered = answers[i] != null;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                className="h-7 rounded text-[11px] font-medium border transition-colors"
                style={{
                  background: isAnswered ? "var(--c-accent)" : "var(--c-surface)",
                  color: isAnswered ? "#fff" : "var(--c-text-sub)",
                  borderColor: isCurrent ? "var(--c-accent-ink)" : "var(--c-border)",
                  boxShadow: isCurrent ? "0 0 0 1px var(--c-accent-ink)" : undefined,
                }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <section className="card p-5 mb-6" style={{ borderLeft: "4px solid var(--c-accent)" }}>
          <p className="text-xs text-[color:var(--c-text-sub)] mb-2">{q.field}</p>
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
          <div className="flex items-center gap-3">
            {!isLast && (
              <button type="button" onClick={() => setIdx((v) => v + 1)} className="btn-accent">
                次へ →
              </button>
            )}
            <button
              type="button"
              onClick={confirmSubmit}
              className={
                isLast
                  ? "btn-accent"
                  : "text-sm px-3 py-2 rounded-lg border border-[color:var(--c-border)] text-[color:var(--c-text-sub)] hover:text-[color:var(--c-accent)]"
              }
            >
              採点する({answeredCount}/{questions.length})
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ===================== Done (合否判定・詳解) ===================== */
  const score = questions.reduce((s, q, i) => s + (answers[i] === q.correctAnswer ? 1 : 0), 0);
  const pct = Math.round((score / questions.length) * 100);
  const passed = isPassed(answers);
  const passPct = Math.round((passCount / questions.length) * 100);

  const sectionStats = (sections ?? []).map((sec) => {
    let c = 0;
    for (let i = sec.start; i < sec.start + sec.count; i++) {
      if (answers[i] === questions[i].correctAnswer) c++;
    }
    return { ...sec, correct: c, passed: c >= sec.passCount };
  });

  const fieldStats: Record<string, { correct: number; total: number }> = {};
  questions.forEach((q, i) => {
    const fs = fieldStats[q.field] ?? (fieldStats[q.field] = { correct: 0, total: 0 });
    fs.total++;
    if (answers[i] === q.correctAnswer) fs.correct++;
  });
  const fieldsSorted = Object.entries(fieldStats).sort(
    (a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total,
  );
  const weakest = fieldsSorted.find(([, s]) => s.correct < s.total);

  return (
    <div>
      <section className="card p-6 text-center mb-6">
        {result?.timeout && (
          <p className="text-xs font-bold text-red-600 mb-2">時間切れのため自動採点しました</p>
        )}
        <p className="text-xs text-[color:var(--c-text-sub)] mb-1">あなたの得点</p>
        <p className="text-4xl font-bold font-serif mb-1" style={{ color: "var(--c-accent)" }}>
          {score} <span className="text-2xl text-[color:var(--c-text-sub)]">/ {questions.length}</span>
        </p>
        <p className="text-sm font-bold mb-2" style={{ color: passed ? "#15803d" : "#b45309" }}>
          正答率 {pct}%
          {pointsPerQuestion ? `・換算 ${score * pointsPerQuestion}点/100点` : ""}
        </p>
        <p
          className="inline-block text-sm font-bold px-4 py-1.5 rounded-full"
          style={{
            background: passed ? "#dcfce7" : "#fef3c7",
            color: passed ? "#15803d" : "#b45309",
          }}
        >
          {passed ? "判定: 合格圏" : "判定: あと一歩"}
        </p>
        <p className="text-xs text-[color:var(--c-text-sub)] mt-3">
          合格基準は{passLabel}。所要時間 約{result?.elapsedMin ?? timeLimitMin}分。
          ※この判定はオリジナル問題による目安です。
        </p>
      </section>

      {/* 課題(セクション)別の判定 */}
      {sectionStats.length > 0 && (
        <section className="card p-5 mb-6">
          <h3 className="text-sm font-bold mb-4" style={{ color: "var(--c-accent-ink)" }}>課題別の判定</h3>
          <div className="space-y-3">
            {sectionStats.map((sec) => (
              <div key={sec.label} className="flex items-center justify-between text-sm">
                <span className="text-[color:var(--c-text)]">{sec.label}</span>
                <span className="font-bold" style={{ color: sec.passed ? "#15803d" : "#dc2626" }}>
                  {sec.correct}/{sec.count}(基準 {sec.passCount}) {sec.passed ? "クリア" : "未達"}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[color:var(--c-text-sub)] mt-3">
            本試験はすべての課題で基準を満たす必要があります。
          </p>
        </section>
      )}

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
                    style={{ width: `${p}%`, background: p >= passPct ? "#15803d" : "#dc2626" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 弱点判定＋送客(最高intent面) */}
      {weakest && (
        <aside className="card p-5 mb-6" style={{ borderLeft: "4px solid var(--c-accent)" }}>
          <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-3">
            いちばんの弱点は <strong style={{ color: "var(--c-accent-ink)" }}>{weakest[0]}</strong>
            ({weakest[1].correct}/{weakest[1].total}正解)。本試験まで、ここを重点的に固めると得点が伸びます。
          </p>
          <div className="text-xs text-[color:var(--c-text-sub)] flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="tracking-wider border border-[color:var(--c-border)] px-1.5 py-0.5 rounded text-[10px]">広告</span>
            <span>苦手分野を体系的に補うなら</span>
            <FreeLeadCTA exam={exam} placement="moshi_result" />
            <AffiliateLink
              href={EXAM_AFFILIATE[exam].href}
              course={EXAM_AFFILIATE[exam].course}
              placement="moshi_result"
              className="text-blue-700 hover:underline font-medium"
            >
              {EXAM_AFFILIATE[exam].label} →
            </AffiliateLink>
          </div>
        </aside>
      )}

      {/* Studio 送客 */}
      <aside className="mb-6 p-4 rounded-lg border border-indigo-200 bg-indigo-50">
        <p className="text-xs font-bold mb-1 text-indigo-900">間違えた問題だけ、自動で復習</p>
        <p className="text-xs leading-relaxed mb-2 text-indigo-900/80">
          今回の取りこぼしを忘れる前に。資格名や手元の教材から作った問題を忘却曲線で自動復習できる姉妹サービス「シカクモン Studio」。
        </p>
        <a
          href={STUDIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold inline-flex items-center gap-1 no-underline text-indigo-600 hover:underline"
        >
          シカクモン Studio を無料で試す →
        </a>
      </aside>

      {/* 全問詳解 */}
      <section className="mb-6">
        <h3 className="text-base font-bold mb-4 font-serif" style={{ color: "var(--c-accent-ink)" }}>
          全問詳解
        </h3>
        <div className="space-y-3">
          {questions.map((q, i) => {
            const sel = answers[i];
            const correct = sel === q.correctAnswer;
            return (
              <details key={q.slug} className="card p-4">
                <summary className="cursor-pointer text-sm leading-relaxed list-none">
                  <span
                    className="inline-block font-bold mr-2"
                    style={{ color: correct ? "#15803d" : "#dc2626" }}
                  >
                    {correct ? "○" : "×"} 問{i + 1}
                  </span>
                  <span className="text-xs text-[color:var(--c-text-sub)] mr-2">{q.field}</span>
                  <span className="text-[color:var(--c-text)]">{q.questionText.slice(0, 60)}{q.questionText.length > 60 ? "…" : ""}</span>
                </summary>
                <div className="mt-3 pt-3 border-t border-[color:var(--c-border)]">
                  <p className="text-xs text-[color:var(--c-text-sub)] mb-3">
                    あなたの解答: {sel != null ? `${sel}. ${q.choices[sel - 1]}` : "未解答"}
                    {!correct && (
                      <>
                        <br />
                        正解: {q.correctAnswer}. {q.choices[q.correctAnswer - 1]}
                      </>
                    )}
                  </p>
                  {q.explanationHtml ? (
                    <>
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: q.explanationHtml }} />
                      <a
                        href={`${questionPathPrefix}${q.slug}/`}
                        className="inline-block mt-2 text-xs text-[color:var(--c-text-sub)] underline hover:no-underline"
                      >
                        この問題のページで復習する →
                      </a>
                    </>
                  ) : (
                    <a
                      href={`${questionPathPrefix}${q.slug}/`}
                      className="inline-block text-xs text-blue-700 underline hover:no-underline"
                    >
                      詳しい解説を読む(問題ページへ)→
                    </a>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </section>

      {/* 第2回以降の予告(有料化の布石) */}
      <p className="text-xs text-[color:var(--c-text-sub)] mb-6">
        第2回・第3回の模擬試験は現在制作中です。
      </p>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => start("new")} className="btn-accent">
          もう一度受験する →
        </button>
        <a href="/study/" className="inline-flex items-center text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-accent)]">
          学習履歴を見る →
        </a>
        <a href={topPath} className="inline-flex items-center text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-accent)]">
          資格トップへ →
        </a>
      </div>
    </div>
  );
}
