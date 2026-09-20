// =============================================================================
// 第2回模試(有料)のサンプル問題。商品ページに2問だけ、解説つきで出す。
// 2026-09-20 に設備資格ドリルの Moshi2Sample から移植。
//
// 【なぜ出すか】
// 見ず知らずのサイトで、中身を1問も見ないまま買う人はいない。問題の粒度と
// 解説の厚みは文章で説明するより1問見せたほうが早い。売っているのは
// 「問題数」ではなく「解説の質」なので、そこを隠したままでは判断材料がない。
//
// 【何を出すか】
// 出題順の先頭と、そこから分野が変わる最初の1問(見つからなければ中盤)。
// ○×問題は先頭に並ぶので、○×のある資格では 1問目=○×・2問目=択一 になる。
// 選び方は問題数だけで決まるので、ビルドのたびに変わることはない。
//
// **サーバー専用**。loadMoshi2 は有料データを読むので、client component から import しないこと。
// 商品ページ(サーバーコンポーネント)から呼び、結果は静的HTMLとして2問分だけ出る。
// =============================================================================
import Moshi2ViewPing from "@/components/Moshi2ViewPing";
import { loadMoshi2 } from "@/lib/moshi2-load";
import type { ExamSlug } from "@/lib/study-progress";

export default async function Moshi2Sample({ certId }: { certId: ExamSlug }) {
  const paper = await loadMoshi2(certId);
  if (!paper || paper.length < 4) return null;

  const first = paper[0];
  const mid = Math.floor(paper.length / 2);
  const second = paper.slice(1).find((q) => q.field !== first.field) ?? paper[mid];
  const picked = [first, second];

  // id="sample" は結果画面のオファーの「サンプル問題を見る」リンク先。表示計測は moshi2_sample_open。
  return (
    <Moshi2ViewPing
      event="moshi2_sample_open"
      params={{ cert: certId }}
      id="sample"
      className="mb-6 max-w-2xl scroll-mt-20"
    >
      <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-1 font-serif">サンプル問題</h2>
      <p className="text-sm text-[color:var(--c-text)] leading-relaxed mb-3">
        実際に出題される{paper.length}問のうち2問を、解説までそのまま出します。
        買う前に、問題の難しさと解説の細かさを見てください。
      </p>

      <div className="space-y-3">
        {picked.map((q, n) => (
          <div key={q.slug} className="card p-4">
            <p className="text-[11px] text-[color:var(--c-text-sub)] tracking-wide mb-2">
              サンプル {n + 1}　{q.field}
            </p>
            <p className="text-sm text-[color:var(--c-ink)] leading-relaxed mb-3 whitespace-pre-line">
              {q.questionText}
            </p>

            <ol className="space-y-1 mb-3">
              {q.choices.map((c, i) => {
                const isAnswer = i + 1 === q.correctAnswer;
                return (
                  <li
                    key={i}
                    className={
                      "text-sm leading-relaxed pl-6 -indent-6 " +
                      (isAnswer ? "font-bold" : "text-[color:var(--c-text-sub)]")
                    }
                    style={isAnswer ? { color: "#15803d" } : undefined}
                  >
                    <span className="inline-block w-6 indent-0 tabular-nums">{isAnswer ? "✓" : i + 1 + "."}</span>
                    {c}
                  </li>
                );
              })}
            </ol>

            {q.explanationHtml && (
              <div className="border-t border-[color:var(--c-border)] pt-3 text-[13px] text-[color:var(--c-text)] leading-relaxed">
                <span className="font-bold text-[color:var(--c-ink)] mr-2">解説</span>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: q.explanationHtml }} />
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-[color:var(--c-text-sub)] mt-3 leading-relaxed">
        残りの{paper.length - 2}問も同じ密度で解説しています。無料の第1回とは1問も重複しません。
      </p>
    </Moshi2ViewPing>
  );
}
