import type { Metadata } from "next";
import ShikenmaePage, { shikenmaeMetadata } from "../../../ShikenmaePage";
import { SHIKENMAE_EVENTS, SHIKENMAE_SIZE, dateKey } from "@/lib/shikenmae";

// 「試験前の10問」の、投稿から来た人の着地ページ。点は 0〜10 だけ(範囲外は 404)。canonical は出さない。
export const dynamicParams = false;

export function generateStaticParams() {
  return SHIKENMAE_EVENTS.flatMap((e) =>
    Array.from({ length: SHIKENMAE_SIZE + 1 }, (_, s) => ({ exam: e.exam, date: dateKey(e.date), score: String(s) })),
  );
}

export async function generateMetadata({ params }: { params: Promise<{ exam: string; date: string; score: string }> }): Promise<Metadata> {
  const { exam, date, score } = await params;
  return shikenmaeMetadata(exam, date, Number(score));
}

export default async function Page({ params }: { params: Promise<{ exam: string; date: string; score: string }> }) {
  const { exam, date, score } = await params;
  return <ShikenmaePage exam={exam} date={date} score={Number(score)} />;
}
