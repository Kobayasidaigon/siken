/**
 * 福祉住環境コーディネーター3級 対策講座（ユーキャン）の広告。
 * ユーキャンの「福祉住環境コーディネーター講座」は「２・３級講座」（2026-11-12 に講座のページで確認）なので、
 * 2級と同じ講座を案内する。リンクは src/lib/affiliate-links.ts の EXAM_AFFILIATE を唯一の出典とする。
 * 配置: fukushi3 の資格トップ・問題ページ(答え合わせ後)。
 *
 * 掲載面の制限は2級と同じ（lib/ucan-policy.ts）: 数値を伴う合格率・合格者数を書いた面には出さない。
 * ユーキャンは A8 提携の申請中で、いまは計測なしの直リンク（Fukushi2CourseAd.tsx の TODO と同じ）。

 *
 * 2026-11-22: アフィリ提携が無い(直リンクで売上ゼロ)ため、枠の主役をシカクモン Studio のカードに替えた
 * (StudioFirstCourseAd.tsx / lib/studio-cta.ts の STUDIO_FIRST_EXAMS)。講座・公式サイトのリンクは下に小さく残す。
 * headline / body は旧レイアウトの名残で、今は使っていない(呼び出し側を変えずに済むよう受け取りだけ残す)。
 */

import StudioFirstCourseAd from "@/components/StudioFirstCourseAd";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

interface Props {
  headline?: string;
  body?: string;
  /** 設置面(AffiliateLink と同じ語彙)。問題ページの答え合わせ後は question_result */
  placement?: string;
  /** 講座の直リンクを出すか */
  showCourseLink?: boolean;
}

export default function Fukushi3CourseAd({ placement = "course_ad", showCourseLink = true }: Props = {}) {
  return (
    <StudioFirstCourseAd
      exam="fukushi3"
      placement={placement}
      showCourseLink={showCourseLink}
      courseHref={EXAM_AFFILIATE["fukushi3"].href}
      courseLabel={EXAM_AFFILIATE["fukushi3"].label}
      courseLead="2級まで続けて通信講座で学びたい方は"
    />
  );
}
