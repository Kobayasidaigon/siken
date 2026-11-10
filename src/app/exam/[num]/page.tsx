import SiteLink from "@/components/SiteLink";
import { getQuestionsByExam, getExamNumbers } from "@/lib/questions";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { QuestionData } from "@/lib/types";
import { pageMetadata } from "@/lib/page-metadata";

// 問題があるのは 0(オリジナル問題)だけ。以前は /exam/1/〜/exam/19/ を開くと「この回の問題は準備中です」「0問」の
// 空のページが出ていたので、generateStaticParams に無い番号は 404 にする(2026-11-10)
export const dynamicParams = false;

export async function generateStaticParams() {
  const exams = getExamNumbers();
  return exams.map((n) => ({ num: String(n) }));
}

export async function generateMetadata({ params }: { params: Promise<{ num: string }> }): Promise<Metadata> {
  const { num } = await params;
  const title = num === "0" ? "貸金業務取扱主任者 練習問題一覧" : `貸金業務取扱主任者｜第${num}回 問題一覧`;
  return pageMetadata({
    path: `/exam/${num}/`,
    title,
    description: `貸金業務取扱主任者試験 ${title}。1問ずつ解いて、答えと解説を確認できます。`,
    // 問題へのリンクの一覧だけで、そのページにしかない文章が無いため検索に出さない(2026-11-10)
    noindex: true,
  });
}

const fieldOrder = ["貸金業法", "利息制限法・出資法", "民法・民事訴訟法", "資金需要者等の保護"];

function QuestionCard({ q, index }: { q: QuestionData; index: number }) {
  const diffColor = { A: "bg-green-100 text-green-800", B: "bg-amber-100 text-amber-800", C: "bg-red-100 text-red-800" }[q.difficulty];
  return (
    <SiteLink
      href={`/q/${q.slug}/`}
      className="card p-4 flex justify-between items-center no-underline group"
      style={{ borderLeft: "3px solid var(--c-kashikin)" }}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{ background: "var(--c-kashikin-soft)", color: "var(--c-kashikin-ink)" }}
          >
            問{index}
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${diffColor}`}>{q.difficulty}</span>
        </div>
        <p className="text-sm text-[color:var(--c-text)] line-clamp-1">
          {q.questionText.slice(0, 60)}...
        </p>
      </div>
      <svg className="w-4 h-4 text-[color:var(--c-text-sub)] flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </SiteLink>
  );
}

export default async function ExamPage({ params }: { params: Promise<{ num: string }> }) {
  const { num } = await params;
  const examNumber = parseInt(num);
  if (isNaN(examNumber) || examNumber < 0 || examNumber > 19) notFound();

  const questions = await getQuestionsByExam(examNumber);

  // Group by field
  const grouped = new Map<string, QuestionData[]>();
  for (const field of fieldOrder) {
    grouped.set(field, []);
  }
  for (const q of questions) {
    const list = grouped.get(q.field);
    if (list) list.push(q);
    else grouped.set(q.field, [q]);
  }

  const isOriginal = examNumber === 0;

  return (
    <div className="theme-kashikin pb-16">
      <nav className="breadcrumb text-xs text-[color:var(--c-text-sub)] mb-4 flex gap-1">
        <SiteLink href="/">ホーム</SiteLink><span>/</span>
        <SiteLink href="/kashikin/">貸金業務取扱主任者</SiteLink><span>/</span>
        <SiteLink href="/exam/">問題一覧</SiteLink><span>/</span>
        <span className="text-[color:var(--c-ink)]">{isOriginal ? "全問一覧" : `第${examNumber}回`}</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        {isOriginal ? "オリジナル練習問題（全問）" : `第${examNumber}回 貸金業務取扱主任者試験`}
      </h1>
      <div className="w-12 h-1 mb-3" style={{ background: "var(--c-kashikin)" }}></div>
      <p className="text-sm text-[color:var(--c-text-sub)] mb-4">{questions.length}問を分野別に表示しています。</p>

      {isOriginal && (
        <div className="mb-8">
          <SiteLink href="/kashikin/mock/" className="btn-accent">本番形式テストに挑戦（20問・採点あり）→</SiteLink>
        </div>
      )}

      {questions.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-[color:var(--c-text-sub)] text-sm">この回の問題は準備中です。</p>
        </div>
      ) : (
        <div className="space-y-10">
          {fieldOrder.map((field) => {
            const fieldQuestions = grouped.get(field) || [];
            if (fieldQuestions.length === 0) return null;
            return (
              <section key={field}>
                <div
                  className="pl-4 py-2 mb-4 rounded-r"
                  style={{ borderLeft: "4px solid var(--c-kashikin)", background: "var(--c-kashikin-soft)" }}
                >
                  <h2 className="text-base font-bold font-serif" style={{ color: "var(--c-kashikin-ink)" }}>
                    {field}
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--c-kashikin-ink)" }}>{fieldQuestions.length}問</p>
                </div>
                <div className="space-y-2">
                  {fieldQuestions.map((q, i) => (
                    <QuestionCard key={q.slug} q={q} index={i + 1} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* 講座広告(KashikinCourseAd)は 2026-11-10 に外した。分野ページと同じく、問題へのリンク一覧と広告だけの
          ページは AdSense の審査で「有用性の低いコンテンツ」に見えやすいため(分野ページの広告も同じ日に外した) */}

      <nav className="mt-10 flex justify-center pt-4 border-t border-[color:var(--c-border)]">
        <SiteLink href="/kashikin/" className="text-sm text-[color:var(--c-text-sub)] no-underline hover:text-[color:var(--c-kashikin)]">
          貸金業務取扱主任者トップへ
        </SiteLink>
      </nav>
    </div>
  );
}
