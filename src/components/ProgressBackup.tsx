"use client";

/**
 * 学習履歴の書き出し・読み込み。2026-09-07 追加。
 *
 * 保存先はブラウザの localStorage だけなので、機種変・ブラウザ変更・
 * サイトデータの削除で消える。サーバに置かない方針は変えずに、
 * 手元のファイルで退避と復元ができるようにする。
 *
 * 「サーバには送信されません」と書いて集めてきた履歴なので、
 * ここでも送信は一切しない。ファイルの読み書きはすべてブラウザ内で完結する。
 */

import { useRef, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { exportProgress, importProgress, type ImportMode } from "@/lib/study-progress";

type Note = { kind: "ok" | "ng"; text: string } | null;

/**
 * いまの学習履歴をJSONファイルとして保存させる。
 * suffix は置き換え前の自動退避と手動の書き出しを、ファイル名で見分けるためのもの。
 */
function downloadProgress(suffix: string): boolean {
  try {
    const data = exportProgress();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // 日付入りにして、複数世代を手元に置いても見分けがつくようにする
    a.download = `shikakumon-study-${data.exportedAt.slice(0, 10)}${suffix}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}

function track(name: string, params: Record<string, unknown>) {
  try {
    sendGAEvent("event", name, params);
  } catch {
    /* GA未ロードでも書き出し・読み込みは動く */
  }
}

export default function ProgressBackup() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<ImportMode>("merge");
  const [note, setNote] = useState<Note>(null);

  function handleExport() {
    if (downloadProgress("")) {
      setNote({ kind: "ok", text: "書き出しました。このファイルを新しい端末で読み込んでください。" });
      track("progress_export", {});
    } else {
      setNote({ kind: "ng", text: "書き出せませんでした。別のブラウザでお試しください。" });
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // 同じファイルを続けて選べるように、読み終えたら値を空にする
    e.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setNote({ kind: "ng", text: "ファイルが大きすぎます。学習履歴のファイルか確認してください。" });
      return;
    }
    if (mode === "replace") {
      // 置き換えは取り消せない。サーバに控えが無いので、戻す手段は手元のファイルだけ。
      // 先にいまの履歴を書き出しておく。黙ってファイルが2つ落ちると不審に見えるので、
      // confirm で必ず予告する。
      if (
        !confirm(
          "いまの学習履歴を消して、ファイルの内容に置き換えます。\n" +
            "取り消せないので、先にいまの履歴をバックアップとして書き出します（ファイルが2つ保存されます）。\n\n" +
            "続けますか？"
        )
      ) {
        return;
      }
      downloadProgress("-before-replace");
    }
    try {
      const parsed = JSON.parse(await file.text());
      const res = importProgress(parsed, mode);
      if (!res.ok) {
        setNote({ kind: "ng", text: res.error ?? "読み込めませんでした。" });
        return;
      }
      setNote({
        kind: "ok",
        text: `読み込みました。解いた問題 ${res.totals?.attempted ?? 0} 問・ブックマーク ${res.totals?.bookmarks ?? 0} 件になりました。`,
      });
      track("progress_import", { mode });
    } catch {
      setNote({ kind: "ng", text: "ファイルを読み取れませんでした。書き出したファイルをそのままお使いください。" });
    }
  }

  return (
    <section className="card p-5">
      <h2 className="text-sm font-bold text-[color:var(--c-ink)] font-serif mb-1">履歴の持ち出しと復元</h2>
      <p className="text-xs text-[color:var(--c-text-sub)] leading-relaxed mb-4">
        学習履歴はこのブラウザの中にだけ保存されています。機種変更やブラウザのデータ削除で消えるので、
        ファイルに書き出して持ち出せるようにしています。読み書きはすべてブラウザ内で行い、どこにも送信しません。
      </p>

      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          onClick={handleExport}
          className="text-sm px-4 py-2 rounded-lg border border-[color:var(--c-border-strong)] text-[color:var(--c-ink)] hover:bg-[color:var(--c-bg-alt)] transition-colors"
        >
          ファイルに書き出す
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-sm px-4 py-2 rounded-lg border border-[color:var(--c-border-strong)] text-[color:var(--c-ink)] hover:bg-[color:var(--c-bg-alt)] transition-colors"
        >
          ファイルから読み込む
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      <fieldset className="mt-4">
        <legend className="text-xs font-bold text-[color:var(--c-ink)] mb-1.5">読み込むときの扱い</legend>
        <div className="flex flex-wrap gap-4 text-xs text-[color:var(--c-text)]">
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              name="import-mode"
              checked={mode === "merge"}
              onChange={() => setMode("merge")}
            />
            いまの履歴に足す
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              name="import-mode"
              checked={mode === "replace"}
              onChange={() => setMode("replace")}
            />
            いまの履歴を置き換える
          </label>
        </div>
        <p className="text-xs text-[color:var(--c-text-sub)] mt-1.5 leading-relaxed">
          足す場合、同じ問題はメダルが進んでいるほうを残します。
        </p>
      </fieldset>

      {note && (
        <p
          className={`text-xs mt-4 leading-relaxed ${
            note.kind === "ok" ? "text-[color:var(--c-correct)]" : "text-[color:var(--c-wrong)]"
          }`}
        >
          {note.text}
        </p>
      )}
    </section>
  );
}
