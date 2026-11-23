/**
 * eco検定（環境社会検定試験）向けの学習リソース案内。
 * 配置: eco の問題ページ・分野ページ・資格トップ・関連コラム末尾
 *
 * TODO(A8提携後): AffiliateLink の href を A8 の a8mat 付きリンクへ差し替え、
 * インプレッション計測用の 1x1 gif も追加する（BijihouCourseAd.tsx 参照）。
 * 差し替え時は src/lib/affiliate-links.ts の eco エントリも同時に更新すること。
 * 提携可否の確認はユーザー宿題（night-batch/INBOX.md）。
 *
 * ※提携が付くまでのリンク先は東京商工会議所の公式検定サイト（トラッキングなし）。
 *   収益はゼロだが、受験者が最初に見るべき一次情報へ導く導線としては正しいので出しておく。
 * ※そのため他資格の CourseAd と違い「広告」バッジを出していない（アフィリではないため）。
 *   A8リンクへ差し替える際は、他の CourseAd と同じ「広告」バッジを必ず復活させること。

 *
 * 2026-11-22: アフィリ提携が無い(直リンクで売上ゼロ)ため、枠の主役をシカクモン Studio のカードに替えた
 * (StudioFirstCourseAd.tsx / lib/studio-cta.ts の STUDIO_FIRST_EXAMS)。講座・公式サイトのリンクは下に小さく残す。
 * headline / body は旧レイアウトの名残で、今は使っていない(呼び出し側を変えずに済むよう受け取りだけ残す)。
 */

import StudioFirstCourseAd from "@/components/StudioFirstCourseAd";

interface Props {
  headline?: string;
  body?: string;
  /** 設置面(AffiliateLink と同じ語彙)。問題ページの答え合わせ後は question_result */
  placement?: string;
  /** 講座の直リンクを出すか */
  showCourseLink?: boolean;
}

export default function EcoCourseAd({ placement = "course_ad", showCourseLink = true }: Props = {}) {
  return (
    <StudioFirstCourseAd
      exam="eco"
      placement={placement}
      showCourseLink={showCourseLink}
      courseHref={"https://kentei.tokyo-cci.or.jp/eco/"}
      courseLabel={"東商の公式サイトで公式テキスト・学習方法を見る"}
      courseLead="公式テキストから押さえたい方は"
    />
  );
}
