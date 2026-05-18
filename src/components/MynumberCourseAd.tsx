/**
 * マイナンバー実務検定 公式講座（全日本情報学習振興協会）の広告
 * 配置: マイナンバー関連コラム記事の本文末尾、マイナンバートップページ
 */

interface Props {
  headline?: string;
  body?: string;
}

export default function MynumberCourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "独学に不安があれば";
  const finalBody = body ?? "マイナンバー実務検定試験を実施している全日本情報学習振興協会では、公式の認定講座「SMART合格講座」を提供しています。試験範囲を体系的に学びたい方は検討してみてください。";

  return (
    <aside className="my-10 p-5 rounded-lg border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)]">
      <p className="mb-3">
        <span className="text-[10px] tracking-wider text-[color:var(--c-text-sub)] border border-[color:var(--c-border)] px-1.5 py-0.5 rounded">
          広告
        </span>
      </p>
      <p className="text-xs text-[color:var(--c-text-sub)] mb-3">{finalHeadline}</p>
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-3">
        {finalBody}
      </p>
      <a
        href="https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.joho-gakushu.jp%2Fsmartinfo%2Fk_nns%2F"
        rel="nofollow sponsored noopener"
        target="_blank"
        className="text-sm text-blue-700 hover:underline font-medium"
      >
        マイナンバー実務検定のSMART合格講座を見る →
      </a>
      <img
        width={1}
        height={1}
        src="https://www14.a8.net/0.gif?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2"
        alt=""
        style={{ position: "absolute", border: 0 }}
      />
    </aside>
  );
}
