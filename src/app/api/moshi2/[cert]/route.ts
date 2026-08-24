// =============================================================================
// 第2回模試(有料)の配信。購入者の署名 cookie を検証してからペーパーを返す。
//
// 未購入は 402 を返す。受験画面はこのステータスを見て「購入」と「受験」を
// 出し分けるので、有料の問題データが未購入者のバンドルに載ることはない。
// =============================================================================

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { accessCookieName, isDevUnlockEnabled, verifyAccess } from "@/lib/access";
import { loadMoshi2 } from "@/lib/moshi2-load";
import { moshi2ProductOf } from "@/lib/moshi2-products";

export async function GET(_request: Request, { params }: { params: Promise<{ cert: string }> }) {
  const { cert } = await params;

  const product = moshi2ProductOf(cert);
  if (!product) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // 開発時のみ、決済を通さずに中身を確認できる(本番では必ず false)
  const devUnlocked = isDevUnlockEnabled();
  const jar = await cookies();
  const token = jar.get(accessCookieName(cert))?.value;
  if (!devUnlocked && !verifyAccess(token, cert)) {
    // 未購入。商品情報だけ返して購入画面を描けるようにする。
    return NextResponse.json(
      { error: "payment_required", product: { name: product.name, priceJpy: product.priceJpy } },
      { status: 402 }
    );
  }

  const questions = await loadMoshi2(cert);
  if (!questions) {
    return NextResponse.json({ error: "not_ready" }, { status: 503 });
  }

  return NextResponse.json(
    {
      // 画面側に「決済を通さず開いている」と出すための印。本番では常に undefined
      dev: devUnlocked ? true : undefined,
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
    // 購入者ごとの内容。CDN にもブラウザにも残さない。
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
