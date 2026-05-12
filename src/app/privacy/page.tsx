import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  path: "/privacy/",
  title: "プライバシーポリシー｜シカクモン",
  description: "シカクモンのプライバシーポリシー。個人情報の取得・利用目的、Google Analytics 4 によるアクセス解析、Google AdSense および A8.net によるアフィリエイト広告について記載しています。",
});

export default function PrivacyPage() {
  return (
    <div className="prose max-w-none pb-16">
      <h1>プライバシーポリシー</h1>
      <p>当サイト（以下「当サイト」）は、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシーを定めます。</p>

      <h2>個人情報の取得</h2>
      <p>当サイトでは、お問い合わせの際にメールアドレス等の個人情報をご提供いただく場合があります。</p>

      <h2>個人情報の利用目的</h2>
      <p>取得した個人情報は、以下の目的で利用いたします。</p>
      <ul>
        <li>お問い合わせへの回答</li>
        <li>サイトの改善・運営に必要な分析</li>
      </ul>

      <h2>アクセス解析ツールについて</h2>
      <p>
        当サイトでは、サイト改善のために以下のアクセス解析ツールを利用しています。
      </p>
      <ul>
        <li>
          <strong>Google Analytics 4（GA4）</strong>：Googleによるアクセス解析ツールです。
          トラフィックデータの収集のためにCookieを使用していますが、収集されるデータは匿名であり、
          個人を特定するものではありません。
        </li>
        <li>
          <strong>Vercel Analytics</strong>：サイトホスティング事業者Vercelが提供するアクセス解析機能です。
          ページビュー等の集計に使用し、こちらも個人を特定する情報は収集しません。
        </li>
      </ul>
      <p>
        Google Analyticsによるデータ収集を拒否されたい場合は、
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics オプトアウトアドオン</a>
        をブラウザにインストールするか、お使いのブラウザでCookieを無効化してください。
      </p>

      <h2>広告配信について</h2>
      <p>
        当サイトでは、第三者配信の広告サービスとして以下を利用しています。
      </p>
      <ul>
        <li>
          <strong>Google AdSense</strong>：Googleによる広告配信サービスです。
          Cookieを使用してユーザーの興味に応じた広告を表示することがあります。
          Cookieの利用を望まない場合は、
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Googleの広告設定</a>
          から無効化できます。第三者ベンダーが配信する広告に関する詳細は、
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Googleの広告ポリシー</a>
          をご覧ください。
        </li>
      </ul>

      <h2>アフィリエイトプログラムについて</h2>
      <p>
        当サイトは、株式会社ファンコミュニケーションズが運営する「A8.net」のアフィリエイトプログラムに参加しています。
        コラム記事の一部に広告リンクを掲載しており、当サイト経由でユーザーが商品・サービスを購入された場合、
        当サイトが紹介料を受け取ることがあります。
      </p>
      <p>
        アフィリエイト広告には、景品表示法に基づき「広告」の表示を行っています。
        広告リンクは「nofollow sponsored」属性を付与しており、ユーザーに対して広告である旨を明示しています。
      </p>

      <h2>個人情報の第三者提供</h2>
      <p>取得した個人情報は、法令に基づく場合を除き、第三者に提供することはありません。</p>

      <h2>プライバシーポリシーの変更</h2>
      <p>
        当サイトは、個人情報に関して適用される法令を遵守するとともに、
        本ポリシーの内容を適宜見直し改善に努めます。
      </p>

      <h2>お問い合わせ</h2>
      <p>
        プライバシーポリシーに関するお問い合わせは、
        <a href="/contact/">お問い合わせフォーム</a>よりお願いいたします。
      </p>

      <p className="text-sm text-slate-400 mt-8">制定日：2026年3月30日／最終改訂：2026年5月12日</p>
    </div>
  );
}
