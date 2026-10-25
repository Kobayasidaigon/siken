"use client";
/**
 * 「試験前の10問」の受験画面。2026-10-25 追加。設計は docs/share-campaign-design.md の MVP、仕組みは lib/shikenmae.ts。
 *
 * - 全員が同じ順で1問ずつ解く。解いている間は正誤を出さず、10問目のあとにまとめて採点する。
 * - 窓(試験の7日前〜試験日)の判定は、日本時間でブラウザが行う(ページはビルド時に作るため)。
 * - 窓の間の1回目だけ、学習履歴に記録し、端末内に結果を残し、送るボタンを出し、GA4 に送る。
 *   2回目(「もう一度解く」)は、どれもしない。窓が閉じたあとはアーカイブとして何度でも解ける(学習履歴には記録する)。
 * - 途中の解答は sessionStorage に置く(同じタブで戻れば続きから。タブを閉じると最初から)。
 * - MockExam / MoshiExam は流用しない。前者は毎回問題を並べ替え、後者は模試の計測が混ざるため。
 * - X・LINE へは button から window.open で開く。投稿文には問題ごとの○×が入るので、GA4 の拡張計測の
 *   「離脱クリック」が a 要素の href(投稿文)を拾わないようにするため(設計書の「段階0」)。
 */
import { useEffect, useRef, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { recordResult } from "@/lib/study-progress";
import type { ShikenmaeQuestion } from "@/lib/shikenmae-data";
import {
  SHIKENMAE_SIZE,
  bitsText,
  dateKey,
  loadShikenmaeRecord,
  mdJa,
  mdSlash,
  saveShikenmaeRecord,
  shareText,
  shikenmaePath,
  shikenmaePhase,
  windowStart,
  type ShareChannel,
  type ShikenmaeEvent,
  type ShikenmaePhase,
  type ShikenmaeRecord,
} from "@/lib/shikenmae";

type RunMode = "first" | "retry" | "archive";
type View = "loading" | "before" | "previous" | "running" | "result";

interface Props {
  event: ShikenmaeEvent;
  questions: ShikenmaeQuestion[];
  /** 点つきの着地ページ(/shikenmae/<資格>/<日付>/<点>/)のときの、投稿した人の点 */
  posterScore?: number | null;
  /** 第1回模試のページ */
  moshiPath: string;
  /** 分野名 → 分野ページ */
  fieldHrefs: Record<string, string>;
  /** 次の試験前の10問(結果画面で案内する) */
  next?: { examName: string; date: string; topPath: string } | null;
}

function track(name: string, params: Record<string, string | number>) {
  try {
    sendGAEvent("event", name, params);
  } catch {
    /* GA未ロードでも解ける */
  }
}

export default function ShikenmaeRun({ event, questions, posterScore = null, moshiPath, fieldHrefs, next }: Props) {
  const runKey = `shikakumon-shikenmae-run-${event.exam}-${dateKey(event.date)}`;
  const [view, setView] = useState<View>("loading");
  const [phase, setPhase] = useState<ShikenmaePhase>("open");
  const [mode, setMode] = useState<RunMode>("first");
  const [answers, setAnswers] = useState<(number | null)[]>(() => new Array(questions.length).fill(null));
  const [idx, setIdx] = useState(0);
  const [record, setRecord] = useState<ShikenmaeRecord | null>(null);
  const started = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);
  const shared = posterScore != null ? 1 : 0;

  // 窓の判定と、記録・途中の解答の読み込み(ブラウザでだけ行う)
  useEffect(() => {
    const p = shikenmaePhase(event);
    setPhase(p);
    const rec = loadShikenmaeRecord(event);
    setRecord(rec);
    track("shikenmae_view", {
      exam: event.exam,
      placement: p === "closed" ? "archive" : shared ? "shared" : "event",
    });
    if (p === "before") {
      setView("before");
      return;
    }
    const m: RunMode = p === "closed" ? "archive" : rec ? "retry" : "first";
    // 同じタブで途中まで解いていれば続きから
    try {
      const saved = JSON.parse(sessionStorage.getItem(runKey) || "null");
      if (saved && saved.mode === m && Array.isArray(saved.answers) && saved.answers.length === questions.length) {
        setMode(m);
        setAnswers(saved.answers);
        setIdx(Math.min(Math.max(0, saved.idx ?? 0), questions.length - 1));
        started.current = true;
        setView("running");
        return;
      }
    } catch {
      /* 読めなければ最初から */
    }
    setMode(m);
    setView(m === "retry" ? "previous" : "running");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function saveRun(nextAnswers: (number | null)[], nextIdx: number, m: RunMode = mode) {
    try {
      sessionStorage.setItem(runKey, JSON.stringify({ mode: m, answers: nextAnswers, idx: nextIdx }));
    } catch {
      /* 保存できなくても解ける */
    }
  }

  function select(num: number) {
    const a = [...answers];
    a[idx] = num;
    setAnswers(a);
    saveRun(a, idx);
    if (!started.current) {
      started.current = true;
      if (mode !== "retry") track("shikenmae_start", { exam: event.exam });
    }
  }

  function go(i: number) {
    setIdx(i);
    saveRun(answers, i);
    topRef.current?.scrollIntoView({ block: "start" });
  }

  function retry() {
    const blank = new Array(questions.length).fill(null);
    setMode("retry");
    setAnswers(blank);
    setIdx(0);
    started.current = false;
    saveRun(blank, 0, "retry");
    setView("running");
    topRef.current?.scrollIntoView({ block: "start" });
  }

  function finish() {
    const bits = questions.map((q, i) => (answers[i] === q.correctAnswer ? "1" : "0")).join("");
    const score = [...bits].filter((b) => b === "1").length;
    try {
      sessionStorage.removeItem(runKey);
    } catch {
      /* 消せなくても次の読み込みで上書きされる */
    }
    if (mode !== "retry") {
      // 1回目とアーカイブは学習履歴に記録する(問題ページで解いたのと同じ扱い)
      questions.forEach((q, i) => {
        if (answers[i] != null) recordResult(event.exam, q.slug, answers[i] === q.correctAnswer);
      });
      track("shikenmae_complete", {
        exam: event.exam,
        size: questions.length,
        correct: score,
        score_bucket: Math.round((score / questions.length) * 20) * 5,
        mode: mode === "archive" ? "archive" : "window",
        shared,
      });
    }
    if (mode === "first") {
      const rec = { bits, score, at: Date.now() };
      saveShikenmaeRecord(event, rec);
      setRecord(rec);
    }
    setView("result");
    topRef.current?.scrollIntoView({ block: "start" });
  }

  if (view === "loading") {
    // サーバーで描く HTML。問題1の高さぶんを確保して、表示のあとに下の要素が大きく動かないようにする
    return <div ref={topRef} className="min-h-[420px] scroll-mt-20" aria-busy="true" />;
  }

  if (view === "before") {
    return (
      <div ref={topRef} className="card p-6 text-center scroll-mt-20">
        <p className="text-base font-bold text-[color:var(--c-ink)]">{mdJa(windowStart(event))}から解けます</p>
        <p className="text-sm text-[color:var(--c-text-sub)] mt-2">試験日は{mdJa(event.date)}です。</p>
      </div>
    );
  }

  const current = mode === "first" || mode === "archive" ? null : record;

  if (view === "previous" && record) {
    return (
      <div ref={topRef} className="scroll-mt-20">
        <p className="text-sm text-[color:var(--c-text-sub)] mb-3">このブラウザで解いた結果です（1回目だけを残しています）。</p>
        <Result
          event={event}
          questions={questions}
          bits={record.bits}
          answers={null}
          posterScore={posterScore}
          canShare
          fieldHrefs={fieldHrefs}
          moshiPath={moshiPath}
          next={next}
          archive={false}
        />
        <div className="mt-6">
          <button type="button" onClick={retry} className="text-sm underline text-[color:var(--c-text-sub)] hover:no-underline">
            もう一度解く（2回目は学習履歴にも、この記録にも残りません）
          </button>
        </div>
      </div>
    );
  }

  if (view === "result") {
    const bits = questions.map((q, i) => (answers[i] === q.correctAnswer ? "1" : "0")).join("");
    return (
      <div ref={topRef} className="scroll-mt-20">
        {mode === "retry" && (
          <p className="text-sm text-[color:var(--c-text-sub)] mb-3">2回目の結果です。学習履歴と記録には残していません。</p>
        )}
        <Result
          event={event}
          questions={questions}
          bits={bits}
          answers={answers}
          posterScore={posterScore}
          canShare={mode === "first"}
          fieldHrefs={fieldHrefs}
          moshiPath={moshiPath}
          next={next}
          archive={mode === "archive"}
        />
        {mode === "retry" && current && (
          <p className="text-xs text-[color:var(--c-text-sub)] mt-4">1回目の結果: 10問中{current.score}問</p>
        )}
      </div>
    );
  }

  // 解いている途中
  const q = questions[idx];
  const isLast = idx === questions.length - 1;
  return (
    <div ref={topRef} className="scroll-mt-20">
      {phase === "closed" && idx === 0 && answers.every((a) => a == null) && (
        <p className="text-sm text-[color:var(--c-text-sub)] mb-4">
          {mdJa(event.date)}の試験の前に公開した10問です。答えと解説つきで何度でも解けます。
        </p>
      )}
      <div className="card p-5">
        <p className="text-xs text-[color:var(--c-text-sub)] mb-2">
          問{idx + 1} / {questions.length}
          <span className="ml-2">{q.field}</span>
        </p>
        <p className="text-sm text-[color:var(--c-text)] leading-relaxed whitespace-pre-wrap mb-4">{q.questionText}</p>
        <ol className="space-y-2 mb-4">
          {q.choices.map((choice, i) => {
            const num = i + 1;
            const on = answers[idx] === num;
            return (
              <li
                key={i}
                onClick={() => select(num)}
                className={`text-sm px-3 py-2.5 rounded-lg transition-colors flex items-start gap-2 cursor-pointer ${
                  on
                    ? "bg-blue-50 border border-blue-300 text-blue-800 font-medium"
                    : "bg-slate-50 text-slate-600 border border-transparent hover:bg-slate-100"
                }`}
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
            onClick={() => go(idx - 1)}
            disabled={idx === 0}
            className="text-sm text-[color:var(--c-text-sub)] underline disabled:opacity-40 disabled:no-underline"
          >
            前へ
          </button>
          {isLast ? (
            <button
              type="button"
              onClick={finish}
              disabled={answers.some((a) => a == null)}
              className="btn-accent disabled:opacity-50"
              title={answers.some((a) => a == null) ? "すべての問題に答えると採点できます" : undefined}
            >
              採点する（{answers.filter((a) => a != null).length}/{questions.length}）
            </button>
          ) : (
            <button type="button" onClick={() => go(idx + 1)} disabled={answers[idx] == null} className="btn-accent disabled:opacity-50">
              次へ →
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-[color:var(--c-text-sub)] mt-3">解いている間は正誤を出しません。10問目のあとにまとめて採点します。</p>
    </div>
  );
}

function Result({
  event,
  questions,
  bits,
  answers,
  posterScore,
  canShare,
  fieldHrefs,
  moshiPath,
  next,
  archive,
}: {
  event: ShikenmaeEvent;
  questions: ShikenmaeQuestion[];
  bits: string;
  answers: (number | null)[] | null;
  posterScore: number | null;
  canShare: boolean;
  fieldHrefs: Record<string, string>;
  moshiPath: string;
  next?: { examName: string; date: string; topPath: string } | null;
  archive: boolean;
}) {
  const score = [...bits].filter((b) => b === "1").length;
  const shared = posterScore != null ? 1 : 0;
  const wrongFields = [...new Set(questions.filter((_, i) => bits[i] !== "1").map((q) => q.field))];

  return (
    <div>
      {/* スクショ向けの部分。幅375pxの1画面に収める。画像だけで広がっても入口が残るよう URL を入れる */}
      <section className="card p-5 text-center mb-5">
        <p className="text-sm font-bold text-[color:var(--c-ink)]">{event.examName}</p>
        <p className="text-xs text-[color:var(--c-text-sub)] mt-1">試験前の10問（{mdSlash(event.date)} 試験）</p>
        <p className="text-3xl font-bold font-serif mt-3" style={{ color: "var(--c-accent)" }}>
          10問中{score}問
          {score === SHIKENMAE_SIZE && <span className="text-base ml-1">（全問正解）</span>}
        </p>
        <p className="text-2xl tracking-widest mt-2 font-mono text-[color:var(--c-ink)]" aria-label={`正誤 ${bitsText(bits)}`}>
          {bitsText(bits)}
        </p>
        <p className="text-[11px] text-[color:var(--c-text-sub)] mt-3">
          シカクモン shikakumon.com{shikenmaePath(event)}
        </p>
      </section>

      {posterScore != null && (
        <p className="text-sm text-[color:var(--c-text)] mb-5">
          投稿した人（自己採点）: 10問中{posterScore}問
          <span className="block text-xs text-[color:var(--c-text-sub)] mt-1">この点は、投稿した人のブラウザで採点したものです。</span>
        </p>
      )}

      {canShare && <ShareBox event={event} bits={bits} score={score} shared={shared} />}

      {/* 問ごとの内訳と解説。間違えた問題は最初から開いておく */}
      <section className="mb-6">
        <h2 className="text-sm font-bold text-[color:var(--c-ink)] mb-3">問ごとの結果と解説</h2>
        <div className="space-y-2">
          {questions.map((q, i) => {
            const ok = bits[i] === "1";
            return (
              <details key={q.slug} open={!ok} className="card p-4">
                <summary className="cursor-pointer text-sm">
                  <span className={`font-bold mr-2 ${ok ? "text-green-700" : "text-red-700"}`}>{ok ? "○" : "×"}</span>
                  問{i + 1}
                  <span className="text-xs text-[color:var(--c-text-sub)] ml-2">{q.field}</span>
                </summary>
                <p className="text-sm text-[color:var(--c-text)] leading-relaxed mt-3 whitespace-pre-wrap">{q.questionText}</p>
                <ol className="mt-2 space-y-1">
                  {q.choices.map((c, j) => {
                    const num = j + 1;
                    const isCorrect = num === q.correctAnswer;
                    const chosen = answers ? answers[i] === num : false;
                    return (
                      <li
                        key={j}
                        className={`text-xs px-2 py-1.5 rounded ${
                          isCorrect ? "bg-green-50 text-green-800 font-medium" : chosen ? "bg-red-50 text-red-700" : "text-slate-500"
                        }`}
                      >
                        {num}. {c}
                        {isCorrect && "（正解）"}
                        {chosen && !isCorrect && "（あなたの答え）"}
                      </li>
                    );
                  })}
                </ol>
                <div className="prose prose-sm max-w-none mt-3" dangerouslySetInnerHTML={{ __html: q.explanationHtml }} />
                <a href={`/${event.exam}/q/${q.slug}/`} className="inline-block text-xs underline mt-2">
                  この問題のページで復習する →
                </a>
              </details>
            );
          })}
        </div>
      </section>

      {/* 次へ */}
      <section className="mb-6 space-y-2 text-sm">
        {archive &&
          wrongFields.map((f) =>
            fieldHrefs[f] ? (
              <a
                key={f}
                href={fieldHrefs[f]}
                onClick={() => track("practice_link_click", { exam: event.exam, kind: "field", placement: "shikenmae_result" })}
                className="block underline"
              >
                「{f}」の問題を解き直す →
              </a>
            ) : null,
          )}
        <a
          href={moshiPath}
          onClick={() => track("practice_link_click", { exam: event.exam, kind: "moshi", placement: "shikenmae_result" })}
          className="block underline"
        >
          模擬試験 第1回（無料）を通しで解く →
        </a>
        {next && (
          <a
            href={next.topPath}
            onClick={() => track("practice_link_click", { exam: event.exam, kind: "next_exam", placement: "shikenmae_result" })}
            className="block underline"
          >
            {next.examName}（{mdSlash(next.date)}）の試験前の10問は {mdSlash(windowStart({ ...event, date: next.date }))} から →
          </a>
        )}
      </section>

      <p className="text-xs text-[color:var(--c-text-sub)]">
        この記録は、いま開いているブラウザに保存されます。X や LINE の中で開いている場合は、そのアプリの中にだけ残ります。
      </p>
    </div>
  );
}

function ShareBox({ event, bits, score, shared }: { event: ShikenmaeEvent; bits: string; score: number; shared: number }) {
  const [withScore, setWithScore] = useState(true);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const result = withScore ? { score, bits } : null;

  function send(channel: ShareChannel) {
    const text = shareText(event, channel, result);
    track("share_click", {
      exam: event.exam,
      channel,
      placement: "shikenmae_result",
      with_score: withScore ? 1 : 0,
      shared,
    });
    if (channel === "x") {
      window.open(`https://x.com/intent/post?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    } else if (channel === "line") {
      window.open(`https://line.me/R/share?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    } else if (channel === "share") {
      navigator.share({ text }).catch(() => {
        /* 閉じられたときは何もしない */
      });
    } else {
      navigator.clipboard
        ?.writeText(text)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          /* コピーできない環境では何もしない */
        });
    }
  }

  const btn = "text-xs font-bold border rounded-md px-3 py-2 transition hover:opacity-80";
  return (
    <section className="card p-4 mb-6">
      <p className="text-sm font-bold text-[color:var(--c-ink)] mb-2">結果を送る</p>
      <label className="flex items-center gap-2 text-xs text-[color:var(--c-text-sub)] mb-3">
        <input type="checkbox" checked={withScore} onChange={(e) => setWithScore(e.target.checked)} />
        点と○×を載せる（外すと、点の無い文面とリンクになります）
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => send("x")} className={btn} style={{ color: "var(--c-accent)", borderColor: "var(--c-accent)" }}>
          Xに投稿
        </button>
        <button type="button" onClick={() => send("line")} className={btn} style={{ color: "var(--c-accent)", borderColor: "var(--c-accent)" }}>
          LINEで送る
        </button>
        {canNativeShare && (
          <button type="button" onClick={() => send("share")} className={btn} style={{ color: "var(--c-accent)", borderColor: "var(--c-accent)" }}>
            共有
          </button>
        )}
        <button type="button" onClick={() => send("copy")} className={btn} style={{ color: "var(--c-text-sub)", borderColor: "var(--c-border)" }}>
          {copied ? "コピーしました" : "文面をコピー"}
        </button>
      </div>
      <p className="text-[11px] text-[color:var(--c-text-sub)] mt-3">
        送り先のサービスには、文面とリンクがそのまま渡ります。リンクに入るのは点（10問中◯問）だけで、問ごとの○×は文面にだけ入ります。
      </p>
    </section>
  );
}
