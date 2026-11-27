import IchimonPage, { ichimonMetadata } from "@/components/IchimonPage";

/** 一問一答(○×)。2026-11-27 追加。中身は components/IchimonPage.tsx */
export const metadata = ichimonMetadata("dxa");

export default function DxaIchimonPage() {
  return <IchimonPage exam="dxa" theme="theme-pii" />;
}
