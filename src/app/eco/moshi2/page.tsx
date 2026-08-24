import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import Moshi2PageBody from "@/components/Moshi2PageBody";

export const metadata: Metadata = pageMetadata({
  path: "/eco/moshi2/",
  title: "eco検定（環境社会検定試験） 模擬試験 第2回（有料）｜50問・90分",
  description:
    "eco検定（環境社会検定試験）の模擬試験 第2回。第1回とは完全に別問題で、本試験と同じ50問・90分の条件で受験でき、終了後に合否判定・分野別の弱点分析・全問の解説を確認できます。買い切り¥1,280・登録不要。",
});

export default function Page() {
  return <Moshi2PageBody certId="eco" />;
}
