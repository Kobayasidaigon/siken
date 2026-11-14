/**
 * 資格別の転職エージェント比較ページの本体。2026-11-14 追加。
 * 中身は lib/tenshoku.ts(src/data/tenshoku/<資格>.json)から作る。ページ側は exam を渡すだけ。
 *
 * 計測: リンクは AffiliateLink(affiliate_click / cta_impression)。course="career-<資格>"、
 *   placement は表の行が "tenshoku_table_career"、紹介カードが "tenshoku_card_career"
 *   (career-links.ts の「<面>_career」の決まりに合わせた)。
 */
import SiteLink from "@/components/SiteLink";
import AffiliateLink from "@/components/AffiliateLink";
import { getTenshoku, linkedAgents } from "@/lib/tenshoku";
import type { ExamSlug } from "@/lib/study-progress";

function Mark({ on }: { on: boolean }) {
  return on ? (
    <span className="font-bold text-[color:var(--c-accent)]" aria-label="公式サイトに記載あり">○</span>
  ) : (
    <span className="text-[color:var(--c-text-sub)]" aria-label="公式サイトで確認できない">—</span>
  );
}

export default function TenshokuPage({ exam }: { exam: ExamSlug }) {
  const d = getTenshoku(exam);
  const agents = linkedAgents(d);
  const course = `career-${exam}`;

  return (
    <div className="theme-kashikin pb-16">
      <section className="-mx-4 px-4 py-10 sm:py-14 border-y mb-10" style={{ background: "var(--c-accent-soft)", borderColor: "var(--c-border)" }}>
        <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
          <SiteLink href="/" className="no-underline hover:underline">ホーム</SiteLink>
          {" / "}
          <SiteLink href={d.examTop} className="no-underline hover:underline">{d.examName}</SiteLink>
          {" / "}
          <span>転職</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight" style={{ color: "var(--c-accent-ink)" }}>
          {d.title}
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-accent)" }}></div>
        <div className="space-y-3 max-w-2xl">
          {d.intro.map((p, i) => (
            <p key={i} className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--c-accent-ink)" }}>{p}</p>
          ))}
        </div>
        {d.lawSource && (
          <p className="mt-3 text-xs text-[color:var(--c-text-sub)]">
            出典:{" "}
            <a href={d.lawSource.href} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
              {d.lawSource.label}
            </a>
          </p>
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">資格を活かせる主な仕事</h2>
        <div className="space-y-3">
          {d.jobs.map((j) => (
            <div key={j.name} className="card p-5" style={{ borderLeft: "3px solid var(--c-accent)" }}>
              <p className="text-base font-bold text-[color:var(--c-ink)] font-serif mb-1">{j.name}</p>
              <p className="text-sm text-[color:var(--c-text-sub)] leading-relaxed">{j.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-2 font-serif">転職エージェントの比較</h2>
        <p className="text-xs text-[color:var(--c-text-sub)] leading-relaxed mb-4">
          ○は公式サイトに記載があるもの、—は公式サイトで確認できなかったものです（{d.checkedAt}に確認）。
          掲載しているのは当サイトが提携しているサービスだけで、提携先が増えたら追加します。
          <span className="tracking-wider border border-[color:var(--c-border)] px-1.5 py-0.5 rounded text-[10px] ml-1">広告</span>
        </p>

        {agents.length === 0 ? (
          <p className="card p-5 text-sm text-[color:var(--c-text-sub)]">いま紹介できる転職エージェントはありません。</p>
        ) : (
          <>
            <div className="overflow-x-auto -mx-4 px-4 mb-8">
              <table className="w-full min-w-[560px] text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-[color:var(--c-border)] text-left">
                    <th scope="col" className="py-2 pr-3 font-bold text-[color:var(--c-ink)]">サービス</th>
                    {d.columns.map((c) => (
                      <th key={c.key} scope="col" className="py-2 px-2 text-xs font-bold text-[color:var(--c-ink)] text-center">{c.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {agents.map((a) => (
                    <tr key={a.offerId} className="border-b border-[color:var(--c-border)]">
                      <th scope="row" className="py-3 pr-3 text-left font-normal">
                        <AffiliateLink href={a.offer.href} course={course} placement="tenshoku_table_career" className="text-blue-700 hover:underline font-medium">
                          {a.name}
                        </AffiliateLink>
                      </th>
                      {d.columns.map((c) => (
                        <td key={c.key} className="py-3 px-2 text-center"><Mark on={!!a.marks[c.key]} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-6">
              {agents.map((a) => (
                <article key={a.offerId} className="card p-5">
                  <p className="mb-2">
                    <span className="text-[10px] tracking-wider text-[color:var(--c-text-sub)] border border-[color:var(--c-border)] px-1.5 py-0.5 rounded">広告</span>
                  </p>
                  <h3 className="text-base font-bold text-[color:var(--c-ink)] font-serif mb-1">{a.name}</h3>
                  <p className="text-xs text-[color:var(--c-text-sub)] mb-4">運営: {a.company}</p>
                  <dl className="text-sm space-y-3 mb-5">
                    <div>
                      <dt className="font-bold text-[color:var(--c-ink)]">得意な業界</dt>
                      <dd className="text-[color:var(--c-text-sub)] leading-relaxed">{a.industry}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-[color:var(--c-ink)]">求人の傾向</dt>
                      <dd className="text-[color:var(--c-text-sub)] leading-relaxed">{a.jobs}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-[color:var(--c-ink)]">対応地域</dt>
                      <dd className="text-[color:var(--c-text-sub)] leading-relaxed">{a.area}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-[color:var(--c-ink)]">向いている人</dt>
                      <dd className="text-[color:var(--c-text-sub)] leading-relaxed">
                        <ul className="list-disc pl-5 space-y-1">
                          {a.fit.map((f) => <li key={f}>{f}</li>)}
                        </ul>
                      </dd>
                    </div>
                    {a.free && (
                      <div>
                        <dt className="font-bold text-[color:var(--c-ink)]">料金</dt>
                        <dd className="text-[color:var(--c-text-sub)] leading-relaxed">{a.free}</dd>
                      </div>
                    )}
                  </dl>
                  <AffiliateLink href={a.offer.href} course={course} placement="tenshoku_card_career">
                    {a.offer.label} →
                  </AffiliateLink>
                  {a.offer.pixel && (
                    <img width={1} height={1} src={a.offer.pixel} alt="" style={{ position: "absolute", border: 0 }} />
                  )}
                  <p className="mt-3 text-xs text-[color:var(--c-text-sub)]">
                    説明は
                    <a href={a.officialUrl} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline mx-0.5">公式サイト</a>
                    の記載（{d.checkedAt}に確認）をもとにしています。求人の内容や条件は変わることがあるので、登録前に公式サイトでご確認ください。
                  </p>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="border-t border-[color:var(--c-border)] pt-8">
        <SiteLink href={d.examTop} className="text-sm underline hover:no-underline">
          {d.examName}の練習問題・模擬試験に戻る →
        </SiteLink>
      </section>
    </div>
  );
}
