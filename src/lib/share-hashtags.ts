/**
 * 結果の投稿文に付けるハッシュタグ。2026-10-25 追加(docs/share-campaign-design.md)。
 * 運営が X で、どちらの表記の投稿が多いかを見て決める(例 #賃管士 と #賃貸不動産経営管理士)。
 * ここに無い資格には付けない。模試・本番形式テスト・試験前の10問で共通に使う。
 */
export const SHARE_HASHTAGS: Record<string, string> = {
  chintai: "#賃貸不動産経営管理士",
  kangyo: "#管理業務主任者",
};
