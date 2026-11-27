import IchimonPage, { ichimonMetadata } from "@/components/IchimonPage";

/** 一問一答(○×)。2026-11-27 追加。中身は components/IchimonPage.tsx */
export const metadata = ichimonMetadata("hoikushi");

export default function HoikushiIchimonPage() {
  return <IchimonPage exam="hoikushi" theme="theme-pii" />;
}
