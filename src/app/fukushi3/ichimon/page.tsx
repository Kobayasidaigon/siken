import IchimonPage, { ichimonMetadata } from "@/components/IchimonPage";

/** 一問一答(○×)。2026-11-27 追加。中身は components/IchimonPage.tsx */
export const metadata = ichimonMetadata("fukushi3");

export default function Fukushi3IchimonPage() {
  return <IchimonPage exam="fukushi3" theme="theme-fukushi" />;
}
