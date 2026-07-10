import { getAllColumns } from "@/lib/columns";

/**
 * RSS 2.0 フィード(/feed.xml)。
 *
 * にほんブログ村等のランキングサイト登録やRSSリーダー購読用。
 * output:"export" のため force-static でビルド時に静的生成される。
 * コラム追加時はデプロイで自動更新。
 */
export const dynamic = "force-static";

const BASE_URL = "https://shikakumon.com";
const SITE_NAME = "シカクモン";
const SITE_DESCRIPTION =
  "資格試験の無料練習問題サイト「シカクモン」の学習コラム更新情報です。";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toPubDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00+09:00`);
  return Number.isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

export async function GET() {
  const columns = (await getAllColumns()).slice(0, 20);

  const items = columns
    .map((c) => {
      const url = `${BASE_URL}/column/${c.slug}/`;
      const date = c.updatedAt || c.publishedAt;
      return `    <item>
      <title>${escapeXml(c.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(c.description)}</description>
      <pubDate>${toPubDate(date)}</pubDate>
    </item>`;
    })
    .join("\n");

  const latest = columns[0];
  const lastBuildDate = latest
    ? toPubDate(latest.updatedAt || latest.publishedAt)
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${BASE_URL}</link>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>${SITE_DESCRIPTION}</description>
    <language>ja</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
