import { todayStart } from "@/lib/exam-dates";
import ExamCountdownCard, { type ExamCountdownProps } from "@/components/ExamCountdownCard";

/**
 * 資格トップの試験カウントダウンカード。
 *
 * A8実測(2026-08-06)で成果は「申込締切の直前」に集中すると分かったため、
 * 申込期間中は「次回試験まであとN日」より優先して「申込締切まであとN日」を
 * 表示する(締切の方が読者の行動=申込・講座検討を生む)。
 * 申込期間外は従来どおり試験日カウントダウンに戻り、日付リストが尽きたら非表示。
 *
 * apply: 試験実施団体がA8広告主の場合(SMART系=全日本情報学習振興協会)のみ、
 * 締切表示時に公式申込ページへのA8導線を添える(「広告」ラベル付き)。
 *
 * lead: 2026-09-05 追加。実施団体が広告主でない資格(アガルート系の貸金・賃管士・管業、
 * オンスク/LEC の知財、SMART の ビジ法)では、締切カウントダウンが日数を見せるだけで
 * 行動導線が無かった。成果が集中する窓なので、affiliate-links.ts に freeHref
 * (資料請求・無料体験・無料登録)がある資格だけ、apply と同じ罫線下に無料オファーを
 * 1行添える。apply と同時には出さない(協会申込が優先)。freeHref 未設定なら何も出ない。
 *
 * 資格トップだけでなく日程コラム(/column/*-nittei/)・直前対策コラムにも設置している。
 * applyPlacement / leadPlacement は設置面ごとの CTR を分けて計測するために置いている。
 *
 * 2026-10-10: 描画は ExamCountdownCard(クライアント部品)に移した。ここはビルド時の日付を
 * 渡すだけの入口で、呼び出し側の props は変わらない。ブラウザで閲覧日に計算し直すので、
 * 「あと◯日」と、締切を過ぎた回・申込リンクを下げる処理がデプロイしなくても日付どおりに動く。
 */
export default function ExamCountdown(props: ExamCountdownProps) {
  return <ExamCountdownCard {...props} asOf={todayStart()} />;
}
