"use client";

/**
 * 第2回模試(有料)の印刷用紙面。2026-09-09 新設。
 *
 * 【なぜ必要だったか】
 * Moshi2Gate の商品説明が「問題・解答用紙・解説を A4 に組んだ印刷用の紙面つき」と
 * 約束し、受験画面から /<資格>/moshi2/print/ へリンクしていたのに、そのルートが
 * 存在しなかった。購入者がリンクを踏むと 404 になっていた。約束した機能が無いのは
 * 特商法・景表法の観点でも不味いので、説明文を削るのではなく実装して合わせる。
 *
 * 【安全性】
 * 問題データは Moshi2Gate と同じ /api/moshi2/[cert] からしか取らない。未購入なら
 * API が 402 を返すのでこの画面にも何も出ない。ページ自体は静的生成のままで、
 * HTML にもバンドルにも問題文は載らない。SEO 上も購入者以外には空のページに見える。
 *
 * 【紙面の構成】
 *   1枚目〜  問題（解答欄なし。番号と設問文と選択肢だけ）
 *   区切り   解答用紙（マークシート風の番号だけの表。書き込んで使う）
 *   区切り   解答一覧と解説
 * ブラウザの印刷ダイアログから A4 で出す前提。PDF 保存もそのままできる。
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { moshi2ProductOf } from "@/lib/moshi2-products";
import { EXAM_LIST, type ExamSlug } from "@/lib/study-progress";

type PrintQuestion = {
  slug: string;
  questionText: string;
  choices: string[];
  correctAnswer: number;
  points?: number;
  field: string;
  explanationHtml?: string;
};

type Paper = {
  def: { round: number; timeLimitMin: number; passLabel: string; choiceLabel: string };
  questions: PrintQuestion[];
  dev?: boolean;
};

type Status = "loading" | "locked" | "ready" | "notReady" | "error";

export default function Moshi2Print({ certId }: { certId: ExamSlug }) {
  const product = moshi2ProductOf(certId);
  const examName = EXAM_LIST.find((e) => e.slug === certId)?.name ?? "";
  const [status, setStatus] = useState<Status>("loading");
  const [paper, setPaper] = useState<Paper | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/moshi2/${certId}/`, { cache: "no-store" });
      if (res.status === 402) return setStatus("locked");
      if (res.status === 503) return setStatus("notReady");
      if (!res.ok) return setStatus("error");
      setPaper((await res.json()) as Paper);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [certId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!product) return null;

  if (status === "loading") {
    return <p className="text-sm text-[color:var(--c-text-sub)]">読み込んでいます…</p>;
  }

  if (status === "locked") {
    return (
      <div className="card p-5 text-sm leading-relaxed">
        <p className="text-[color:var(--c-ink)] font-bold mb-2">この紙面は購入者向けです</p>
        <p className="text-[color:var(--c-text-sub)] mb-4">
          {product.name}をご購入いただくと、問題・解答用紙・解説を A4 に組んだ紙面を印刷できます。
        </p>
        <Link href={`/${certId}/moshi2/`} className="btn-accent no-underline">
          商品ページへ →
        </Link>
      </div>
    );
  }

  if (status === "notReady") {
    return <p className="text-sm text-[color:var(--c-text-sub)]">この資格の第2回模試は準備中です。</p>;
  }

  if (status === "error" || !paper) {
    return (
      <p className="text-sm text-[color:var(--c-text-sub)]">
        読み込みに失敗しました。時間をおいて開き直してください。
      </p>
    );
  }

  const qs = paper.questions;

  return (
    <div className="moshi2-print">
      {/* 画面でだけ出す操作部。印刷には出さない */}
      <div className="print-hide card p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[color:var(--c-text-sub)] leading-relaxed">
          そのまま印刷すると、問題・解答用紙・解説の順で A4 に組まれます。PDF として保存もできます。
        </p>
        <button onClick={() => window.print()} className="btn-accent shrink-0">
          印刷する →
        </button>
      </div>

      <header className="mb-6">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] font-serif mb-1">
          {examName} 模擬試験 第{paper.def.round}回
        </h2>
        <p className="text-xs text-[color:var(--c-text-sub)]">
          全{qs.length}問／{paper.def.choiceLabel}／制限時間 {paper.def.timeLimitMin}分／合格基準{" "}
          {paper.def.passLabel}
        </p>
        <p className="text-xs text-[color:var(--c-text-sub)] mt-1">
          シカクモン（shikakumon.com）／購入者ご本人の学習用です。複製・再配布はご遠慮ください。
        </p>
      </header>

      {/* ---- 問題 ---- */}
      <section className="mb-8">
        <h3 className="text-base font-bold text-[color:var(--c-ink)] font-serif mb-3 border-b border-[color:var(--c-border)] pb-1">
          問題
        </h3>
        <ol className="space-y-5">
          {qs.map((q, i) => (
            <li key={q.slug} className="text-sm leading-relaxed break-inside-avoid">
              <p className="text-[color:var(--c-text)] mb-1.5">
                <span className="font-bold text-[color:var(--c-ink)] mr-2">問{i + 1}</span>
                {q.questionText}
              </p>
              <ol className="pl-6 space-y-0.5 text-[color:var(--c-text)]">
                {q.choices.map((c, ci) => (
                  <li key={ci}>
                    {ci + 1}．{c}
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </section>

      {/* ---- 解答用紙 ---- */}
      <section className="mb-8 print-break-before">
        <h3 className="text-base font-bold text-[color:var(--c-ink)] font-serif mb-3 border-b border-[color:var(--c-border)] pb-1">
          解答用紙
        </h3>
        <p className="text-xs text-[color:var(--c-text-sub)] mb-3">
          解いた番号を記入してください。採点は次ページの解答一覧で行えます。
        </p>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-x-2 gap-y-1">
          {qs.map((q, i) => (
            <div
              key={q.slug}
              className="border border-[color:var(--c-border)] text-xs text-center py-1.5 leading-none"
            >
              <span className="text-[color:var(--c-text-sub)]">{i + 1}</span>
              <span className="block h-4"></span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- 解答と解説 ---- */}
      <section className="print-break-before">
        <h3 className="text-base font-bold text-[color:var(--c-ink)] font-serif mb-3 border-b border-[color:var(--c-border)] pb-1">
          解答と解説
        </h3>
        <p className="text-xs text-[color:var(--c-text-sub)] mb-4">
          正解一覧：
          {qs.map((q, i) => (
            <span key={q.slug} className="mr-2 whitespace-nowrap">
              {i + 1}-{q.correctAnswer}
            </span>
          ))}
        </p>
        <ol className="space-y-4">
          {qs.map((q, i) => (
            <li key={q.slug} className="text-sm leading-relaxed break-inside-avoid">
              <p className="mb-1">
                <span className="font-bold text-[color:var(--c-ink)] mr-2">問{i + 1}</span>
                <span className="text-[color:var(--c-text-sub)] mr-2">{q.field}</span>
                <span className="font-bold text-[color:var(--c-ink)]">正解 {q.correctAnswer}</span>
              </p>
              {q.explanationHtml ? (
                <div
                  className="text-[color:var(--c-text)] [&_p]:mb-1"
                  dangerouslySetInnerHTML={{ __html: q.explanationHtml }}
                />
              ) : (
                <p className="text-[color:var(--c-text-sub)]">解説は受験画面でご確認ください。</p>
              )}
            </li>
          ))}
        </ol>
      </section>

      <p className="print-hide text-xs text-[color:var(--c-text-sub)] mt-8">
        <Link href={`/${certId}/moshi2/`} className="underline hover:no-underline">
          ← 受験画面に戻る
        </Link>
      </p>
    </div>
  );
}
