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
  href: string;     // A8の計測付きリンク
  label: string;    // アンカーテキスト
  course: string;   // GA4計測用の識別子
}

export const EXAM_AFFILIATE: Record<ExamSlug, AffiliateTarget> = {
  kashikin: {
    href: "https://px.a8.net/svt/ejp?a8mat=4B3N6P+AWY41E+44M0+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.agaroot.jp%2Fkashikin%2F",
    label: "アガルートの貸金業務取扱主任者講座を見る",
    course: "kashikin",
  },
  pii: {
    href: "https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.joho-gakushu.jp%2Fsmartinfo%2Fk_piip%2F",
    label: "個人情報保護士のSMART合格講座を見る",
    course: "pii",
  },
  chizai: {
    href: "https://px.a8.net/svt/ejp?a8mat=4B3TF4+BJKL0Y+408S+BW8O2&a8ejpredirect=https%3A%2F%2Fonsuku.jp%2Ftraining%2Fchizai3",
    label: "知的財産管理技能検定3級の対策講座を見る",
    course: "chizai",
  },
  mynumber: {
    href: "https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.joho-gakushu.jp%2Fsmartinfo%2Fk_nns%2F",
    label: "マイナンバー実務検定のSMART合格講座を見る",
    course: "mynumber",
  },
  jitsumu: {
    href: "https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.joho-gakushu.jp%2Fsmartinfo%2Fk_pipl%2F",
    label: "個人情報保護実務検定のSMART合格講座を見る",
    course: "jitsumu",
  },
  bijihou: {
    href: "https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.joho-gakushu.jp%2Fsmartinfo%2Fsmart_lineup.php",
    label: "ビジネス実務法務検定のSMART合格講座を見る",
    course: "bijihou",
  },
};

/**
 * 答え合わせ直後CTAの導入文（資格別）。誇大表現は避け、答え合わせ文脈に連動。
 */
export const RESULT_CTA_HEADLINE: Record<ExamSlug, string> = {
  kashikin: "間違えた論点を体系的に整理するなら",
  pii: "間違えた論点を体系的に整理するなら",
  chizai: "間違えた論点を体系的に整理するなら",
  mynumber: "間違えた論点を体系的に整理するなら",
  jitsumu: "間違えた論点を体系的に整理するなら",
  bijihou: "間違えた論点を体系的に整理するなら",
};
