import type { UpcomingExam } from "@/lib/exam-dates";
import { nextExam, nextApplyDeadline, daysUntilYmd, formatYmdJa } from "@/lib/exam-dates";
import AffiliateLink from "@/components/AffiliateLink";
import FreeLeadCTA from "@/components/FreeLeadCTA";
import CountdownPing from "@/components/CountdownPing";
import type { ExamSlug } from "@/lib/study-progress";
import { EXAM_AFFILIATE } from "@/lib/affiliate-links";

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
 */

interface Props {
  exams: UpcomingExam[];
  accent: string; // 例 "var(--c-pii)"
  accentSoft: string; // 例 "var(--c-pii-soft)"。締切間近の強調背景に使う
  examWord?: string; // 試験日表示の名詞。既定「次回試験」(貸金は「次回本試験」)
  periodExam?: boolean; // 東商IBT/CBTの期間制: 「試験期間の開始まで」+日付末尾に「〜」
  apply?: { href: string; course: string; pixel: string };
  applyPlacement?: string; // GA4で設置面を区別する。既定は資格トップの "top_apply"
  lead?: ExamSlug; // 締切表示時に無料オファー(freeHref)を添える資格。apply が無い資格向け
  leadPlacement?: string; // 既定は資格トップの "top_lead"。コラムは "column_countdown_lead"
}

// 締切がこの日数以内に迫ったら強調表示に切り替える。
// 強調は「淡色背景+左罫線+日数の級数アップ」まで(赤・アニメーション等は設計言語に反するため使わない)。
const URGENT_DAYS = 10;

export default function ExamCountdown({
  exams,
  accent,
  accentSoft,
  examWord = "次回試験",
  periodExam = false,
  apply,
  applyPlacement = "top_apply",
  lead,
  leadPlacement = "top_lead",
}: Props) {
  const deadline = nextApplyDeadline(exams);
  if (deadline && deadline.applyEnd) {
    const daysLeft = daysUntilYmd(deadline.applyEnd);
    const urgent = daysLeft <= URGENT_DAYS;
    return (
      <section
        className="mb-10 card p-5"
        style={urgent ? { background: accentSoft, borderLeft: `3px solid ${accent}` } : undefined}
      >
        <CountdownPing mode="apply" ymd={deadline.applyEnd} />
        {/* モバイルは縦積み(日付が長く横並びだとはみ出すため)、sm以上で横並び */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <p className="text-xs text-[color:var(--c-text-sub)] mb-1">{deadline.label} 申込締切まで</p>
            <p className={`${urgent ? "text-2xl" : "text-lg"} font-bold font-serif`} style={{ color: accent }}>
              {daysLeft === 0 ? "本日締切" : <>あと {daysLeft} 日</>}
            </p>
          </div>
          <div className="text-sm text-[color:var(--c-text-sub)] sm:text-right">
            <p>締切 {formatYmdJa(deadline.applyEnd)}</p>
            <p className="mt-1">試験日 {formatYmdJa(deadline.date)}{periodExam ? "〜" : ""}</p>
          </div>
        </div>
        {apply && (
          <p className="mt-4 pt-3 border-t border-[color:var(--c-border)] text-sm flex items-center gap-2">
            <span className="text-[10px] tracking-wider text-[color:var(--c-text-sub)] border border-[color:var(--c-border)] px-1.5 py-0.5 rounded shrink-0">
              広告
            </span>
            <AffiliateLink href={apply.href} course={apply.course} placement={applyPlacement} className="underline hover:no-underline">
              協会公式サイトで申し込む →
            </AffiliateLink>
            <img width={1} height={1} src={apply.pixel} alt="" style={{ position: "absolute", border: 0 }} />
          </p>
        )}
        {!apply && lead && (
          <LeadRow exam={lead} placement={leadPlacement} />
        )}
      </section>
    );
  }

  const upcoming = nextExam(exams);
  if (!upcoming) return null;
  const daysLeft = daysUntilYmd(upcoming.date);
  if (daysLeft <= 0) return null;
  return (
    <section className="mb-10 card p-5 flex items-center justify-between">
      <CountdownPing mode="exam" ymd={upcoming.date} />
      <div>
        <p className="text-xs text-[color:var(--c-text-sub)] mb-1">
          {periodExam ? `${examWord}期間（${upcoming.label}）の開始まで` : `${examWord}（${upcoming.label}）まで`}
        </p>
        <p className="text-lg font-bold font-serif" style={{ color: accent }}>あと {daysLeft} 日</p>
      </div>
      <p className="text-sm text-[color:var(--c-text-sub)]">{formatYmdJa(upcoming.date)}{periodExam ? "〜" : ""}</p>
    </section>
  );
}

/**
 * 無料オファー行。FreeLeadCTA は freeHref が無い資格では null を返すので、
 * その場合は「広告」ラベルごと出さないよう、ここで先に有無を確認する。
 */
function LeadRow({ exam, placement }: { exam: ExamSlug; placement: string }) {
  if (!EXAM_AFFILIATE[exam]?.freeHref) return null;
  return (
    <p className="mt-4 pt-3 border-t border-[color:var(--c-border)] text-sm flex items-center gap-2">
      <span className="text-[10px] tracking-wider text-[color:var(--c-text-sub)] border border-[color:var(--c-border)] px-1.5 py-0.5 rounded shrink-0">
        広告
      </span>
      <FreeLeadCTA exam={exam} placement={placement} className="underline hover:no-underline" />
    </p>
  );
}
