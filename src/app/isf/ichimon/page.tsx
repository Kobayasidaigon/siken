import IchimonPage, { ichimonMetadata } from "@/components/IchimonPage";

/** 一問一答(○×)。2026-11-27 追加。中身は components/IchimonPage.tsx */
export const metadata = ichimonMetadata("isf");

export default function IsfIchimonPage() {
  return <IchimonPage exam="isf" theme="theme-pii" />;
}
