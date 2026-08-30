/**
 * 知的財産管理技能検定2級 講座（LECオンライン）の広告
 * 配置: 知財2級トップページ(他の2級面に広げるときもここを参照)
 *
 * 3級はオンスク(ChizaiCourseAd)のままだが、2級の専用対策講座はオンスクに無く、
 * LEC東京リーガルマインドが2級対策講座を提供しているため2級だけLECを採用
 * (A8提携承認2026-08-06・成果=講座/書籍購入1%+資料請求100円)。
 * hrefはA8商品リンク作成(掲載サイト=シカクモン)で生成したもの。改変しないこと。
 * 無料CTA(資料請求)は FreeLeadCTA が affiliate-links.ts の chizai2.freeHref を参照する。
 */

import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";

interface Props {
  headline?: string;
  body?: string;
}

export default function Chizai2CourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "知財検定2級の対策講座をお探しの方へ";
  const finalBody =
    body ??
    "知的財産管理技能検定2級は実務寄りの応用まで問われ、市販教材だけでは網羅しにくい試験です。資格スクールLEC東京リーガルマインドは2級の対策講座を提供しており、頻出論点を講義で体系的に押さえられます。";

  return (
    <aside className="theme-chizai my-10 p-5 rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)]">
      <p className="mb-3">
        <span className="text-[10px] tracking-wider text-[color:var(--c-text-sub)] border border-[color:var(--c-border)] px-1.5 py-0.5 rounded">
          広告
        </span>
      </p>
      <p className="text-xs text-[color:var(--c-text-sub)] mb-3">{finalHeadline}</p>
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-4">
        {finalBody}
      </p>
      <div className="flex flex-col items-start gap-3">
        <FreeLeadCTA exam="chizai2" placement="course_ad" withBadge />
        <AffiliateLink
          href="https://px.a8.net/svt/ejp?a8mat=4B9ZDE+3TJ5IQ+1G62+BW0YB&a8ejpredirect=https%3A%2F%2Fonline.lec-jp.com%2Fdisp%2FCSfDispListPage_001.jsp%3Fexm%3D10012%26gnr%3D2"
          course="chizai2"
          placement="course_ad"
        >
          LECの知的財産管理技能検定2級対策講座を見る →
        </AffiliateLink>
        <img
          width={1}
          height={1}
          src="https://www11.a8.net/0.gif?a8mat=4B9ZDE+3TJ5IQ+1G62+BW0YB"
          alt=""
          style={{ position: "absolute", border: 0 }}
        />
      </div>
    </aside>
  );
}
