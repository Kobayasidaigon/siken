import { getAllChintaiQuestions, getChintaiQuestionsByField } from "@/lib/chintai-questions";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import ChintaiCourseAd from "@/components/ChintaiCourseAd";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  path: "/chintai/",
  title: "賃貸不動産経営管理士 試験対策｜オリジナル200問を無料で",
  description: "賃貸不動産経営管理士のオリジナル練習問題200問を詳細解説。民法・商法・会社法・関連法規（独禁法・消費者法・知財法）を収録。",
});

const fields = [
  { name: "賃貸住宅管理業法と登録制度", slug: "gyouhou", desc: "登録が必要な事業者と管理戸数200戸の基準、登録の有効期間5年、業務管理者の選任義務、再委託の制限、分別管理、定期報告、国土交通大臣の監督と罰則" },
  { name: "管理受託契約", slug: "jutaku", desc: "管理受託方式とサブリース方式の違い、締結前の重要事項説明と締結時書面、委任の規律と善管注意義務、標準管理委託契約書、再委託と定期報告" },
  { name: "サブリースと特定賃貸借契約", slug: "sublease", desc: "特定転貸事業者と勧誘者、登録の有無にかかわらず適用される規制、誇大広告等の禁止、不当な勧誘等の禁止、特定賃貸借契約の重要事項説明、借賃減額請求" },
  { name: "賃貸借契約と借地借家法", slug: "keiyaku", desc: "普通借家と定期借家、賃貸人の修繕義務、一部滅失による賃料の当然減額、賃借権の譲渡・転貸と承諾、対抗要件、個人根保証の極度額、敷金の意義" },
  { name: "契約の終了・更新と原状回復", slug: "shuuryou", desc: "更新拒絶の通知期間と正当事由、法定更新、解約申入れ、信頼関係破壊の法理、通常損耗・経年変化を除く原状回復、ガイドラインの考え方、自力救済の禁止" },
  { name: "金銭の管理と会計", slug: "kinsen", desc: "家賃・敷金・共益費・礼金の性質、借賃増減額請求と特約の効力、滞納対応と時効、家賃債務保証、分別管理義務、複式簿記の基礎、利回りの計算" },
  { name: "建物の維持保全と設備", slug: "setsubi", desc: "構造と耐震基準、修繕計画、給水方式の違い、排水トラップと封水、電気・ガス設備、換気の3方式、消防用設備、エレベーターの保守、定期調査報告" },
  { name: "入居者の募集と広告規制", slug: "boshuu", desc: "宅建業法の適用と重要事項説明・37条書面、媒介報酬の制限、広告開始時期、おとり広告の禁止、公正競争規約の表示ルール、入居審査とセーフティネット住宅" },
  { name: "賃貸業への支援業務（税・保険・証券化）", slug: "shien", desc: "不動産所得と減価償却、固定資産税と住宅用地の特例、居住用家賃の消費税非課税、貸家建付地の評価、火災保険と地震保険、借家人賠償責任保険、不動産証券化とPM・AM" },
  { name: "賃貸管理の意義と管理士の役割", slug: "igi", desc: "賃貸住宅を取り巻く社会情勢、管理の外部委託の進行、賃貸不動産経営管理士の倫理憲章、守秘義務と個人情報保護、反社会的勢力の排除、住宅セーフティネット制度" },
];

export default async function ChintaiPage() {
  const allQuestions = await getAllChintaiQuestions();
  const allColumns = await getAllColumns();
  const chintaiColumns = allColumns.filter((c) => c.slug.startsWith("chintai-"));
  const fieldCounts = await Promise.all(
    fields.map(async (f) => {
      const qs = await getChintaiQuestionsByField(f.name);
      return qs.length;
    })
  );

  return (
    <div className="theme-kashikin pb-16">
      <section className="-mx-4 px-4 py-10 sm:py-14 border-y mb-10" style={{ background: "var(--c-kashikin-soft)", borderColor: "var(--c-border)" }}>
        <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
          <a href="/" className="no-underline hover:underline">ホーム</a> / <span>賃貸不動産経営管理士</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight" style={{ color: "var(--c-kashikin-ink)" }}>
          賃貸不動産経営管理士
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-kashikin)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-kashikin-ink)" }}>
          民法・会社法・関連法規を扱う、{allQuestions.length}問のオリジナル練習問題集です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/chintai/q/chintai-001/" className="btn-accent">問題を解き始める →</a>
          <a
            href="/chintai/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-kashikin-soft)]"
            style={{ borderColor: "var(--c-kashikin)", color: "var(--c-kashikin-ink)" }}
          >
            模擬試験を受ける（90分・70点合格判定）→
          </a>
        </div>
      </section>

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示(東商IBT/CBTは期間制) */}

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {fields.map((f, i) => (
            <a key={f.slug} href={`/chintai/field/${f.slug}/`} className="card p-5 no-underline group block" style={{ borderLeft: "3px solid var(--c-kashikin)" }}>
              <div className="flex items-start justify-between mb-1 gap-3">
                <p className="text-base font-bold text-[color:var(--c-ink)] font-serif">{f.name}</p>
                <span className="text-xs text-[color:var(--c-text-sub)] shrink-0">{fieldCounts[i]}問</span>
              </div>
              <p className="text-sm text-[color:var(--c-text-sub)] mt-2 leading-relaxed">{f.desc}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">試験の概要</h2>
        <div className="card p-5 text-sm text-[color:var(--c-text-sub)] space-y-2">
          <p><span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　多肢選択式・90分・100点満点</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　70点以上</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　IBT方式 5,500円／CBT方式 7,700円（いずれも税込）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">試験日</span>　CBT方式で通年実施（全国47都道府県の会場で随時受験可能）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　東京商工会議所</p>
        </div>
      </section>

      <ChintaiCourseAd />

      {/* コラム */}
      {chintaiColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {chintaiColumns.slice(0, 6).map((col) => (
              <a
                key={col.slug}
                href={`/column/${col.slug}/`}
                className="block py-2 text-sm text-[color:var(--c-text)] no-underline hover:text-[color:var(--c-kashikin)] border-b border-[color:var(--c-border)] last:border-b-0"
              >
                {col.title}
              </a>
            ))}
          </div>
          {chintaiColumns.length > 6 && (
            <a href="/column/#chintai" className="inline-block mt-4 text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-kashikin)] underline">
              賃貸不動産経営管理士のコラムをすべて見る →
            </a>
          )}
        </section>
      )}
    </div>
  );
}
