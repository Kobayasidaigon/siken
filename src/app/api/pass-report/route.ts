// =============================================================================
// 合格報告(利用者からの受験報告)の受け口。2026-09-05 追加。
//
// 受け取った内容は保存せず、運営宛のメールに転送するだけ。DBを増やさないのは、
// 個人情報を溜めないため(投稿者のメールアドレスは任意項目で、掲載前の確認連絡にしか
// 使わない)。掲載は運営が内容を読んで判断し、src/content/voices/ に手で書き写す。
// 自動で公開される経路は無い。
//
// RESEND_API_KEY 未設定でもエラーにはしない(送れなかったことを応答で伝える)。
// =============================================================================

import { NextResponse } from "next/server";
import { sendMail } from "@/lib/email";
import { MOSHI2_CONFIG } from "@/lib/moshi2-config";
import { EXAM_LIST } from "@/lib/study-progress";

const EXAM_NAMES = new Map(EXAM_LIST.map((e) => [e.slug as string, e.name]));

const LIMITS = {
  comment: { min: 20, max: 2000 },
  short: 80,
  email: 200,
} as const;

/**
 * 同一IPからの連投を抑える最小の制限。サーバーレスではインスタンスごとの記憶なので
 * 完全ではないが、素朴な繰り返し投稿は止まる。厳密な制御が要るほど投稿が増えたら
 * 別の手段(Turnstile 等)を検討する。
 *
 * 【数えるのは「受け付けた投稿」だけ】入力の不備で弾いた分まで数えると、
 * コメントが短くて3回やり直した人が4回目に送れなくなる。チェックは先に行い、
 * カウントは受け付けたとき(ハニーポットで捨てたときも含む)だけにする。
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const recent = new Map<string, number[]>();

function hitsWithinWindow(ip: string, now: number): number[] {
  return (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
}

/** すでに上限まで受け付けているか(この呼び出しでは数えない) */
function isRateLimited(ip: string): boolean {
  return hitsWithinWindow(ip, Date.now()).length >= MAX_PER_WINDOW;
}

/** 投稿を受け付けたことを記録する */
function recordSubmission(ip: string): void {
  const now = Date.now();
  if (recent.size > 500) recent.clear(); // 際限なく増やさない
  recent.set(ip, [...hitsWithinWindow(ip, now), now]);
}

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "短時間に何度も送信されています。しばらく時間をおいてからお試しください。" },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "リクエストが不正です。" }, { status: 400 });
  }

  // ハニーポット。人間には見えない項目に値が入っていたら自動投稿とみなして黙って捨てる
  // (捨てた分も数える。数えないとボットが上限なく叩けてしまう)
  if (str(body.website, 100)) {
    recordSubmission(ip);
    return NextResponse.json({ ok: true });
  }

  const exam = str(body.exam, 40);
  const examName = EXAM_NAMES.get(exam);
  const examPeriod = str(body.examPeriod, LIMITS.short);
  const result = str(body.result, 10);
  const comment = str(body.comment, LIMITS.comment.max);
  const consent = body.consent === true;

  if (!examName) {
    return NextResponse.json({ error: "資格を選んでください。" }, { status: 400 });
  }
  if (!examPeriod) {
    return NextResponse.json({ error: "受験した時期を入力してください。" }, { status: 400 });
  }
  if (result !== "pass" && result !== "fail") {
    return NextResponse.json({ error: "結果を選んでください。" }, { status: 400 });
  }
  if (comment.length < LIMITS.comment.min) {
    return NextResponse.json(
      { error: `コメントは${LIMITS.comment.min}文字以上でお願いします。` },
      { status: 400 },
    );
  }
  if (!consent) {
    return NextResponse.json(
      { error: "サイトへの掲載に同意いただける場合のみ送信できます。" },
      { status: 400 },
    );
  }

  const studyPeriod = str(body.studyPeriod, LIMITS.short);
  const score = str(body.score, LIMITS.short);
  const materials = str(body.materials, LIMITS.short * 4);
  const displayName = str(body.displayName, LIMITS.short);
  const email = str(body.email, LIMITS.email);

  const lines = [
    "合格報告フォームから投稿がありました。",
    "",
    `資格:       ${examName} (${exam})`,
    `受験時期:   ${examPeriod}`,
    `結果:       ${result === "pass" ? "合格" : "不合格"}`,
    `学習期間:   ${studyPeriod || "(未記入)"}`,
    `スコア:     ${score || "(未記入)"}`,
    `使った教材: ${materials || "(未記入)"}`,
    `表示名:     ${displayName || "(未記入 → 匿名で掲載)"}`,
    `連絡先:     ${email || "(未記入)"}`,
    "掲載同意:   あり",
    "",
    "--- コメント ---",
    comment,
    "",
    "----",
    "掲載するときは src/content/voices/ に .md を作ってください(書式は src/lib/voices.ts)。",
    "内容を作り変えず、実際に届いた文章のまま載せること。",
  ];

  const sent = await sendMail({
    to: MOSHI2_CONFIG.contactEmail,
    subject: `[シカクモン] 合格報告: ${examName} (${result === "pass" ? "合格" : "不合格"})`,
    text: lines.join("\n"),
  });

  if (!sent) {
    // メールの設定前でも投稿者を不安にさせない。ログには残る
    console.error("pass-report: メールを送れませんでした", { exam, examPeriod });
    return NextResponse.json(
      {
        error: `送信に失敗しました。お手数ですが ${MOSHI2_CONFIG.contactEmail} まで直接お送りください。`,
      },
      { status: 502 },
    );
  }

  recordSubmission(ip);
  return NextResponse.json({ ok: true });
}
