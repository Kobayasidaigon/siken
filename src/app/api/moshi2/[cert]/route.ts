// =============================================================================
// 第2回模試の配信。2026-11-08 に無料化し、購入者の確認(署名 cookie)を外した。
//
// 問題はページの HTML に入れず、受験画面(Moshi2Gate)と印刷用紙面(Moshi2Print)が
// ここから取りに行く。100問超の問題と解説を静的 HTML に入れると第2回のページだけ
// 極端に重くなるため、この形を残している。
// =============================================================================

import { NextResponse } from "next/server";
import { loadMoshi2 } from "@/lib/moshi2-load";
import { moshi2ProductOf } from "@/lib/moshi2-products";

export async function GET(_request: Request, { params }: { params: Promise<{ cert: string }> }) {
  const { cert } = await params;

  const product = moshi2ProductOf(cert);
  if (!product) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const questions = await loadMoshi2(cert);
  if (!questions) {
    return NextResponse.json({ error: "not_ready" }, { status: 503 });
  }

  return NextResponse.json(
    {
      def: {
        round: 2,
        timeLimitMin: product.timeLimitMin,
        passCount: product.passCount,
        passLabel: product.passLabel,
        choiceLabel: product.choiceLabel,
        passPoints: product.passPoints,
        pointsPerQuestion: product.pointsPerQuestion,
        sections: product.sections,
      },
      questions,
    },
    // 誰が取っても同じ内容なので CDN に1日置いてよい。問題を直したときは再デプロイで入れ替わる。
    { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } }
  );
}
