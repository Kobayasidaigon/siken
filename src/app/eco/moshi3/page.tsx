import SiteLink from "@/components/SiteLink";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import {
  ECO_MOSHI3_GOGUN,
  ECO_MOSHI3_OX,
  ECO_MOSHI3_PASS_COUNT,
  ECO_MOSHI3_PASS_POINTS,
  ECO_MOSHI3_TIME_LIMIT_MIN,
  getEcoMoshi3Takuitsu,
} from "@/lib/eco-moshi3";
import MoshiExam, { type MoshiQuestion } from "@/components/MoshiExam";

export const metadata: Metadata = pageMetadata({
  path: "/eco/moshi3/",
  title: "eco検定 模擬試験 第3回（無料）｜○×・語群の穴埋め・四肢択一70問・90分・70点判定",
  description:
    "eco検定（環境社会検定試験）の無料模擬試験 第3回。○×20問・語群から選ぶ穴埋め20問・用語の意味を問う四肢択一30問の70問を、本試験と同じ90分・100点満点70点以上の基準で受験できます。終了後に合格判定・分野別の弱点分析・全問の解説を確認できます。登録不要。",
});

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default async function EcoMoshi3Page() {
  const takuitsu = await getEcoMoshi3Takuitsu();
  // 当サイト独自の構成(公式は形ごとの問題数・配点を公表していない):
  // ○×20問(各1点) → 語群の穴埋め20問(各1点) → 四肢択一30問(各2点) = 70問・100点満点
  const questions: MoshiQuestion[] = [
    ...ECO_MOSHI3_OX.map((o) => ({
      slug: o.id,
      questionText: `次の記述は正しいか、誤っているか。\n\n${o.statement}`,
      choices: ["正しい", "誤っている"],
      format: "ox" as const,
      correctAnswer: o.answer ? 1 : 2,
      field: o.field,
      explanationHtml: `<p>${escapeHtml(o.explain)}</p>`,
      points: 1,
      noLink: true,
    })),
    ...ECO_MOSHI3_GOGUN.flatMap((g) =>
      g.blanks.map((b) => {
        const idx = g.words.indexOf(b.answer);
        if (idx < 0) throw new Error(`[eco-moshi3] 語群に正解がありません: ${g.id} ${b.label}`);
        return {
          slug: `${g.id}-${b.label}`,
          questionText: `次の文章の【${b.label}】にあてはまる最も適切な語句を、語群から選びなさい。\n\n${g.passage}`,
          choices: g.words,
          correctAnswer: idx + 1,
          field: g.field,
          explanationHtml: `<p>正解は「${escapeHtml(b.answer)}」。${escapeHtml(b.explain)}</p>`,
          points: 1,
          noLink: true,
        };
      })
    ),
    ...takuitsu.map((q) => ({
      slug: q.slug,
      questionText: q.questionText,
      choices: q.choices,
      correctAnswer: q.correctAnswer,
      field: q.field,
      explanationHtml: q.content,
      points: 2,
    })),
  ];

  return (
    <div className="theme-eco pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <SiteLink href="/">ホーム</SiteLink><span>/</span>
        <SiteLink href="/eco/">eco検定</SiteLink><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第3回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第3回（○×・語群の穴埋めつき）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        eco検定の本試験では、四肢択一のほかに、一問一答の○×問題や、10個ほどの語群から選ぶ穴埋め問題も出ると受験者の間で言われています。
        用語・キーワードの意味をきちんと理解しているかを問う問題も多いため、この回は3つの形をそろえ、用語に重点を置いてつくりました。
        四肢択一は、エコロジカル・フットプリントやバーチャルウォーター、パークアンドライドなど、用語の意味を問う問題から出題します。
        本試験と同じ<strong>90分・100点満点・70点以上で合格</strong>の基準で受験できます。
      </p>

      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　70問＝100点満点（○×20問×1点＋語群の穴埋め20問×1点＋四肢択一30問×2点。当サイト独自の構成）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{ECO_MOSHI3_TIME_LIMIT_MIN}分（自動採点）＝本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　{ECO_MOSHI3_PASS_POINTS}点以上＝本試験と同じ</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　無料・登録不要</p>
      </div>

      <MoshiExam
        exam="eco"
        round={3}
        sessionKey="shikakumon-eco-moshi3-v1"
        questions={questions}
        timeLimitMin={ECO_MOSHI3_TIME_LIMIT_MIN}
        passCount={ECO_MOSHI3_PASS_COUNT}
        passLabel="70点／100点満点 以上"
        choiceLabel="○×+語群+四肢択一"
        questionPathPrefix="/eco/q/"
        topPath="/eco/"
        passPoints={ECO_MOSHI3_PASS_POINTS}
        sharePath="/eco/moshi3/"
      />

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 max-w-2xl leading-relaxed">
        ※本試験（IBT/CBT）は「多肢選択式」と公表されていますが、<strong>形ごとの問題数や配点は公式には公表されていません</strong>。
        本模試の70問・配点の構成は当サイト独自のもので、本試験の出題数を示すものではありません。
        問題はすべて当サイトで作成したオリジナルで、実際の試験問題の転載ではありません。合格判定はあくまで学習の目安です。
        四肢択一だけの模擬試験は<SiteLink href="/eco/moshi/" className="underline hover:no-underline">第1回</SiteLink>へ、
        ○×を1問ずつ解きたい方は<SiteLink href="/eco/ichimon/" className="underline hover:no-underline">一問一答</SiteLink>へ。
      </p>
    </div>
  );
}
