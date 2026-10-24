/**
 * コラムの本文中に置く「その場で解ける1問」(InlineQuestion)の設定。2026-10-24 追加。
 *
 * 背景: GA4(2026-09-26〜10-23)で、調べ物で来るコラム(合格率・試験日・難易度・意味ない)は、
 * そのページから入ったセッションのうち問題を解き始めた割合が 2〜14% で、資格トップ(44〜51%)や
 * 過去問のコラム(27〜42%)より低かった。合格率のコラムは知りたい数字が最初の段落に出てしまい、
 * 問題へのリンクはスマホで3画面ほど下が最初だった。
 * そこで最初の見出しの前(最初の段落のすぐ下)に1問を置き、答えたら同じ資格の問2へ進めるようにする。
 *
 * 進め方: 1ページにつき変更は1つにして、置いた日をここと CHANGELOG に残す。
 *   2026-10-24 fukushi2-goukakuritsu(導入前: 217セッション・解き始め 14%・アフィリエイトのクリック 2件)
 *   効いたら eco-nanido → jitsumu-iminai と広げる。pii-nittei は申込カウントダウンからのクリックが
 *   コラムで最も多いので最後にする。
 * 効果の見方: そのページから入ったセッションのうち question_answered があった割合。
 *   カードからの回答は placement=column_inline_q で区別できる(docs/ga4-events.md)。
 */
import type { ExamSlug } from "./study-progress";
import { getFukushi2Question } from "./fukushi2-questions";

interface InlineQuestionConfig {
  exam: ExamSlug;
  /** カードに出す問題。難易度Aの問1から選ぶ */
  questionSlug: string;
  /** 「続けて解く」の行き先 */
  nextSlug: string;
  nextLabel: string;
  /** カードの見出し。本文の流れとつなげる(数値は本文と同じ値にそろえる) */
  heading: string;
  /** 正誤のあとに出す1行。省略時は解説の最初の1文 */
  point?: string;
  /**
   * 記事末尾の Studio 導線の文言。既定の「〜の問題を1問解いてみる」がカードと名前がかぶるため、
   * カードを置いたページだけ差し替える(Studio の LP は「AI が作った問題を登録なしで1問解ける」)。
   */
  studioLinkLabel: string;
}

const CONFIG: Record<string, InlineQuestionConfig> = {
  "fukushi2-goukakuritsu": {
    exam: "fukushi2",
    questionSlug: "fukushi2-001",
    nextSlug: "fukushi2-002",
    nextLabel: "続けて解く（問2へ）",
    heading: "合格率23.0%の試験を、1問だけ解いてみる",
    studioLinkLabel: "Studio で AI が作った2級の問題を解いてみる",
  },
};

type Loader = (slug: string) => Promise<{
  questionNumber: number;
  field: string;
  difficulty: string;
  questionText: string;
  choices: string[];
  correctAnswer: number;
  content: string;
} | null>;

/** 資格ごとの問題の読み込み。カードを置く資格を増やすときはここに足す */
const LOADERS: Partial<Record<ExamSlug, Loader>> = {
  fukushi2: getFukushi2Question,
};

/** 資格ごとの問題ページのパス(/<資格>/q/<slug>/) */
function questionPath(exam: ExamSlug, slug: string): string {
  return `/${exam}/q/${slug}/`;
}

/** 解説の HTML から最初の1文を取り出す(見出しを除いた最初の段落の「。」まで) */
function firstSentence(html: string): string {
  const p = html.match(/<p>([\s\S]*?)<\/p>/);
  if (!p) return "";
  const text = p[1].replace(/<[^>]+>/g, "").trim();
  const end = text.indexOf("。");
  return end >= 0 ? text.slice(0, end + 1) : text;
}

export interface InlineQuestionData {
  exam: ExamSlug;
  questionSlug: string;
  heading: string;
  label: string;
  questionText: string;
  choices: string[];
  correctAnswer: number;
  point: string;
  detailHref: string;
  nextHref: string;
  nextLabel: string;
  studioLinkLabel: string;
}

/** コラムのスラッグに対応するカードのデータ。カードを置かないコラムは null */
export async function getInlineQuestion(columnSlug: string): Promise<InlineQuestionData | null> {
  const c = CONFIG[columnSlug];
  if (!c) return null;
  const load = LOADERS[c.exam];
  const q = load ? await load(c.questionSlug) : null;
  if (!q) return null;
  return {
    exam: c.exam,
    questionSlug: c.questionSlug,
    heading: c.heading,
    label: `練習問題 問${q.questionNumber}（${q.field}・難易度${q.difficulty}）`,
    questionText: q.questionText,
    choices: q.choices,
    correctAnswer: q.correctAnswer,
    point: c.point ?? firstSentence(q.content),
    detailHref: questionPath(c.exam, c.questionSlug),
    nextHref: questionPath(c.exam, c.nextSlug),
    nextLabel: c.nextLabel,
    studioLinkLabel: c.studioLinkLabel,
  };
}
