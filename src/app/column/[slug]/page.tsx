import { getAllColumnSlugs, getColumn } from "@/lib/columns";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { certFromColumnSlug, studioCtaFor } from "@/lib/studio-cta";
import PiiCourseAd from "@/components/PiiCourseAd";
import ColumnScrollPing from "@/components/ColumnScrollPing";
import { getPiiAdContent } from "@/lib/pii-ad-content";
import MynumberCourseAd from "@/components/MynumberCourseAd";
import { getMynumberAdContent } from "@/lib/mynumber-ad-content";
import BijihouCourseAd from "@/components/BijihouCourseAd";
import { getBijihouAdContent } from "@/lib/bijihou-ad-content";
import JitsumuCourseAd from "@/components/JitsumuCourseAd";
import { getJitsumuAdContent } from "@/lib/jitsumu-ad-content";
import ChizaiCourseAd from "@/components/ChizaiCourseAd";
import { getChizaiAdContent } from "@/lib/chizai-ad-content";
import Fukushi2CourseAd from "@/components/Fukushi2CourseAd";
import { canShowUcanAd } from "@/lib/ucan-policy";
import EcoCourseAd from "@/components/EcoCourseAd";
import BijimaneCourseAd from "@/components/BijimaneCourseAd";
import TextAffiliateAd from "@/components/TextAffiliateAd";
import ExamCountdown from "@/components/ExamCountdown";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/page-metadata";
import type { UpcomingExam } from "@/lib/exam-dates";
import {
  KASHIKIN_EXAMS,
  CHIZAI_EXAMS,
  FUKUSHI2_EXAMS,
  BIJIHOU_EXAMS,
  BIJIMANE_EXAMS,
  ECO_EXAMS,
  PII_EXAMS,
  MYNUMBER_EXAMS,
  JITSUMU_EXAMS,
} from "@/lib/exam-dates";

export async function generateStaticParams() {
  return getAllColumnSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const col = await getColumn(slug);
  if (!col) return {};
  return pageMetadata({
    path: `/column/${slug}/`,
    title: col.title,
    description: col.description,
  });
}

export default async function ColumnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const col = await getColumn(slug);
  if (!col) notFound();

  // PII関連コラム記事に個人情報保護士講座広告を表示
  const isPiiArticle = slug.startsWith("pii-");
  const piiAdContent = isPiiArticle ? getPiiAdContent(slug) : undefined;

  // マイナンバー関連コラム記事にマイナンバー実務検定講座広告を表示
  const isMynumberArticle = slug.startsWith("mynumber-");
  const mynumberAdContent = isMynumberArticle ? getMynumberAdContent(slug) : undefined;

  // 個人情報保護実務検定関連コラムに個情保実務検定講座広告を表示
  const isJitsumuArticle = slug.startsWith("jitsumu-");
  const jitsumuAdContent = isJitsumuArticle ? getJitsumuAdContent(slug) : undefined;

  // ビジネス実務法務検定関連コラムにビジネス実務法務検定講座広告を表示
  const isBijihouArticle = slug.startsWith("bijihou-");
  const bijihouAdContent = isBijihouArticle ? getBijihouAdContent(slug) : undefined;

  // 貸金系コラム（SMART講座広告が無い記事）にアガルート貸金業務取扱主任者講座を表示。
  // アガルートは貸金業務取扱主任者講座を実際に提供している（agaroot.jp/kashikin）。
  // 知財3級はアガルートに講座が存在しないため広告を設置しない（誤誘導防止）。
  // osusume-text / takken-hikaku は別途アガルート個別素材を設置済みのため除外。
  const kashikinAdSlugs = new Set([
    "goukakuritsu",
    "benkyouhou",
    "shiken-nittei",
    "kashikingyou-toha",
    "benkyou-jikan",
  ]);
  const isKashikinGeneralArticle =
    (slug.startsWith("kashikin-") || kashikinAdSlugs.has(slug)) &&
    slug !== "osusume-text" &&
    slug !== "takken-hikaku";

  // 知財3級コラム。chizai-benrishi-hikaku（知財検定 vs 弁理士）は文脈一致する
  // アガルート弁理士講座（既存提携・高単価）、その他はオンスク知財3級講座（暫定）。
  const isBenrishiArticle = slug === "chizai-benrishi-hikaku";
  const isChizaiGeneralArticle = slug.startsWith("chizai-") && !isBenrishiArticle;
  const chizaiAdContent = isChizaiGeneralArticle ? getChizaiAdContent(slug) : undefined;

  // 知財2級コラム（chizai2-*）。chizai-* とは別扱い（startsWith("chizai-") は false）。
  const isChizai2Article = slug.startsWith("chizai2-");

  // 福祉住環境コーディネーター2級コラム（fukushi2-*）にユーキャン講座広告を表示
  // 資格別 LP がある資格は、その LP へ資格ごとの文言で送る (無ければ従来の汎用)
  const studioCta = studioCtaFor(certFromColumnSlug(slug), "column_footer");

  const isFukushi2Article = slug.startsWith("fukushi2-");

  // 講座広告(ユーキャン)だけは、数値を伴う合格率・合格者数に触れる記事に出さない。
  // 広告主の掲載ルールによる制限で、判定条件と根拠は lib/ucan-policy.ts に集約している。
  // ここを isFukushi2Article 自体に混ぜないこと — 記事末尾の内部導線
  // (「全200問を見る」等) まで消えて、貸金の CTA に落ちる。
  const showFukushi2CourseAd = isFukushi2Article && canShowUcanAd(col);

  // eco検定コラム（eco-*）・ビジマネコラム（bijimane-*）。
  // この2つの分岐が無かったため、20本すべてが末尾の else に落ちて
  // 貸金業務取扱主任者の CTA（/exam/0/「全504問を見る」）を出していた。
  const isEcoArticle = slug.startsWith("eco-");
  const isBijimaneArticle = slug.startsWith("bijimane-");

  // 日程・申込コラム(全日本情報学習振興協会が実施するSMART系資格のみ)には、
  // 講座広告より先に「試験申込」導線を置く。ドリル読者の必然行動(受験申込)が
  // そのまま成果地点になるため。着地は協会公式の各試験ページ(申込ボタンあり)。
  // ビジ法(東商実施)・知財(知財教育協会実施)は協会の試験ではないため対象外。
  const examApplyAds: Record<
    string,
    { course: string; body: string; linkText: string; href: string; pixel: string }
  > = {
    "pii-nittei": {
      course: "pii",
      body: "個人情報保護士認定試験の申込みは、実施団体(全日本情報学習振興協会)の公式サイトから行います。公開会場・CBT・オンラインIBTの受験方式ごとに申込期限が定められているため、受験する回を決めたら早めに手続きしておきましょう。",
      linkText: "協会公式サイトで試験日程・申込方法を確認する",
      href: "https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.joho-gakushu.or.jp%2Fpiip%2F",
      pixel: "https://www11.a8.net/0.gif?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2",
    },
    "mynumber-nittei": {
      course: "mynumber",
      body: "マイナンバー実務検定の申込みは、実施団体(全日本情報学習振興協会)の公式サイトから行います。公開会場・CBT・オンラインIBTの受験方式ごとに申込期限が定められているため、受験する回を決めたら早めに手続きしておきましょう。",
      linkText: "協会公式サイトで試験日程・申込方法を確認する",
      href: "https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.joho-gakushu.or.jp%2Fnns%2F",
      pixel: "https://www11.a8.net/0.gif?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2",
    },
    "jitsumu-nittei": {
      course: "jitsumu",
      body: "個人情報保護実務検定の申込みは、実施団体(全日本情報学習振興協会)の公式サイトから行います。公開会場・CBT・オンラインIBTの受験方式ごとに申込期限が定められているため、受験する回を決めたら早めに手続きしておきましょう。",
      linkText: "協会公式サイトで試験日程・申込方法を確認する",
      href: "https://px.a8.net/svt/ejp?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.joho-gakushu.or.jp%2Fpipl%2F",
      pixel: "https://www11.a8.net/0.gif?a8mat=4B1TI0+9T22IA+4LOQ+BW8O2",
    },
  };
  const examApplyAd = examApplyAds[slug];

  // 日程コラムの本文冒頭に、資格トップと同じ試験カウントダウンを出す。
  // 日程コラムは「(資格名) 試験日/日程」で検索して来る=申込意図が最も強い着地点だが、
  // 本文はmarkdownの静的な表(「申込期間 7月1日〜9月10日」)だけで、締切まで何日かは
  // 読者が自分で数える必要があった。A8実測(2026-08-06)で成果は締切直前に集中すると
  // 分かっているため、残り日数を最初に見せる。試験日リストが尽きれば自動で消える。
  const niteiCountdowns: Record<
    string,
    {
      exams: UpcomingExam[];
      accent: string;
      accentSoft: string;
      examWord?: string;
      periodExam?: boolean;
    }
  > = {
    // 貸金の日程コラムだけ slug に資格接頭辞が無い(サイト初期からある記事のため)
    "shiken-nittei": {
      exams: KASHIKIN_EXAMS,
      accent: "var(--c-kashikin)",
      accentSoft: "var(--c-kashikin-soft)",
      examWord: "次回本試験",
    },
    "chizai-nittei": {
      exams: CHIZAI_EXAMS,
      accent: "var(--c-chizai)",
      accentSoft: "var(--c-chizai-soft)",
    },
    "chizai2-nittei": {
      exams: CHIZAI_EXAMS,
      accent: "var(--c-chizai)",
      accentSoft: "var(--c-chizai-soft)",
    },
    // 東商のIBT/CBTは期間制なので periodExam(「試験期間の開始まで」+日付に「〜」)
    "bijihou-nittei": {
      exams: BIJIHOU_EXAMS,
      accent: "var(--c-kashikin)",
      accentSoft: "var(--c-kashikin-soft)",
      periodExam: true,
    },
    "bijimane-nittei": {
      exams: BIJIMANE_EXAMS,
      accent: "var(--c-bijimane)",
      accentSoft: "var(--c-bijimane-soft)",
      periodExam: true,
    },
    "fukushi2-nittei": {
      exams: FUKUSHI2_EXAMS,
      accent: "var(--c-fukushi)",
      accentSoft: "var(--c-fukushi-soft)",
      periodExam: true,
    },
    "eco-nittei": {
      exams: ECO_EXAMS,
      accent: "var(--c-eco)",
      accentSoft: "var(--c-eco-soft)",
      periodExam: true,
    },
    "pii-nittei": { exams: PII_EXAMS, accent: "var(--c-pii)", accentSoft: "var(--c-pii-soft)" },
    "mynumber-nittei": {
      exams: MYNUMBER_EXAMS,
      accent: "var(--c-pii)",
      accentSoft: "var(--c-pii-soft)",
    },
    "jitsumu-nittei": {
      exams: JITSUMU_EXAMS,
      accent: "var(--c-pii)",
      accentSoft: "var(--c-pii-soft)",
    },
  };
  const niteiCountdown = niteiCountdowns[slug];

  const pageUrl = `https://shikakumon.com/column/${slug}/`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${pageUrl}#article`,
      headline: col.title,
      description: col.description,
      url: pageUrl,
      mainEntityOfPage: pageUrl,
      inLanguage: "ja",
      datePublished: col.publishedAt,
      dateModified: col.updatedAt || col.publishedAt,
      author: { "@type": "Person", name: "熊太郎", url: "https://shikakumon.com/about/" },
      publisher: {
        "@type": "Organization",
        "@id": "https://shikakumon.com/#organization",
        name: "シカクモン",
        url: "https://shikakumon.com",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "ホーム", item: "https://shikakumon.com/" },
        { "@type": "ListItem", position: 2, name: "コラム", item: "https://shikakumon.com/column/" },
        { "@type": "ListItem", position: 3, name: col.title, item: pageUrl },
      ],
    },
  ];

  return (
    <article className="pb-4">
      <JsonLd data={jsonLd} />

      <nav className="breadcrumb text-xs text-slate-400 mb-4 flex flex-wrap gap-1">
        <a href="/">ホーム</a><span>/</span>
        <a href="/column/">コラム</a><span>/</span>
        <span className="text-slate-600">{col.title}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 leading-tight">
        {col.title}
      </h1>

      <div className="flex gap-3 text-xs text-slate-400 mb-8">
        <span>公開: {col.publishedAt}</span>
        {col.updatedAt && col.updatedAt !== col.publishedAt && (
          <span>更新: {col.updatedAt}</span>
        )}
      </div>

      <ColumnScrollPing slug={slug} />

      {/* 日程コラムのみ: 本文より先に「申込締切まであとN日」を出す(締切10日以内は強調) */}
      {niteiCountdown && (
        <ExamCountdown
          exams={niteiCountdown.exams}
          accent={niteiCountdown.accent}
          accentSoft={niteiCountdown.accentSoft}
          examWord={niteiCountdown.examWord}
          periodExam={niteiCountdown.periodExam}
          apply={
            examApplyAd
              ? {
                  href: examApplyAd.href,
                  course: examApplyAd.course,
                  pixel: examApplyAd.pixel,
                }
              : undefined
          }
          applyPlacement="column_countdown_apply"
        />
      )}

      <section className="prose max-w-none" dangerouslySetInnerHTML={{ __html: col.content }} />

      {/* 試験申込導線(日程コラムのみ)。読者の申込意図に最短で応えるため講座広告より上に置く */}
      {examApplyAd && (
        <TextAffiliateAd
          headline="受験する回を決めたら"
          body={examApplyAd.body}
          linkHref={examApplyAd.href}
          linkText={examApplyAd.linkText}
          pixelSrc={examApplyAd.pixel}
          course={examApplyAd.course}
          placement="column_apply"
        />
      )}

      {/* 広告は本文を読み終えた直後（最も関心が高い位置）に配置。免責の注意書きは広告の下へ。 */}
      {isPiiArticle && (
        <PiiCourseAd
          headline={piiAdContent?.headline}
          body={piiAdContent?.body}
        />
      )}

      {isMynumberArticle && (
        <MynumberCourseAd
          headline={mynumberAdContent?.headline}
          body={mynumberAdContent?.body}
        />
      )}

      {isJitsumuArticle && (
        <JitsumuCourseAd
          headline={jitsumuAdContent?.headline}
          body={jitsumuAdContent?.body}
        />
      )}

      {isBijihouArticle && (
        <BijihouCourseAd
          headline={bijihouAdContent?.headline}
          body={bijihouAdContent?.body}
        />
      )}

      {/* GSC上位記事への追加アフィリエイト（アガルートアカデミー）。
          記事本文が「講座は記事末尾の案内へ」と誘導してくる受け皿なので、
          行き先(貸金講座)とやること(講座を見る)を明示する文言にしている */}
      {slug === "osusume-text" && (
        <TextAffiliateAd
          headline="独学より講義で時短したい方へ"
          course="agaroot-osusume"
          placement="column_osusume"
          body="市販テキストだけでは不安が残る方は、通信講座も選択肢です。アガルートアカデミーの貸金業務取扱主任者講座は、頻出論点と法改正対応をスマホ講義で体系的に押さえられます。テキストと講義のサンプルは資料請求(無料)で確認できます。"
          linkHref="https://px.a8.net/svt/ejp?a8mat=4B3N6P+AWY41E+44M0+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.agaroot.jp%2Fkashikin%2F"
          linkText="アガルートの貸金業務取扱主任者講座を見る"
          pixelSrc="https://www14.a8.net/0.gif?a8mat=4B3N6P+AWY41E+44M0+BW8O2"
        />
      )}

      {slug === "takken-hikaku" && (
        <TextAffiliateAd
          headline="宅建側の対策をお探しの方へ"
          course="agaroot-takken"
          body="貸金業務取扱主任者と宅建のダブルライセンスを狙うなら、宅建側もきちんと準備しておく必要があります。フルカラーテキストと動画講義で、ゼロから1年合格を目指せるカリキュラムです。"
          linkHref="https://px.a8.net/svt/ejp?a8mat=4B3N6P+AWY41E+44M0+61Z82"
          linkText="宅建士講座・ゼロから始めて1年合格！"
          pixelSrc="https://www11.a8.net/0.gif?a8mat=4B3N6P+AWY41E+44M0+61Z82"
        />
      )}

      {isKashikinGeneralArticle && (
        <TextAffiliateAd
          headline="独学に不安があれば"
          course="kashikin"
          body="貸金業務取扱主任者は市販の問題集が少なく、独学で進めにくい試験です。通信講座のアガルートアカデミーは貸金業務取扱主任者講座を提供しており、頻出論点と法改正への対応を体系的に押さえられます。"
          linkHref="https://px.a8.net/svt/ejp?a8mat=4B3N6P+AWY41E+44M0+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.agaroot.jp%2Fkashikin%2F"
          linkText="アガルートの貸金業務取扱主任者講座を見る"
          pixelSrc="https://www14.a8.net/0.gif?a8mat=4B3N6P+AWY41E+44M0+BW8O2"
        />
      )}

      {isBenrishiArticle && (
        <TextAffiliateAd
          headline="弁理士を視野に入れている方へ"
          course="agaroot-benrishi"
          body="知財検定3級から弁理士を目指すなら、早い段階で弁理士試験の出題範囲を把握しておくと学習計画が立てやすくなります。アガルートアカデミーは弁理士試験講座を提供しています。"
          linkHref="https://px.a8.net/svt/ejp?a8mat=4B3N6P+AWY41E+44M0+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.agaroot.jp%2Fbenri%2F"
          linkText="アガルートの弁理士試験講座を見る"
          pixelSrc="https://www12.a8.net/0.gif?a8mat=4B3N6P+AWY41E+44M0+BW8O2"
        />
      )}

      {isChizaiGeneralArticle && (
        <ChizaiCourseAd
          headline={chizaiAdContent?.headline}
          body={chizaiAdContent?.body}
        />
      )}

      {isChizai2Article && (
        <ChizaiCourseAd headline="2級レンジの論点を体系的に押さえるなら" />
      )}

      {showFukushi2CourseAd && (
        <Fukushi2CourseAd headline="広い出題範囲を体系的に押さえるなら" />
      )}

      {isEcoArticle && (
        <EcoCourseAd headline="公式テキストの範囲を体系的に押さえるなら" />
      )}

      {isBijimaneArticle && (
        <BijimaneCourseAd headline="公式テキストの範囲を体系的に押さえるなら" />
      )}

      {isChizaiGeneralArticle && chizaiAdContent?.secondaryBenrishi && (
        <TextAffiliateAd
          themeClass="theme-chizai"
          headline="3級の先に弁理士を狙うなら"
          course="agaroot-benrishi"
          body="知財検定3級の対策はオンスクで十分ですが、将来的に弁理士まで視野に入れているなら、早い段階で出題範囲を把握しておくと学習計画が立てやすくなります。アガルートアカデミーは弁理士試験講座を提供しています。"
          linkHref="https://px.a8.net/svt/ejp?a8mat=4B3N6P+AWY41E+44M0+BW8O2&a8ejpredirect=https%3A%2F%2Fwww.agaroot.jp%2Fbenri%2F"
          linkText="アガルートの弁理士試験講座を見る"
          pixelSrc="https://www12.a8.net/0.gif?a8mat=4B3N6P+AWY41E+44M0+BW8O2"
        />
      )}

      <aside className="mt-8 p-4 rounded border border-[color:var(--c-border)] bg-[color:var(--c-bg-alt)] text-xs text-[color:var(--c-text-sub)] leading-relaxed">
        <p className="mb-1"><span className="font-bold">記事の前提</span></p>
        <p>
          本記事は{col.updatedAt || col.publishedAt}時点の法令・試験制度に基づいて作成しています。
          受験料・試験日程・出題範囲・改正法対応などの最新情報は、各実施機関の公式サイトで必ずご確認ください。
        </p>
      </aside>

      <div className="mt-10 pt-6 border-t border-slate-200">
        <p className="text-sm font-medium text-slate-700 mb-3">練習問題に挑戦する</p>
        <div className="flex flex-wrap gap-3">
          {isPiiArticle ? (
            <>
              <a href="/pii/q/pii-001/" className="text-sm text-blue-700 no-underline hover:underline">個情保 全300問を見る →</a>
              <a href="/pii/mock/" className="text-sm text-slate-500 no-underline hover:underline">本番形式で腕試し →</a>
              <a href="/pii/" className="text-sm text-slate-500 no-underline hover:underline">分野別に選ぶ →</a>
            </>
          ) : isMynumberArticle ? (
            <>
              <a href="/mynumber/q/mynumber-001/" className="text-sm text-blue-700 no-underline hover:underline">マイナンバー 全200問を見る →</a>
              <a href="/mynumber/" className="text-sm text-slate-500 no-underline hover:underline">分野別に選ぶ →</a>
            </>
          ) : isJitsumuArticle ? (
            <>
              <a href="/jitsumu/q/jitsumu-001/" className="text-sm text-blue-700 no-underline hover:underline">個情保実務 全200問を見る →</a>
              <a href="/jitsumu/" className="text-sm text-slate-500 no-underline hover:underline">分野別に選ぶ →</a>
            </>
          ) : isBijihouArticle ? (
            <>
              <a href="/bijihou/q/bijihou-001/" className="text-sm text-blue-700 no-underline hover:underline">ビジ法 全200問を見る →</a>
              <a href="/bijihou/" className="text-sm text-slate-500 no-underline hover:underline">分野別に選ぶ →</a>
            </>
          ) : isFukushi2Article ? (
            <>
              <a href="/fukushi2/" className="text-sm text-blue-700 no-underline hover:underline">福祉住環境2級 全200問を見る →</a>
              <a href="/fukushi2/mock/" className="text-sm text-slate-500 no-underline hover:underline">本番形式で腕試し →</a>
              <a href="/fukushi2/field/kaigohoken/" className="text-sm text-slate-500 no-underline hover:underline">介護保険と住宅改修の問題から始める →</a>
            </>
          ) : isEcoArticle ? (
            <>
              <a href="/eco/" className="text-sm text-blue-700 no-underline hover:underline">eco検定 全200問を見る →</a>
              <a href="/eco/mock/" className="text-sm text-slate-500 no-underline hover:underline">本番形式で腕試し →</a>
              <a href="/eco/field/climate/" className="text-sm text-slate-500 no-underline hover:underline">気候変動とエネルギーの問題から始める →</a>
            </>
          ) : isBijimaneArticle ? (
            <>
              <a href="/bijimane/" className="text-sm text-blue-700 no-underline hover:underline">ビジマネ 全200問を見る →</a>
              <a href="/bijimane/mock/" className="text-sm text-slate-500 no-underline hover:underline">本番形式で腕試し →</a>
              <a href="/bijimane/field/leadership/" className="text-sm text-slate-500 no-underline hover:underline">部下のマネジメントの問題から始める →</a>
            </>
          ) : slug.startsWith("chizai2-") ? (
            <>
              <a href="/chizai2/" className="text-sm text-blue-700 no-underline hover:underline">知財2級の練習問題を見る →</a>
              <a href="/chizai2/mock/" className="text-sm text-slate-500 no-underline hover:underline">本番形式で腕試し →</a>
              <a href="/chizai/" className="text-sm text-slate-500 no-underline hover:underline">3級から始める →</a>
            </>
          ) : slug.startsWith("chizai-") ? (
            <>
              <a href="/chizai/" className="text-sm text-blue-700 no-underline hover:underline">知財3級の練習問題を見る →</a>
              <a href="/chizai/mock/" className="text-sm text-slate-500 no-underline hover:underline">本番形式で腕試し →</a>
              <a href="/chizai/field/patent/" className="text-sm text-slate-500 no-underline hover:underline">特許法の問題から始める →</a>
            </>
          ) : (
            <>
              <a href="/exam/0/" className="text-sm text-blue-700 no-underline hover:underline">全504問を見る →</a>
              <a href="/kashikin/mock/" className="text-sm text-slate-500 no-underline hover:underline">本番形式で腕試し →</a>
              <a href="/field/" className="text-sm text-slate-500 no-underline hover:underline">分野別に選ぶ →</a>
            </>
          )}
        </div>
      </div>

      {/* Studio 関連サービス案内 (記事末固定) */}
      <aside
        className="mt-10 p-4 rounded-lg border"
        style={{
          background: "var(--c-chizai-soft)",
          borderColor: "var(--c-chizai)",
        }}
      >
        <p className="text-xs font-bold mb-1" style={{ color: "var(--c-chizai-ink)" }}>
          {studioCta.heading}
        </p>
        <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--c-chizai-ink)" }}>
          {studioCta.body}
        </p>
        <a
          href={studioCta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold inline-flex items-center gap-1 no-underline"
          style={{ color: "var(--c-chizai)" }}
        >
          {studioCta.linkLabel}
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </aside>

      <nav className="mt-6">
        <a href="/column/" className="text-sm text-slate-500 no-underline hover:underline">← コラム一覧に戻る</a>
      </nav>
    </article>
  );
}
