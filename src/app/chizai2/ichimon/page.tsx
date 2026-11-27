import IchimonPage, { ichimonMetadata } from "@/components/IchimonPage";

/** 一問一答(○×)。2026-11-27 追加。中身は components/IchimonPage.tsx */
export const metadata = ichimonMetadata("chizai2");

export default function Chizai2IchimonPage() {
  return <IchimonPage exam="chizai2" theme="theme-chizai" />;
}
