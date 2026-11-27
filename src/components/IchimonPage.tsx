import SiteLink from "@/components/SiteLink";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import IchimonDrill from "@/components/IchimonDrill";
import { getIchimonData, type IchimonExam } from "@/lib/ichimon";
import { EXAM_LIST } from "@/lib/study-progress";

/**
 * 資格ごとの一問一答ページの中身。2026-11-27 に本体の全資格へ広げたときに共通化した。
 * ○×は4択の各肢から作る(lib/ox-from-choices.ts)。中身は問題ページと重なるので検索には出さない。
 */
function examOf(exam: IchimonExam) {
  const e = EXAM_LIST.find((x) => x.slug === exam);
  if (!e) throw new Error(`unknown exam: ${exam}`);
  return e;
}

export function ichimonMetadata(exam: IchimonExam): Metadata {
  const { name, topPath } = examOf(exam);
  const hasInput = getIchimonData(exam).inputs.length > 0;
  const kind = hasInput ? "○×・記入式" : "○×";
  return pageMetadata({
    path: `${topPath}ichimon/`,
    noindex: true,
    title: `${name} 一問一答（${kind}）｜1問ずつ答え合わせ`,
    description: `${name}の練習問題の選択肢を、1つずつ○×で答える一問一答。答えるとすぐに正誤と解説が出ます。登録不要・無料。`,
  });
}

export default function IchimonPage({ exam, theme }: { exam: IchimonExam; theme: string }) {
  const { name, topPath, questionPathPrefix } = examOf(exam);
  const { ox, sharedExplains, inputs } = getIchimonData(exam);
  return (
    <div className={`${theme} pb-16`}>
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <SiteLink href="/">ホーム</SiteLink><span>/</span>
        <SiteLink href={topPath}>{name}</SiteLink><span>/</span>
        <span className="text-[color:var(--c-ink)]">一問一答</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        一問一答（○×{inputs.length > 0 ? "・記入式" : ""}）
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <IchimonDrill
        exam={exam}
        examLabel={name}
        questionPathPrefix={questionPathPrefix}
        ox={ox}
        sharedExplains={sharedExplains}
        inputs={inputs}
      />
    </div>
  );
}
