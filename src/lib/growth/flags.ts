/**
 * growth-kit の段階導入フラグ。2026-09-13 追加。
 *
 * STUDIO_CONNECT_ENABLED
 *   Studio 側の接続画面(/connect: リマインド登録・履歴同期)ができるまで false。
 *   true にすると、試験日設定後のリマインド案内と /study/ の同期カードから
 *   Studio へのリンクが出る。契約は docs/growth-kit.md。
 *   NEXT_PUBLIC_ なのでビルド時に焼き込まれる(切り替えたら再デプロイ)。
 */
export const STUDIO_CONNECT_ENABLED = process.env.NEXT_PUBLIC_STUDIO_CONNECT === "1";
