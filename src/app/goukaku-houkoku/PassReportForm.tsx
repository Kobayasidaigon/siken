"use client";

import { useEffect, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { EXAM_LIST, type ExamSlug } from "@/lib/study-progress";

/**
 * 合格報告の投稿フォーム。2026-09-05 追加。
 *
 * 送信先は /api/pass-report(運営宛メールに転送するだけで、保存はしない)。
 * 資格は ?exam= で初期選択できる(PassReportCta からの遷移で使う)。
 *
 * 掲載は運営が内容を読んでから手で行う。自動で公開される経路は無い。
 * その旨をフォーム上でも明記して、投稿者の期待とずれないようにしている。
 */

type Status = "idle" | "sending" | "done" | "error";

export default function PassReportForm() {
  const [exam, setExam] = useState<ExamSlug | "">("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // ?exam=kashikin のように資格が指定されていれば初期選択する
    const q = new URLSearchParams(window.location.search).get("exam");
    if (q && EXAM_LIST.some((e) => e.slug === q)) setExam(q as ExamSlug);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setMessage("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      exam: String(fd.get("exam") ?? ""),
      examPeriod: String(fd.get("examPeriod") ?? ""),
      result: String(fd.get("result") ?? ""),
      studyPeriod: String(fd.get("studyPeriod") ?? ""),
      score: String(fd.get("score") ?? ""),
      materials: String(fd.get("materials") ?? ""),
      comment: String(fd.get("comment") ?? ""),
      displayName: String(fd.get("displayName") ?? ""),
      email: String(fd.get("email") ?? ""),
      website: String(fd.get("website") ?? ""), // ハニーポット
      consent: fd.get("consent") === "on",
    };

    try {
      const res = await fetch("/api/pass-report/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "送信に失敗しました。時間をおいてお試しください。");
        return;
      }
      setStatus("done");
      try {
        sendGAEvent("event", "pass_report_submit", { exam: payload.exam, result: payload.result });
      } catch {
        /* GA未ロードでも送信は完了している */
      }
    } catch {
      setStatus("error");
      setMessage("送信に失敗しました。通信環境をご確認のうえ、もう一度お試しください。");
    }
  }

  if (status === "done") {
    return (
      <div className="card p-6">
        <p className="text-base font-bold text-[color:var(--c-ink)] font-serif mb-2">
          報告ありがとうございました
        </p>
        <p className="text-sm text-[color:var(--c-text-sub)] leading-relaxed">
          いただいた内容は問題と解説の見直しに使わせていただきます。
          掲載する場合は、内容を変えずにそのまま
          <a href="/voice/" className="underline hover:no-underline mx-0.5">合格報告のページ</a>
          と資格ページに載せます。掲載までに数日いただくことがあります。
        </p>
      </div>
    );
  }

  const labelClass = "block text-sm font-bold text-[color:var(--c-ink)] mb-1.5";
  const inputClass =
    "w-full rounded-lg border border-[color:var(--c-border)] bg-white px-3 py-2 text-sm text-[color:var(--c-text)] focus:outline-none focus:border-[color:var(--c-accent)]";
  const noteClass = "text-xs text-[color:var(--c-text-sub)] mt-1 leading-relaxed";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="exam" className={labelClass}>
          受験した資格 <span className="text-red-700">必須</span>
        </label>
        <select
          id="exam"
          name="exam"
          required
          value={exam}
          onChange={(ev) => setExam(ev.target.value as ExamSlug)}
          className={inputClass}
        >
          <option value="">選択してください</option>
          {EXAM_LIST.map((e) => (
            <option key={e.slug} value={e.slug}>
              {e.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="examPeriod" className={labelClass}>
          受験した時期 <span className="text-red-700">必須</span>
        </label>
        <input
          id="examPeriod"
          name="examPeriod"
          type="text"
          required
          maxLength={40}
          placeholder="2026年11月"
          className={inputClass}
        />
        <p className={noteClass}>
          年月までで結構です。日付までは掲載しません（受験者が特定されないようにするためです）。
        </p>
      </div>

      <fieldset>
        <legend className={labelClass}>
          結果 <span className="text-red-700">必須</span>
        </legend>
        <div className="flex gap-5">
          {[
            { value: "pass", label: "合格" },
            { value: "fail", label: "不合格" },
          ].map((o) => (
            <label key={o.value} className="flex items-center gap-2 text-sm text-[color:var(--c-text)]">
              <input type="radio" name="result" value={o.value} required />
              {o.label}
            </label>
          ))}
        </div>
        <p className={noteClass}>
          不合格の報告も歓迎します。どこで足りなかったかは、これから受ける方にとって合格体験より役に立つことがあります。
        </p>
      </fieldset>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="studyPeriod" className={labelClass}>
            学習期間（任意）
          </label>
          <input id="studyPeriod" name="studyPeriod" type="text" maxLength={40} placeholder="3か月" className={inputClass} />
        </div>
        <div>
          <label htmlFor="score" className={labelClass}>
            点数・スコア（任意）
          </label>
          <input id="score" name="score" type="text" maxLength={40} placeholder="50問中38点" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="materials" className={labelClass}>
          使った教材（任意）
        </label>
        <input
          id="materials"
          name="materials"
          type="text"
          maxLength={200}
          placeholder="市販のテキスト1冊と、このサイトの問題"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="comment" className={labelClass}>
          コメント <span className="text-red-700">必須</span>
        </label>
        <textarea
          id="comment"
          name="comment"
          required
          minLength={20}
          maxLength={2000}
          rows={8}
          placeholder="どの分野が難しかったか、当サイトの問題は本試験とどれくらい近かったか、これから受ける人へのアドバイスなど"
          className={inputClass}
        />
        <p className={noteClass}>
          20文字以上・2,000文字まで。いただいた文章は編集せずそのまま掲載します。
          <strong className="text-[color:var(--c-ink)]">
            本試験の問題文・選択肢・正答を再現した内容は、守秘義務にあたるため掲載しません。
          </strong>
          傾向や手ごたえをお書きください。
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="displayName" className={labelClass}>
            表示名（任意）
          </label>
          <input id="displayName" name="displayName" type="text" maxLength={40} placeholder="くま" className={inputClass} />
          <p className={noteClass}>未記入の場合は「匿名」で掲載します。本名は書かないでください。</p>
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            メールアドレス（任意）
          </label>
          <input id="email" name="email" type="email" maxLength={200} placeholder="example@example.com" className={inputClass} />
          <p className={noteClass}>
            掲載前の確認や、内容について質問したいときにだけ使います。掲載はしません。
          </p>
        </div>
      </div>

      {/* ハニーポット。自動投稿対策。人には見えない */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="card p-4">
        <label className="flex items-start gap-2.5 text-sm text-[color:var(--c-text)]">
          <input type="checkbox" name="consent" required className="mt-1" />
          <span>
            投稿した内容（資格・受験時期・結果・学習期間・スコア・教材・コメント・表示名）を、
            当サイトに掲載することに同意します。
            <span className="block text-xs text-[color:var(--c-text-sub)] mt-1 leading-relaxed">
              掲載するかどうかは運営が内容を読んで判断します。すべての報告を掲載するとは限りません。
              掲載後の削除のご依頼にも対応します。
            </span>
          </span>
        </label>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-700 leading-relaxed">{message}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-accent disabled:opacity-60"
      >
        {status === "sending" ? "送信中…" : "報告を送信する"}
      </button>
    </form>
  );
}
