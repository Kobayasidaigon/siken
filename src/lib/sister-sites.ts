/**
 * 姉妹サイトの紹介文の正準定義(2026-10-31 新設)。
 *
 * これまでは同じ紹介を トップ本文(app/page.tsx)・フッター(app/layout.tsx)・public/llms.txt の
 * 3か所に手で書いていて、姉妹側で資格や問題を足すたびに数がずれていた
 * (10/31 時点で設備は「ビルメン系9資格・2,162問」、施工管理は「8試験1,960問」のまま)。
 * トップとフッターはここから読む。コラム一覧の「ほかの分野のコラム」もここから読む。
 *
 * 数は各姉妹のリポジトリのデータで数えた値(リポジトリをまたぐので自動集計はしない)。
 * 姉妹側で資格・問題を足したら、ここと public/llms.txt の「姉妹サイト」の節を一緒に直し、checkedAt を更新する。
 *   - 衛生管理者ドリル: eisei-shikaku/src/data/questions.ts の QUESTIONS 1,000問(第二種600・第一種400)
 *   - 設備資格ドリル: setsubi-shikaku/src/data/certs.ts の CERTS 16件・questions.ts の QUESTIONS 2,828問
 *     (setsubi の llms.txt・CHANGELOG 2026-10-19 にあった「15試験区分」は、設備側のブランチ claude/sister-traffic-growth の
 *      8052e7f で16試験区分に直り、CHANGELOG に誤記の注記が入った。CERTS は16件、site.ts の説明文も CERTS.length)
 *   - 筋トレ資格ドリル: kintore-shikaku/src/data/certs.ts の CERTS 7件・QUESTIONS 1,101問
 *   - 施工管理ドリル: sekokan/data/exams.json の13件・data/<試験>/*.json の合計2,635問(README.md の「13試験 2,635問」と一致)。
 *     13件の内訳は、施工管理技士 第一次検定の10件と、技術士第一次試験の基礎・適性・専門(建設部門)の3件
 */

export type SisterSiteId = "eisei" | "setsubi" | "kintore" | "sekokan";

export interface SisterSite {
  id: SisterSiteId;
  name: string;
  /** サイトのトップ(末尾スラッシュつき。姉妹はどれも trailingSlash: true) */
  href: string;
  /** コラム一覧。施工管理ドリルだけ /column/(単数形) */
  columnsHref: string;
  /** トップ本文の姉妹サイトのカードに出す1文 */
  homeDesc: string;
  /** フッターのリンクの下に出す短い説明 */
  footerDesc: string;
  /** コラム一覧(/column/)の「ほかの分野のコラム」に出す1行 */
  columnsDesc: string;
  /** トップのカードの左線の色(本体のテーマ色を借りている) */
  color: string;
  /** 上の数を姉妹のデータで確かめた日 */
  checkedAt: string;
}

export const SISTER_SITES: SisterSite[] = [
  {
    id: "eisei",
    name: "衛生管理者ドリル",
    href: "https://eisei.shikakumon.com/",
    columnsHref: "https://eisei.shikakumon.com/columns/",
    homeDesc: "第一種・第二種衛生管理者の練習問題1,000問と本番形式の模擬試験。総務・人事で選任される方向け。",
    footerDesc: "第一種・第二種衛生管理者の無料練習問題と模擬試験",
    columnsDesc: "第一種・第二種衛生管理者の試験日程・合格率・過去問の入手先、選任されたあとの職務など。",
    color: "var(--c-kashikin)",
    checkedAt: "2026-10-31",
  },
  {
    id: "setsubi",
    name: "設備資格ドリル",
    href: "https://setsubi.shikakumon.com/",
    columnsHref: "https://setsubi.shikakumon.com/columns/",
    homeDesc: "第二種電気工事士・電験三種・危険物乙4・ビル管・エネルギー管理士・公害防止管理者など設備・電気・環境系の16試験、2,828問。",
    footerDesc: "電気工事士・電験・危険物など設備系16試験の無料練習問題",
    columnsDesc: "電気工事士・電験三種・危険物乙4・二級ボイラー技士・ビル管理士・消防設備士などの過去問の入手先・勉強法・試験の概要。",
    color: "var(--c-chizai)",
    checkedAt: "2026-10-31",
  },
  {
    id: "kintore",
    name: "筋トレ資格ドリル",
    href: "https://kintore.shikakumon.com/",
    columnsHref: "https://kintore.shikakumon.com/columns/",
    homeDesc: "NSCA-CPT・NESTA-PFT・健康運動指導士などトレーナー系7資格の練習問題1,101問と模試。",
    footerDesc: "NSCA-CPTなどトレーナー系7資格の無料練習問題",
    columnsDesc: "NSCA-CPT・NSCA-CSCS・健康運動指導士などの合格率・過去問・資格どうしの違い。",
    color: "var(--c-pii)",
    checkedAt: "2026-10-31",
  },
  {
    id: "sekokan",
    name: "施工管理ドリル",
    href: "https://sekokan.shikakumon.com/",
    columnsHref: "https://sekokan.shikakumon.com/column/",
    // 技術士第一次試験は基礎・適性と、専門は建設部門だけ(sekokan/data/exams.json の gijutsushi-kiso・gijutsushi-tekisei・gijutsushi-senmon、
    // sekokan/data/site.ts の description「技術士第一次試験（基礎・適性・専門(建設)）」)。ほかの部門の専門科目もあると読めないよう、部門まで書く。
    homeDesc: "土木・建築・電気工事・管工事・電気通信工事の1級・2級 施工管理技士 第一次検定と技術士第一次試験（基礎・適性・建設部門の専門）、13試験2,635問と本試験形式の模擬試験。",
    footerDesc: "施工管理技士（土木・建築・電気・管・電気通信）と技術士第一次試験（建設部門）の無料練習問題",
    columnsDesc: "施工管理技士 第一次検定・技術士第一次試験（建設部門）の過去問の公開先、級の選び方、勉強の進め方。",
    color: "var(--c-eco)",
    checkedAt: "2026-10-31",
  },
];

export function sisterSite(id: SisterSiteId): SisterSite {
  const site = SISTER_SITES.find((s) => s.id === id);
  if (!site) throw new Error(`unknown sister site: ${id}`);
  return site;
}
