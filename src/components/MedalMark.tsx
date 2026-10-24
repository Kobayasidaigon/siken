"use client";
/**
 * 分野ページの問題一覧に出す「自分の印」(金・銀・銅)と、その説明の1行。2026-10-25 追加。
 *
 * 背景: docs/self-data-features-research.md の提案1(印だけの版)。「次の問題」は分野の中を番号順に進むので、
 * 利用者は分野ごとに解き進めているのに、分野のどこまで解いたかを見る場所が無かった。過去問道場の理解度アイコン、
 * Ping-t の問題ごとの状態にあたる。
 *
 * - 印は端末内の学習履歴(study-progress)から計算する。サーバーにも GA4 にも何も送らない。
 * - ページはサーバーで描くので、初めの HTML には印が無い。表示のあとで入れる。カードの幅が変わらないよう枠は先に確保する。
 * - 未挑戦の問題には何も出さない(一覧が「未」で埋まるのを避ける)。
 * - medals を持たない古いデータは、loadProgress が不正解を銅・正解を銀として補ってから返す。
 * - 問題ページから戻る操作(bfcache)や別のタブでの回答でも古い印が残らないよう、pageshow と storage で読み直す。
 */
import { useSyncExternalStore } from "react";
import { loadProgress, type AllProgress, type ExamSlug, type Medal } from "@/lib/study-progress";

let snapshot: AllProgress | null = null;
const listeners = new Set<() => void>();

function refresh() {
  snapshot = loadProgress();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (listeners.size === 1) {
    window.addEventListener("pageshow", refresh);
    window.addEventListener("storage", refresh);
  }
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0) {
      window.removeEventListener("pageshow", refresh);
      window.removeEventListener("storage", refresh);
    }
  };
}

function getSnapshot(): AllProgress | null {
  if (!snapshot) snapshot = loadProgress();
  return snapshot;
}

function getServerSnapshot(): AllProgress | null {
  return null;
}

function useProgress(): AllProgress | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function medalOf(progress: AllProgress | null, exam: ExamSlug, slug: string): Medal | null {
  const p = progress?.[exam];
  if (!p) return null;
  return p.medals?.[slug] ?? null;
}

const LABEL: Record<Medal, { text: string; aria: string; className: string }> = {
  gold: { text: "金", aria: "金：2回続けて正解", className: "border-amber-400 text-amber-700 bg-amber-50" },
  silver: { text: "銀", aria: "銀：前回正解", className: "border-slate-300 text-slate-600 bg-slate-50" },
  bronze: { text: "銅", aria: "銅：前回不正解", className: "border-orange-300 text-orange-800 bg-orange-50" },
};

/** 問題カードの右端(矢印の左)に置く印。未挑戦なら空の枠だけ */
export default function MedalMark({ exam, slug }: { exam: ExamSlug; slug: string }) {
  const medal = medalOf(useProgress(), exam, slug);
  const l = medal ? LABEL[medal] : null;
  return (
    <span className="w-7 shrink-0 flex justify-center ml-2">
      {l && (
        <span
          role="img"
          aria-label={l.aria}
          title={l.aria}
          className={`text-[11px] leading-none font-bold px-1 py-1 rounded border ${l.className}`}
        >
          {l.text}
        </span>
      )}
    </span>
  );
}

/**
 * 一覧の上の説明。サーバーの HTML に含めて全員に出す。
 * 記録がある人にだけ出す作りだと、表示のあとで行が増えて一覧全体が下にずれるため(2026-10-25 の見直しで指摘)。
 */
export function MedalLegend() {
  return (
    <p className="text-xs text-[color:var(--c-text-sub)] mb-2 leading-relaxed">
      解いた問題には、このブラウザに残る前回の結果の印が付きます（銅＝前回不正解、銀＝前回正解、金＝2回続けて正解）。
    </p>
  );
}
