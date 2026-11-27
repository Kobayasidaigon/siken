import IchimonPage, { ichimonMetadata } from "@/components/IchimonPage";

/** 一問一答(○×)。2026-11-27 追加。中身は components/IchimonPage.tsx */
export const metadata = ichimonMetadata("gaia");

export default function GaiaIchimonPage() {
  return <IchimonPage exam="gaia" theme="theme-pii" />;
}
