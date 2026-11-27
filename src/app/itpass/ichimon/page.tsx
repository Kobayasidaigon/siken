import IchimonPage, { ichimonMetadata } from "@/components/IchimonPage";

/** 一問一答(○×)。2026-11-27 追加。中身は components/IchimonPage.tsx */
export const metadata = ichimonMetadata("itpass");

export default function ItpassIchimonPage() {
  return <IchimonPage exam="itpass" theme="theme-pii" />;
}
