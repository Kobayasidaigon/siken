import type { Metadata } from "next";
import TenshokuPage from "@/components/TenshokuPage";
import { getTenshoku } from "@/lib/tenshoku";
import { pageMetadata } from "@/lib/page-metadata";

// 中身は src/data/tenshoku/chintai.json(lib/tenshoku.ts)。2026-11-14 追加
const d = getTenshoku("chintai");

export const metadata: Metadata = pageMetadata({ path: d.path, title: d.title, description: d.description });

export default function Page() {
  return <TenshokuPage exam="chintai" />;
}
