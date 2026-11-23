/**
 * ビジネスマネジャー検定 対策講座（産業能率大学の通信講座）の広告
 * 2026-11-10: 以前は「東商の公式通信講座（産業能率大学）」と書いていた。東京商工会議所の公式通信講座のページ
 *   (kentei.tokyo-cci.or.jp/bijimane/support/online-course.html)に産業能率大学の名前は無く、申込は運営委託機関の
 *   株式会社ワールド・ヒューマン・リソーシス。一方、産業能率大学 総合研究所の「公式通信講座 ＜Web専用＞」のページ
 *   (www.hj.sanno.ac.jp/distance-learning/course/2AM0-01.html)は「東京商工会議所の公式通信講座」と書いている(受講料21,000円で一致)。
 *   このリンク先(B650-01)がその講座かは開けず確かめられなかったので、「東商公式」とは書かない。
 * 2026-11-10(午後): 旧リンク先(/cp/distance-learning/course/B650-01.html)は /distance-learning/… に転送されて
 *   「ページが見つかりません」になっていた(AdSense 申し込み前の Cowork の確認で判明)。開けることを確かめた
 *   2AM0-01「＜Web専用＞ビジネスマネジャー検定試験(R)」(受講料21,000円・税込)に差し替えた。そのページは
 *   「東京商工会議所の公式通信講座」と書いているが、東商のページには産業能率大学の名前が無いので、文言は変えていない。
 *   「公式テキストは400ページ超」も公式ページで確かめられないため外した。
 * 配置: bijimane の問題ページ・分野ページ・資格トップ・関連コラム末尾
 *
 * TODO(A8提携後): AffiliateLink の href を A8 の a8mat 付きリンクへ差し替え、
 * インプレッション計測用の 1x1 gif も追加する（BijihouCourseAd.tsx 参照）。
 * 差し替え時は src/lib/affiliate-links.ts の bijimane エントリも同時に更新すること。
 * 提携可否の確認はユーザー宿題（night-batch/INBOX.md 項目1）。

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

export default function BijimaneCourseAd({ placement = "course_ad", showCourseLink = true }: Props = {}) {
  return (
    <StudioFirstCourseAd
      exam="bijimane"
      placement={placement}
      showCourseLink={showCourseLink}
      courseHref={"https://www.hj.sanno.ac.jp/distance-learning/course/2AM0-01.html"}
      courseLabel={"産業能率大学の通信講座を見る"}
      courseLead="通信講座で体系的に学びたい方は"
    />
  );
}
