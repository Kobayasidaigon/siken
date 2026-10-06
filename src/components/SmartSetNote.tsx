/**
 * SMART合格講座の「試験と同時申込で3,300円引き」の注記。2026-10-06 追加。
 * 講座広告(Pii/Jitsumu/Mynumber/IsecCourseAd)の講座リンクの直下に、資格トップでだけ出す。
 * 金額と確認時点は lib/smart-set-price.ts が唯一の出典。
 */

import {
  SMART_SET_PRICE,
  SMART_SET_DISCOUNT_YEN,
  SMART_SET_CHECKED,
  formatPrices,
  yen,
  type SmartSetExam,
} from "@/lib/smart-set-price";

export default function SmartSetNote({ exam }: { exam: SmartSetExam }) {
  const p = SMART_SET_PRICE[exam];
  return (
    <p className="text-xs text-[color:var(--c-text-sub)] leading-relaxed">
      <span className="font-bold text-[color:var(--c-ink)]">
        試験と同時に申し込むと{yen(SMART_SET_DISCOUNT_YEN)}円引き
      </span>
      <br />
      講座のみ {formatPrices(p.courseOnly)}／講座＋試験 {formatPrices(p.withExam)}
      （税込・{SMART_SET_CHECKED}時点の協会公式ページの表示）
    </p>
  );
}
