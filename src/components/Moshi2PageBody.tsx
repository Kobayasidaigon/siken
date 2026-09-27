/**
 * 第2回模試(有料)の商品ページ本体。資格ごとのページはこれを呼ぶだけにしてある。
 *
 * このファイル自体に有料の問題データは入らない。受験画面(Moshi2Gate)が購入者
 * 判定を通った API から取りに行くので、ページは通常どおり静的生成でき、検索にも
 * 載る。サンプル2問だけは Moshi2Sample(サーバー側)が静的HTMLとして出す。
 *
 * 【2026-09-20 改修】構成を「仕様表」から「価値→信頼→安心→価格」の順に組み替えた。
 *   改修前は リード(価格入り)→仕様表→購入ボックス で、GA4 28日間で到達64人・
 *   平均エンゲージメント13秒・checkout 0。価格を見て、買う理由が書かれる前に離脱していた。
 *   節の順序: H1+リード / こんな方 / 含まれるもの / サンプル(#sample) / 作問方針 /
 *   価格ボックス / FAQ / 第1回への戻し口(1か所だけ)。価格ボックス以降は Moshi2Gate が描く。
 *
 *   価値の節は Moshi2Gate に `pitch` として渡す。購入済みの人にはこの節を出さず、
 *   受験画面だけを見せるため(サーバー側で描いた JSX を client component に渡している)。
 */

import Moshi2Gate from "@/components/Moshi2Gate";
import Moshi2Sample from "@/components/Moshi2Sample";
import { moshi2ProductOf } from "@/lib/moshi2-products";
import { EXAM_LIST, type ExamSlug } from "@/lib/study-progress";

/** 資格ごとの配色。第1回のページで使っているものに合わせる。 */
const THEME: Record<string, string> = {
  pii: "theme-pii",
  jitsumu: "theme-pii",
  mynumber: "theme-pii",
  bijihou: "theme-kashikin",
  bijimane: "theme-bijimane",
  chizai: "theme-chizai",
  chizai2: "theme-chizai",
  eco: "theme-eco",
  fukushi2: "theme-fukushi",
};

export default function Moshi2PageBody({ certId }: { certId: ExamSlug }) {
  const p = moshi2ProductOf(certId);
  const exam = EXAM_LIST.find((e) => e.slug === certId);
  if (!p || !exam) return null;

  const total = p.questionCount + p.oxCount;

  const pitch = (
    <>
      {/* 2. こんな方のための1回分 */}
      <section className="mb-6 max-w-2xl">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-2 font-serif">こんな方のための1回分です</h2>
        <ul className="text-sm text-[color:var(--c-text)] leading-relaxed space-y-1.5 list-disc pl-5">
          <li>第1回が「あと一歩」「未達」だった → 復習のあと、別問題で伸びを確かめたい</li>
          <li>第1回が合格圏だった → 本番は初見。もう1セットで再現性を確認したい</li>
          <li>本試験まで3週間を切った → 本番形式の通し練習を残り回数分やっておきたい</li>
        </ul>
      </section>

      {/* 3. 含まれるもの(価値の高い順) */}
      <section className="card p-5 mb-6 max-w-2xl">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-2 font-serif">含まれるもの</h2>
        <ul className="text-sm text-[color:var(--c-text)] leading-relaxed space-y-1.5 list-disc pl-5">
          <li>
            <strong>第1回と1問も重複しない新作{total}問</strong>
            （本試験と同じ形式・配点・時間: {p.choiceLabel}・{p.timeLimitMin}分・{p.passLabel}）
          </li>
          <li>全{total}問の解説。正解の根拠だけでなく、誤りの選択肢がなぜ誤りかまで</li>
          <li>分野別正答率と弱点診断。間違えた問題は練習問題の復習に自動で反映</li>
          <li>印刷用 A4 紙面（問題・解答用紙・解説、PDF 保存可）</li>
          <li>買い切り・登録不要・サブスクなし</li>
        </ul>
      </section>

      {/* 4. サンプル問題(id="sample") */}
      <Moshi2Sample certId={certId} />

      {/* 5. 作問方針(信頼) */}
      <section className="mb-6 max-w-2xl">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-2 font-serif">作問方針</h2>
        <p className="text-sm text-[color:var(--c-text)] leading-relaxed">
          本試験の出題範囲・形式に合わせて編集部がオリジナルで作成しています。公式問題の転載ではありません。
          法改正・最新テキストに合わせて随時更新します。
          <a href="/about/" className="underline underline-offset-2 ml-1">運営者情報</a>
        </p>
      </section>
    </>
  );

  return (
    <div className={`${THEME[certId] ?? ""} pb-16`}>
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href={exam.topPath}>{exam.name}</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第2回</span>
      </nav>

      {/* 1. 見出しとリード */}
      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        {exam.name} 第2回模擬試験 ― 本番前の最終確認用
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-6 max-w-2xl">
        第1回（無料）で出た弱点は、本当に埋まりましたか？
        第1回と1問も重複しない初見の<strong>{total}問</strong>で、本試験と同じ
        <strong>{p.timeLimitMin}分・{p.passLabel}</strong>の条件をもう一度通す1回分です。
      </p>

      <Moshi2Gate certId={certId} pitch={pitch} />
    </div>
  );
}
