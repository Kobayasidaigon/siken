import IchimonPage, { ichimonMetadata } from "@/components/IchimonPage";

/** 一問一答(○×)。2026-11-27 追加。中身は components/IchimonPage.tsx */
export const metadata = ichimonMetadata("llc");

export default function LlcIchimonPage() {
  return <IchimonPage exam="llc" theme="theme-pii" />;
}
