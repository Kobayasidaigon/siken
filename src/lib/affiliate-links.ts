/**
 * 資格(ExamSlug)ごとの A8 アフィリエイトリンクの正準定義。
 *
 * 問題ページの「答え合わせ直後CTA」(AnswerReveal) など、CourseAdコンポーネント以外の
 * 場所からA8リンクを使うときの単一の参照元。a8mat文字列の重複(=更新漏れ・収益取りこぼし)を防ぐ。
 *
 * 注: 既存の *CourseAd.tsx も同じリンクを内蔵しているが、それらは「本文末の講座広告」用。
 * リンクを差し替える際はこのファイルと該当CourseAdの両方を更新すること。
 */

import type { ExamSlug } from "./study-progress";

export interface AffiliateTarget {
  href: string;     // A8の計測付きリンク（有料講座）
  label: string;    // アンカーテキスト
  course: string;   // GA4計測用の識別子

  /**
   * ★低摩擦オファー（資料請求・無料体験・無料受講相談など）のA8リンク。
   * 有料講座の購入は摩擦が大きくCVRの天井が低いため、無料アクションを併設すると
   * 発生件数が桁違いに取りやすい（監査の最優先課題＝offer-mix）。
   *
   * 使い方: A8管理画面で同じ広告主（アガルート／情報学習振興協会／オンスク等）の
   * 「資料請求」「無料体験」「無料受講相談」プログラムの素材リンクを取得し、
   * 下の freeHref / freeLabel に貼るだけで、採点直後・学習履歴・分野ページ・講座広告の
   * 各所に自動で「無料」CTAが表示される（FreeLeadCTA / CourseAd が参照）。
   * 未設定（undefined）の間は無料CTAは一切表示されない（安全な no-op）。
   */
  freeHref?: string;
  freeLabel?: string;
}

export const EXAM_AFFILIATE: Record<ExamSlug, AffiliateTarget> = {
  kashikin: {
    href: "https://px.a8.net/svt/ejp?a8mat=4B3N6P+AWY41E+44M0+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.agaroot.jp%2Fkashikin%2F",
    label: "アガルートの貸金業務取扱主任者講座を見る",
    course: "kashikin",
    // アガルート公式の資料請求・無料体験ページ(登録1分)。2026-08-03設定。
    freeHref:
      "https://px.a8.net/svt/ejp?a8mat=4B3N6P+AWY41E+44M0+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.agaroot.jp%2Fkashikin%2Fcatalog%2F",
    freeLabel: "資料請求・無料体験を申し込む(登録1分)",
  },
  pii: {
    href: "https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.joho-gakushu.jp%2Fsmartinfo%2Fk_piip%2F",
    label: "個人情報保護士のSMART合格講座を見る",
    course: "pii",
    // SMARTの無料ユーザー登録(講座の試し視聴可)。2026-08-03設定。
    freeHref:
      "https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.joho-gakushu.jp%2Fsmart%2Fregistfree.php",
    freeLabel: "無料登録してSMART講座を試し見る",
  },
  chizai: {
    href: "https://px.a8.net/svt/ejp?a8mat=4B3TF4+BJKL0Y+408S+BW8O2&a8ejpredirect=https%3A%2F%2Fonsuku.jp%2Ftraining%2Fchizai3",
    label: "知的財産管理技能検定3級の対策講座を見る",
    course: "chizai",
    // オンスク自身の無料体験導線(無料期間無制限・自動有料化なしと公式表記)。2026-08-03設定。
    freeHref:
      "https://px.a8.net/svt/ejp?a8mat=4B3TF4+BJKL0Y+408S+BW8O2&a8ejpredirect=https%3A%2F%2Fonsuku.jp%2Fmembers%2Flogin_required%3Frequired%3D1",
    freeLabel: "オンスクの無料体験で講義を試す",
  },
  // TODO(2級): オンスクに知財2級の個別講座があればそのa8matへ差し替える。
  //   当面は3級と同じオンスク知財リンク(サブスクで2級範囲もカバー)を流用。
  chizai2: {
    href: "https://px.a8.net/svt/ejp?a8mat=4B3TF4+BJKL0Y+408S+BW8O2&a8ejpredirect=https%3A%2F%2Fonsuku.jp%2Ftraining%2Fchizai3",
    label: "オンスクの知財検定対策講座を見る",
    course: "chizai2",
    freeHref:
      "https://px.a8.net/svt/ejp?a8mat=4B3TF4+BJKL0Y+408S+BW8O2&a8ejpredirect=https%3A%2F%2Fonsuku.jp%2Fmembers%2Flogin_required%3Frequired%3D1",
    freeLabel: "オンスクの無料体験で講義を試す",
  },
  mynumber: {
    href: "https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.joho-gakushu.jp%2Fsmartinfo%2Fk_nns%2F",
    label: "マイナンバー実務検定のSMART合格講座を見る",
    course: "mynumber",
    freeHref:
      "https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.joho-gakushu.jp%2Fsmart%2Fregistfree.php",
    freeLabel: "無料登録してSMART講座を試し見る",
  },
  jitsumu: {
    href: "https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.joho-gakushu.jp%2Fsmartinfo%2Fk_pipl%2F",
    label: "個人情報保護実務検定のSMART合格講座を見る",
    course: "jitsumu",
    freeHref:
      "https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.joho-gakushu.jp%2Fsmart%2Fregistfree.php",
    freeLabel: "無料登録してSMART講座を試し見る",
  },
  bijihou: {
    href: "https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.joho-gakushu.jp%2Fsmartinfo%2Fsmart_lineup.php",
    label: "ビジネス実務法務検定のSMART合格講座を見る",
    course: "bijihou",
    freeHref:
      "https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.joho-gakushu.jp%2Fsmart%2Fregistfree.php",
    freeLabel: "無料登録してSMART講座を試し見る",
  },
  // TODO(fukushi2): A8でユーキャン「講座申込プログラム」と提携後、a8mat付きリンクへ差し替える
  //   (講座申込=最大5,000円/件。afbの資料請求=最大1,000円は freeHref に設定する)。
  //   提携承認まではトラッキング無しの公式講座ページへの直リンクで運用(収益ゼロだが導線は維持)。
  fukushi2: {
    href: "https://www.u-can.co.jp/%E7%A6%8F%E7%A5%89%E4%BD%8F%E7%92%B0%E5%A2%83%E3%82%B3%E3%83%BC%E3%83%87%E3%82%A3%E3%83%8D%E3%83%BC%E3%82%BF%E3%83%BC/",
    label: "ユーキャンの福祉住環境コーディネーター講座を見る",
    course: "fukushi2",
  },
  // TODO(bijimane): A8で産業能率大学(東商の公式通信講座)またはTACのプログラムと提携できたら
  //   a8mat付きリンクへ差し替える。提携可否はユーザー確認待ち(night-batch/INBOX.md 項目1)。
  //   それまではトラッキング無しの公式講座ページへの直リンクで運用する(収益ゼロだが導線は維持)。
  //   ※ SMART合格講座(情報学習振興協会)はビジネスマネジャー検定を扱っていないため流用しないこと。
  bijimane: {
    href: "https://www.hj.sanno.ac.jp/cp/distance-learning/course/B650-01.html",
    label: "東商公式通信講座（産業能率大学）を見る",
    course: "bijimane",
  },
};

/**
 * 答え合わせ直後CTAの導入文（資格別）。誇大表現は避け、答え合わせ文脈に連動。
 */
export const RESULT_CTA_HEADLINE: Record<ExamSlug, string> = {
  kashikin: "間違えた論点を体系的に整理するなら",
  pii: "間違えた論点を体系的に整理するなら",
  chizai: "間違えた論点を体系的に整理するなら",
  chizai2: "間違えた論点を体系的に整理するなら",
  mynumber: "間違えた論点を体系的に整理するなら",
  jitsumu: "間違えた論点を体系的に整理するなら",
  bijihou: "間違えた論点を体系的に整理するなら",
  fukushi2: "間違えた論点を体系的に整理するなら",
  bijimane: "間違えた論点を体系的に整理するなら",
};
