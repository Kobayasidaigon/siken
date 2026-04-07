import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "シカクモン｜資格試験の練習問題サイト",
    template: "%s｜シカクモン",
  },
  description: "資格試験のオリジナル練習問題を無料で提供。貸金業務取扱主任者・個人情報保護士など、ニッチ資格の試験対策に。",
  metadataBase: new URL("https://shikakumon.com"),
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
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="text-base font-bold text-blue-800 no-underline hover:text-blue-600 transition-colors">
              シカクモン
            </a>
            <nav className="hidden sm:flex gap-4 text-sm">
              <a href="/kashikin/" className="text-slate-600 hover:text-blue-700 no-underline">貸金業務取扱主任者</a>
              <a href="/pii/" className="text-slate-600 hover:text-blue-700 no-underline">個人情報保護士</a>
              <a href="/column/" className="text-slate-600 hover:text-blue-700 no-underline">コラム</a>
              <a href="/about/" className="text-slate-600 hover:text-blue-700 no-underline">サイト概要</a>
            </nav>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-800 text-slate-400 mt-12">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm mb-6">
              <div>
                <h4 className="text-white font-bold mb-2 text-xs">資格試験</h4>
                <ul className="space-y-1">
                  <li><a href="/kashikin/" className="hover:text-white no-underline">貸金業務取扱主任者</a></li>
                  <li><a href="/pii/" className="hover:text-white no-underline">個人情報保護士</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-2 text-xs">学習情報</h4>
                <ul className="space-y-1">
                  <li><a href="/column/" className="hover:text-white no-underline">コラム</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-2 text-xs">サイト情報</h4>
                <ul className="space-y-1">
                  <li><a href="/about/" className="hover:text-white no-underline">運営者情報</a></li>
                  <li><a href="/privacy/" className="hover:text-white no-underline">プライバシー</a></li>
                  <li><a href="/contact/" className="hover:text-white no-underline">お問い合わせ</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-700 pt-4 text-xs text-center">
              <p>&copy; {new Date().getFullYear()} シカクモン</p>
              <p className="mt-1">※ 当サイトの情報は学習目的で提供しています。正確な情報は公式サイトをご確認ください。</p>
            </div>
          </div>
        </footer>

        {/* Mobile Nav */}
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
          <div className="flex justify-around h-14 items-center text-xs">
            <a href="/" className="flex flex-col items-center text-slate-500 hover:text-blue-700 no-underline">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" /></svg>
              ホーム
            </a>
            <a href="/kashikin/" className="flex flex-col items-center text-slate-500 hover:text-blue-700 no-underline">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              貸金
            </a>
            <a href="/pii/" className="flex flex-col items-center text-slate-500 hover:text-blue-700 no-underline">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              個情
            </a>
            <a href="/column/" className="flex flex-col items-center text-slate-500 hover:text-blue-700 no-underline">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              コラム
            </a>
          </div>
        </nav>
        <Analytics />
      </body>
    </html>
  );
}
