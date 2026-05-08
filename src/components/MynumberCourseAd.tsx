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
      <p className="text-xs font-bold text-[color:var(--c-text-sub)] mb-3 inline-block px-2 py-0.5 rounded border border-[color:var(--c-border)] bg-[color:var(--c-surface)]">
        【広告】PRを含みます
      </p>
      <p className="text-xs text-[color:var(--c-text-sub)] mb-3">{finalHeadline}</p>
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-4">
        {finalBody}
      </p>
      <div className="flex justify-center">
        <a
          href="https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+6BEQ9"
          rel="nofollow sponsored"
          target="_blank"
        >
          <img
            width={300}
            height={250}
            alt="マイナンバー実務検定 SMART合格講座"
            src="https://www22.a8.net/svt/bgt?aid=260425368593&wid=001&eno=01&mid=s00000021473001061000&mc=1"
            style={{ maxWidth: "100%", height: "auto", border: 0 }}
          />
        </a>
        <img
          width={1}
          height={1}
          src="https://www10.a8.net/0.gif?a8mat=4B1TI0+9T22IA+4LOQ+6BEQ9"
          alt=""
          style={{ position: "absolute", border: 0 }}
        />
      </div>
    </aside>
  );
}
