"use client";

import { useEffect, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";

// 模試結果画面の「本試験と形式は近かったか」ワンタップアンケート。
// 東商IBT系(ビジ法・福祉住環境)など本試験の問題・模範解答が非公開の資格では、
// 受験経験者の回答が出題形式の一次情報になる(GA4 の moshi_format_feedback で収集)。
type Verdict = "close" | "somewhat" | "different" | "not_taken";

const OPTIONS: { verdict: Verdict; label: string }[] = [
  { verdict: "close", label: "近かった" },
  { verdict: "somewhat", label: "やや違った" },
  { verdict: "different", label: "かなり違った" },
  { verdict: "not_taken", label: "本試験は未受験" },
];

export default function MoshiFormatFeedback({ exam, round }: { exam: string; round: number }) {
  const storageKey = `moshiFmtFb:${exam}`;
  const [voted, setVoted] = useState<Verdict | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      setVoted((localStorage.getItem(storageKey) as Verdict) || null);
    } catch {
      /* localStorage不可の環境では毎回表示 */
    }
    setLoaded(true);
  }, [storageKey]);

  function vote(verdict: Verdict) {
    sendGAEvent("event", "moshi_format_feedback", { exam, round, verdict });
    try {
      localStorage.setItem(storageKey, verdict);
    } catch {
      /* noop */
    }
    setVoted(verdict);
  }

  if (!loaded) return null;

  return (
    <section className="card p-5 mb-6">
      {voted ? (
        <p className="text-sm text-[color:var(--c-text-sub)] leading-relaxed">
          ご回答ありがとうございます。今後の模試の形式改善に反映します。
          {(voted === "somewhat" || voted === "different") && (
            <>
              {" "}
              よろしければ、どこが違ったか(問題数・出題形式・時間など)を
              <a href="/contact/" className="underline underline-offset-2 mx-0.5">
                お問い合わせ
              </a>
              から一言お寄せください。
            </>
          )}
        </p>
      ) : (
        <>
          <h3 className="text-sm font-bold mb-1.5 text-[color:var(--c-ink)]">
            本試験を受けたことがある方へ
          </h3>
          <p className="text-xs text-[color:var(--c-text-sub)] leading-relaxed mb-3">
            この模試の形式(問題数・出題形式・時間)は、実際の本試験と近かったですか?
            回答は模試の形式改善に使わせていただきます。
          </p>
          <div className="flex flex-wrap gap-2">
            {OPTIONS.map((o) => (
              <button
                key={o.verdict}
                onClick={() => vote(o.verdict)}
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
