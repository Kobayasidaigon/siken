import type { ExamSlug } from "@/lib/study-progress";

/**
 * 各資格の公式ページ(実施団体のその試験のページ。都道府県や教育委員会ごとに実施する試験は、
 * 出題範囲や実施状況をまとめた官公庁のページ)。2026-11-10 追加。
 *
 * 資格トップの「試験の概要」の下に、広告ではないふつうのリンクとして出す(src/components/OfficialSiteLink.tsx)。
 * これまで資格トップには公式サイトへのリンクが無く、日程・受験料を「公式サイトでご確認ください」と書きながら
 * どこを見ればよいかを示していなかった。AdSense の再審査に向けた直しの一つ。
 *
 * どの URL も 2026-11-10 に1件ずつ開き、実施団体のドメインであること・その試験のページであることを確かめた。
 * URL を直したら checkedAt も書き換える。
 */
export interface OfficialSite {
  /** リンクの前に出す見出し。ふつうは「公式サイト」 */
  heading: string;
  /** リンクの文言。「団体名「試験名」」の形 */
  label: string;
  url: string;
  /** リンクを確かめた日 */
  checkedAt: string;
  /** 試験を実施団体1つで行っていないときの補足 */
  note?: string;
}

const CHECKED = "2026年11月10日";

function site(label: string, url: string, extra: Partial<Pick<OfficialSite, "heading" | "note">> = {}): OfficialSite {
  return { heading: extra.heading ?? "公式サイト", label, url, checkedAt: CHECKED, note: extra.note };
}

export const OFFICIAL_SITES: Record<ExamSlug, OfficialSite> = {
  kashikin: site("日本貸金業協会「貸金業務取扱主任者資格試験」", "https://www.j-fsa.or.jp/chief/qualifying_exam/"),
  pii: site("全日本情報学習振興協会「個人情報保護士認定試験」", "https://www.joho-gakushu.or.jp/piip/"),
  chizai: site("知的財産教育協会「知的財産管理技能検定」", "https://www.kentei-info-ip-edu.org/"),
  chizai2: site("知的財産教育協会「知的財産管理技能検定」", "https://www.kentei-info-ip-edu.org/"),
  mynumber: site("全日本情報学習振興協会「マイナンバー実務検定」", "https://www.joho-gakushu.or.jp/nns/"),
  jitsumu: site("全日本情報学習振興協会「個人情報保護実務検定」", "https://www.joho-gakushu.or.jp/pipl/"),
  bijihou: site("東京商工会議所「ビジネス実務法務検定試験®」", "https://kentei.tokyo-cci.or.jp/houmu/"),
  fukushi2: site("東京商工会議所「福祉住環境コーディネーター検定試験®」", "https://kentei.tokyo-cci.or.jp/fukushi/"),
  fukushi3: site("東京商工会議所「福祉住環境コーディネーター検定試験®」", "https://kentei.tokyo-cci.or.jp/fukushi/"),
  bijimane: site("東京商工会議所「ビジネスマネジャー検定試験®」", "https://kentei.tokyo-cci.or.jp/bijimane/"),
  eco: site("東京商工会議所「eco検定（環境社会検定試験）®」", "https://kentei.tokyo-cci.or.jp/eco/"),
  bijihou2: site("東京商工会議所「ビジネス実務法務検定試験®」", "https://kentei.tokyo-cci.or.jp/houmu/"),
  itpass: site("情報処理推進機構（IPA）「ITパスポート試験」", "https://www.ipa.go.jp/shiken/kubun/ip.html"),
  chintai: site("賃貸不動産経営管理士協議会「賃貸不動産経営管理士試験」", "https://www.chintaikanrishi.jp/exam/summary/"),
  kangyo: site("マンション管理業協会「管理業務主任者試験」", "https://www.kanrikyo.or.jp/kanri/siken.html"),
  isec: site("全日本情報学習振興協会「情報・サイバーセキュリティ管理士認定試験」", "https://www.joho-gakushu.or.jp/isme/"),
  kyoin: site("文部科学省「公立学校教員採用選考」", "https://www.mext.go.jp/a_menu/shotou/senkou/1243155.htm", {
    heading: "公式の情報",
    note: "試験は都道府県・指定都市の教育委員会ごとに行われます。日程と申込は、受験する自治体の教育委員会の案内で確かめてください。",
  }),
  shakai: site("社会福祉振興・試験センター「社会福祉士国家試験」", "https://www.sssc.or.jp/shakai/index.html"),
  isf: site("全日本情報学習振興協会「情報・サイバーセキュリティ初級認定試験」", "https://www.joho-gakushu.or.jp/isme/"),
  dxp: site("全日本情報学習振興協会「DXパスポート試験」", "https://www.joho-gakushu.or.jp/dx/dx-passport/"),
  had: site("日本ハラスメントカウンセラー協会「ハラスメントアドバイザー認定試験」", "https://www.joho-gakushu.or.jp/nsp/"),
  ccm: site("全日本情報学習振興協会「企業危機・コンプライアンス管理士認定試験」", "https://www.joho-gakushu.or.jp/ccm/"),
  xray: site("安全衛生技術試験協会「エックス線作業主任者免許試験」", "https://www.exam.or.jp/introduction/h_shokai701/"),
  aia: site("全日本情報学習振興協会「AI活用アドバイザー認定試験」", "https://www.joho-gakushu.or.jp/ai-advisor/"),
  dxa: site("全日本情報学習振興協会「DX推進アドバイザー認定試験」", "https://www.joho-gakushu.or.jp/dx/dxa/"),
  gaia: site("全日本情報学習振興協会「生成AIアドバイザー認定試験」", "https://www.joho-gakushu.or.jp/seisei-ai-advisor/"),
  hoikushi: site("全国保育士養成協議会「保育士試験」", "https://www.hoyokyo.or.jp/exam/"),
  touhan: site("厚生労働省「登録販売者試験問題の作成に関する手引き」", "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000082537.html", {
    heading: "出題範囲（公式）",
    note: "試験は都道府県ごとに行われます。日程と申込は、受験する都道府県の案内で確かめてください。",
  }),
  ccc: site("全日本情報学習振興協会「民法法務士認定試験」", "https://www.joho-gakushu.or.jp/ccc/"),
  llc: site("全日本情報学習振興協会「労働法務士認定試験」", "https://www.joho-gakushu.or.jp/llc/"),
  cac: site("全日本情報学習振興協会「会社法法務士認定試験」", "https://www.joho-gakushu.or.jp/cac/"),
  ibd: site("全日本情報学習振興協会「インバウンド実務主任者認定試験」", "https://www.joho-gakushu.or.jp/ibd/"),
  dxo: site("全日本情報学習振興協会「DXオフィサー認定試験」", "https://www.joho-gakushu.or.jp/dx/dxo/"),
  wlc: site("全日本情報学習振興協会「ワークライフ・コーディネーター認定試験」", "https://www.joho-gakushu.or.jp/wlc/"),
};
