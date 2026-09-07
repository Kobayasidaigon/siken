import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import PassReportForm from "./PassReportForm";

export const metadata: Metadata = pageMetadata({
  path: "/goukaku-houkoku/",
  title: "合格報告フォーム｜受験された方へ",
  description:
    "シカクモンの練習問題で学習し、受験された方から結果を教えていただくフォームです。出題の傾向や、当サイトの問題が本試験とどれくらい近かったかを、これから受ける方のために共有してください。",
});

export default function PassReportPage() {
  return (
    <div className="pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex flex-wrap gap-1">
        <a href="/">ホーム</a><span>/</span>
        <span className="text-[color:var(--c-ink)]">合格報告</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-3 font-serif leading-tight">
        受験の結果を教えてください
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <div className="prose max-w-none mb-8">
        <p>
          このサイトの問題は、市販の問題集が少ない資格を、受験する側の視点で作っています。
          実際に受けた方からの報告は、問題と解説を直すための一番確かな材料です。
        </p>
        <p>
          いただいた内容は、掲載可の方の分だけ、文章を変えずにそのまま
          <a href="/voice/">合格報告のページ</a>と各資格のページに載せます。
          合格・不合格どちらの報告も歓迎します。
        </p>
      </div>

      <aside className="card p-5 mb-6 text-sm text-[color:var(--c-text)] leading-relaxed" style={{ borderLeft: "3px solid var(--c-accent)" }}>
        <p className="font-bold text-[color:var(--c-ink)] mb-2">
          本試験の問題そのものは書かないでください
        </p>
        <p className="text-[color:var(--c-text-sub)]">
          多くの資格試験では、出題内容を第三者に伝えないことが受験の条件になっています
          （守秘義務）。問題文・選択肢・正答を再現した投稿は、書かれた方ご自身が不利益を負うおそれがあるため、
          掲載しません。
        </p>
        <p className="text-[color:var(--c-text-sub)] mt-2">
          「どの分野が厚かった」「計算問題が思ったより多かった」「時間が足りなかった」といった、
          <strong className="text-[color:var(--c-ink)]">傾向や手ごたえ</strong>のレベルでお書きください。
          それで十分に役に立ちます。
        </p>
      </aside>

      <aside className="card p-5 mb-8 text-sm text-[color:var(--c-text-sub)] leading-relaxed">
        <p className="font-bold text-[color:var(--c-ink)] mb-2">お約束</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>いただいた文章を、こちらで書き換えて掲載することはしません。</li>
          <li>受験日は年月までしか掲載しません。本名・勤務先などが書かれていた場合は掲載しません。</li>
          <li>メールアドレスは掲載しません。掲載前の確認と、内容の質問にだけ使います。</li>
          <li>掲載後に削除をご依頼いただければ、対応します。</li>
          <li>謝礼はお渡ししていません。対価と引き換えの投稿は、広告と区別がつかなくなるためです。</li>
        </ul>
      </aside>

      <PassReportForm />

      <p className="mt-8 text-xs text-[color:var(--c-text-sub)] leading-relaxed">
        フォームがうまく動かない場合は、
        <a href="/contact/" className="underline hover:no-underline mx-0.5">お問い合わせ</a>
        のメールアドレス宛に同じ内容をお送りください。個人情報の取り扱いは
        <a href="/privacy/" className="underline hover:no-underline mx-0.5">プライバシーポリシー</a>
        に記載しています。
      </p>
    </div>
  );
}
