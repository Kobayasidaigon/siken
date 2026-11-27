import IchimonPage, { ichimonMetadata } from "@/components/IchimonPage";

/** 一問一答(○×)。2026-11-27 追加。中身は components/IchimonPage.tsx */
export const metadata = ichimonMetadata("had");

export default function HadIchimonPage() {
  return <IchimonPage exam="had" theme="theme-pii" />;
}
