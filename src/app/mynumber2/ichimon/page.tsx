import IchimonPage, { ichimonMetadata } from "@/components/IchimonPage";

/** 一問一答(○×)。2026-11-27 追加。中身は components/IchimonPage.tsx */
export const metadata = ichimonMetadata("mynumber2");

export default function Mynumber2IchimonPage() {
  return <IchimonPage exam="mynumber2" theme="theme-pii" />;
}
