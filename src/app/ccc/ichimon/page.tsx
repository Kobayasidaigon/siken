import IchimonPage, { ichimonMetadata } from "@/components/IchimonPage";

/** 一問一答(○×)。2026-11-27 追加。中身は components/IchimonPage.tsx */
export const metadata = ichimonMetadata("ccc");

export default function CccIchimonPage() {
  return <IchimonPage exam="ccc" theme="theme-pii" />;
}
