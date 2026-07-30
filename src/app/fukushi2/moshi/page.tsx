import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import {
  getFukushi2Moshi1Takuitsu,
  FUKUSHI2_MOSHI_PASS_POINTS,
  FUKUSHI2_MOSHI_TIME_LIMIT_MIN,
} from "@/lib/fukushi2-moshi";
import { FUKUSHI2_OX } from "@/lib/fukushi2-moshi-ox";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/fukushi2/moshi/",
  title: "福祉住環境コーディネーター2級 模擬試験 第1回（無料）｜本試験型○×+択一58問・90分・70点判定",
  description:
    "福祉住環境コーディネーター2級の無料模擬試験。受験者の体験談に基づく本試験型構成（○×30問＋四肢択一28問＝58問・100点満点）を、本試験と同じ90分・70点合格の基準で受験でき、終了後に合格判定・分野別の弱点分析・全問の詳しい解説を確認できます。",
});

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default async function Fukushi2MoshiPage() {
  const takuitsu = await getFukushi2Moshi1Takuitsu();
  // 本試験型: ○×30問(各1点)→ 四肢択一28問(2点×14・3点×14)=58問・100点満点
  const questions: MoshiQuestion[] = [
    ...FUKUSHI2_OX.map((o) => ({
      slug: o.id,
      questionText: `次の記述は正しいか、誤っているか。\n\n${o.statement}`,
      choices: ["正しい", "誤っている"],
      correctAnswer: o.answer ? 1 : 2,
      field: o.field,
      explanationHtml: `<p>${escapeHtml(o.explain)}</p>`,
      points: 1,
      noLink: true,
    })),
    ...takuitsu.map((q) => ({
      slug: q.slug,
      questionText: q.questionText,
      choices: q.choices,
      correctAnswer: q.correctAnswer,
      field: q.field,
      explanationHtml: q.content,
      points: q.points,
    })),
  ];

  return (
    <div className="theme-fukushi pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/fukushi2/">福祉住環境コーディネーター2級</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第1回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第1回（本試験型）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        本試験（IBT/CBT）と同じ<strong>90分・100点満点・70点以上で合格</strong>の基準で受験できる無料の模擬試験です。
        出題構成は受験者の体験談で一致している<strong>○×30問＋四肢択一28問(配点1〜3点)の本試験型</strong>に合わせました。
        IBT移行後は過去問が公開されないため、本番と同じ形式・時間で解ける場は貴重です。
        全員が同じ問題を同じ順序で解く固定問題なので、本番前の実力測定にそのまま使えます。
      </p>

      {/* 試験仕様 */}
      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　58問＝100点満点（○×30問×1点＋四肢択一14問×2点＋14問×3点）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{FUKUSHI2_MOSHI_TIME_LIMIT_MIN}分（自動採点）＝本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　{FUKUSHI2_MOSHI_PASS_POINTS}点以上＝本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="fukushi2"
        round={1}
        sessionKey="shikakumon-fukushi2-moshi1-v2"
        questions={questions}
        timeLimitMin={FUKUSHI2_MOSHI_TIME_LIMIT_MIN}
        passCount={41}
        passLabel="70点／100点満点 以上"
        choiceLabel="○×+四肢択一"
        questionPathPrefix="/fukushi2/q/"
        topPath="/fukushi2/"
        passPoints={FUKUSHI2_MOSHI_PASS_POINTS}
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本試験（IBT/CBT）の問題数・出題形式の内訳・配点は公式には公開されていません。本模試の構成
        （○×30問＋四肢択一28問・配点1〜3点）は、複数の受験者の体験談と公式練習問題の形式（4肢選択・○×選択・穴埋め）に
        基づく本試験型の推定構成で、実際の試験と異なる場合があります（本試験に含まれることがある図面を使った問題・
        穴埋め問題は対象外です）。当サイト編集部が作成したオリジナル問題で、実際の試験問題の転載ではありません。
        合格判定はあくまで学習の目安です。時間を計らずに力試しをしたい方は
        <a href="/fukushi2/mock/" className="underline hover:no-underline">本番形式テスト（ランダム20問）</a>へ、
        1問ずつじっくり学びたい方は<a href="/fukushi2/" className="underline hover:no-underline">練習問題200問</a>へ。
      </p>
    </div>
  );
}
