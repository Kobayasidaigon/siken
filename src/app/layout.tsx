import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "貸金業務取扱主任者 試験対策サイト",
    template: "%s｜貸金業務取扱主任者 試験対策",
  },
  description: "貸金業務取扱主任者試験のオリジナル練習問題504問を詳細解説。分野別に整理し、合格に必要な知識をわかりやすく解説します。",
  metadataBase: new URL("https://siken-ten.vercel.app"),
  verification: {
    google: "HXloSepdau6D0k5wewOdIRWFdBLpUWgQvy2x4sqY6_0",
  },
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "貸金業務取扱主任者 試験対策サイト",
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
              貸金業務取扱主任者<span className="text-slate-400 font-normal text-sm ml-1">試験対策</span>
            </a>
            <nav className="hidden sm:flex gap-4 text-sm">
              <a href="/exam/" className="text-slate-600 hover:text-blue-700 no-underline">問題一覧</a>
              <a href="/field/" className="text-slate-600 hover:text-blue-700 no-underline">分野別</a>
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
                <h4 className="text-white font-bold mb-2 text-xs">問題</h4>
                <ul className="space-y-1">
                  <li><a href="/exam/0/" className="hover:text-white no-underline">オリジナル問題</a></li>
                  <li><a href="/exam/" className="hover:text-white no-underline">問題一覧</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-2 text-xs">分野別</h4>
                <ul className="space-y-1">
                  <li><a href="/field/kashikingyouhou/" className="hover:text-white no-underline">貸金業法</a></li>
                  <li><a href="/field/risoku/" className="hover:text-white no-underline">利息制限法</a></li>
                  <li><a href="/field/minpou/" className="hover:text-white no-underline">民法</a></li>
                  <li><a href="/field/hogo/" className="hover:text-white no-underline">資金需要者保護</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-2 text-xs">学習情報</h4>
                <ul className="space-y-1">
                  <li><a href="/guide/" className="hover:text-white no-underline">学習ガイド</a></li>
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
              <p>&copy; {new Date().getFullYear()} 貸金業務取扱主任者 試験対策サイト</p>
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
            <a href="/exam/" className="flex flex-col items-center text-slate-500 hover:text-blue-700 no-underline">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              問題
            </a>
            <a href="/field/" className="flex flex-col items-center text-slate-500 hover:text-blue-700 no-underline">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              分野別
            </a>
            <a href="/column/" className="flex flex-col items-center text-slate-500 hover:text-blue-700 no-underline">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              コラム
            </a>
          </div>
        </nav>
      </body>
    </html>
  );
}
