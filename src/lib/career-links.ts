/**
 * 資格を活かした転職サービスへの導線(アフィリエイト)の正準定義。2026-10-17 追加。
 *
 * 講座広告(affiliate-links.ts)は「これから受ける人」向けで、合格した人・合格圏の人には
 * 出すものが無かった。合格した人の次の行動は「資格を仕事に活かす」なので、
 * 読者層(track)ごとに転職サービスのリンクを1本ずつ持たせる。
 *
 * 使い方: ASP(A8 等)で転職サービスと提携したら、その track の offer に
 *   発行された計測付きリンクを貼るだけ。CareerCTA(コラム末尾・模試の合格圏・合格報告の送信後)が
 *   一斉に点灯する。生成リンクは改変しないこと(既存リンクの a8mat から自前で作らない方針)。
 *   未設定(undefined)の間は何も表示しない(安全な no-op)。
 *   どの track が未設定でも general に offer があれば、文言ごと general に切り替えて出す。
 * 申請先の候補・提携状況・成果条件は docs/career-affiliate.md。
 * 2026-10-19: A8 で承認された2本を入れた(fudosan=宅建Jobエージェント、general=ワンキャリア転職)。
 * 2026-11-15: fukushi=介護JJ を入れた(社会福祉士・保育士。福祉住環境は general に移した)。
 *
 * 計測: AffiliateLink の course は "career-<資格>"(資格IDにしないこと。recent-course が
 *   「前回チェックした講座」として講座リンクを出し直してしまう)、placement は "<面>_career"。
 *   広告主は href の a8mat から affiliate-program.ts で引く(提携したら1行足す)。
 */

import type { ExamSlug } from "./study-progress";

export type CareerTrack = "kanri" | "fudosan" | "kinyu" | "fukushi" | "it" | "kyoin" | "general";

export interface CareerOffer {
  href: string;   // ASP 発行の計測付きリンク
  label: string;  // アンカーテキスト(サービス名を入れる。例「MS Agentで管理部門の求人を見る」)。
                  // 対象の条件(正社員経験など)はここに書く。1行表示(variant="line")でも必ず見えるため
  pixel?: string; // A8 の1x1計測ピクセル(素材に付いていれば)
  note?: string;  // サービスの紹介(カード表示のみ)。自分の言葉で短く。広告主サイトの文章は転載しない
  requiresPr?: boolean; // 広告主が「ファーストビューに PR 表記」を必須にしている(無いと提携解除の恐れ)。PrNotice を出す
}

interface CareerTrackInfo {
  name: string;     // 読者層の名前(docs・コメント用)
  headline: string; // カードの導入(1行)
  body: string;     // カードの本文。特定サービスの効果をうたわない
  offer?: CareerOffer;
}

/**
 * 提携済みの転職サービスのリンク。キーは affiliate-program.ts の GA4 program 名と同じ。
 * 2026-11-14: 資格別の転職エージェント比較ページ(lib/tenshoku.ts)からも同じリンクを引けるように、
 * track の中から外に出した(リンクの中身は変えていない)。
 */
export const CAREER_OFFERS = {
  // A8 2026-10-17 承認(株式会社ヘイフィールド)。「No.1」等の表現は使わない。年齢等の成果条件は書かない
  takkenjob: {
    href: "https://px.a8.net/svt/ejp?a8mat=4BEIPB+CONHRM+4I3U+BWVTE",
    label: "宅建Jobエージェントで不動産業界の求人を見る（正社員での転職を考えている方向け）",
    pixel: "https://www19.a8.net/0.gif?a8mat=4BEIPB+CONHRM+4I3U+BWVTE",
    note: "宅建Jobエージェントは不動産業界専門の転職エージェントです。宅建や賃貸管理の資格を活かせる求人を担当者に相談でき、業界未経験からの転職にも対応しています。登録は無料です。",
  },
  // A8 2026-10-26 承認(株式会社ハートフルケア)。成果は対象資格を持ち正社員を希望する人の新規会員登録。
  // 対象資格に福祉住環境コーディネーターは入っていない(対象外の資格で集めた登録は否認)ので、社会福祉士と保育士だけに出す。
  // ファーストビューの PR 表記が必須。「お祝い金」とは書かない。管理画面の紹介文は写さない
  kaigojj: {
    href: "https://px.a8.net/svt/ejp?a8mat=4BEIPB+CV79F6+2YJA+TTTEQ",
    label: "介護JJで介護・福祉の正社員求人を見る（介護・福祉・保育などの資格をお持ちで、正社員を希望する方向け）",
    pixel: "https://www13.a8.net/0.gif?a8mat=4BEIPB+CV79F6+2YJA+TTTEQ",
    note: "介護JJは介護・福祉の仕事に絞った転職サイトです。登録できるのは、社会福祉士・保育士・介護福祉士などの対象資格を持ち、正社員での転職を考えている方です。",
    requiresPr: true,
  },
  // A8 2026-10-19 承認(株式会社ワンキャリア)。正社員での勤務経験がない人の登録は否認されるので label に条件を書く
  onecareer: {
    href: "https://px.a8.net/svt/ejp?a8mat=4BEIPB+D5X2B6+5O7E+BX3J6",
    label: "ワンキャリア転職で求人と企業のクチコミを見る（正社員経験のある方向け）",
    pixel: "https://www16.a8.net/0.gif?a8mat=4BEIPB+D5X2B6+5O7E+BX3J6",
    note: "ワンキャリア転職は、企業ごとの年収やクチコミ、選考対策の情報を見ながら転職活動を進められるサービスです。会員登録は無料です。",
  },
} satisfies Record<string, CareerOffer>;

export type CareerOfferId = keyof typeof CAREER_OFFERS;

const CAREER_TRACKS: Record<CareerTrack, CareerTrackInfo> = {
  kanri: {
    name: "管理部門(総務・人事・法務・コンプライアンス・知財)",
    headline: "資格を活かして管理部門で働くなら",
    body: "総務・人事・法務の求人は、資格の名前よりも「どの業務を任せられるか」で見られます。管理部門に特化した転職サービスなら、学んだ分野が求人のどの業務に当たるかを担当者と整理できます。",
  },
  fudosan: {
    name: "不動産(賃貸管理・マンション管理)",
    headline: "不動産管理の仕事で資格を活かすなら",
    body: "管理会社には事務所ごとに業務管理者・管理業務主任者を置く義務があり、資格を持つ人の求人が出ています。不動産業界に特化した転職サービスなら、資格が応募条件や手当になる求人を探せます。",
    offer: CAREER_OFFERS.takkenjob,
  },
  kinyu: {
    name: "金融(消費者金融・クレジット・信販)",
    headline: "貸金業界で資格を活かすなら",
    body: "貸金業者は営業所ごとに貸金業務取扱主任者を置く必要があり、資格を持つ人を優遇する求人があります。金融業界に強い転職サービスなら、資格が評価される職場を探せます。",
  },
  fukushi: {
    name: "介護・福祉",
    headline: "福祉の仕事で資格を活かすなら",
    body: "介護・福祉の求人は、施設の種類や働き方で条件が大きく変わります。福祉職に特化した転職サービスなら、資格を活かせる職場を条件で絞り込めます。",
    offer: CAREER_OFFERS.kaigojj,
  },
  it: {
    name: "IT・情報セキュリティ",
    headline: "ITの仕事で資格を活かすなら",
    body: "IT系の資格は、それだけで採用が決まるものではありませんが、未経験からIT職を目指すときの学習の証明になります。IT業界に強い転職サービスなら、資格を評価する求人を探せます。",
  },
  kyoin: {
    name: "教員・教育",
    headline: "教壇に立つ道を広げるなら",
    body: "教員採用試験の結果を待つあいだや次の試験までの期間に、常勤講師・非常勤講師として働く道もあります。教育業界の求人サービスに登録しておくと、条件に合う募集を探せます。",
  },
  general: {
    name: "総合(どの資格にも使える転職サービス)",
    headline: "資格を次の仕事につなげるなら",
    // 担当者が付くエージェント型とは限らない(ワンキャリア転職は情報を見ながら自分で進める型)ので、相談を前提にしない
    body: "資格は、取ったあとにどう使うかで価値が変わります。転職サービスに登録すると、資格を評価する求人を探したり、今の経験と組み合わせた仕事の選び方を考えたりできます。",
    offer: CAREER_OFFERS.onecareer,
  },
};

/**
 * 資格ごとの読者層。ビジマネ・eco検定は特定の業界に結び付かないので general。
 * 2026-10-19 追加の6資格: DX/AI/生成AIアドバイザーは DXパスポートと同じ it。
 * 登録販売者・エックス線作業主任者は合う層が無く general。保育士は介護系の転職サービス
 * (fukushi の申請先候補)とずれるので general(保育専門のサービスと提携したら層を足す)。
 */
export const EXAM_CAREER: Record<ExamSlug, CareerTrack> = {
  kashikin: "kinyu",
  pii: "kanri",
  mynumber: "kanri",
  jitsumu: "kanri",
  bijihou: "kanri",
  bijihou2: "kanri",
  had: "kanri",
  ccm: "kanri",
  chizai: "kanri",
  chizai2: "kanri",
  chintai: "fudosan",
  kangyo: "fudosan",
  shakai: "fukushi",
  // 福祉住環境は介護JJの対象資格に入っていないので general(2026-11-15)
  fukushi2: "general",
  fukushi3: "general",
  mynumber2: "kanri",
  mynumber1: "kanri",
  itpass: "it",
  isec: "it",
  isf: "it",
  dxp: "it",
  kyoin: "kyoin",
  bijimane: "general",
  eco: "general",
  dxa: "it",
  aia: "it",
  gaia: "it",
  touhan: "general",
  xray: "general",
  hoikushi: "fukushi", // 保育士は介護JJの対象資格(2026-11-15 に general から変更)
  // 2026-10-31 追加の協会6資格。法務3資格とワークライフは管理部門、DXオフィサーは IT、インバウンドは合う層が無く general。
  ccc: "kanri",
  llc: "kanri",
  cac: "kanri",
  ibd: "general",
  dxo: "it",
  wlc: "kanri",
};

/**
 * 表示する文言とリンクを返す。その track に offer が無ければ general に切り替え、
 * general にも無ければ null(何も出さない)。
 */
export function careerOfferFor(track: CareerTrack): (CareerTrackInfo & { offer: CareerOffer }) | null {
  const own = CAREER_TRACKS[track];
  if (own.offer) return { ...own, offer: own.offer };
  const general = CAREER_TRACKS.general;
  if (general.offer) return { ...general, offer: general.offer };
  return null;
}

/** その資格(または track)で出る転職リンクが、ファーストビューの PR 表記を必須にしているか */
export function careerNeedsPr(exam?: ExamSlug, track?: CareerTrack): boolean {
  const resolved = track ?? (exam ? EXAM_CAREER[exam] : undefined);
  if (!resolved) return false;
  return !!careerOfferFor(resolved)?.offer.requiresPr;
}
