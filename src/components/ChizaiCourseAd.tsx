/**
 * 知的財産管理技能検定3級 講座（オンスク.JP）の広告
 * 配置: 知財関連コラム末尾・知財トップページ・知財の問題ページ
 *
 * アガルート等の大手は知財検定の対策講座を提供していないため、現状はオンスク.JPを採用。
 * A8リンクはこのコンポーネントに一元管理する（複数ページで同一プログラムを使うため、
 * リンクが変わったときの更新漏れ＝収益取りこぼしを防ぐ目的）。
 * 各ページの文脈に合わせた訴求文を props で渡せる。渡さなければ汎用文を表示。
 */

import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";

interface Props {
  headline?: string;
  body?: string;
}

export default function ChizaiCourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "知財検定の対策講座をお探しの方へ";
  const finalBody =
    body ??
    "知的財産管理技能検定は市販教材が限られる試験です。月額制のオンライン講座オンスク.JPは知財検定3級講座を提供しており、スキマ時間で出題範囲を体系的に押さえられます。";

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
        <FreeLeadCTA exam="chizai" placement="course_ad" withBadge />
        <AffiliateLink
          href="https://px.a8.net/svt/ejp?a8mat=4B3TF4+BJKL0Y+408S+BW8O2&a8ejpredirect=https%3A%2F%2Fonsuku.jp%2Ftraining%2Fchizai3"
          course="chizai"
          placement="course_ad"
        >
          知的財産管理技能検定3級の対策講座を見る →
        </AffiliateLink>
      </div>
      <img
        width={1}
        height={1}
        src="https://www11.a8.net/0.gif?a8mat=4B3TF4+BJKL0Y+408S+BW8O2"
        alt=""
        style={{ position: "absolute", border: 0 }}
      />
    </aside>
  );
}
