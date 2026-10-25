import type { Metadata } from "next";
import ShikenmaePage, { shikenmaeMetadata } from "../../ShikenmaePage";
import { SHIKENMAE_EVENTS, dateKey } from "@/lib/shikenmae";

// 「試験前の10問」のイベントのページ。lib/shikenmae.ts を参照。一覧に無い資格・日付は 404。
export const dynamicParams = false;

export function generateStaticParams() {
  return SHIKENMAE_EVENTS.map((e) => ({ exam: e.exam, date: dateKey(e.date) }));
}

export async function generateMetadata({ params }: { params: Promise<{ exam: string; date: string }> }): Promise<Metadata> {
  const { exam, date } = await params;
  return shikenmaeMetadata(exam, date);
}

export default async function Page({ params }: { params: Promise<{ exam: string; date: string }> }) {
  const { exam, date } = await params;
  return <ShikenmaePage exam={exam} date={date} />;
}
