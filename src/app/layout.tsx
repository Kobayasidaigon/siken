import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

const notoSerif = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "シカクモン｜資格試験のオリジナル練習問題を無料で提供",
    template: "%s｜シカクモン - 資格試験の練習問題",
  },
  description: "シカクモンは資格試験のオリジナル練習問題を無料で提供するサイトです。貸金業務取扱主任者（504問）・個人情報保護士（300問）・知的財産管理技能検定3級（200問）など、市販の問題集が少ないニッチ資格の試験対策に。全問に根拠法令を含む詳細解説付き。",
  icons: {
    icon: "/favicon.svg",
  },
  metadataBase: new URL("https://shikakumon.com"),
  alternates: {
    canonical: "https://shikakumon.com",
  },
  verification: {
    google: "dnyK_8fRmK5hV625XjQD10ccjXMiXHXp_8RdH-jq2zw",
  },
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "シカクモン",
    title: "シカクモン｜資格試験のオリジナル練習問題を無料で提供",
    description: "シカクモンは資格試験のオリジナル練習問題を無料で提供するサイトです。貸金業務取扱主任者（504問）・個人情報保護士（300問）・知的財産管理技能検定3級（200問）など、ニッチ資格の試験対策に。",
    url: "https://shikakumon.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body style={{ fontFamily: "var(--font-sans), 'Noto Sans JP', 'Hiragino Sans', sans-serif" }}>
        {/* Header */}
        <header className="bg-[color:var(--c-surface)] border-b border-[color:var(--c-border)] sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="no-underline group flex items-baseline gap-2">
              <span className="text-xl font-bold text-[color:var(--c-ink)] font-serif tracking-wide group-hover:text-[color:var(--c-kashikin)] transition-colors">シカクモン</span>
              <span className="hidden sm:inline text-xs text-[color:var(--c-text-sub)] font-medium">資格試験の練習問題</span>
            </a>
            <nav className="hidden sm:flex gap-7 text-sm items-center">
              <div className="relative group">
                <button type="button" className="flex items-center gap-1 text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] transition-colors py-2 cursor-pointer">
                  資格
                  <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
                  <div className="bg-[color:var(--c-surface)] border border-[color:var(--c-border)] rounded-lg shadow-lg py-2 min-w-[220px]">
                    <a href="/kashikin/" className="flex items-center px-4 py-2 text-[color:var(--c-text)] hover:bg-[color:var(--c-bg-alt)] hover:text-[color:var(--c-kashikin)] no-underline transition-colors">
                      <span className="w-1 h-4 mr-3 rounded-full" style={{ background: "var(--c-kashikin)" }}></span>
                      貸金業務取扱主任者
                    </a>
                    <a href="/pii/" className="flex items-center px-4 py-2 text-[color:var(--c-text)] hover:bg-[color:var(--c-bg-alt)] hover:text-[color:var(--c-pii)] no-underline transition-colors">
                      <span className="w-1 h-4 mr-3 rounded-full" style={{ background: "var(--c-pii)" }}></span>
                      個人情報保護士
                    </a>
                    <a href="/chizai/" className="flex items-center px-4 py-2 text-[color:var(--c-text)] hover:bg-[color:var(--c-bg-alt)] hover:text-[color:var(--c-chizai)] no-underline transition-colors">
                      <span className="w-1 h-4 mr-3 rounded-full" style={{ background: "var(--c-chizai)" }}></span>
                      知的財産管理技能検定3級
                    </a>
                    <a href="/mynumber/" className="flex items-center px-4 py-2 text-[color:var(--c-text)] hover:bg-[color:var(--c-bg-alt)] hover:text-[color:var(--c-pii)] no-underline transition-colors">
                      <span className="w-1 h-4 mr-3 rounded-full" style={{ background: "var(--c-pii)" }}></span>
                      マイナンバー実務検定3級
                    </a>
                    <a href="/jitsumu/" className="flex items-center px-4 py-2 text-[color:var(--c-text)] hover:bg-[color:var(--c-bg-alt)] hover:text-[color:var(--c-pii)] no-underline transition-colors">
                      <span className="w-1 h-4 mr-3 rounded-full" style={{ background: "var(--c-pii)" }}></span>
                      個人情報保護実務検定3級
                    </a>
                    <a href="/bijihou/" className="flex items-center px-4 py-2 text-[color:var(--c-text)] hover:bg-[color:var(--c-bg-alt)] hover:text-[color:var(--c-kashikin)] no-underline transition-colors">
                      <span className="w-1 h-4 mr-3 rounded-full" style={{ background: "var(--c-kashikin)" }}></span>
                      ビジネス実務法務検定3級
                    </a>
                  </div>
                </div>
              </div>
              <a href="/column/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline transition-colors">コラム</a>
              <a href="/about/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline transition-colors">サイトについて</a>
            </nav>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[color:var(--c-bg-alt)] border-t border-[color:var(--c-border)] mt-8">
          <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm mb-8">
              <div>
                <h4 className="text-[color:var(--c-ink)] font-bold mb-3 text-xs font-serif">資格試験</h4>
                <ul className="space-y-2">
                  <li><a href="/kashikin/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-kashikin)] no-underline">貸金業務取扱主任者</a></li>
                  <li><a href="/pii/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">個人情報保護士</a></li>
                  <li><a href="/chizai/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-chizai)] no-underline">知財管理技能検定3級</a></li>
                  <li><a href="/mynumber/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">マイナンバー実務検定3級</a></li>
                  <li><a href="/jitsumu/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">個人情報保護実務検定3級</a></li>
                  <li><a href="/bijihou/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-kashikin)] no-underline">ビジネス実務法務検定3級</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[color:var(--c-ink)] font-bold mb-3 text-xs font-serif">読みもの</h4>
                <ul className="space-y-2">
                  <li><a href="/column/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline">コラム</a></li>
                  <li><a href="/guide/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline">学習ガイド</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[color:var(--c-ink)] font-bold mb-3 text-xs font-serif">サイト情報</h4>
                <ul className="space-y-2">
                  <li><a href="/about/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline">このサイトについて</a></li>
                  <li><a href="/privacy/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline">プライバシー</a></li>
                  <li><a href="/contact/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline">お問い合わせ</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-[color:var(--c-border)] pt-4 text-xs text-[color:var(--c-text-sub)]">
              <p className="mb-1">運営：熊太郎　｜　{new Date().getFullYear()} シカクモン</p>
              <p>※ 内容は学習目的で提供しています。正確な情報は各試験の公式サイトをご確認ください。</p>
            </div>
          </div>
        </footer>

        {/* Mobile Nav */}
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-[color:var(--c-surface)] border-t border-[color:var(--c-border)] z-50">
          <div className="flex justify-around h-14 items-center text-xs">
            <a href="/" className="flex flex-col items-center text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" /></svg>
              ホーム
            </a>
            <a href="/kashikin/" className="flex flex-col items-center text-[color:var(--c-text-sub)] hover:text-[color:var(--c-kashikin)] no-underline">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              貸金
            </a>
            <a href="/pii/" className="flex flex-col items-center text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              個情保
            </a>
            <a href="/chizai/" className="flex flex-col items-center text-[color:var(--c-text-sub)] hover:text-[color:var(--c-chizai)] no-underline">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              知財
            </a>
          </div>
        </nav>
        <Analytics />
      </body>
    </html>
  );
}
