/**
 * 貸金業務取扱主任者 講座（アガルートアカデミー）の広告
 * 配置: 貸金関連コラム末尾・貸金トップページ・貸金の問題ページ
 *
 * A8リンクはこのコンポーネントに一元管理する（複数ページで同一プログラムを使うため、
 * リンクが変わったときの更新漏れ＝収益取りこぼしを防ぐ目的）。
 * 各ページの文脈に合わせた訴求文を props で渡せる。渡さなければ汎用文を表示。
 */

interface Props {
  headline?: string;
  body?: string;
}

export default function KashikinCourseAd({ headline, body }: Props = {}) {
  const finalHeadline = headline ?? "独学に不安があれば";
  const finalBody =
    body ??
    "貸金業務取扱主任者は市販の問題集が少なく、独学で進めにくい試験です。通信講座のアガルートアカデミーは貸金業務取扱主任者講座を提供しており、頻出論点と法改正への対応を体系的に押さえられます。";

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
        href="https://px.a8.net/svt/ejp?a8mat=4B3N6P+AWY41E+44M0+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.agaroot.jp%2Fkashikin%2F"
        rel="nofollow sponsored noopener"
        target="_blank"
        className="text-sm text-blue-700 hover:underline font-medium"
      >
        アガルートの貸金業務取扱主任者講座を見る →
      </a>
      <img
        width={1}
        height={1}
        src="https://www14.a8.net/0.gif?a8mat=4B3N6P+AWY41E+44M0+BW8O2"
        alt=""
        style={{ position: "absolute", border: 0 }}
      />
    </aside>
  );
}
