import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import {
  getShakaiMoshi1Questions,
  SHAKAI_MOSHI_PASS_COUNT,
  SHAKAI_MOSHI_TIME_LIMIT_MIN,
} from "@/lib/shakai-moshi";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/shakai/moshi/",
  title: "社会福祉士 共通科目 模擬試験 第1回（無料）｜60問・75分・分野別判定つき",
  description:
    "社会福祉士国家試験の共通科目にしぼった無料模擬試験。原理と政策・社会保障・権利擁護・地域福祉・障害者福祉・医学と心理・社会学と調査・ソーシャルワークの8分野から60問を75分で通しで解き、分野別の正答率で弱点を判定します。登録不要。",
});

export default async function ShakaiMoshiPage() {
  const all = await getShakaiMoshi1Questions();
  // 詳解は同梱せず、結果画面から各問題ページへ誘導する(pii/moshi と同じ)
  const questions: MoshiQuestion[] = all.map((q) => ({
    slug: q.slug,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    field: q.field,
  }));

  return (
    <div className="theme-eco pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a>
        <span>/</span>
        <a href="/shakai/">社会福祉士</a>
        <span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（共通科目・60問）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        共通科目12科目を束ねた8分野から<strong>60問を75分</strong>で通しで解く無料の模擬試験です。
        全員が同じ問題を同じ順序で解く固定問題なので、分野別の弱点を測るのにそのまま使えます。
        共通科目は<strong>精神保健福祉士と共通の出題範囲</strong>なので、どちらの受験にも使えます。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">出題数</span>
          　60問（8分野から各7〜8問／4肢択一）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">制限時間</span>
          {SHAKAI_MOSHI_TIME_LIMIT_MIN}分（自動採点）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">目安ライン</span>　{SHAKAI_MOSHI_PASS_COUNT}
          問（正答率60%＝本試験の合格基準に合わせた素点の目安）
        </p>
        <p>
          <span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要
        </p>
      </div>

      <MoshiExam
        exam="shakai"
        round={1}
        sessionKey="shikakumon-shakai-moshi1-v1"
        questions={questions}
        timeLimitMin={SHAKAI_MOSHI_TIME_LIMIT_MIN}
        passCount={SHAKAI_MOSHI_PASS_COUNT}
        passLabel="60問中36問以上（正答率60%）"
        choiceLabel="4肢択一"
        questionPathPrefix="/shakai/q/"
        topPath="/shakai/"
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本試験は129問・225分で、共通科目と専門科目の両方が出題されます。本模試は
        <strong>共通科目だけ</strong>を60問・75分に切り出したもので、本試験の形式そのものではありません。
        また本試験の合格基準は総得点の約6割ですが、毎年の難易度で補正され、6つの科目群すべてで得点があることも
        要件になります。ここでの6割判定は素点だけを見た学習の目安です。
        当サイト編集部が作成したオリジナル問題で構成しており、実際の過去問題の転載ではありません。
        1問ずつじっくり学びたい方は
        <a href="/shakai/" className="underline hover:no-underline">
          練習問題200問
        </a>
        へ。
      </p>
    </div>
  );
}
