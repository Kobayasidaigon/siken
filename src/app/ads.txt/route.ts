import { ADSENSE_PUBLISHER } from "@/lib/adsense";

// AdSense の ads.txt。運営者 ID は環境変数から組み立てる(src/lib/adsense.ts)。
// f08c47fec0942fa0 は Google の認証局 ID で、全サイト共通の固定値。
export const dynamic = "force-static";

export async function GET() {
  if (!ADSENSE_PUBLISHER) {
    return new Response("Not Found", { status: 404 });
  }
  return new Response(`google.com, ${ADSENSE_PUBLISHER}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
