import SiteLink from "@/components/SiteLink";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getAllQuestions } from "@/lib/questions";

/**
 * 貸金業務取扱主任者の学習ガイド。
 *
 * 2026-11-10: サイト全体の使い方は /hajimete/ に移し、ここは貸金業務取扱主任者だけのページとして /kashikin/ から案内する。
 * あわせて、試験の数字を日本貸金業協会の公表資料に合わせて直した。以前は出題分野を「貸金業法・利息制限法・民法・
 * 資金需要者の保護」の4つとし、公式の試験科目にある「財務及び会計に関すること」が抜けていた。
 * 数字は次のページで 2026-11-10 に確かめた(年度が替わったら見直す):
 * - 試験の実施方法 https://www.j-fsa.or.jp/chief/qualifying_exam/enforcement.php
 * - 出題数の目安 https://www.j-fsa.or.jp/chief/qualifying_exam/item_range/standard.php
 * - 試験結果 https://www.j-fsa.or.jp/chief/qualifying_exam/result.php と第18〜20回の各回の結果ページ
 */
export const metadata: Metadata = pageMetadata({
  path: "/guide/",
  title: "貸金業務取扱主任者の勉強法・学習ガイド",
  description:
    "貸金業務取扱主任者試験の試験科目・出題数の目安・合格基準点と合格率の推移を、日本貸金業協会の公表資料をもとにまとめ、練習問題を使った勉強の進め方を紹介します。",
});

const SOURCES = [
  { label: "資格試験の受験（試験日程）", url: "https://www.j-fsa.or.jp/chief/qualifying_exam/" },
  { label: "試験の実施方法", url: "https://www.j-fsa.or.jp/chief/qualifying_exam/enforcement.php" },
  { label: "試験科目の出題数の目安", url: "https://www.j-fsa.or.jp/chief/qualifying_exam/item_range/standard.php" },
  { label: "これまでの試験結果", url: "https://www.j-fsa.or.jp/chief/qualifying_exam/result.php" },
];

export default async function GuidePage() {
  const total = (await getAllQuestions()).length;

  return (
    <div className="prose max-w-none pb-16">
      <nav className="not-prose text-xs text-[color:var(--c-text-sub)] mb-4">
        <SiteLink href="/" className="no-underline hover:underline">ホーム</SiteLink> /{" "}
        <SiteLink href="/kashikin/" className="no-underline hover:underline">貸金業務取扱主任者</SiteLink> / <span>学習ガイド</span>
      </nav>
      <h1>貸金業務取扱主任者 学習ガイド</h1>

      <p className="text-lg text-slate-600">
        貸金業務取扱主任者試験の概要と、当サイトの練習問題を使った勉強の進め方をまとめました。
        試験の数字は、日本貸金業協会が公表している資料から引いています（2026年11月10日に確認）。
      </p>

      <h2>試験の概要</h2>
      <table>
        <tbody>
          <tr><th>実施機関</th><td>日本貸金業協会（指定試験機関）</td></tr>
          <tr><th>受験資格</th><td>なし（年齢・学歴などに関係なく、誰でも受験できます）</td></tr>
          <tr><th>試験日</th><td>年1回・11月。第5回からはいずれも11月の第3日曜日に行われており、令和8年度は11月15日</td></tr>
          <tr><th>試験時間</th><td>2時間（13時00分〜15時00分）</td></tr>
          <tr><th>問題数・形式</th><td>50問・4肢択一・マークシート方式</td></tr>
          <tr><th>合格基準点</th><td>試験のあとに試験委員会が決めます。第18回は31問、第19回は30問、第20回は31問の正解でした</td></tr>
          <tr><th>合格率</th><td>第18回 31.0%、第19回 32.4%、第20回 32.5%（合格者数÷受験者数）</td></tr>
          <tr><th>受験手数料</th><td>8,500円（貸金業法施行令で定められた額）</td></tr>
          <tr><th>出題の基準</th><td>令和8年度は、令和8年4月1日に施行されている法令等から出題</td></tr>
        </tbody>
      </table>

      <h2>試験科目と出題数</h2>
      <p>
        試験科目は次の4つです。出題数の目安は協会が公表しているもので、各回の出題数は試験ごとに決まります。
        第18回から第20回までは、3回続けて27問・15問・5問・3問でした。
      </p>
      <table>
        <thead>
          <tr><th>試験科目</th><th>出題数の目安</th><th>第18〜20回の出題数</th></tr>
        </thead>
        <tbody>
          <tr><td>法及び関係法令に関すること</td><td>22〜28問</td><td>27問</td></tr>
          <tr><td>貸付け及び貸付けに付随する取引に関する法令及び実務に関すること</td><td>14〜18問</td><td>15問</td></tr>
          <tr><td>資金需要者等の保護に関すること</td><td>4〜6問</td><td>5問</td></tr>
          <tr><td>財務及び会計に関すること</td><td>2〜4問</td><td>3問</td></tr>
        </tbody>
      </table>
      <p>
        当サイトの練習問題（{total}問）は、法令ごとに「貸金業法」「利息制限法・出資法」「民法・民事訴訟法」「資金需要者等の保護」の4分野に分けています。
        協会の試験科目とはおおむね、貸金業法と利息制限法・出資法が1つ目の科目に、民法・民事訴訟法が2つ目の科目に、
        資金需要者等の保護が3つ目の科目にあたります。
        「財務及び会計」（家計の収支や、企業の財務諸表など）の問題は、いまは載せていません。
      </p>

      <h2>勉強の進め方</h2>

      <h3>Step 1：全体をひととおり読む</h3>
      <p>
        まずテキストを1回通して読み、4つの科目がどんな内容かをつかみます。
        この段階で覚えきる必要はありません。
      </p>

      <h3>Step 2：分野別の練習問題を解く</h3>
      <p>
        <SiteLink href="/kashikin/">資格のトップ</SiteLink>から分野を選び、練習問題を解いていきます。
        出題の多い「法及び関係法令」にあたる貸金業法から始めるのがおすすめです。
        間違えた問題は解説を読み、あとで見直したい問題はブックマークしておきます。
      </p>

      <h3>Step 3：苦手な分野を解き直す</h3>
      <p>
        <SiteLink href="/kashikin/mock/">本番形式テスト（20問）</SiteLink>で分野別の正答率を見て、低い分野を解き直します。
        <SiteLink href="/study/">学習履歴</SiteLink>の復習ドリルでは、間違えた問題を先に20問ずつ解けます。
      </p>

      <h3>Step 4：本番と同じ時間で解く</h3>
      <p>
        試験の1〜2週間前に、<SiteLink href="/kashikin/moshi/">模擬試験（50問・120分）</SiteLink>を本番と同じ2時間で解き、
        時間配分と、合格基準点（直近3回は30〜31問）に届いているかを確かめます。
      </p>

      <h2>勉強を始める時期</h2>
      <p>
        必要な時間は、法律を学んだことがあるかどうかで大きく変わります。
        はじめて法律を学ぶなら、試験の3〜4か月前に始めると、テキストの通読・練習問題・解き直しを一回りできます。
        令和8年度の受験申込の受付は7月1日から9月10日まででした。試験の4か月ほど前に申込が始まるので、
        申し込むときに勉強の予定も立てておくと進めやすくなります。
      </p>

      <h2>出典</h2>
      <p>日本貸金業協会の次のページです（2026年11月10日に確認）。最新の日程と受験案内は、申し込む前に必ずこちらで確かめてください。</p>
      <ul>
        {SOURCES.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="not-prose card p-6 bg-blue-50 border border-blue-200 text-center mt-8">
        <p className="text-base font-bold text-blue-900 mb-2">練習問題を解き始める</p>
        <p className="text-sm text-slate-600 mb-4">全{total}問のオリジナル練習問題を、分野ごとに解けます</p>
        <SiteLink href="/kashikin/" className="inline-block bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium no-underline hover:bg-blue-600">
          貸金業務取扱主任者のトップへ
        </SiteLink>
      </div>
    </div>
  );
}
