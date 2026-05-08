import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import StudyClient from "./StudyClient";

export const metadata: Metadata = pageMetadata({
  path: "/study/",
  title: "学習履歴｜ブックマーク・間違えた問題の見直し",
  description: "シカクモンで解いた問題の正誤履歴とブックマークを表示します。間違えた問題から再挑戦したり、後で見直したい問題を整理できます。",
});

export default function StudyPage() {
  return <StudyClient />;
}
