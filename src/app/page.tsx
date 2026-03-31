import { getAllQuestions, getExamNumbers, getFields } from "@/lib/questions";

export default async function Home() {
  const questions = await getAllQuestions();
  const examNumbers = getExamNumbers();
  const fields = getFields();

  const totalQuestions = questions.length;

  return (
    <div className="space-y-8 pb-16">
      {/* Hero */}
      <section className="text-center py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-3">
          貸金業務取扱主任者<br className="sm:hidden" />過去問解説
        </h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          全{totalQuestions > 0 ? totalQuestions : "950"}問の過去問をわかりやすく解説。
          年度別・分野別に整理し、合格に必要な知識を効率的に学べます。
        </p>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "総問題数", value: totalQuestions > 0 ? `${totalQuestions}問` : "950問", color: "text-blue-700" },
          { label: "試験回数", value: "全19回", color: "text-emerald-700" },
          { label: "合格率目安", value: "約30%", color: "text-amber-700" },
          { label: "全問無料", value: "0円", color: "text-rose-600" },
        ].map((stat) => (
          <div key={stat.label} className="card p-4 text-center">
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Exam List */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
          年度別で解く
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(examNumbers.length > 0 ? examNumbers.filter(n => n > 0) : Array.from({ length: 19 }, (_, i) => 19 - i)).map((n) => (
            <a key={n} href={`/exam/${n}/`} className="card p-4 hover:shadow-md transition-shadow no-underline group">
              <p className="text-sm font-bold text-blue-800 group-hover:text-blue-600">第{n}回</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {n >= 15 ? `令和${n - 13}年度` : n >= 7 ? `平成${n + 18}年度` : `平成${n + 18}年度`}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Field List */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-emerald-600 rounded-full"></span>
          分野別で解く
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: "貸金業法", slug: "kashikingyouhou", desc: "試験の中心。出題数が最も多い分野", icon: "📜" },
            { name: "利息制限法・出資法", slug: "risoku", desc: "利率・みなし利息・グレーゾーン金利", icon: "💰" },
            { name: "民法・民事訴訟法", slug: "minpou", desc: "契約・保証・時効・強制執行", icon: "⚖️" },
            { name: "資金需要者等の保護", slug: "hogo", desc: "個人情報保護・消費者契約法", icon: "🛡️" },
          ].map((field) => (
            <a key={field.slug} href={`/field/${field.slug}/`} className="card p-4 hover:shadow-md transition-shadow no-underline group flex gap-3 items-start">
              <span className="text-2xl">{field.icon}</span>
              <div>
                <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600">{field.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{field.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Study Guide CTA */}
      <section className="card p-6 bg-blue-50 border border-blue-200 text-center">
        <h2 className="text-base font-bold text-blue-900 mb-2">はじめて受験する方へ</h2>
        <p className="text-sm text-slate-600 mb-4">
          貸金業務取扱主任者試験の難易度・合格率・勉強法を詳しく解説しています
        </p>
        <a href="/guide/" className="inline-block bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium no-underline hover:bg-blue-600 transition-colors">
          学習ガイドを見る
        </a>
      </section>

      {/* About Section (E-E-A-T) */}
      <section className="card p-6">
        <h2 className="text-base font-bold text-slate-800 mb-2">このサイトについて</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          当サイトは、貸金業務取扱主任者試験の過去問を全問掲載し、
          1問ずつ丁寧に解説しています。
          出典は日本貸金業協会の公式発表に基づいており、
          正確な情報提供を心がけています。
          すべてのコンテンツは無料でご利用いただけます。
        </p>
        <a href="/about/" className="text-sm text-blue-600 mt-2 inline-block no-underline hover:underline">
          運営者情報を見る →
        </a>
      </section>
    </div>
  );
}
