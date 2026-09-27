import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import Moshi2PageBody from "@/components/Moshi2PageBody";

export const metadata: Metadata = pageMetadata({
  path: "/jitsumu/moshi2/",
  title: "個人情報保護実務検定 第2回模擬試験（本番形式・全問解説・弱点診断）",
  description:
    "個人情報保護実務検定の第2回模擬試験。第1回とは1問も重複しない初見の80問で、本試験と同じ90分の条件をもう一度通す本番前の最終確認用。全問解説・分野別の弱点診断・A4印刷用紙面つき。買い切り¥1,980・登録不要。",
});

export default function Page() {
  return <Moshi2PageBody certId="jitsumu" />;
}
