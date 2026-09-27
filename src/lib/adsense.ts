/**
 * Google AdSense のサイト運営者 ID。Vercel の環境変数 NEXT_PUBLIC_ADSENSE_PID で渡す
 * (`ca-pub-` + 16桁。`pub-` 始まりで入れても受け付ける)。
 * 未設定のときは AdSense まわり(サイト紐付けの meta・/ads.txt・プライバシーポリシーの記載)を一切出さない。
 *
 * 2026-09-25 の再申請では、審査中はサイトの紐付けと ads.txt だけを出し、
 * 広告スクリプト(adsbygoogle.js)は承認されてから入れる。
 * 2026-05〜06 は審査NGのままスクリプトを全ページで読み込み、広告0枚で表示だけ遅くしていた(ccc09b4 で撤去)。
 */
const digits = process.env.NEXT_PUBLIC_ADSENSE_PID?.match(/pub-(\d{16})/)?.[1] ?? null;

/** meta タグ・広告スクリプト用(`ca-pub-XXXXXXXXXXXXXXXX`) */
export const ADSENSE_CLIENT = digits ? `ca-pub-${digits}` : null;

/** ads.txt 用(`pub-XXXXXXXXXXXXXXXX`) */
export const ADSENSE_PUBLISHER = digits ? `pub-${digits}` : null;
