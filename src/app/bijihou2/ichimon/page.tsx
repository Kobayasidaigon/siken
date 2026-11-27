import IchimonPage, { ichimonMetadata } from "@/components/IchimonPage";

/** 一問一答(○×)。2026-11-27 追加。中身は components/IchimonPage.tsx */
export const metadata = ichimonMetadata("bijihou2");

export default function Bijihou2IchimonPage() {
  return <IchimonPage exam="bijihou2" theme="theme-kashikin" />;
}
