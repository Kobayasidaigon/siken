import SiteLink from "@/components/SiteLink";
import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import StudioLink from "@/components/StudioLink";
import MobileNav from "@/components/MobileNav";
import { ADSENSE_CLIENT } from "@/lib/adsense";
import { SISTER_SITES } from "@/lib/sister-sites";
import { hasVoices } from "@/lib/voices";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

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

// 1時間ごとにページを作り直す(ISR)。2026-10-24 追加。
// 試験日・申込締切のカウントダウン(ExamCountdown)、締切前のコラム冒頭の表示、ホームの次回試験は、
// サーバーで日付を計算して HTML に書き込んでいる。ビルドしたきりだと次のデプロイまで日数が止まり、
// 締切が過ぎた回のカウントダウンも出続ける(10/24 時点で 10/20 のビルドのまま、pii は実際より4日多い
// 「あと9日」、10/22 締切の jitsumu・isec・isf は「あと2日」を出していた)。
// ルートレイアウトに置くと、配下のすべてのページの再生成間隔になる。
export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    default: "シカクモン｜資格試験のオリジナル練習問題を無料で提供",
    // SERPのtitle表示は全角30字前後で切れるため、サフィックスは最小限にして
    // ページ固有のキーワード部分を残す
    template: "%s｜シカクモン",
  },
  // 資格を増やしたらここの資格名と問題数も更新すること(自動集計はしていない)。
  // 正しい数は src/app/page.tsx の exams の件数と count の合計(src/content/<資格>/*.md の数と一致。貸金業務取扱主任者だけは
  // src/content/kashikin/ ではなく src/content/questions/ の504件)。2026-11-01時点=33資格6,632問
  description: "シカクモンは資格試験のオリジナル練習問題を無料で提供するサイトです。貸金業務取扱主任者・賃貸不動産経営管理士・管理業務主任者・個人情報保護士・知的財産管理技能検定・ビジネス実務法務検定・ITパスポート・登録販売者・保育士・エックス線作業主任者など33資格、合計6,632問。全問に解説付き。",
  icons: {
    icon: "/favicon.svg",
  },
  metadataBase: new URL("https://shikakumon.com"),
  verification: {
    google: "dnyK_8fRmK5hV625XjQD10ccjXMiXHXp_8RdH-jq2zw",
  },
  // AdSense とサイトの紐付け(審査用)。静的HTMLに必ず出る meta で行い、広告スクリプトは承認後に入れる(src/lib/adsense.ts)
  ...(ADSENSE_CLIENT ? { other: { "google-adsense-account": ADSENSE_CLIENT } } : {}),
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "シカクモン",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "シカクモン - 資格試験の練習問題" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const showVoiceLink = hasVoices();
  return (
    <html lang="ja" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body style={{ fontFamily: "var(--font-sans), 'Noto Sans JP', 'Hiragino Sans', sans-serif" }}>
        {/* Header */}
        <header className="bg-[color:var(--c-surface)] border-b border-[color:var(--c-border)] sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <SiteLink href="/" className="no-underline group flex items-baseline gap-2">
              <span className="text-xl font-bold text-[color:var(--c-ink)] font-serif tracking-wide group-hover:text-[color:var(--c-kashikin)] transition-colors">シカクモン</span>
              <span className="hidden sm:inline text-xs text-[color:var(--c-text-sub)] font-medium">資格試験の練習問題</span>
            </SiteLink>
            <nav className="hidden sm:flex gap-7 text-sm items-center">
              {/* 以前はマウスを乗せたときだけ開く33資格の縦1列のメニューだった。タッチ操作やキーボードでは開かず、
                  ノートPCでは下の資格が画面の外に出ていた。トップの区分ごとの資格一覧へのリンクにした(2026-11-10) */}
              <SiteLink href="/#exams" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline transition-colors">資格一覧</SiteLink>
              <SiteLink href="/column/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline transition-colors">コラム</SiteLink>
              <SiteLink href="/calendar/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline transition-colors">試験日程</SiteLink>
              <SiteLink href="/study/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline transition-colors">学習履歴</SiteLink>
              <SiteLink href="/about/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline transition-colors">サイトについて</SiteLink>
              <StudioLink
                href="https://studio.shikakumon.com/?utm_source=shikakumon&utm_medium=referral&utm_content=header"
                placement="header"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold no-underline transition-colors"
                style={{ background: "var(--c-chizai-soft)", color: "var(--c-chizai-ink)" }}
              >
                Studio
                <span
                  className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                  style={{ background: "var(--c-chizai)", color: "#fff" }}
                >
                  AI
                </span>
              </StudioLink>
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
                  <li><SiteLink href="/kashikin/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-kashikin)] no-underline">貸金業務取扱主任者</SiteLink></li>
                  <li><SiteLink href="/chintai/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-kashikin)] no-underline">賃貸不動産経営管理士</SiteLink></li>
                  <li><SiteLink href="/kangyo/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-kashikin)] no-underline">管理業務主任者</SiteLink></li>
                  <li><SiteLink href="/pii/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">個人情報保護士</SiteLink></li>
                  <li><SiteLink href="/chizai/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-chizai)] no-underline">知財管理技能検定3級</SiteLink></li>
                  <li><SiteLink href="/chizai2/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-chizai)] no-underline">知財管理技能検定2級</SiteLink></li>
                  <li><SiteLink href="/mynumber/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">マイナンバー実務検定3級</SiteLink></li>
                  <li><SiteLink href="/jitsumu/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">個人情報保護実務検定</SiteLink></li>
                  <li><SiteLink href="/itpass/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">ITパスポート試験</SiteLink></li>
                  <li><SiteLink href="/isec/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">情報・サイバーセキュリティ管理士</SiteLink></li>
                  <li><SiteLink href="/isf/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">情報・サイバーセキュリティ初級</SiteLink></li>
                  <li><SiteLink href="/dxp/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">DXパスポート試験</SiteLink></li>
                  <li><SiteLink href="/had/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">ハラスメントアドバイザー</SiteLink></li>
                  <li><SiteLink href="/ccm/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">企業危機・コンプライアンス管理士</SiteLink></li>
                  <li><SiteLink href="/touhan/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">登録販売者</SiteLink></li>
                  <li><SiteLink href="/hoikushi/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">保育士試験（筆記）</SiteLink></li>
                  <li><SiteLink href="/gaia/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">生成AIアドバイザー</SiteLink></li>
                  <li><SiteLink href="/dxa/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">DX推進アドバイザー</SiteLink></li>
                  <li><SiteLink href="/aia/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">AI活用アドバイザー</SiteLink></li>
                  <li><SiteLink href="/ccc/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">民法法務士</SiteLink></li>
                  <li><SiteLink href="/llc/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">労働法務士</SiteLink></li>
                  <li><SiteLink href="/cac/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">会社法法務士</SiteLink></li>
                  <li><SiteLink href="/ibd/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">インバウンド実務主任者</SiteLink></li>
                  <li><SiteLink href="/dxo/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">DXオフィサー</SiteLink></li>
                  <li><SiteLink href="/wlc/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">ワークライフ・コーディネーター</SiteLink></li>
                  <li><SiteLink href="/xray/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-pii)] no-underline">エックス線作業主任者</SiteLink></li>
                  <li><SiteLink href="/kyoin/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-fukushi)] no-underline">教員採用試験（教職教養）</SiteLink></li>
                  <li><SiteLink href="/shakai/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-eco)] no-underline">社会福祉士（共通科目）</SiteLink></li>
                  <li><SiteLink href="/bijihou/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-kashikin)] no-underline">ビジネス実務法務検定3級</SiteLink></li>
                  <li><SiteLink href="/bijihou2/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-kashikin)] no-underline">ビジネス実務法務検定2級</SiteLink></li>
                  <li><SiteLink href="/fukushi2/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-fukushi)] no-underline">福祉住環境コーディネーター2級</SiteLink></li>
                  <li><SiteLink href="/fukushi3/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-fukushi)] no-underline">福祉住環境コーディネーター3級</SiteLink></li>
                  <li><SiteLink href="/bijimane/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-bijimane)] no-underline">ビジネスマネジャー検定</SiteLink></li>
                  <li><SiteLink href="/eco/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-eco)] no-underline">eco検定（環境社会検定試験）</SiteLink></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[color:var(--c-ink)] font-bold mb-3 text-xs font-serif">読みもの</h4>
                <ul className="space-y-2">
                  <li><SiteLink href="/hajimete/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline">はじめての方へ</SiteLink></li>
                  <li><SiteLink href="/column/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline">コラム</SiteLink></li>
                  <li><SiteLink href="/calendar/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline">試験日程</SiteLink></li>
                  {/* 合格報告は、掲載できる報告が届くまで出さない(0件の /voice/ は空のページのため。2026-11-10) */}
                  {showVoiceLink && (
                    <li><SiteLink href="/voice/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline">合格報告</SiteLink></li>
                  )}
                </ul>
                <h4 className="text-[color:var(--c-ink)] font-bold mt-6 mb-3 text-xs font-serif">関連サービス</h4>
                <ul className="space-y-2">
                  <li>
                    <StudioLink
                      href="https://studio.shikakumon.com/?utm_source=shikakumon&utm_medium=referral&utm_content=footer"
                      placement="footer"
                      className="no-underline inline-flex items-center gap-1"
                      style={{ color: "var(--c-chizai)" }}
                    >
                      シカクモン Studio
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </StudioLink>
                    <p className="text-[11px] text-[color:var(--c-text-sub)] mt-0.5 leading-relaxed">
                      テキストから AI が問題を作る
                    </p>
                  </li>
                </ul>
                <h4 className="text-[color:var(--c-ink)] font-bold mt-6 mb-3 text-xs font-serif">姉妹サイト</h4>
                {/* 紹介文は lib/sister-sites.ts(トップ本文と共有) */}
                <ul className="space-y-2">
                  {SISTER_SITES.map((site) => (
                    <li key={site.id}>
                      <a
                        href={site.href}
                        className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline"
                      >
                        {site.name}
                      </a>
                      <p className="text-[11px] text-[color:var(--c-text-sub)] mt-0.5 leading-relaxed">
                        {site.footerDesc}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[color:var(--c-ink)] font-bold mb-3 text-xs font-serif">サイト情報</h4>
                <ul className="space-y-2">
                  <li><SiteLink href="/about/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline">このサイトについて</SiteLink></li>
                  <li><SiteLink href="/about/#disclaimer" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline">免責事項</SiteLink></li>
                  <li><SiteLink href="/privacy/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline">プライバシー</SiteLink></li>
                  <li><SiteLink href="/contact/" className="text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] no-underline">お問い合わせ</SiteLink></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-[color:var(--c-border)] pt-4 text-xs text-[color:var(--c-text-sub)] space-y-1">
              <p>運営：熊太郎　｜　{new Date().getFullYear()} シカクモン</p>
              <p>※ 内容は学習目的で提供しています。正確な情報は各試験の公式サイトをご確認ください。</p>
              <p>※「ビジネス実務法務検定試験®」は東京商工会議所、「個人情報保護士®」は一般財団法人全日本情報学習振興協会の登録商標です。その他、本サイトに記載されている試験名・サービス名は各実施機関に帰属します。</p>
            </div>
          </div>
        </footer>

        {/* Mobile Nav */}
        <MobileNav />
        <Analytics />
      </body>
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
