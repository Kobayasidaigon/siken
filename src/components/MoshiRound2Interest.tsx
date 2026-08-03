"use client";

import { useEffect, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";

// 模試結果画面の「第2回(有料)が出たら受けたいか」ワンタップ意向調査(フェイクドア)。
// 第2回以降を制作して有料展開するかの判断材料にする。回答は GA4 の
// moshi_round2_interest イベントで収集。回答値は登録済みカスタム定義
// verdict(イベントスコープ)を再利用するため、exam × verdict で即集計できる。
type Answer = "paid" | "free_only";

const OPTIONS: { answer: Answer; label: string }[] = [
  { answer: "paid", label: "有料でも受けたい" },
  { answer: "free_only", label: "無料なら受けたい" },
];

export default function MoshiRound2Interest({ exam, round }: { exam: string; round: number }) {
  const storageKey = `moshiR2Door:${exam}`;
  const [answered, setAnswered] = useState<Answer | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      setAnswered((localStorage.getItem(storageKey) as Answer) || null);
    } catch {
      /* localStorage不可の環境では毎回表示 */
    }
    setLoaded(true);
  }, [storageKey]);

  function answer(a: Answer) {
    sendGAEvent("event", "moshi_round2_interest", { exam, round, verdict: a });
    try {
      localStorage.setItem(storageKey, a);
    } catch {
      /* noop */
    }
    setAnswered(a);
  }

  if (!loaded) return null;

  return (
    <section className="card p-5 mb-6">
      {answered ? (
        <p className="text-sm text-[color:var(--c-text-sub)] leading-relaxed">
          ありがとうございます。第2回を制作するかどうかの判断材料にします。公開の際はこのページでご案内します。
        </p>
      ) : (
        <>
          <h3 className="text-sm font-bold mb-1.5 text-[color:var(--c-ink)]">第2回模試について</h3>
          <p className="text-xs text-[color:var(--c-text-sub)] leading-relaxed mb-3">
            同じ本試験形式・別問題の「第2回」の制作を検討しています(有料・1,000円前後を想定)。
            公開されたら受けてみたいですか?
          </p>
          <div className="flex flex-wrap gap-2">
            {OPTIONS.map((o) => (
              <button
                key={o.answer}
                onClick={() => answer(o.answer)}
                className="rounded-lg border border-[color:var(--c-border)] bg-white px-3 py-1.5 text-xs text-[color:var(--c-text-sub)] transition-colors hover:bg-slate-50 hover:text-[color:var(--c-ink)]"
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
