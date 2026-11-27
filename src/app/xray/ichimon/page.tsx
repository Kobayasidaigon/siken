import IchimonPage, { ichimonMetadata } from "@/components/IchimonPage";

/** 一問一答(○×)。2026-11-27 追加。中身は components/IchimonPage.tsx */
export const metadata = ichimonMetadata("xray");

export default function XrayIchimonPage() {
  return <IchimonPage exam="xray" theme="theme-pii" />;
}
