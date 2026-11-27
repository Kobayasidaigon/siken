"use client";

/**
 * 一問一答(○×・記入式)。2026-11-23 追加。
 *
 * ○×: 4択の各肢を1つの記述として「正しい/誤り」で答える(lib/ox-from-choices.ts が作る)。
 * 記入: 空欄の語句を打ち込む。表記ゆれは lib/answer-normalize.ts でそろえてから判定し、
 *       それでも外れたときは「自分の答えも正しい」で自己採点に切り替えられる。
 *
 * 1回10問。1問ずつその場で答え合わせをして解説を出す(腕試しテストと違い、覚えるための面)。
 * 正誤は学習履歴(/study)に残さない。履歴は4択の問題ページ単位で数えているため、
 * ○×の肢をそこへ混ぜると「解いた問題数」が4倍に膨らむ。
 * GA4 へは開始と終了だけ送る(打った文字は送らない)。docs/ga4-events.md を参照。
 */

import { useMemo, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import SiteLink from "@/components/SiteLink";
import { isCorrectInput } from "@/lib/answer-normalize";
import type { InputItem, OxItem } from "@/lib/question-format";

type Mode = "ox" | "input";
type OxView = Omit<OxItem, "explain"> & { explain?: string };

interface Props {
  exam: string;
  examLabel: string;
  questionPathPrefix: string;
  ox: OxView[];
  /** sharedExplain の肢の解説(元の問題ごとに1つ。4肢で同じ文を4回送らないため分けて持つ) */
  sharedExplains: Record<string, string>;
  inputs: InputItem[];
}

const SIZE = 10;

function track(name: string, params: Record<string, unknown>) {
  try {
    sendGAEvent("event", name, params);
  } catch {
    /* GA未ロードでも解答は妨げない */
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Result = { correct: boolean; given: string; selfMarked?: boolean };

export default function IchimonDrill({ exam, examLabel, questionPathPrefix, ox, sharedExplains, inputs }: Props) {
  const [mode, setMode] = useState<Mode>("ox");
  const [field, setField] = useState<string>("");
  const [phase, setPhase] = useState<"intro" | "running" | "done">("intro");
  const [pool, setPool] = useState<(OxView | InputItem)[]>([]);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<(Result | null)[]>([]);
  const [text, setText] = useState("");

  const source = mode === "ox" ? ox : inputs;
  const fields = useMemo(() => [...new Set(source.map((q) => q.field))], [source]);
  const filtered = field ? source.filter((q) => q.field === field) : source;

  function start() {
    const picked = shuffle(filtered).slice(0, SIZE);
    setPool(picked);
    setResults(picked.map(() => null));
    setIdx(0);
    setText("");
    setPhase("running");
    track("ichimon_start", { exam, mode, size: picked.length, filtered: field ? 1 : 0 });
  }

  function answer(r: Result) {
    setResults((prev) => prev.map((v, i) => (i === idx ? r : v)));
  }

  function next() {
    if (idx + 1 >= pool.length) {
      const correct = results.filter((r) => r?.correct).length;
      track("ichimon_complete", {
        exam,
        mode,
        size: pool.length,
        correct,
        self_marked: results.filter((r) => r?.selfMarked).length,
      });
      setPhase("done");
      return;
    }
    setIdx((v) => v + 1);
    setText("");
  }

  /* ===================== Intro ===================== */
  if (phase === "intro") {
    return (
      <div>
        <div className="flex gap-2 mb-5" role="tablist">
          {(["ox", "input"] as Mode[]).map((m) => {
            const count = m === "ox" ? ox.length : inputs.length;
            if (count === 0) return null;
            const on = mode === m;
            return (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => {
                  setMode(m);
                  setField("");
                }}
                className="px-4 py-2 rounded-lg border text-sm font-bold transition-colors"
                style={
                  on
                    ? { background: "var(--c-accent)", borderColor: "var(--c-accent)", color: "#fff" }
                    : { borderColor: "var(--c-accent)", color: "var(--c-accent-ink)" }
                }
              >
                {m === "ox" ? "○×" : "記入式"}（{count}問）
              </button>
            );
          })}
        </div>

        <div className="card p-6 mb-6">
          <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-3">
            {mode === "ox" ? (
              <>
                {examLabel}の4択問題の選択肢を、1つずつ<strong>「正しい(○)か誤り(×)か」</strong>で答えます。
                答えるとすぐに正誤と解説が出ます。
              </>
            ) : (
              <>
                空欄に入る語句や数字を<strong>打ち込んで</strong>答えます。選択肢を見ずに思い出せるかを確かめる暗記用の問題です
                （本試験に記入式は出ません）。全角・半角、ひらがな・カタカナ、漢数字の違いは気にせず入力できます。
              </>
            )}
          </p>
          <label className="block text-xs text-[color:var(--c-text-sub)] mb-4">
            分野
            <select
              value={field}
              onChange={(e) => setField(e.target.value)}
              className="ml-2 border rounded-md px-2 py-1 text-sm bg-white text-[color:var(--c-text)]"
            >
              <option value="">すべて（{source.length}問）</option>
              {fields.map((f) => (
                <option key={f} value={f}>
                  {f}（{source.filter((q) => q.field === f).length}問）
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={start} className="btn-accent">
            {Math.min(SIZE, filtered.length)}問に挑戦する →
          </button>
        </div>
      </div>
    );
  }

  /* ===================== Done ===================== */
  if (phase === "done") {
    const correct = results.filter((r) => r?.correct).length;
    return (
      <div>
        <section className="card p-6 text-center mb-6">
          <p className="text-xs text-[color:var(--c-text-sub)] mb-1">{mode === "ox" ? "○×" : "記入式"}の結果</p>
          <p className="text-4xl font-bold font-serif mb-1" style={{ color: "var(--c-accent)" }}>
            {correct} <span className="text-2xl text-[color:var(--c-text-sub)]">/ {pool.length}</span>
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={start} className="btn-accent">
              もう{Math.min(SIZE, filtered.length)}問 →
            </button>
            <button
              type="button"
              onClick={() => setPhase("intro")}
              className="px-4 py-2 rounded-lg border text-sm"
              style={{ borderColor: "var(--c-accent)", color: "var(--c-accent-ink)" }}
            >
              形式・分野を選び直す
            </button>
          </div>
        </section>
        <ol className="space-y-2">
          {pool.map((q, i) => {
            const r = results[i];
            const isOx = "statement" in q;
            return (
              <li key={q.id} className="card p-4 text-sm">
                <span className="font-bold mr-2" style={{ color: r?.correct ? "#15803d" : "#dc2626" }}>
                  {r?.correct ? "正解" : "不正解"}
                </span>
                <span className="text-[color:var(--c-text)]">{isOx ? q.statement : q.prompt}</span>
                <p className="text-xs text-[color:var(--c-text-sub)] mt-1">
                  正解: {isOx ? (q.answer ? "○ 正しい" : "× 誤り") : q.answers[0]}
                  {"sourceSlug" in q && q.sourceSlug && (
                    <>
                      {"　"}
                      <SiteLink href={`${questionPathPrefix}${q.sourceSlug}/`} className="underline">
                        元の4択問題
                      </SiteLink>
                    </>
                  )}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  /* ===================== Running ===================== */
  const q = pool[idx];
  const r = results[idx];
  const isOx = "statement" in q;
  const progressPct = Math.round(((idx + 1) / pool.length) * 100);
  const explain = isOx ? (q.explain ?? sharedExplains[q.sourceSlug] ?? "") : q.explain;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 text-xs text-[color:var(--c-text-sub)]">
        <span>
          {isOx ? "○×" : "記入式"} {idx + 1} / {pool.length}
        </span>
        <span>{q.field}</span>
      </div>
      <div className="h-1.5 rounded-full bg-[color:var(--c-bg-alt)] mb-6 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${progressPct}%`, background: "var(--c-accent)" }} />
      </div>

      <section className="card p-5 mb-5" style={{ borderLeft: "4px solid var(--c-accent)" }}>
        {isOx ? (
          <>
            <p className="text-xs text-[color:var(--c-text-sub)] mb-2">{/の(説明|特徴|記述)$/.test(q.topic) ? `${q.topic}として、次の記述は正しいか誤りか。` : `${q.topic}に関する次の記述は、正しいか誤りか。`}</p>
            <p className="text-base text-[color:var(--c-text)] leading-relaxed">{q.statement}</p>
          </>
        ) : (
          <>
            <p className="text-base text-[color:var(--c-text)] leading-relaxed">{q.prompt}</p>
            {q.hint && <p className="text-xs text-[color:var(--c-text-sub)] mt-2">ヒント: {q.hint}</p>}
          </>
        )}
      </section>

      {/* 解答欄 */}
      {isOx ? (
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[true, false].map((v) => {
            const chosen = r && r.given === (v ? "o" : "x");
            const isAns = q.answer === v;
            const bg = !r ? "#fff" : isAns ? "#bbf7d0" : chosen ? "#fecaca" : "#fff";
            return (
              <button
                key={String(v)}
                type="button"
                disabled={!!r}
                onClick={() => answer({ correct: q.answer === v, given: v ? "o" : "x" })}
                className="rounded-xl border-2 py-4 text-center transition-colors disabled:cursor-default"
                style={{ borderColor: v ? "#2563eb" : "#dc2626", background: bg }}
                aria-label={v ? "正しい" : "誤り"}
              >
                <span className="block text-4xl font-bold leading-none" style={{ color: v ? "#2563eb" : "#dc2626" }}>
                  {v ? "○" : "×"}
                </span>
                <span className="block text-xs mt-1 text-[color:var(--c-text-sub)]">{v ? "正しい" : "誤り"}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <form
          className="flex gap-2 mb-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (r || !text.trim()) return;
            answer({ correct: isCorrectInput(text, q.answers), given: text });
          }}
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!!r}
            placeholder="ここに入力"
            autoComplete="off"
            className="flex-1 border-2 rounded-lg px-3 py-2 text-base bg-white text-[color:var(--c-text)]"
            style={{ borderColor: "var(--c-accent)" }}
            aria-label="答え"
          />
          <button type="submit" disabled={!!r || !text.trim()} className="btn-accent disabled:opacity-40">
            答える
          </button>
        </form>
      )}

      {/* 答え合わせ */}
      {r && (
        <section className="card p-5 mb-5">
          <p className="text-lg font-bold mb-2" style={{ color: r.correct ? "#15803d" : "#dc2626" }}>
            {r.correct ? (r.selfMarked ? "正解（自己採点）" : "正解！") : "不正解"}
          </p>
          {isOx ? (
            <p className="text-sm text-[color:var(--c-text)] mb-3">
              この記述は<strong>{q.answer ? "正しい（○）" : "誤り（×）"}</strong>です。
            </p>
          ) : (
            <>
              <p className="text-sm text-[color:var(--c-text)] mb-1">
                正解: <strong>{q.answers[0]}</strong>
                {q.answers.length > 1 && (
                  <span className="text-xs text-[color:var(--c-text-sub)]">（{q.answers.slice(1).join("・")} でも正解）</span>
                )}
              </p>
              <p className="text-xs text-[color:var(--c-text-sub)] mb-3">あなたの答え: {r.given}</p>
              {!r.correct && (
                <button
                  type="button"
                  onClick={() => answer({ ...r, correct: true, selfMarked: true })}
                  className="text-xs underline mb-3 text-[color:var(--c-accent-ink)]"
                >
                  書き方が違うだけで、自分の答えも正しい
                </button>
              )}
            </>
          )}
          {explain && (
            <div className="text-sm text-[color:var(--c-text)] leading-relaxed whitespace-pre-wrap border-t border-[color:var(--c-border,#e5e7eb)] pt-3">
              {isOx && q.sharedExplain && (
                <p className="text-xs text-[color:var(--c-text-sub)] mb-1">
                  元の4択問題の解説です（この記述は選択肢{q.choiceNo}）。
                </p>
              )}
              {explain}
            </div>
          )}
          {"sourceSlug" in q && q.sourceSlug && (
            <p className="text-xs mt-3">
              <SiteLink href={`${questionPathPrefix}${q.sourceSlug}/`} className="underline text-[color:var(--c-accent-ink)]">
                元の4択問題と詳しい解説を見る →
              </SiteLink>
            </p>
          )}
        </section>
      )}

      {r && (
        <div className="flex justify-end">
          <button type="button" onClick={next} className="btn-accent">
            {idx + 1 >= pool.length ? "結果を見る" : "次へ →"}
          </button>
        </div>
      )}
    </div>
  );
}
