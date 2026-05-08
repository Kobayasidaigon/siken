/**
 * 個人情報保護士 公式講座（全日本情報学習振興協会）の広告
 * 配置: PII関連コラム記事の本文末尾、PIIトップページ
 *
 * 各ページの文脈に合わせた訴求文を props で渡せる。
 * 渡されない場合はデフォルトの汎用文を表示。
 */

interface Props {
  headline?: string;
  body?: string;
}

export default function PiiCourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "独学に不安があれば";
  const finalBody = body ?? "個人情報保護士試験を実施している全日本情報学習振興協会では、公式の認定講座「SMART合格講座」を提供しています。試験範囲を体系的に学びたい方は検討してみてください。";

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
          href="https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+6A4FL"
          rel="nofollow sponsored"
          target="_blank"
        >
          <img
            width={300}
            height={250}
            alt="個人情報保護士 SMART合格講座"
            src="https://www29.a8.net/svt/bgt?aid=260425368593&wid=001&eno=01&mid=s00000021473001055000&mc=1"
            style={{ maxWidth: "100%", height: "auto", border: 0 }}
          />
        </a>
        <img
          width={1}
          height={1}
          src="https://www12.a8.net/0.gif?a8mat=4B1TI0+9T22IA+4LOQ+6A4FL"
          alt=""
          style={{ position: "absolute", border: 0 }}
        />
      </div>
    </aside>
  );
}
