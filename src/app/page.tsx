export default function Home() {
  const exams = [
    {
      name: "貸金業務取扱主任者",
      slug: "kashikin",
      count: 504,
      desc: "貸金業法・利息制限法・民法・資金需要者保護の4分野を網羅した練習問題集。試験は年1回（11月）実施で、合格率は約30%。貸金業者に必須の国家資格です。",
      date: "2026年11月（年1回）",
    },
    {
      name: "個人情報保護士",
      slug: "pii",
      count: 300,
      desc: "個人情報保護法・マイナンバー法・情報セキュリティの3分野をカバー。企業の個人情報管理に関わる実務者向けの認定資格です。年に複数回実施されます。",
      date: "2026年6月21日 / 9月27日",
    },
    {
      name: "知的財産管理技能検定3級",
      slug: "chizai",
      count: 200,
      desc: "特許法・著作権法・意匠法・商標法・不正競争防止法・国際条約を網羅した国家資格。企業の知財管理・知財戦略に関わる実務者向けの資格です。年3回実施。",
      date: "2026年7月12日",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://shikakumon.com/#organization",
        name: "シカクモン",
        url: "https://shikakumon.com",
      },
      {
        "@type": "WebSite",
        "@id": "https://shikakumon.com/#website",
        url: "https://shikakumon.com",
        name: "シカクモン",
        description: "資格試験のオリジナル練習問題を無料で提供するサイト。貸金業務取扱主任者・個人情報保護士など、ニッチ資格の試験対策に。",
        publisher: { "@id": "https://shikakumon.com/#organization" },
        inLanguage: "ja",
      },
    ],
  };

  return (
    <div className="space-y-10 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
          シカクモン ― 資格試験の練習問題サイト
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed max-w-xl">
          シカクモンは、ニッチな資格試験に特化したオリジナル練習問題サイトです。
          貸金業務取扱主任者や個人情報保護士など、市販の問題集が少ない資格を中心に、
          合計800問以上の練習問題を無料で公開しています。
          すべての問題に根拠法令を含む詳細な解説が付いており、
          合格に必要な知識を効率よく身につけることができます。
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
              <p className="text-xs text-slate-400 mt-2">次回試験: {exam.date}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-base font-bold text-slate-800 mb-3">シカクモンの特徴</h2>
        <div className="text-sm text-slate-600 leading-relaxed space-y-2">
          <p>
            各問題は四肢択一形式で、実際の試験と同じ形式で出題されます。
            解答後には正解・不正解の判定に加え、各選択肢ごとの解説を表示。
            なぜその選択肢が正しいのか（または間違っているのか）を、
            根拠となる条文番号とともに確認できます。
          </p>
          <p>
            分野別・難易度別に問題を絞り込めるので、
            苦手分野の集中学習や、試験直前の総復習にも活用できます。
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-base font-bold text-slate-800 mb-2">このサイトについて</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          最新の法令に基づいたオリジナル問題を、1問ずつ丁寧に解説しています。
          すべて無料でご利用いただけます。問題の正確性については、
          複数のAIによる検証と人的チェックを実施しています。
        </p>
        <a href="/about/" className="text-sm text-slate-500 mt-2 inline-block no-underline hover:underline">
          運営者情報 →
        </a>
      </section>
    </div>
  );
}
