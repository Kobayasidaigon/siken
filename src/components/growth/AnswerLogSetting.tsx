"use client";

/**
 * 解答の記録(匿名)を送るかどうかの設定。2026-09-13 追加。
 *
 * /study/ の「履歴の持ち出しと復元」の下に置く。既定は「送る」。
 * 止めると、それ以降の解答は送られない(すでに送った分は匿名IDのまま統計に残る)。
 * 「匿名IDを作り直す」で、これまでの記録と切り離すこともできる。
 * 何を送るかは /privacy/ に書いてある。
 */

import { useEffect, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { getAnonId, isAnswerLogOptedOut, resetAnonId, setAnswerLogOptedOut } from "@/lib/growth/anon-id";

export default function AnswerLogSetting({ className = "" }: { className?: string }) {
  const [enabled, setEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    setEnabled(!isAnswerLogOptedOut());
    setMounted(true);
  }, []);

  function toggle(next: boolean) {
    setAnswerLogOptedOut(!next);
    setEnabled(next);
    setNote(next ? "この端末での解答を、匿名で送ります。" : "この端末での解答は、これ以降送りません。");
    try {
      sendGAEvent("event", "answer_log_setting", { enabled: next ? "yes" : "no" });
    } catch {
      /* noop */
    }
  }

  function reset() {
    resetAnonId();
    getAnonId();
    setNote("匿名IDを作り直しました。これまでに送った記録とは切り離されます。");
  }

  return (
    <section className={`card p-5 ${className}`}>
      <h2 className="text-sm font-bold text-[color:var(--c-ink)] font-serif mb-1">解答の記録（匿名）</h2>
      <p className="text-xs text-[color:var(--c-text-sub)] leading-relaxed mb-3">
        問題を解いたときの正誤を、端末の匿名IDとあわせて集計用に送っています。
        「みんなの正答率」「間違えた人が多い問題」に使います。氏名・メールアドレスなどは含みません。
        詳しくは<a href="/privacy/" className="underline">プライバシーポリシー</a>。
      </p>
      <label className="flex items-center gap-2 text-sm text-[color:var(--c-text)]">
        <input type="checkbox" checked={enabled} disabled={!mounted} onChange={(e) => toggle(e.target.checked)} />
        解答の正誤を匿名で送る
      </label>
      <div className="mt-3">
        <button
          type="button"
          onClick={reset}
          disabled={!mounted}
          className="text-xs text-[color:var(--c-text-sub)] underline hover:no-underline disabled:opacity-50"
        >
          匿名IDを作り直す
        </button>
      </div>
      {note && <p className="text-xs mt-3 text-[color:var(--c-text-sub)]">{note}</p>}
    </section>
  );
}
