export default function Home() {
  const exams = [
    {
      name: "貸金業務取扱主任者",
      slug: "kashikin",
      count: 504,
      desc: "貸金業法・利息制限法・民法・資金需要者保護の4分野",
      date: "2026年11月（年1回）",
    },
    {
      name: "個人情報保護士",
      slug: "pii",
      count: 300,
      desc: "個人情報保護法・マイナンバー法・情報セキュリティ",
      date: "2026年6月21日 / 9月27日",
    },
  ];

  return (
    <div className="space-y-10 pb-16">
      <section className="py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
          シカクモン
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-lg">
          資格試験のオリジナル練習問題を無料で公開しています。
          1問ごとに根拠法令を含む詳細解説付き。
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-slate-800 mb-4">資格を選ぶ</h2>
        <div className="space-y-4">
          {exams.map((exam) => (
            <a
              key={exam.slug}
              href={`/${exam.slug}/`}
              className="card p-5 hover:shadow-md transition-shadow no-underline group block"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-base font-bold text-slate-800 group-hover:text-blue-600">{exam.name}</p>
                <span className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded font-bold shrink-0 ml-2">{exam.count}問</span>
              </div>
              <p className="text-sm text-slate-500">{exam.desc}</p>
              <p className="text-xs text-slate-400 mt-1">次回試験: {exam.date}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-base font-bold text-slate-800 mb-2">このサイトについて</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          最新の法令に基づいたオリジナル問題を、1問ずつ丁寧に解説しています。
          すべて無料です。
        </p>
        <a href="/about/" className="text-sm text-slate-500 mt-2 inline-block no-underline hover:underline">
          運営者情報 →
        </a>
      </section>
    </div>
  );
}
