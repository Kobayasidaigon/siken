import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ページが見つかりません",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="pb-16 pt-8">
      <p className="text-xs text-[color:var(--c-text-sub)] mb-2">404 Not Found</p>
      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-4 font-serif">
        ページが見つかりません
      </h1>
      <p className="text-sm text-[color:var(--c-text-sub)] leading-relaxed mb-8">
        お探しのページは移動または削除された可能性があります。
        以下から目的の資格の練習問題をお探しください。
      </p>
      <ul className="space-y-2 text-sm">
        <li><a href="/" className="text-blue-700 hover:underline">ホーム</a></li>
        <li><a href="/kashikin/" className="text-blue-700 hover:underline">貸金業務取扱主任者 練習問題</a></li>
        <li><a href="/pii/" className="text-blue-700 hover:underline">個人情報保護士 練習問題</a></li>
        <li><a href="/chizai/" className="text-blue-700 hover:underline">知的財産管理技能検定3級 練習問題</a></li>
        <li><a href="/mynumber/" className="text-blue-700 hover:underline">マイナンバー実務検定3級 練習問題</a></li>
        <li><a href="/jitsumu/" className="text-blue-700 hover:underline">個人情報保護実務検定 練習問題</a></li>
        <li><a href="/bijihou/" className="text-blue-700 hover:underline">ビジネス実務法務検定3級 練習問題</a></li>
        <li><a href="/column/" className="text-blue-700 hover:underline">コラム一覧</a></li>
      </ul>
    </div>
  );
}
