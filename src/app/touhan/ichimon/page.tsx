import IchimonPage, { ichimonMetadata } from "@/components/IchimonPage";

/** 一問一答(○×)。2026-11-27 追加。中身は components/IchimonPage.tsx */
export const metadata = ichimonMetadata("touhan");

export default function TouhanIchimonPage() {
  return <IchimonPage exam="touhan" theme="theme-pii" />;
}
