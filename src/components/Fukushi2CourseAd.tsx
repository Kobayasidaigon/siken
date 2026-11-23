/**
 * 福祉住環境コーディネーター2級 対策講座（ユーキャン）の広告
 * 配置: fukushi2 の問題ページ・分野ページ・資格トップ・関連コラム末尾
 *
 * TODO(A8提携後): AffiliateLink の href を A8 の a8mat 付きリンクへ差し替え、
 * インプレッション計測用の 1x1 gif も追加する（BijihouCourseAd.tsx 参照）。
 * 差し替え時は src/lib/affiliate-links.ts の fukushi2 エントリも同時に更新すること。

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

export default function Fukushi2CourseAd({ placement = "course_ad", showCourseLink = true }: Props = {}) {
  return (
    <StudioFirstCourseAd
      exam="fukushi2"
      placement={placement}
      showCourseLink={showCourseLink}
      courseHref={"https://www.u-can.co.jp/%E7%A6%8F%E7%A5%89%E4%BD%8F%E7%92%B0%E5%A2%83%E3%82%B3%E3%83%BC%E3%83%87%E3%82%A3%E3%83%8D%E3%83%BC%E3%82%BF%E3%83%BC/"}
      courseLabel={"ユーキャンの福祉住環境コーディネーター講座を見る"}
      courseLead="通信講座で体系的に学びたい方は"
    />
  );
}
