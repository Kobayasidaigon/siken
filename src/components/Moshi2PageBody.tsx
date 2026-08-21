/**
 * 第2回模試(有料)の商品ページ本体。資格ごとのページはこれを呼ぶだけにしてある。
 *
 * このファイル自体に有料の問題データは入らない。受験画面(Moshi2Gate)が購入者
 * 判定を通った API から取りに行くので、ページは通常どおり静的生成でき、検索にも
 * 載る。第1回のページと同じ骨格(パンくず→見出し→説明→仕様表→本体)にしてある。
 */

import Moshi2Gate from "@/components/Moshi2Gate";
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

  return (
    <div className={`${THEME[certId] ?? ""} pb-16`}>
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href={exam.topPath}>{exam.name}</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">模擬試験 第2回</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        模擬試験 第2回
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-5 max-w-2xl">
        第1回と<strong>完全に別問題</strong>の模擬試験です。第1回と同じ
        <strong>{total}問・{p.timeLimitMin}分・{p.passLabel}</strong>の条件で通しで解けます。
        全員が同じ問題を同じ順序で解く固定問題なので、第1回の点数とそのまま比べられます。
        買い切りで、登録は不要です。
      </p>

      <div className="card p-5 mb-6 text-sm text-[color:var(--c-text-sub)] space-y-2 max-w-2xl">
        <p><span className="font-bold text-[color:var(--c-ink)]">出題数</span>　{total}問（{p.choiceLabel}）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">制限時間</span>　{p.timeLimitMin}分（自動採点）</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　{p.passLabel}</p>
        <p><span className="font-bold text-[color:var(--c-ink)]">価格</span>　¥{p.priceJpy.toLocaleString()}（買い切り・登録不要）</p>
        <p className="text-[12px] leading-relaxed pt-1 border-t border-[color:var(--c-line)]">
          第1回（無料）はこちら → <a href={`${exam.topPath}moshi/`} className="underline underline-offset-2">模擬試験 第1回</a>
          <br />
          まずは無料の第1回で、出題の傾向と相性を確かめてからで大丈夫です。
        </p>
      </div>

      <Moshi2Gate certId={certId} />
    </div>
  );
}
