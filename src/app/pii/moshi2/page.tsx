import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import Moshi2PageBody from "@/components/Moshi2PageBody";

export const metadata: Metadata = pageMetadata({
  path: "/pii/moshi2/",
  title: "個人情報保護士 模擬試験 第2回（有料）｜100問・150分",
  description:
    "個人情報保護士の模擬試験 第2回。第1回とは完全に別問題で、本試験と同じ100問・150分の条件で受験でき、終了後に合否判定・分野別の弱点分析・全問の解説を確認できます。買い切り¥1,980・登録不要。",
});

export default function Page() {
  return <Moshi2PageBody certId="pii" />;
}
