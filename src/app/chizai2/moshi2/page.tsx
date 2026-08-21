import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import Moshi2PageBody from "@/components/Moshi2PageBody";

export const metadata: Metadata = pageMetadata({
  path: "/chizai2/moshi2/",
  title: "知的財産管理技能検定2級 模擬試験 第2回（有料）｜40問・60分",
  description:
    "知的財産管理技能検定2級の模擬試験 第2回。第1回とは完全に別問題で、本試験と同じ40問・60分の条件で受験でき、終了後に合否判定・分野別の弱点分析・全問の解説を確認できます。買い切り¥1,280・登録不要。",
});

export default function Page() {
  return <Moshi2PageBody certId="chizai2" />;
}
