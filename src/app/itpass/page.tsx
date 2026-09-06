import { getAllItpassQuestions, getItpassQuestionsByField } from "@/lib/itpass-questions";
import { getAllColumns } from "@/lib/columns";
import type { Metadata } from "next";
import ItpassCourseAd from "@/components/ItpassCourseAd";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  path: "/itpass/",
  title: "ITパスポート 練習問題・過去問対策【全200問・無料】",
  description: "ITパスポート試験のオリジナル練習問題200問を無料公開。経営戦略・法務からセキュリティ・ネットワークまで、シラバスVer.6.5準拠の10分野を根拠つき解説で演習できます。公開過去問の補完に。",
});

const fields = [
  { name: "企業活動と法務", slug: "kigyou", desc: "企業理念とCSR、組織形態、財務諸表と損益分岐点、QC七つ道具、知的財産権、個人情報保護法、労働関連法規、標準化（ストラテジ系「企業と法務」）" },
  { name: "経営戦略とビジネスインダストリ", slug: "senryaku", desc: "SWOT分析・PPM・競争戦略、CSF/KGI/KPI、CRM・SCM・ERP、MOTとイノベーション、電子商取引、IoT活用、AI・生成AIのビジネス活用（ストラテジ系「経営戦略」）" },
  { name: "システム戦略とシステム企画", slug: "system-senryaku", desc: "業務モデリング、BPRとRPA、SaaS・PaaS・IaaSの違い、DX、要件定義、RFI・RFP・RFQの使い分け、ベンダ選定（ストラテジ系「システム戦略」）" },
  { name: "システム開発と開発管理技術", slug: "kaihatsu", desc: "開発工程とテストの種類、レビュー、ウォータフォールとアジャイル、スクラムの役割とイベント、DevOps、リファクタリング（マネジメント系「開発技術」）" },
  { name: "プロジェクトマネジメント", slug: "project", desc: "スコープとWBS、アローダイアグラムとクリティカルパス、ガントチャート、コスト見積り、リスク対応の4分類、ステークホルダマネジメント（マネジメント系）" },
  { name: "サービスマネジメントとシステム監査", slug: "service", desc: "ITILとSLA・SLM、インシデント管理と問題管理の違い、サービスデスク、ファシリティマネジメント、システム監査の手順、内部統制、BCPとRTO・RPO（マネジメント系）" },
  { name: "基礎理論とアルゴリズム", slug: "kiso", desc: "2進数・16進数の変換、論理演算、確率と期待値、統計と相関、機械学習の3分類、フローチャート、探索と整列、スタックとキュー（テクノロジ系「基礎理論」）" },
  { name: "コンピュータシステムとハードウェア", slug: "computer", desc: "5大装置とCPU、記憶階層、RAIDと冗長化、稼働率とMTBF・MTTRの計算、フェールセーフとフールプルーフ、OSとファイルシステム、OSSライセンス（テクノロジ系）" },
  { name: "情報デザイン・データベース・ネットワーク", slug: "tech", desc: "ユニバーサルデザインとUX、画像・動画の形式と圧縮、関係データベースと正規化、トランザクション、TCP/IPとIPアドレス、DNS、5GとLPWA（テクノロジ系「技術要素」）" },
  { name: "情報セキュリティ", slug: "security", desc: "機密性・完全性・可用性、マルウェアと攻撃手法、共通鍵暗号と公開鍵暗号、デジタル署名と電子証明書、多要素認証、ファイアウォールとゼロトラスト、ISMS（テクノロジ系・最頻出）" },
];

export default async function ItpassPage() {
  const allQuestions = await getAllItpassQuestions();
  const allColumns = await getAllColumns();
  const itpassColumns = allColumns.filter((c) => c.slug.startsWith("itpass-"));
  const fieldCounts = await Promise.all(
    fields.map(async (f) => {
      const qs = await getItpassQuestionsByField(f.name);
      return qs.length;
    })
  );

  return (
    <div className="theme-pii pb-16">
      <section className="-mx-4 px-4 py-10 sm:py-14 border-y mb-10" style={{ background: "var(--c-pii-soft)", borderColor: "var(--c-border)" }}>
        <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
          <a href="/" className="no-underline hover:underline">ホーム</a> / <span>ITパスポート</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 font-serif leading-tight" style={{ color: "var(--c-pii-ink)" }}>
          ITパスポート
        </h1>
        <div className="w-16 h-1 mb-4" style={{ background: "var(--c-pii)" }}></div>
        <p className="text-sm sm:text-base leading-relaxed max-w-lg" style={{ color: "var(--c-pii-ink)" }}>
          経営戦略・法務からセキュリティ・ネットワークまで、シラバスVer.6.5準拠の10分野。{allQuestions.length}問のオリジナル練習問題集です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/itpass/q/itpass-001/" className="btn-accent">問題を解き始める →</a>
          <a
            href="/itpass/moshi/"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm font-medium no-underline transition-colors hover:bg-[color:var(--c-pii-soft)]"
            style={{ borderColor: "var(--c-pii)", color: "var(--c-pii-ink)" }}
          >
            模擬試験を受ける（100問・120分・分野別判定）→
          </a>
        </div>
      </section>

      {/* カウントダウン: 申込期間中は「申込締切まで」を優先表示(東商IBT/CBTは期間制) */}

      <section className="mb-12">
        <h2 className="text-lg font-bold text-[color:var(--c-ink)] mb-5 font-serif">分野から選ぶ</h2>
        <div className="space-y-3">
          {fields.map((f, i) => (
            <a key={f.slug} href={`/itpass/field/${f.slug}/`} className="card p-5 no-underline group block" style={{ borderLeft: "3px solid var(--c-pii)" }}>
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
          {/* 2026-09-05: ビジ法の雛形(東商IBT/CBT・70点合格)が残ったままの誤記を IPA の試験要項に合わせて修正 */}
          <p><span className="font-bold text-[color:var(--c-ink)]">試験形式</span>　四肢択一・100問・120分（CBT方式）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">合格基準</span>　総合評価点600点以上（1,000点満点）かつ分野別評価点（ストラテジ系・マネジメント系・テクノロジ系）が各300点以上</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">受験料</span>　7,500円（税込）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">試験日</span>　CBT方式で通年実施（全国47都道府県の会場で随時受験可能）</p>
          <p><span className="font-bold text-[color:var(--c-ink)]">実施機関</span>　独立行政法人情報処理推進機構（IPA）</p>
        </div>
      </section>

      <ItpassCourseAd />

      {/* コラム */}
      {itpassColumns.length > 0 && (
        <section className="border-t border-[color:var(--c-border)] pt-8 mt-8">
          <h2 className="text-base font-bold text-[color:var(--c-ink)] mb-4 font-serif">コラム</h2>
          <div className="space-y-2">
            {itpassColumns.slice(0, 6).map((col) => (
              <a
                key={col.slug}
                href={`/column/${col.slug}/`}
                className="block py-2 text-sm text-[color:var(--c-text)] no-underline hover:text-[color:var(--c-pii)] border-b border-[color:var(--c-border)] last:border-b-0"
              >
                {col.title}
              </a>
            ))}
          </div>
          {itpassColumns.length > 6 && (
            <a href="/column/#itpass" className="inline-block mt-4 text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-pii)] underline">
              ITパスポートのコラムをすべて見る →
            </a>
          )}
        </section>
      )}
    </div>
  );
}
