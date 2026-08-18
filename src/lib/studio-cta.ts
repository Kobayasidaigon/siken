/**
 * 本体サイト → シカクモン Studio への送客 CTA の定義。
 *
 * 背景 (2026-08-18 の実測):
 *   本体の検索流入は月 974 クリックあるが、Studio に来るのは月 60 セッション程度で、
 *   さらに Studio 側で問題を作った人は 90 日で 7 人しかいない。
 *   一方 Studio には資格別 LP が 7 枚あり、登録不要でその資格の問題を 1 問
 *   その場で解ける (解説つき) のに、90 日で 1 PV しか無い死蔵資産だった。
 *   原因は送客リンクが全部トップページ `/` 固定で、資格が引き継がれないこと。
 *
 * 方針:
 *   資格別 LP がある資格は、その LP へ直接送る。文言もその資格の悩みに寄せる
 *   (「過去問が手に入らない」等)。枠のデザインは既存のまま変えない
 *   — 目立たせるのではなく、文言の具体性で効かせる。
 *
 * 段階導入:
 *   まず流入上位 2 資格 (福祉住環境コーディネーター2級 / 個人情報保護士) のみ。
 *   効果を確認してから知財 (chizai) 等へ広げる。マッピングに無い資格は
 *   従来どおり汎用文言 + トップページのまま。
 */
import type { ExamSlug } from "./study-progress";

const STUDIO_ORIGIN = "https://studio.shikakumon.com";

export type StudioCta = {
  /** utm 付きの遷移先 URL */
  href: string;
  /** 枠の見出し */
  heading: string;
  /** 枠の本文 */
  body: string;
  /** リンクの文言 */
  linkLabel: string;
};

type CertCta = {
  /** Studio 側の LP スラッグ (studio.shikakumon.com/lp/<slug>) */
  lp: string;
  heading: string;
  body: string;
  linkLabel: string;
};

/**
 * 資格別 LP を持ち、専用文言を出す資格。
 * ここに無い資格は汎用 CTA (トップページ) にフォールバックする。
 *
 * 文言の前提 (2026-08-18 実機確認済み):
 *   各 LP には「まずは1問、解いてみませんか」= 事前生成済みの問題を
 *   登録なしでその場で解ける欄がある。“その場で生成する” のはトップpage側の
 *   別機能なので、ここで「作れる」と書かないこと。
 */
const CERT_CTA: Partial<Record<ExamSlug, CertCta>> = {
  fukushi2: {
    lp: "fukushi2",
    heading: "過去問が無い分の演習量をどう作るか",
    body:
      "福祉住環境コーディネーター2級は IBT・CBT 化で試験問題が非公開のため、年度別の過去問集がありません。姉妹サービス「シカクモン Studio」では、AI が作った2級の問題を登録なしでその場で1問解けます (解説つき)。手元のノートや教材から自分用の問題集を作ることもできます。",
    linkLabel: "福祉住環境2級の問題を1問解いてみる",
  },
  pii: {
    lp: "pii",
    heading: "公開されていない過去問の代わりに",
    body:
      "個人情報保護士の本試験の過去問は一般公開されておらず、演習に使える素材が限られます。姉妹サービス「シカクモン Studio」では、AI が作った個人情報保護士の問題を登録なしでその場で1問解けます (解説つき)。手元のノートや教材から自分用の問題集を作ることもできます。",
    linkLabel: "個人情報保護士の問題を1問解いてみる",
  },
};

/** 従来どおりの汎用 CTA (資格別 LP が無い場合)。文言は既存のまま。 */
const GENERIC: Omit<CertCta, "lp"> = {
  heading: "自分の教材から問題を作りたい人へ",
  body:
    "シカクモン本体に無い資格や、手元のテキスト・PDF からも AI が問題を生成する別サイト「シカクモン Studio」を運営しています。忘却曲線に沿った復習や AI への質問にも対応しています。",
  linkLabel: "シカクモン Studio を見る",
};

/**
 * コラムのスラッグから資格を判定する。
 * 既存ページと同じ `<資格>-` 接頭辞の流儀 (chizai2- は chizai と別物なので、
 * 最初のハイフンまでを資格 ID として厳密に取る)。
 */
export function certFromColumnSlug(slug: string): ExamSlug | null {
  const head = slug.split("-")[0];
  return head in CERT_CTA ? (head as ExamSlug) : null;
}

/**
 * 送客 CTA を組み立てる。
 * @param exam    資格 (null なら汎用)
 * @param medium  utm_medium。既存の値をそのまま渡すこと (column_footer / quiz_<資格> 等)
 */
export function studioCtaFor(
  exam: ExamSlug | null | undefined,
  medium: string
): StudioCta {
  const cta = exam ? CERT_CTA[exam] : undefined;
  const path = cta ? `/lp/${cta.lp}` : "/";
  const href = `${STUDIO_ORIGIN}${path}?utm_source=shikakumon&utm_medium=${medium}`;
  const { heading, body, linkLabel } = cta ?? GENERIC;
  return { href, heading, body, linkLabel };
}
