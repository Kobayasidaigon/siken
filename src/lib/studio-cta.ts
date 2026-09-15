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
 *   2026-08-18 にまず流入上位 2 資格 (福祉住環境コーディネーター2級 / 個人情報保護士)。
 *   2026-09-15 に Studio 側で貸金・マイナンバー・ビジ法・eco・個情実務・ビジマネの
 *   LP が揃ったので、本体が問題を持つ資格は全て資格別 LP へ送る (知財 3級/2級・
 *   IT パスポートは既存 LP へ)。マッピングに無い資格 (賃管士・管業・情報セキュリティ
 *   管理士・教員採用・社会福祉士) は従来どおり汎用文言 + トップページのまま。
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
  kashikin: {
    lp: "kashikin",
    heading: "解説の無い過去問を、解説つきの類題で",
    body:
      "貸金業務取扱主任者の過去問は協会が公開していますが解説が無く、古い回は法改正前の内容を含みます。姉妹サービス「シカクモン Studio」では、AI が作った貸金業務取扱主任者の問題を登録なしでその場で1問解けます (解説つき)。間違えた論点のメモから、解説つきの類題を作ることもできます。",
    linkLabel: "貸金業務取扱主任者の問題を1問解いてみる",
  },
  mynumber: {
    lp: "mynumber",
    heading: "正答率 70% の壁を、分野ごとの演習で",
    body:
      "マイナンバー実務検定は合格率が高めでも正答率 70% の絶対評価で、苦手分野を 1 つ残すと落ちます。姉妹サービス「シカクモン Studio」では、AI が作ったマイナンバー実務検定の問題を登録なしでその場で1問解けます (解説つき)。分野を選んで自分用の問題集を作ることもできます。",
    linkLabel: "マイナンバー実務検定の問題を1問解いてみる",
  },
  jitsumu: {
    lp: "jitsumu",
    heading: "改正法対応の演習量を、自分で作る",
    body:
      "個人情報保護実務検定は本試験問題が非公開で、令和 4 年改正に対応した演習素材も限られます。姉妹サービス「シカクモン Studio」では、AI が作った個人情報保護実務検定の問題を登録なしでその場で1問解けます (解説つき)。改正点をまとめたノートから自分用の問題集を作ることもできます。",
    linkLabel: "個人情報保護実務検定の問題を1問解いてみる",
  },
  bijihou: {
    lp: "bijihou",
    heading: "IBT 化で過去問が無い分の演習量をどう作るか",
    body:
      "ビジネス実務法務検定は IBT・CBT 化で試験問題が非公開になり、新しい過去問が出回りません。姉妹サービス「シカクモン Studio」では、AI が作ったビジネス実務法務検定の問題を登録なしでその場で1問解けます (解説つき)。公式テキストの章ごとのノートから自分用の問題集を作ることもできます。",
    linkLabel: "ビジネス実務法務検定の問題を1問解いてみる",
  },
  bijihou2: {
    lp: "bijihou",
    heading: "IBT 化で過去問が無い分の演習量をどう作るか",
    body:
      "ビジネス実務法務検定 2級は IBT・CBT 化で試験問題が非公開になり、新しい過去問が出回りません。姉妹サービス「シカクモン Studio」では、AI が作ったビジネス実務法務検定の問題を登録なしでその場で1問解けます (解説つき)。会社法・債権回収など 2級の分野を選んで自分用の問題集を作ることもできます。",
    linkLabel: "ビジネス実務法務検定の問題を1問解いてみる",
  },
  bijimane: {
    lp: "bijimane",
    heading: "合格率が 23% の回でも取りこぼさないために",
    body:
      "ビジネスマネジャー検定は試験問題が非公開で、合格率も回によって 23〜75% と大きく振れます。姉妹サービス「シカクモン Studio」では、AI が作ったビジネスマネジャー検定の問題を登録なしでその場で1問解けます (解説つき)。公式テキストの各部のノートから自分用の問題集を作ることもできます。",
    linkLabel: "ビジネスマネジャー検定の問題を1問解いてみる",
  },
  eco: {
    lp: "eco",
    heading: "非公開の本試験問題の代わりに",
    body:
      "eco検定は IBT・CBT 方式で本試験の問題が公開されず、演習量を自分で用意する必要があります。姉妹サービス「シカクモン Studio」では、AI が作った eco検定の問題を登録なしでその場で1問解けます (解説つき)。公式テキストの章ごとのノートから自分用の問題集を作ることもできます。",
    linkLabel: "eco検定の問題を1問解いてみる",
  },
  chizai: {
    lp: "chizai",
    heading: "法域を横断する基礎固めを、分野ごとの演習で",
    body:
      "知的財産管理技能検定は特許・商標・著作権など法域を横断して出題され、学科・実技それぞれで合格基準を満たす必要があります。姉妹サービス「シカクモン Studio」では、AI が作った知財検定の問題を登録なしでその場で1問解けます (解説つき)。分野を選んで自分用の問題集を作ることもできます。",
    linkLabel: "知財検定の問題を1問解いてみる",
  },
  chizai2: {
    lp: "chizai",
    heading: "2級の合格基準 80% に届く演習量を",
    body:
      "知的財産管理技能検定 2級は学科・実技とも満点の 80% が合格基準で、取りこぼしの余地が小さい試験です。姉妹サービス「シカクモン Studio」では、AI が作った知財検定の問題を登録なしでその場で1問解けます (解説つき)。苦手な法域を選んで自分用の問題集を作ることもできます。",
    linkLabel: "知財検定の問題を1問解いてみる",
  },
  itpass: {
    lp: "it-passport",
    heading: "分野別基準 (各 30%) を落とさないために",
    body:
      "IT パスポートは総合 600 点に加えてストラテジ・マネジメント・テクノロジの各分野で 30% 以上が必要で、苦手分野を捨てられません。姉妹サービス「シカクモン Studio」では、AI が作った IT パスポートの問題を登録なしでその場で解けます (解説つき)。分野を選んで自分用の問題集を作ることもできます。",
    linkLabel: "IT パスポートの問題を解いてみる",
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
 *
 * utm_medium は GA4 のチャネル判定キーなので `referral` 固定。独自値
 * (column_footer 等) を入れると全部 Unassigned に落ちる (2026-08 実測で
 * 流入の72%)。配置・資格IDは utm_content に載せる (移行仕様は studio repo
 * docs/funnel-analytics.md)。資格の引き継ぎは utm の読み替えに頼らず
 * ?exam= で明示する (Studio 本番のトップは ?exam= を読んでお試し生成に
 * 資格名を入れる。模試リンク studioMoshiHref と同じ流儀)。
 *
 * @param exam     資格 (null なら汎用)
 * @param content  utm_content。既存の配置名をそのまま渡すこと (column_footer / quiz_<資格> 等)
 */
export function studioCtaFor(
  exam: ExamSlug | null | undefined,
  content: string
): StudioCta {
  const cta = exam ? CERT_CTA[exam] : undefined;
  const path = cta ? `/lp/${cta.lp}` : "/";
  const params = new URLSearchParams({
    utm_source: "shikakumon",
    utm_medium: "referral",
    utm_content: content,
  });
  if (exam) params.set("exam", EXAM_FULL_NAMES[exam]);
  const href = `${STUDIO_ORIGIN}${path}?${params.toString()}`;
  const { heading, body, linkLabel } = cta ?? GENERIC;
  return { href, heading, body, linkLabel };
}

/**
 * 資格 ID → 正式名称。Studio の生成フォームに渡す資格名として使う。
 * Studio 側 lib/referral-exam-names.ts の SHIKAKUMON_EXAM_NAMES と同じ値を保つこと
 * (向こうは utm_content — 旧リンクでは utm_medium — から引く用、こちらは URL に載せる用)。
 */
export const EXAM_FULL_NAMES: Record<ExamSlug, string> = {
  kashikin: "貸金業務取扱主任者",
  pii: "個人情報保護士",
  chizai: "知的財産管理技能検定",
  chizai2: "知的財産管理技能検定2級",
  mynumber: "マイナンバー実務検定",
  jitsumu: "個人情報保護実務検定",
  bijihou: "ビジネス実務法務検定",
  fukushi2: "福祉住環境コーディネーター2級",
  bijimane: "ビジネスマネジャー検定",
  eco: "eco検定",
  bijihou2: "ビジネス実務法務検定2級",
  itpass: "ITパスポート試験",
  isec: "情報・サイバーセキュリティ管理士認定試験",
  kyoin: "教員採用試験",
  shakai: "社会福祉士国家試験",
  chintai: "賃貸不動産経営管理士",
  kangyo: "管理業務主任者",
};

/**
 * 模試の結果から Studio へ送るリンクを組み立てる。
 *
 * 模試の結果画面では既に分野別正答率を集計し「いちばんの弱点は◯◯」まで
 * 出しているのに、Studio へのリンクは汎用トップのままで、その情報が
 * 一切引き継がれていなかった。資格名と弱点分野を渡すことで、着地先では
 * 何も入力せずに弱点分野の問題を作れる状態になる
 * (Studio 側: トップのお試し生成は ?exam= を、作成画面は ?exam=&theme= を読む)。
 *
 * 模試完了者は全 CTA 設置箇所で最も転換率が高い層 (90日で完了87人 → Studio 19)
 * なので、ここの精度を上げる価値が最も大きい。
 *
 * @param exam      資格
 * @param weakField 最も正答率が低かった分野。無ければ省略
 * @param content   utm_content (既存値を維持: moshi_result / mock_result)。
 *                  utm_medium は GA4 チャネル判定のため referral 固定 (studioCtaFor と同じ理由)
 */
export function studioMoshiHref(
  exam: ExamSlug,
  weakField: string | null | undefined,
  content: string
): string {
  const lp = CERT_CTA[exam]?.lp;
  const path = lp ? `/lp/${lp}` : "/";
  const params = new URLSearchParams({
    utm_source: "shikakumon",
    utm_medium: "referral",
    utm_content: content,
    exam: EXAM_FULL_NAMES[exam],
  });
  // 分野名はそのまま検索語として使われるので、長すぎるものは切る
  const field = (weakField ?? "").trim();
  if (field) params.set("theme", field.slice(0, 40));
  return `${STUDIO_ORIGIN}${path}?${params.toString()}`;
}
