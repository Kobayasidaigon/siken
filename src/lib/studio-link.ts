/**
 * 姉妹サービス「シカクモン Studio」への送客URLを一箇所で組み立てる。
 *
 * これまで各所に生の URL 文字列が散らばっており、パラメータの付け方が
 * 配置ごとにばらついていた。特に問題だったのが以下の2点:
 *
 *  1. utm_medium に配置名(header / home_card / quiz_kashikin …)を入れていたため、
 *     GA4 のデフォルトチャネルグループ判定に載らず Unassigned に落ちていた。
 *     本来 utm_medium はチャネル種別(referral 等)を入れる枠。
 *  2. 資格が判っている面(問題ページ・模試結果)でも、資格を伝える手段が
 *     utm_medium の "quiz_<slug>" という符牒しか無く、Studio 側の着地コピー
 *     出し分けがこの文字列のパースに依存していた。
 *
 * 移行方針(後方互換):
 *  - utm_medium は当面いまの値のまま送り続ける。Studio 側の旧パーサや、
 *    既にキャッシュ/ブックマークされたリンクを壊さないため。
 *  - 併せて exam=<slug> と utm_content=<配置> を新たに付ける。Studio 側は
 *    exam を優先して読み、無ければ従来どおり utm_medium から拾う。
 *  - Studio 側が新パラメータに完全移行しきったら、utm_medium を "referral"
 *    に寄せて配置名は utm_content だけに残す。
 */

export interface StudioLinkOptions {
  /** 配置の識別子。GA4 の studio_click イベントと utm_content に載る。 */
  placement: string;
  /**
   * 資格スラッグ(kashikin / pii / eco …)。判っている面では必ず渡す。
   * Studio 側の着地コピーがこの資格名で出し分けられる。
   */
  exam?: string | null;
  /**
   * 旧来の utm_medium 値。未指定なら placement をそのまま使う。
   * 既存リンクの計測連続性を保つためだけの引数で、新規配置では不要。
   */
  legacyMedium?: string;
}

const STUDIO_ORIGIN = "https://studio.shikakumon.com/";

export function studioUrl({ placement, exam, legacyMedium }: StudioLinkOptions): string {
  const params = new URLSearchParams({
    utm_source: "shikakumon",
    // 後方互換: Studio 側の旧パーサが読む値。移行完了後に "referral" へ寄せる。
    utm_medium: legacyMedium ?? placement,
    utm_content: placement,
  });
  if (exam) params.set("exam", exam);
  return `${STUDIO_ORIGIN}?${params.toString()}`;
}
