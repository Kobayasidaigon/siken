// =============================================================================
// 問題ごとの「みんなの正答率」と「間違えた人が多い問題」。2026-09-13 追加。
//
// 出典は Studio の集計API(契約は docs/growth-kit.md)。ここは薄い代理で、
//   - n が 30 未満の問題は落とす(方針 §7: 統計は n>=30 まで表示しない)
//   - 応答を CDN にキャッシュさせる(1問ページのたびに Studio を叩かない)
//   - Studio 未設定・障害時は空を返す(ページ側は何も出さない)
// の3つだけを担う。
//
//   GET /api/question-stats/?exam=fukushi2&slugs=fukushi2-001,fukushi2-002
//     → { stats: { "fukushi2-001": { n: 132, rate: 61 } } }
//   GET /api/question-stats/?exam=fukushi2&top=10
//     → { top: [ { slug: "fukushi2-118", n: 90, rate: 31, topic: "…", field: "…" } ] }
//     正答率が低い順。topic / field は本体の問題データから付ける(資格トップの HTML に
//     全問ぶんの見出し表を埋め込まずに済むように、ここで解決する)
// =============================================================================

import { NextResponse } from "next/server";
import { EXAM_LIST, type ExamSlug } from "@/lib/study-progress";
import { getQuestionsOf, topicOf } from "@/lib/question-registry";

export const MIN_SAMPLE = 30;
const MAX_SLUGS = 20;
const MAX_TOP = 10;
const SLUG = /^[a-zA-Z0-9-]{1,80}$/;
const EXAMS = new Set<string>(EXAM_LIST.map((e) => e.slug));
const FETCH_TIMEOUT_MS = 3000;
/** Studio 側の集計は時間単位で十分。CDN と Next の data cache の両方に効かせる */
const REVALIDATE_SEC = 1800;

const CACHE_HEADERS = {
  "Cache-Control": `public, s-maxage=${REVALIDATE_SEC}, stale-while-revalidate=${REVALIDATE_SEC * 2}`,
};

type Stat = { n: number; rate: number };

function cleanStat(v: unknown): Stat | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const n = typeof o.n === "number" ? Math.floor(o.n) : NaN;
  const rate = typeof o.rate === "number" ? Math.round(o.rate) : NaN;
  if (!Number.isFinite(n) || !Number.isFinite(rate)) return null;
  if (n < MIN_SAMPLE || rate < 0 || rate > 100) return null;
  return { n, rate };
}

async function fetchStudio(query: URLSearchParams): Promise<unknown | null> {
  const base = process.env.STUDIO_STATS_URL;
  if (!base) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const sep = base.includes("?") ? "&" : "?";
    const res = await fetch(`${base}${sep}${query.toString()}`, {
      signal: controller.signal,
      next: { revalidate: REVALIDATE_SEC },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const exam = searchParams.get("exam") ?? "";
  if (!EXAMS.has(exam)) {
    return NextResponse.json({ stats: {}, top: [] }, { status: 400, headers: CACHE_HEADERS });
  }

  const topParam = searchParams.get("top");
  if (topParam != null) {
    const limit = Math.min(MAX_TOP, Math.max(1, parseInt(topParam, 10) || MAX_TOP));
    const data = await fetchStudio(new URLSearchParams({ site: "main", exam, top: String(limit) }));
    const list = data && typeof data === "object" ? (data as { top?: unknown }).top : null;
    const top: { slug: string; n: number; rate: number }[] = [];
    if (Array.isArray(list)) {
      for (const item of list) {
        if (!item || typeof item !== "object") continue;
        const slug = (item as { slug?: unknown }).slug;
        const stat = cleanStat(item);
        if (typeof slug !== "string" || !SLUG.test(slug) || !stat) continue;
        top.push({ slug, ...stat });
      }
    }
    top.sort((a, b) => a.rate - b.rate);
    const picked = top.slice(0, limit);
    if (picked.length === 0) return NextResponse.json({ top: [] }, { headers: CACHE_HEADERS });
    // 実在する問題だけを、見出し(論点・分野)付きで返す
    const questions = await getQuestionsOf(exam as ExamSlug);
    const byslug = new Map(questions.map((q) => [q.slug, q]));
    const enriched = picked.flatMap((row) => {
      const q = byslug.get(row.slug);
      return q ? [{ ...row, topic: topicOf(q.title), field: q.field }] : [];
    });
    return NextResponse.json({ top: enriched }, { headers: CACHE_HEADERS });
  }

  const slugs = (searchParams.get("slugs") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => SLUG.test(s))
    .slice(0, MAX_SLUGS);
  if (slugs.length === 0) {
    return NextResponse.json({ stats: {} }, { headers: CACHE_HEADERS });
  }
  const data = await fetchStudio(new URLSearchParams({ site: "main", exam, slugs: slugs.join(",") }));
  const src = data && typeof data === "object" ? (data as { stats?: unknown }).stats : null;
  const stats: Record<string, Stat> = {};
  if (src && typeof src === "object") {
    for (const slug of slugs) {
      const stat = cleanStat((src as Record<string, unknown>)[slug]);
      if (stat) stats[slug] = stat;
    }
  }
  return NextResponse.json({ stats }, { headers: CACHE_HEADERS });
}
