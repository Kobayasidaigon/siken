"use client";
import SiteLink from "@/components/SiteLink";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { recordResult, loadProgress, type ExamSlug, type Medal } from "@/lib/study-progress";
import AffiliateLink from "@/components/AffiliateLink";
import StudioLink from "@/components/StudioLink";
import { isStudioFirst, studioCtaFor } from "@/lib/studio-cta";
import { decideCtaPriority } from "@/lib/cta-priority";
import { practiceRoutesFor } from "@/lib/practice-routes";
import { openShikenmaeFor, mdJa, mdSlash, shikenmaePath } from "@/lib/shikenmae";
import ShikenmaeEntryLink from "@/components/ShikenmaeEntryLink";
import { drillPositionOf, endDrill, loadDrill, type DrillState } from "@/lib/review-drill";
import FreeLeadCTA from "@/components/FreeLeadCTA";
import { EXAM_AFFILIATE, RESULT_CTA_HEADLINE } from "@/lib/affiliate-links";
import type { QuestionOx } from "@/lib/ox-from-choices";

// 「4択 / ○×」のどちらで解くか。見る人ごとの好みなので localStorage に置く(無くても4択で動く)。
const MODE_KEY = "shikakumon:answer-mode";
type AnswerMode = "choice" | "ox";

// 答え合わせ直後CTAを出す資格。bijihou/piiで検証→SMART系の発生確認→2026-08-05に
// ユーザー指示で全資格へ展開(発生実績: SMART CVR7.5%・試験申込型あり)。
// fukushi2は非A8の直リンク(ユーキャン提携待ち)だがUX統一のため含める。
// 2026-09-05: 9月に追加した bijihou2 / itpass / chintai / kangyo は A8 リンクが
// affiliate-links.ts に揃っているのにこのリストから漏れ、最高intent面のCTAが
// 出ていなかったため追加。bijimane / eco は A8 未提携(東商公式への直リンク)なので
// 「広告」ラベル付きのこの面には出さない(提携後に追加する)。
const RESULT_CTA_EXAMS: ExamSlug[] = [
  "bijihou",
  "bijihou2",
  "pii",
  "mynumber",
  "jitsumu",
  "chizai",
  "chizai2",
  "kashikin",
  "chintai",
  "kangyo",
  "itpass",
  // fukushi2 / fukushi3(ユーキャンの直リンク)は 2026-11-22 に外した。アフィリ提携が無い資格は
  // この位置に Studio へのリンクを出す(下の studioFirst。lib/studio-cta.ts の STUDIO_FIRST_EXAMS)。
  // 2026-11-14 追加。mynumber2 は3級と同じ SMART合格講座(4B1TI0系)の承認済み提携。
  "mynumber2",
  "mynumber1",
  // 2026-09-08 追加。isec は SMART合格講座(4B1TI0系)の無料登録を主導線にしている。
  "isec",
  // 2026-09-08 追加。kyoin はアガルート(4B3N6P系)の承認済み提携。
  "kyoin",
  // 2026-09-09 追加。shakai もアガルート(4B3N6P系)の承認済み提携。
  "shakai",
  // 2026-10-06 追加。isf / dxp も isec と同じ協会(SMART合格講座・4B1TI0系)。
  "isf",
  "dxp",
  // 2026-10-10 追加。had / ccm も SMART合格講座(4B1TI0系)の無料登録を主導線にしている。
  "had",
  "ccm",
  // 2026-10-19 追加。SMART合格講座(4B1TI0系)。
  "touhan",
  // 2026-10-19 追加。SMART合格講座(4B1TI0系)。
  "hoikushi",
  // 2026-10-19 追加。SMART合格講座(4B1TI0系)。
  "gaia",
  // 2026-10-19 追加。SMART合格講座(4B1TI0系)。
  "dxa",
  // 2026-10-19 追加。SMART合格講座(4B1TI0系)。
  "aia",
  // 2026-10-19 追加。SMART合格講座(4B1TI0系)。
  "xray",
  // 2026-10-31 追加の協会6資格。SMART合格講座(4B1TI0系)。
  "ccc",
  "llc",
  "cac",
  "ibd",
  "dxo",
  "wlc",
];

const MEDAL_LABEL: Record<Medal, string> = { bronze: "🥉 銅", silver: "🥈 銀", gold: "🥇 金" };
const MEDAL_NEXT: Record<Medal, string> = {
  bronze: "もう一度正解で 🥈 銀になります",
  silver: "もう一度正解で 🥇 金になります",
  gold: "この問題はマスター（金）です！",
};

export default function AnswerReveal({
  choices,
  correctAnswer,
  explanationHtml,
  exam,
  questionSlug,
  courseAd,
  nextHref,
  nextLabel,
  ox,
}: {
  choices: string[];
  correctAnswer: number;
  explanationHtml: string;
  exam?: ExamSlug;
  questionSlug?: string;
  // 講座広告（CourseAd）。解答後（最高関心点）にのみ表示する。設問を解いている最中の
  // 常時表示はimpを焼くだけ（CTR 0.26%）なので、ここで revealed ゲートをかける。
  courseAd?: ReactNode;
  // 次の問題への導線。従来はページ最下部の小さなテキストリンクだけで、解説を
  // 読み終えた地点から遠く連続演習が途切れやすかった(UX監査指摘)。解説直下に
  // 大きなボタンとして出す。未指定(分野の最終問など)は非表示。
  nextHref?: string;
  nextLabel?: string;
  // 肢ごとの○×に分けたデータ(components/QuestionAnswer.tsx が渡す)。無い問題は4択だけ。2026-11-27
  ox?: QuestionOx;
}) {
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [mode, setMode] = useState<AnswerMode>("choice");
  const [judged, setJudged] = useState<(boolean | null)[]>(() => (ox ? ox.items.map(() => null) : []));
  // 前に選んだ解き方を引き継ぐ。初期HTMLは必ず4択(サーバの描画と食い違わないように)
  useEffect(() => {
    if (!ox) return;
    try {
      if (localStorage.getItem(MODE_KEY) === "ox") setMode("ox");
    } catch {
      /* 保存できない環境でも4択で解ける */
    }
  }, [ox]);
  function switchMode(next: AnswerMode) {
    if (revealed || next === mode) return;
    setMode(next);
    try {
      localStorage.setItem(MODE_KEY, next);
    } catch {
      /* 同上 */
    }
  }
  const oxMode = mode === "ox" && !!ox;
  const allJudged = oxMode && judged.every((j) => j !== null);
  const anyJudged = oxMode && judged.some((j) => j !== null);
  // 正誤。○×で解いたときは全部の肢が合っていれば正解。答えずに「答えを見る」なら null
  const answeredRight: boolean | null = oxMode
    ? allJudged
      ? ox!.items.every((it, i) => judged[i] === it.answer)
      : null
    : selected === null
      ? null
      : selected === correctAnswer;
  const [medal, setMedal] = useState<Medal | null>(null);

  // 答え合わせ直後の Studio 送客。資格別 LP がある資格はその LP へ資格ごとの
  // 文言で送る (無ければ従来の汎用文言 + トップページ)。utm_medium は referral 固定で、
  // 配置・資格 ID は utm_content=quiz_<資格> に載る (studioCtaFor 参照)。
  const studioCta = studioCtaFor(exam, `quiz_${exam ?? "result"}`);

  // 申込締切が迫っている資格・時期だけ、講座広告(courseAd)を Studio 枠より上に出す。
  // static export のビルド時評価だと、デプロイ間隔次第で締切後も「締切間近」の
  // 並びのまま出しかねないので、クライアント側 (このコンポーネント) で毎回評価する。
  const applyFirst = decideCtaPriority(exam).primary === "apply";

  // アフィリ提携が無い資格(売上ゼロの直リンクしか無い)は Studio を主役にする。2026-11-22。
  // courseAd が Studio のカード(StudioFirstCourseAd)になるので、控えめな studioAside は重ねて出さない。
  const studioFirst = isStudioFirst(exam);

  const studioAside = (
    <aside className="mt-8 p-4 rounded-lg border border-indigo-200 bg-indigo-50">
      <p className="text-xs font-bold mb-1 text-indigo-900">{studioCta.heading}</p>
      <p className="text-xs leading-relaxed mb-2 text-indigo-900/80">{studioCta.body}</p>
      <StudioLink
        href={studioCta.href}
        placement="question_result"
        exam={exam}
        className="text-xs font-bold inline-flex items-center gap-1 no-underline text-indigo-600 hover:underline"
      >
        {studioCta.linkLabel}
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </StudioLink>
    </aside>
  );

  // 通しで解く面(腕試しテスト・模試)。この資格に用意がある分だけ出る
  const practiceRoutes = practiceRoutesFor(exam);
  // 「試験前の10問」の窓が開いている資格だけ、通しで解く面の先頭に入口を足す(lib/shikenmae.ts)。
  // 答えたあとにしか描かないので、ブラウザの時刻で判定してもサーバーの HTML と食い違わない。
  const shikenmae = revealed ? openShikenmaeFor(exam) : null;

  // 進行中の復習ドリル。localStorage を読むので、初期HTMLでは必ず null にする
  // (サーバでの描画結果と食い違うと hydration が壊れる)。
  const [drill, setDrill] = useState<DrillState | null>(null);
  useEffect(() => {
    setDrill(loadDrill());
  }, []);
  const drillPos = drillPositionOf(drill, exam, questionSlug);

  function trackPractice(kind: string, placement: string) {
    try {
      sendGAEvent("event", "practice_link_click", { exam: exam ?? "unknown", kind, placement });
    } catch {
      /* GA未ロードでも遷移は妨げない */
    }
  }

  useEffect(() => {
    if (revealed && answeredRight !== null && exam && questionSlug) {
      recordResult(exam, questionSlug, answeredRight);
      // 更新後のメダルを取得して表示
      setMedal(loadProgress()[exam].medals?.[questionSlug] ?? null);
    }
  }, [revealed, answeredRight, exam, questionSlug]);

  // 「問題を解いた」の計測。2026-09-07 追加。
  // このサイトの中核行動なのに、これまで一度も GA に送っていなかった。
  // 分母が無いので affiliate_click の CTR も「多いのか少ないのか」が言えず、
  // 面ごとの良し悪しを比べられない状態だった。
  //
  // questionSlug は 3,370 通りあるのでパラメータに入れない(GA4 のカスタム
  // ディメンションはカーディナリティが高いと集計から溢れる)。資格と正誤だけ送る。
  // 二重送信を ref で止めているのは、開発時の StrictMode でエフェクトが
  // 2回走るため。中核指標が2倍に見えると判断を誤る。
  const answerSent = useRef(false);
  useEffect(() => {
    if (!revealed || answerSent.current) return;
    answerSent.current = true;
    try {
      sendGAEvent("event", "question_answered", {
        exam: exam ?? "unknown",
        result: answeredRight === null ? "revealed" : answeredRight ? "correct" : "wrong",
        mode: oxMode ? "ox" : "choice",
      });
    } catch {
      /* GA未ロードでも学習は妨げない */
    }
  }, [revealed, answeredRight, oxMode, exam]);

  return (
    <>
      {/* 解き方の切り替え(○×に分けられる問題だけ) */}
      {ox && (
        <div className="flex gap-2 mb-3" role="tablist" aria-label="解き方">
          {(["choice", "ox"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              disabled={revealed && mode !== m}
              onClick={() => switchMode(m)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                mode === m
                  ? "bg-slate-800 text-white border-slate-800 font-bold"
                  : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50 disabled:opacity-40"
              }`}
            >
              {m === "choice" ? `${choices.length}択で解く` : "○×で解く"}
            </button>
          ))}
        </div>
      )}

      {/* ○×で解く: 肢ごとに正しいか誤りかを答える */}
      {oxMode && (
        <div className="mb-6">
          <p className="text-xs text-[color:var(--c-text-sub)] mb-2">
            {ox!.topic}について、それぞれの記述が正しければ○、誤りなら×を選んでください。
          </p>
          <ol className="space-y-2">
            {ox!.items.map((it, i) => {
              const mine = judged[i];
              const ok = revealed && mine !== null && mine === it.answer;
              const ng = revealed && mine !== null && mine !== it.answer;
              return (
                <li
                  key={i}
                  className={`text-sm px-3 py-2.5 rounded-lg border ${
                    ok ? "bg-green-50 border-green-300" : ng ? "bg-red-50 border-red-300" : "bg-slate-50 border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <span className="font-bold shrink-0">{i + 1}.</span>
                    <span className="flex-1 text-slate-700">{it.statement}</span>
                  </div>
                  <div className="flex items-center gap-2 pl-5">
                    {([true, false] as const).map((v) => {
                      const on = mine === v;
                      return (
                        <button
                          key={String(v)}
                          type="button"
                          aria-pressed={on}
                          aria-label={v ? "正しい(○)" : "誤り(×)"}
                          disabled={revealed}
                          onClick={() => setJudged((prev) => prev.map((x, j) => (j === i ? v : x)))}
                          className={`w-12 h-9 rounded-lg border-2 text-lg font-bold leading-none transition-colors ${
                            on
                              ? v
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "bg-red-600 border-red-600 text-white"
                              : v
                                ? "bg-white border-blue-300 text-blue-600 hover:bg-blue-50"
                                : "bg-white border-red-300 text-red-600 hover:bg-red-50"
                          }`}
                        >
                          {v ? "○" : "×"}
                        </button>
                      );
                    })}
                    {revealed && (
                      <span
                        className={`ml-auto shrink-0 text-xs px-1.5 py-0.5 rounded whitespace-nowrap text-white ${
                          it.answer ? "bg-blue-600" : "bg-red-500"
                        }`}
                      >
                        正解は{it.answer ? "○" : "×"}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* Choices */}
      {!oxMode && (
      <ol className="space-y-2 mb-6">
        {choices.map((choice, i) => {
          const num = i + 1;
          const isSelected = selected === num;
          const isCorrect = num === correctAnswer;

          let style = "bg-slate-50 text-slate-600 border border-transparent cursor-pointer hover:bg-slate-100";
          if (revealed) {
            if (isCorrect) {
              style = "bg-green-50 border border-green-300 text-green-800 font-medium";
            } else if (isSelected && !isCorrect) {
              style = "bg-red-50 border border-red-300 text-red-700";
            } else {
              style = "bg-slate-50 text-slate-400 border border-transparent";
            }
          } else if (isSelected) {
            style = "bg-blue-50 border border-blue-300 text-blue-800 font-medium";
          }

          return (
            <li
              key={i}
              onClick={() => !revealed && setSelected(num)}
              className={`text-sm px-3 py-2.5 rounded-lg transition-colors flex items-start gap-2 ${style}`}
            >
              <span className="font-bold shrink-0">{num}.</span>
              <span className="flex-1">{choice}</span>
              {revealed && isCorrect && (
                <span className="shrink-0 text-xs bg-green-600 text-white px-1.5 py-0.5 rounded whitespace-nowrap">正解</span>
              )}
              {revealed && isSelected && !isCorrect && (
                <span className="shrink-0 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded whitespace-nowrap">不正解</span>
              )}
            </li>
          );
        })}
      </ol>
      )}

      {/* Reveal Button */}
      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-3 rounded-lg font-bold text-sm transition-colors mb-6 bg-blue-700 text-white hover:bg-blue-600"
        >
          {oxMode ? (allJudged ? "答え合わせする" : anyJudged ? "答えを見る(残りは未回答)" : "答えを見る") : selected ? "答え合わせする" : "答えを見る"}
        </button>
      )}

      {/* Result */}
      {revealed && (
        <>
          {answeredRight !== null && (
            <div className={`card p-4 mb-6 text-center ${answeredRight ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <p className={`text-base font-bold ${answeredRight ? "text-green-700" : "text-red-700"}`}>
                {answeredRight
                  ? oxMode
                    ? "全問正解!"
                    : "正解!"
                  : oxMode
                    ? `不正解 — ${ox!.items.filter((it, i) => judged[i] === it.answer).length} / ${ox!.items.length} 肢正解`
                    : `不正解 — 正解は ${correctAnswer} です`}
              </p>
              {exam && questionSlug && medal && (
                <>
                  <p className="text-sm font-bold mt-2">
                    この問題：{MEDAL_LABEL[medal]}
                  </p>
                  <p className="text-xs text-[color:var(--c-text-sub)] mt-1">
                    {MEDAL_NEXT[medal]}（<SiteLink href="/study/" className="underline">学習履歴を見る</SiteLink>）
                  </p>
                </>
              )}
            </div>
          )}

          {answeredRight === null && (
            <div className="card p-4 mb-6 text-center bg-green-50 border-green-200">
              <p className="text-base font-bold text-green-700">
                {oxMode ? "正解は各記述の右に出ています" : `正解: ${correctAnswer}`}
              </p>
            </div>
          )}

          {/* アフィリ提携が無い資格は、答え合わせ直後の最上段を Studio へのリンクにする(2026-11-22) */}
          {exam && studioFirst && (
            <p className="mb-6 text-xs text-[color:var(--c-text-sub)] flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span>同じ資格の問題をもっと解くなら</span>
              <StudioLink
                href={studioCta.href}
                placement="question_result_top"
                exam={exam}
                className="text-indigo-700 hover:underline font-bold"
              >
                シカクモン Studio で AI の問題を解く(登録無料) →
              </StudioLink>
            </p>
          )}

          {/* 答え合わせ直後CTA（最高関心点。結果カードの外・控えめなテキストリンク） */}
          {exam && RESULT_CTA_EXAMS.includes(exam) && (
            <p className="mb-6 text-xs text-[color:var(--c-text-sub)] flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="tracking-wider border border-[color:var(--c-border)] px-1.5 py-0.5 rounded text-[10px]">広告</span>
              <span>{RESULT_CTA_HEADLINE[exam]}</span>
              {/* 低摩擦の無料オファーが設定されていれば有料CTAの前に併置（freeHref未設定なら非表示） */}
              <FreeLeadCTA exam={exam} placement="question_result" />
              <AffiliateLink
                href={EXAM_AFFILIATE[exam].href}
                course={EXAM_AFFILIATE[exam].course}
                placement="question_result"
                className="text-blue-700 hover:underline font-medium"
              >
                {EXAM_AFFILIATE[exam].label} →
              </AffiliateLink>
            </p>
          )}
        </>
      )}

      {/* Explanation
          SEO: 解説本文(このサイト最大の独自コンテンツ)は答え合わせ前から初期HTMLに
          含め、hidden で視覚的にだけ隠す。クリック後にしかDOMに存在しない実装だと
          クローラには問題文+選択肢だけの薄いページに見えてしまう。 */}
      <section
        className="prose max-w-none"
        hidden={!revealed}
        dangerouslySetInnerHTML={{ __html: explanationHtml }}
      />

      {revealed && (
        <>
          {/* 復習ドリルの最中は、こちらが「次」になる。分野順の次の問題ではなく
              銅→銀→未挑戦の並びで進むので、通常の導線と入れ替える。
              ドリルの現在位置は「今の問題が並びの何番目か」で毎回引き直しているので、
              戻る操作やリロードで位置がずれない(lib/review-drill.ts)。 */}
          {drillPos && (
            <div className="mt-6">
              <p className="text-xs text-[color:var(--c-text-sub)] mb-2">
                復習ドリル {drillPos.position} / {drillPos.total} 問
              </p>
              {drillPos.nextHref ? (
                <a
                  href={drillPos.nextHref}
                  onClick={() => {
                    try {
                      sendGAEvent("event", "drill_next", { exam: exam ?? "unknown" });
                    } catch {
                      /* GA未ロードでも遷移は妨げない */
                    }
                  }}
                  className="block w-full text-center py-3 rounded-lg font-bold text-sm no-underline transition-colors bg-blue-700 text-white hover:bg-blue-600"
                >
                  ドリルの次の問題へ →
                </a>
              ) : (
                <div className="card p-4">
                  <p className="text-sm font-bold text-[color:var(--c-ink)] font-serif mb-1">
                    ドリルはここまでです
                  </p>
                  <p className="text-xs text-[color:var(--c-text-sub)] leading-relaxed mb-3">
                    {drillPos.total}問を解き終えました。メダルの変化は学習履歴で確認できます。
                  </p>
                  <SiteLink
                    href="/study/"
                    onClick={() => {
                      endDrill();
                      try {
                        sendGAEvent("event", "drill_complete", {
                          exam: exam ?? "unknown",
                          size: drillPos.total,
                        });
                      } catch {
                        /* GA未ロードでも遷移は妨げない */
                      }
                    }}
                    className="text-sm font-bold text-[color:var(--c-accent,var(--c-ink))] hover:underline no-underline"
                  >
                    学習履歴を見る →
                  </SiteLink>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  endDrill();
                  setDrill(null);
                }}
                className="mt-2 text-xs text-[color:var(--c-text-sub)] hover:text-[color:var(--c-ink)] underline"
              >
                ドリルを終える
              </button>
            </div>
          )}

          {/* 次の問題へ(解説直下の主要アクション)。連続演習の途切れを防ぐ */}
          {!drillPos && nextHref && (
            <a
              href={nextHref}
              onClick={() => {
                try {
                  sendGAEvent("event", "next_q_click", { exam: exam ?? "unknown" });
                } catch {
                  /* GA未ロードでも遷移は妨げない */
                }
              }}
              className="block mt-6 w-full text-center py-3 rounded-lg font-bold text-sm no-underline transition-colors bg-blue-700 text-white hover:bg-blue-600"
            >
              {nextLabel ?? "次の問題へ"} →
            </a>
          )}

          {/* 通しで解く面への導線。2026-09-07 追加。
              問題ページはこのサイトの着地の8割を占めるのに、模試・腕試しテストへの
              リンクが1本も無かった。とくに分野の最終問(全14資格で109分野ぶん)は
              「次の問題へ」が出ず、そこで完全に行き止まりだった。
              実測では模試を解き終えた人がいちばん先へ進むので、演習が途切れる地点にだけ
              その面への道を置く。サイト内の機能であって広告ではないので、
              「広告」ラベル付きの講座CTAとは別の見た目にしている。 */}
          {!drillPos &&
            practiceRoutes.length > 0 &&
            (nextHref ? (
              <p className="mt-4 text-xs text-[color:var(--c-text-sub)] flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span>まとめて解くなら</span>
                {shikenmae && (
                  <ShikenmaeEntryLink
                    href={shikenmaePath(shikenmae)}
                    exam={shikenmae.exam}
                    placement="question_mid"
                    className="text-[color:var(--c-accent,var(--c-ink))] hover:underline"
                  >
                    試験前の10問（{mdSlash(shikenmae.date)} 試験）→
                  </ShikenmaeEntryLink>
                )}
                {practiceRoutes.map((r) => (
                  <a
                    key={r.href}
                    href={r.href}
                    onClick={() => trackPractice(r.kind, "question_mid")}
                    className="text-[color:var(--c-accent,var(--c-ink))] hover:underline"
                  >
                    {r.label} →
                  </a>
                ))}
              </p>
            ) : (
              <section className="card p-5 mt-6">
                <p className="text-sm font-bold text-[color:var(--c-ink)] font-serif mb-1">
                  この分野の問題は以上です
                </p>
                <p className="text-xs text-[color:var(--c-text-sub)] leading-relaxed mb-3">
                  通しで解くと、時間配分と、分野ごとの取りこぼしが分かります。
                </p>
                <ul className="space-y-3">
                  {shikenmae && (
                    <li>
                      <ShikenmaeEntryLink
                        href={shikenmaePath(shikenmae)}
                        exam={shikenmae.exam}
                        placement="question_end"
                        className="text-sm font-bold text-[color:var(--c-accent,var(--c-ink))] hover:underline no-underline"
                      >
                        試験前の10問 →
                      </ShikenmaeEntryLink>
                      <span className="block text-xs text-[color:var(--c-text-sub)] mt-0.5">
                        {mdJa(shikenmae.date)}の試験の前の7日間だけ。全員が同じ10問を1回だけ解きます
                      </span>
                    </li>
                  )}
                  {practiceRoutes.map((r) => (
                    <li key={r.href}>
                      <a
                        href={r.href}
                        onClick={() => trackPractice(r.kind, "question_end")}
                        className="text-sm font-bold text-[color:var(--c-accent,var(--c-ink))] hover:underline no-underline"
                      >
                        {r.label} →
                      </a>
                      <span className="block text-xs text-[color:var(--c-text-sub)] mt-0.5">{r.note}</span>
                    </li>
                  ))}
                </ul>
                {/* コラムへの導線。問題ページからコラム(流入をいちばん作っている面)への
                    リンクが1本も無かった。/column/ は資格ごとに <section id={資格ID}> を
                    持っているので、フラグメントでその資格のセクションに着地する。
                    連続演習が続いている inline 版には出さない(読み物へ逸らさない)。 */}
                {exam && (
                  <p className="mt-4 pt-3 border-t border-[color:var(--c-border)] text-xs">
                    <SiteLink
                      href={`/column/#${exam}`}
                      onClick={() => trackPractice("column", "question_end")}
                      className="text-[color:var(--c-accent,var(--c-ink))] hover:underline"
                    >
                      勉強法・試験日程のコラムを読む →
                    </SiteLink>
                  </p>
                )}
              </section>
            ))}

          {/* 答え合わせ後（最高関心点）の 2 つの CTA。
              どちらも消さず、申込締切までの日数で「上に出す方」だけを入れ替える
              (lib/cta-priority.ts)。A8 の成果は申込締切の直前に集中し、
              締切を過ぎるとその回は受験できなくなるため、その窓だけ講座広告を上に置く。
              それ以外の期間は学習期間が長く、Studio の方が価値を訴求しやすい。 */}
          {studioFirst ? (
            courseAd ?? studioAside
          ) : applyFirst ? (
            <>
              {courseAd}
              {studioAside}
            </>
          ) : (
            <>
              {studioAside}
              {courseAd}
            </>
          )}
        </>
      )}
    </>
  );
}
