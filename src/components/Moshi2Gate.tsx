"use client";

/**
 * 第2回模試の受験画面。2026-11-08 に無料化した。
 *
 * それまでは Stripe で有料販売していて(checkout 0件)、未購入なら商品説明と購入ボタン、
 * 購入済みなら受験画面を出し分けていた。無料化で購入まわり(/api/checkout・unlock・
 * restore・stripe-webhook と署名 cookie)はすべて外し、誰でも受験画面を出す。
 *
 * 問題データは /api/moshi2/[cert] から取る。ページを静的生成のまま軽く保つため
 * (100問超の問題と解説をページの HTML に入れると、第2回のページだけ極端に重くなる)。
 * 読み込みが終わるまでは pitch(誰向けか・含まれるもの・サンプル)を出す。
 * 検索エンジンにはこの pitch が見える。
 *
 * fetch 先の URL は末尾スラッシュ必須(next.config.ts が trailingSlash: true のため)。
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import MoshiExam from "@/components/MoshiExam";
import type { MoshiQuestion, MoshiSection } from "@/components/MoshiExam";
import { moshi2ProductOf } from "@/lib/moshi2-products";
import { trackMoshi2 as track } from "@/lib/moshi2-funnel";
import { SITE } from "@/lib/site";
import { EXAM_LIST, type ExamSlug } from "@/lib/study-progress";

/** /api/moshi2/[cert] が返す形。試験仕様は商品定義から来る。 */
type Paper = {
  def: {
    round: number;
    timeLimitMin: number;
    passCount: number;
    passLabel: string;
    choiceLabel: string;
    passPoints?: number;
    pointsPerQuestion?: number;
    sections?: MoshiSection[];
  };
  questions: MoshiQuestion[];
  dev?: boolean;
};
type Status = "loading" | "ready" | "notReady" | "error";

export default function Moshi2Gate({ certId, pitch }: { certId: ExamSlug; pitch?: ReactNode }) {
  const product = moshi2ProductOf(certId);
  const [status, setStatus] = useState<Status>("loading");
  const [paper, setPaper] = useState<Paper | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const pageViewSent = useRef(false);

  const fetchPaper = useCallback(async () => {
    const res = await fetch(`/api/moshi2/${certId}/`, { cache: "no-store" });
    if (res.status === 503) {
      setStatus("notReady");
      return;
    }
    if (!res.ok) {
      setMessage("問題の読み込みに失敗しました。時間をおいて開き直してください。");
      setStatus("error");
      return;
    }
    const data = (await res.json()) as Paper;
    setPaper(data);
    setStatus("ready");
  }, [certId]);

  useEffect(() => {
    let alive = true;

    // どこから来たか(result=第1回の結果画面 / landing=資格トップ / それ以外=direct)。
    // 読んだら canonical を汚さないよう URL から消す(ハッシュ #sample は残す)。
    // ref で1回に抑えるのは、開発時の StrictMode が effect を2度走らせるため。
    const params = new URLSearchParams(window.location.search);
    const src = params.get("src");
    if (!pageViewSent.current) {
      pageViewSent.current = true;
      track("moshi2_page_view", { cert: certId, src: src ?? "direct" });
    }
    if (src) {
      params.delete("src");
      const q = params.toString();
      window.history.replaceState({}, "", `/${certId}/moshi2/${q ? `?${q}` : ""}${window.location.hash}`);
    }

    fetchPaper().catch(() => {
      if (!alive) return;
      setMessage("通信エラーが発生しました。");
      setStatus("error");
    });

    return () => {
      alive = false;
    };
  }, [certId, fetchPaper]);

  if (!product) return null;

  if (status === "ready" && paper) {
    return (
      <>
        {paper.dev && (
          <p className="print-hide mb-4 rounded-[8px] border border-wrong/40 bg-wrong-wash px-4 py-2.5 text-[12px] text-wrong">
            開発モードの表示です。
          </p>
        )}
        {/* 印刷導線は受験UIの「上」に置く。下に置くと140問の後ろに埋もれて見つからない */}
        <div className="print-hide mb-2.5 flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-line bg-surface p-4">
          <p className="text-[13px] text-ink-soft leading-relaxed">
            紙で解く・書き込んで復習するなら、問題・解答用紙・解説を A4 に組んだ紙面をどうぞ。
          </p>
          <Link
            href={`/${certId}/moshi2/print/`}
            className="shrink-0 rounded-[8px] bg-ink px-4 py-2 text-[13px] text-paper no-underline transition-colors hover:bg-[color:var(--c-accent,var(--c-ink))]"
          >
            印刷用ページを開く →
          </Link>
        </div>

        {/* 受験UIそのものは紙に出さない。タイマーや問題番号の一覧を刷っても意味がない */}
        <div className="print-hide">
          <MoshiExam
            exam={certId}
            round={paper.def.round}
            sessionKey={`shikakumon-${certId}-moshi2-v1`}
            questions={paper.questions}
            timeLimitMin={paper.def.timeLimitMin}
            passCount={paper.def.passCount}
            passLabel={paper.def.passLabel}
            choiceLabel={paper.def.choiceLabel}
            questionPathPrefix={
              EXAM_LIST.find((e) => e.slug === certId)?.questionPathPrefix ?? `/${certId}/q/`
            }
            topPath={`/${certId}/`}
            sections={paper.def.sections}
            pointsPerQuestion={paper.def.pointsPerQuestion}
            passPoints={paper.def.passPoints}
          />
        </div>

        {/* この画面を誤って印刷したときに、紙に出るのはこの一行だけ */}
        <p className="print-only text-[13px] leading-relaxed">
          この画面は受験用です。印刷用の紙面は {SITE.url}/{certId}/moshi2/print/ をご利用ください。
        </p>
      </>
    );
  }

  if (status === "notReady") {
    return (
      <section className="bg-surface border border-line rounded-[10px] p-5">
        <p className="text-[13px] text-ink-soft leading-relaxed">
          第2回は現在準備中です。公開までのあいだは
          <Link href={`/${certId}/moshi/`} className="underline underline-offset-2 hover:text-ink">
            第1回模擬試験
          </Link>
          をご利用ください。
        </p>
      </section>
    );
  }

  return (
    <>
      {pitch}
      <section className="bg-surface border border-line rounded-[10px] p-5 text-[13px] text-ink-soft max-w-2xl">
        {status === "error" ? (
          <p className="text-wrong">{message}</p>
        ) : (
          "問題を読み込み中…"
        )}
      </section>
    </>
  );
}
