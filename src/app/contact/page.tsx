import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  path: "/contact/",
  title: "お問い合わせ",
  description: "シカクモンへのお問い合わせ。解説内容の誤りのご指摘やサイト改善のご要望など、メールでご連絡ください。",
});

export default function ContactPage() {
  return (
    <div className="prose max-w-none pb-16">
      <h1>お問い合わせ</h1>

      <p>
        当サイトに関するお問い合わせは、以下のメールアドレスまでお願いいたします。
      </p>

      <div className="card p-6 not-prose">
        <p className="text-sm text-slate-600 mb-2">メールアドレス</p>
        <p className="text-base font-bold text-blue-700">
          dawuzhangguchuan131@gmail.com
        </p>
      </div>

      <h2>お問い合わせの内容</h2>
      <p>以下のようなお問い合わせを受け付けています。</p>
      <ul>
        <li>解説内容の誤りに関するご指摘</li>
        <li>サイトの不具合のご報告</li>
        <li>コンテンツに関するご要望</li>
        <li>その他のお問い合わせ</li>
      </ul>

      <h2>回答について</h2>
      <p>
        お問い合わせには、原則として3営業日以内に回答いたします。
        内容によってはお時間をいただく場合がございます。
      </p>
    </div>
  );
}
