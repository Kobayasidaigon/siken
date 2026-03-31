import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "貸金業務取扱主任者の勉強法・学習ガイド",
  description: "貸金業務取扱主任者試験の難易度・合格率・おすすめ勉強法を解説。独学で合格するための完全ガイド。",
};

export default function GuidePage() {
  return (
    <div className="prose max-w-none pb-16">
      <h1>貸金業務取扱主任者 学習ガイド</h1>

      <p className="text-lg text-slate-600">
        このページでは、貸金業務取扱主任者試験の概要と効率的な勉強法を解説します。
      </p>

      <h2>試験の概要</h2>
      <table>
        <tbody>
          <tr><th>試験実施機関</th><td>日本貸金業協会</td></tr>
          <tr><th>試験時期</th><td>年1回（11月第3日曜日）</td></tr>
          <tr><th>試験時間</th><td>2時間</td></tr>
          <tr><th>問題数</th><td>50問（四肢択一）</td></tr>
          <tr><th>合格基準</th><td>概ね6割以上（30問前後）</td></tr>
          <tr><th>合格率</th><td>約30%前後</td></tr>
          <tr><th>受験料</th><td>8,500円</td></tr>
        </tbody>
      </table>

      <h2>出題分野と配点</h2>
      <table>
        <thead>
          <tr><th>分野</th><th>出題数の目安</th><th>重要度</th></tr>
        </thead>
        <tbody>
          <tr><td>貸金業法</td><td>20〜25問</td><td>★★★（最重要）</td></tr>
          <tr><td>利息制限法・出資法</td><td>5〜8問</td><td>★★★</td></tr>
          <tr><td>民法・民事訴訟法</td><td>10〜15問</td><td>★★</td></tr>
          <tr><td>資金需要者等の保護</td><td>5〜8問</td><td>★★</td></tr>
        </tbody>
      </table>

      <h2>おすすめの勉強法</h2>

      <h3>Step 1：全体像を把握する（1〜2週間）</h3>
      <p>
        まずはテキストを1回通読して、試験の全体像をつかみましょう。
        この段階では暗記する必要はありません。「こんな分野があるのか」程度の理解でOKです。
      </p>

      <h3>Step 2：練習問題を解く（3〜6週間）</h3>
      <p>
        当サイトの練習問題を分野別に解いていきましょう。
        まずは出題数の多い貸金業法から取り組むのがおすすめです。
        間違えた問題はチェックして、解説をしっかり読みましょう。
      </p>

      <h3>Step 3：弱点を潰す（2〜4週間）</h3>
      <p>
        間違えた問題を分野別に分類し、苦手分野を集中的に復習します。
        当サイトの<a href="/field/">分野別ページ</a>を活用してください。
      </p>

      <h3>Step 4：直前対策（1〜2週間）</h3>
      <p>
        試験直前は、頻出テーマの最終確認と、時間配分の練習を行いましょう。
        本番と同じ2時間で50問を解く練習をおすすめします。
      </p>

      <h2>合格に必要な勉強時間</h2>
      <p>
        一般的に<strong>100〜200時間</strong>が目安とされています。
        1日1〜2時間の学習で、<strong>2〜4か月</strong>の期間が必要です。
      </p>

      <h2>練習問題の重要性</h2>
      <p>
        貸金業務取扱主任者試験は、繰り返し出題されるテーマが多い試験です。
        練習問題をしっかり理解することが、合格への最短ルートです。
      </p>

      <div className="not-prose card p-6 bg-blue-50 border border-blue-200 text-center mt-8">
        <p className="text-base font-bold text-blue-900 mb-2">練習問題を解き始める</p>
        <p className="text-sm text-slate-600 mb-4">全504問のオリジナル練習問題に挑戦しましょう</p>
        <a href="/exam/0/" className="inline-block bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium no-underline hover:bg-blue-600">
          オリジナル問題を見る
        </a>
      </div>
    </div>
  );
}
