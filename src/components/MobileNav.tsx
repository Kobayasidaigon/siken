"use client";

/**
 * モバイルのボトムナビ。2026-09-07 に固定4枠から動的に変更。
 *
 * これまでは「ホーム・貸金・個情保・知財」のハードコードだった。14資格あるうちの
 * 3つだけが常に出て、残り11資格を学習している人には自分の資格が出ない。しかも
 * コラム(流入をいちばん作っている面)と学習履歴(再訪の理由になる面)へは、
 * モバイルからは一度もたどり着けなかった。
 *
 * 変更後も枠は4つのまま。2つめだけを「その人が実際に解いている資格」に差し替える。
 *   履歴が無い     → 学習ガイド(はじめての人が次に行くべき面)
 *   履歴がある     → いちばん解いている資格のトップ
 * どちらも「次に行くところ」を出すという意味では同じ枠。
 *
 * 枠の数を出し分けないのは、localStorage を読んだ後で項目が増減すると
 * ナビの高さや並びが動いてしまうため。初期HTMLはサーバでの描画と一致させ、
 * マウント後にラベルとリンク先だけを差し替える。
 */

import { useEffect, useState } from "react";
import { EXAM_LIST, loadProgress, type ExamSlug } from "@/lib/study-progress";

/** ボトムナビに入る短い呼び名。正式名称は長すぎて 1 枠に収まらない */
const SHORT_NAME: Record<ExamSlug, string> = {
  kashikin: "貸金",
  pii: "個情保",
  chizai: "知財3級",
  chizai2: "知財2級",
  mynumber: "マイナ",
  jitsumu: "実務",
  bijihou: "ビジ法3級",
  bijihou2: "ビジ法2級",
  fukushi2: "福祉住環境",
  bijimane: "ビジマネ",
  eco: "eco検定",
  itpass: "ITパス",
  chintai: "賃管士",
  kangyo: "管業",
};

const ICON = "w-5 h-5";
const LINK =
  "flex flex-col items-center text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline";

export default function MobileNav() {
  // 初期値はサーバでの描画と同じにする。マウント後にだけ差し替える
  const [current, setCurrent] = useState<{ href: string; label: string }>({
    href: "/guide/",
    label: "はじめに",
  });

  useEffect(() => {
    try {
      const p = loadProgress();
      let best: { slug: ExamSlug; n: number } | null = null;
      for (const e of EXAM_LIST) {
        const n = p[e.slug].wrong.length + p[e.slug].correct.length;
        if (n > 0 && (!best || n > best.n)) best = { slug: e.slug, n };
      }
      if (!best) return;
      const info = EXAM_LIST.find((e) => e.slug === best.slug);
      if (info) setCurrent({ href: info.topPath, label: SHORT_NAME[best.slug] });
    } catch {
      /* localStorage が読めない環境では既定のまま */
    }
  }, []);

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-[color:var(--c-surface)] border-t border-[color:var(--c-border)] z-50">
      <div className="flex justify-around h-14 items-center text-xs">
        <a href="/" className={LINK}>
          <svg className={ICON} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
          </svg>
          ホーム
        </a>
        <a href={current.href} className={LINK}>
          <svg className={ICON} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          {current.label}
        </a>
        <a href="/column/" className={LINK}>
          <svg className={ICON} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          コラム
        </a>
        <a href="/study/" className={LINK}>
          <svg className={ICON} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          学習履歴
        </a>
      </div>
    </nav>
  );
}
