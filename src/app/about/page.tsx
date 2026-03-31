import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "運営者情報・サイトについて",
  description: "貸金業務取扱主任者 試験対策サイトの運営者情報とサイトの方針について。",
};

export default function AboutPage() {
  return (
    <div className="prose max-w-none pb-16">
      <h1>運営者情報</h1>

      <h2>このサイトについて</h2>
      <p>
        当サイトは、貸金業務取扱主任者試験の合格を目指す受験生のために、
        オリジナル練習問題と詳細な解説を無料で提供しています。
      </p>
      <p>
        全504問のオリジナル問題を、1問ずつ丁寧に解説しています。
        分野別・難易度別に整理しているので、自分のペースで効率的に学習できます。
      </p>

      <h2>運営者</h2>
      <table>
        <tbody>
          <tr><th>運営者</th><td>熊太郎</td></tr>
          <tr><th>連絡先</th><td><a href="/contact/">お問い合わせフォーム</a>をご利用ください</td></tr>
        </tbody>
      </table>

      <h2>サイトの方針</h2>
      <ul>
        <li><strong>正確性</strong>：最新の法令に基づいた正確な問題と解説を提供しています</li>
        <li><strong>わかりやすさ</strong>：専門用語は噛み砕いて説明します</li>
        <li><strong>無料</strong>：すべてのコンテンツは無料でご利用いただけます</li>
        <li><strong>継続的な更新</strong>：最新の試験情報を随時反映します</li>
      </ul>

      <h2>情報の正確性について</h2>
      <p>
        当サイトの情報は正確性を心がけておりますが、法令の改正等により
        内容が変更される場合があります。最新の情報は
        <a href="https://www.j-fsa.or.jp/" target="_blank" rel="noopener noreferrer">日本貸金業協会</a>
        の公式サイトをご確認ください。
      </p>

      <h2>免責事項</h2>
      <p>
        当サイトの情報は学習目的で提供しており、合格を保証するものではありません。
        当サイトの利用によって生じた損害について、運営者は一切の責任を負いません。
      </p>
    </div>
  );
}
