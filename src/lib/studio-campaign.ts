/**
 * Studio への送客 URL の utm_campaign に設置面 (placement) を入れる。2026-10-10 追加。
 *
 * 背景 (2026-10-10 の Studio 側 GA4 の調査):
 *   配置は utm_content に載せていたが、Studio の GA4 でカスタム定義 utm_content は
 *   中身が空だった。GA4 は utm_* をセッションの流入元の判定に使うだけで、
 *   イベントのパラメータには入れないため。結果として「どの面から来た人が登録したか」が
 *   Studio 側で見られなかった。utm_campaign なら標準レポートの
 *   「セッションのキャンペーン」にそのまま出る。
 *
 * 値は StudioLink の placement (= studio_click の placement) と同じにする。
 * 本体の GA4 の studio_click (placement 別) と、Studio の GA4 のセッション
 * (キャンペーン別) が 1 対 1 で並ぶ。
 *
 * utm_content はそのまま残す。Studio はそこから資格を読む
 * (lib/referral-exam-names.ts の examNameFromReferral)。
 *
 * 既に utm_campaign がある URL と、Studio 以外の URL はそのまま返す。
 */
const STUDIO_HOST = "studio.shikakumon.com";

export function withStudioCampaign(href: string, placement: string): string {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  if (url.host !== STUDIO_HOST || url.searchParams.has("utm_campaign")) return href;
  url.searchParams.set("utm_campaign", placement);
  return url.toString();
}
