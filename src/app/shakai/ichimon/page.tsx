import IchimonPage, { ichimonMetadata } from "@/components/IchimonPage";

/** 一問一答(○×)。2026-11-27 追加。中身は components/IchimonPage.tsx */
export const metadata = ichimonMetadata("shakai");

export default function ShakaiIchimonPage() {
  return <IchimonPage exam="shakai" theme="theme-eco" />;
}
