// =============================================================================
// 回答ログの受け口。2026-09-13 追加(方針: docs/direction-2026-09.md §5-3)。
//
// ブラウザ(lib/growth/answer-log.ts)から sendBeacon で届く匿名の正誤ログを検証し、
// Studio の取り込みAPIへ転送する。ここでは保存しない(本体に DB を持たない)。
//
// 転送先が未設定(STUDIO_INGEST_URL なし)の間は、受け取って捨てる。
// sendBeacon は応答を読まないので、失敗しても常に 202 を返す。
//
// 【送らないもの】IP・User-Agent・Cookie は転送しない。届いた本文のうち、
// 検証を通った項目だけを組み直して送る(知らない項目は落とす)。
// =============================================================================

import { NextResponse } from "next/server";
import { EXAM_LIST } from "@/lib/study-progress";

const MAX_BODY_BYTES = 32 * 1024;
const MAX_EVENTS = 50;
const MODES = new Set(["question", "mock", "moshi", "drill", "daily", "column"]);
const EXAMS = new Set<string>(EXAM_LIST.map((e) => e.slug));
const ANON = /^[a-zA-Z0-9-]{8,64}$/;
const SLUG = /^[a-zA-Z0-9-]{1,80}$/;
/** 時刻のずれの許容幅。端末の時計が狂っていても、統計は「いつ頃」で足りる */
const TS_TOLERANCE_MS = 7 * 24 * 60 * 60 * 1000;
const FORWARD_TIMEOUT_MS = 3000;

type CleanEvent = {
  qid: string;
  exam: string;
  slug: string;
  correct: boolean;
  mode: string;
  ts: number;
};

function accepted(extra: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: true, ...extra }, { status: 202 });
}

export async function POST(request: Request) {
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return accepted({ accepted: 0 });
  }
  if (!raw || raw.length > MAX_BODY_BYTES) return accepted({ accepted: 0 });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return accepted({ accepted: 0 });
  }
  if (!body || typeof body !== "object") return accepted({ accepted: 0 });
  const b = body as Record<string, unknown>;
  if (b.v !== 1 || b.site !== "main") return accepted({ accepted: 0 });
  if (typeof b.anon !== "string" || !ANON.test(b.anon)) return accepted({ accepted: 0 });
  if (!Array.isArray(b.events)) return accepted({ accepted: 0 });

  const now = Date.now();
  const events: CleanEvent[] = [];
  for (const e of b.events.slice(0, MAX_EVENTS)) {
    if (!e || typeof e !== "object") continue;
    const ev = e as Record<string, unknown>;
    const exam = typeof ev.exam === "string" ? ev.exam : "";
    const slug = typeof ev.slug === "string" ? ev.slug : "";
    const mode = typeof ev.mode === "string" ? ev.mode : "";
    const ts = typeof ev.ts === "number" ? ev.ts : NaN;
    if (!EXAMS.has(exam) || !SLUG.test(slug) || !MODES.has(mode)) continue;
    if (typeof ev.correct !== "boolean") continue;
    if (!Number.isFinite(ts) || Math.abs(now - ts) > TS_TOLERANCE_MS) continue;
    const qid = `main:${exam}:${slug}`;
    if (ev.qid !== qid) continue;
    events.push({ qid, exam, slug, correct: ev.correct, mode, ts: Math.round(ts) });
  }
  if (events.length === 0) return accepted({ accepted: 0 });

  const url = process.env.STUDIO_INGEST_URL;
  if (!url) return accepted({ accepted: events.length, forwarded: false });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FORWARD_TIMEOUT_MS);
  try {
    const secret = process.env.STUDIO_INGEST_SECRET;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { Authorization: `Bearer ${secret}` } : {}),
      },
      body: JSON.stringify({ v: 1, site: "main", anon: b.anon, sentAt: now, events }),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error("answer-log: Studio への転送が失敗しました", res.status);
      return accepted({ accepted: events.length, forwarded: false });
    }
    return accepted({ accepted: events.length, forwarded: true });
  } catch (err) {
    console.error("answer-log: Studio へ転送できませんでした", err);
    return accepted({ accepted: events.length, forwarded: false });
  } finally {
    clearTimeout(timer);
  }
}
