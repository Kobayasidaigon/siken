# アフィリエイト売上を上げるための調査・実行プロンプト

> 新しいセッションの冒頭にこの内容を貼ると、シカクモン(本体)と姉妹3サイトの
> アフィリエイト収益の取りこぼしを調査し、コードで直せるものはその場で直し、
> ユーザーの手作業が要るもの(ASP申請・GA4設定)は一覧にして返す。
> 初回実施: 2026-09-05(結果は `docs/affiliate-growth-audit.md`)。

---

## プロンプト本文

あなたは「シカクモン」(shikakumon.com / リポジトリ `siken`)と姉妹サイト
(`eisei-shikaku` / `setsubi-shikaku` / `kintore-shikaku`)のアフィリエイト売上を
上げる担当です。日本語でやり取りしてください。目的は **A8.net 等のアフィリエイト成果
(講座申込・資料請求・無料会員登録)を増やすこと** です。自社サービス「シカクモン Studio」
への送客は壊さない範囲で扱い、優先はアフィリです。

### 前提(読んでから動く)

- 本体は Next.js 16 App Router / SSG on Vercel / `trailingSlash: true`。姉妹は static export。
- 収益の骨格は次のファイルに集約されている。まずここを読む:
  - `src/lib/affiliate-links.ts` … 資格→A8リンク(`EXAM_AFFILIATE`)。`freeHref` は無料オファー。
  - `src/components/AffiliateLink.tsx` … GA4 `affiliate_click` / `cta_impression`(params: `course`, `placement`)。
  - `src/components/FreeLeadCTA.tsx`, `TextAffiliateAd.tsx`, `*CourseAd.tsx`(資格ごと)。
  - `src/app/q/[slug]/AnswerReveal.tsx` … 答え合わせ直後CTA(最高intent面)。`RESULT_CTA_EXAMS` が対象資格。
  - `src/lib/cta-priority.ts` + `src/lib/exam-dates.ts` … **A8 の成果は申込締切の直前に集中する**(実測)。
    締切10日前だけ講座広告を Studio 枠より上に出す。日程が無い資格はこの仕組みが動かない。
  - `src/components/ExamCountdown.tsx` … 資格トップ・日程コラム・直前対策コラムのカウントダウン。
  - `src/app/column/[slug]/page.tsx` … コラム末尾の広告割当(スラッグ接頭辞で分岐)。
  - `src/app/study/StudyClient.tsx`, `src/components/MoshiExam.tsx`, `src/app/kashikin/mock/MockExam.tsx` … 結果面CTA。
  - `src/lib/ucan-policy.ts` … ユーキャンの掲載ルール(数値つき合格率の面に広告不可)。
- 実測の手がかり(コメントに残っている): 90日で affiliate_click 172 / Studio送客 約170、
  SMART系の CVR 7.5%、設問中の常時表示は CTR 0.26% で焼くだけ、模試完了者が最も転換する。
- 設計言語(崩さない): 控えめな広告(「広告」ラベル・本文と区別・赤やアニメやポップアップ禁止)、
  非AI的な編集トーン、事実の正確性(変動値は「公式で確認」に誘導)。
- A8 規約: 提携はサイト単位。別サイトの a8mat を流用しない。広告主が扱っていない講座を宣伝しない。
  ユーキャンは「資料請求」が否認条件なので `freeHref` に置かない。

### 手順

1. **事前スカウト(自分で、読み取りだけ)**
   - 資格一覧(`src/lib/study-progress.ts` の `EXAM_LIST`)と `EXAM_AFFILIATE` を突き合わせ、
     A8リンクがあるのに CTA が出ない面を探す(`RESULT_CTA_EXAMS`、コラム分岐、`EXAM_SCHEDULES`)。
   - `public/sitemap.xml` の収録URLと `src/app` の実在ルートの差分、404 になっている内部リンク
     (`grep -rn 'href="/' src/app` と `find src/app -name page.tsx`)。
   - 各資格トップの「試験の概要」が雛形コピペのまま別資格の値になっていないか。
   - 直近の試験日程(`exam-dates.ts`)が今日から見て腐っていないか。今日の日付を確認する。
   - 姉妹サイトの `data/site.ts` / `data/affiliate.ts` で空欄の講座アフィリが無いか。
2. **Workflow で多視点監査 + 外部リサーチ**(下の「監査ワークフロー」を `Workflow` ツールで実行)。
   スカウトで既に分かった所見は `CONTEXT` の「既知」に書いて重複報告を避ける。
   同時実行枠が少ない環境(nproc が 4 以下)では視点を 6 本、検証は所見ごとに1名に絞る。
   初回(2026-09-05)は発見10エージェントの後、検証25エージェントが利用上限で全滅した。
   上限が近いときは検証を high 所見だけに絞るか、`resumeFromRunId` で上限リセット後に
   再開する(発見・リサーチの結果はキャッシュから戻る)。実装する所見は、検証の有無に
   かかわらず自分で file:line を開いて確認してから直す。
3. **実装の順序**(売上に効く順。迷ったらこの順)
   1. 高intent面(答え合わせ直後・模試結果・学習履歴)の CTA 欠落を埋める。
   2. 締切カウントダウン・`EXAM_SCHEDULES` の日程を公式(または予備校3社の一致)で登録する。
   3. コラムの広告分岐・内部導線の誤りを直す(誤った資格の広告は信頼を落とす)。
   4. 収益ページの発見性(sitemap・ヘッダー/フッター・404)を直す。
   5. 事実誤り(受験料・合格基準・実施機関)を直す。E-E-A-T と広告の隣接面の信頼に直結する。
   6. 隣接オファー(比較記事に承認済み素材を併置)・無料オファー(`freeHref`)の追加。
   7. 未提携資格の ASP 候補はコードでは直せない。ユーザー宿題として一覧にする。
4. **検証**: `npm run build`(prebuild の監査スクリプトも通す) → `npx next start -p 3457` →
   変更ページを `curl` して修正文言・広告枠・カウントダウンが HTML に出ていることを確認 → サーバー停止。
5. **成果物**: `docs/affiliate-growth-audit.md` を更新(確定所見 / 実施した修正 / ユーザー宿題 /
   棄却した所見とその理由 / 外部リサーチ結果)。コミットして指定ブランチへ push。
   push は依頼されたときのみ。コミット文は日本語で「何を・なぜ」。

### 監査ワークフロー(Workflow ツールに渡すスクリプト)

```js
export const meta = {
  name: 'shikakumon-affiliate-audit',
  description: 'アフィリ収益の取りこぼしを多視点で発見→反証検証、未提携資格のASP候補を外部リサーチ',
  phases: [
    { title: 'Find' }, { title: 'Research' }, { title: 'Merge' }, { title: 'Verify' },
  ],
}
const REPO = '/home/user/siken'
const CONTEXT = `(上の「前提」をここに貼る。既知の所見 K1.. と「対処済み」を列挙し、
読み取り専用・file:line 根拠必須・設計言語と A8 規約を守る、を明記)`

const FINDINGS_SCHEMA = { type: 'object', properties: { findings: { type: 'array', items: { type: 'object', properties: {
  title: { type: 'string' }, severity: { type: 'string', enum: ['high','medium','low'] },
  evidence: { type: 'array', items: { type: 'object', properties: { file: { type: 'string' }, line: { type: 'integer' }, note: { type: 'string' } }, required: ['file','note'] } },
  why_revenue: { type: 'string' }, fix: { type: 'string' }, fix_type: { type: 'string', enum: ['code','user_action','both'] },
  effort: { type: 'string', enum: ['S','M','L'] }, site: { type: 'string' }, confidence: { type: 'number' } },
  required: ['title','severity','evidence','why_revenue','fix','fix_type','effort','site','confidence'] } },
  known_corrections: { type: 'array', items: { type: 'string' } } }, required: ['findings','known_corrections'] }

const LENSES = [
  { key: 'cta-matrix',    prompt: '14資格×配置面の表を作り、A8リンクがあるのにCTAが出ない面・無料CTAが出ない面・placement名の揺れを洗う' },
  { key: 'column-routing', prompt: 'コラム全スラッグを column/[slug]/page.tsx の分岐に当て、誤った広告・広告なし・内部導線の誤り・比較記事の隣接オファー機会を洗う' },
  { key: 'a8-compliance-and-measurement', prompt: 'a8mat の不一致・広告主の講座有無・rel/広告ラベル/ビーコン・ユーキャン規約・姉妹での流用・計測されないリンク・イベント名不統一' },
  { key: 'dates-and-facts', prompt: '全資格トップの「試験の概要」と exam-dates.ts と日程コラムの整合。雛形コピペの誤り・腐った日付・カウントダウンの無い資格' },
  { key: 'sister-sites',  prompt: '姉妹3サイトを本体と同じ基準で。無料オファー併置・答え合わせ直後CTA・締切優先ロジックの有無・空欄の講座アフィリ' },
  { key: 'offer-mix',     prompt: 'コラム本文で教材・講座・申込を語っているのにリンクが無い箇所、freeHref未設定、結果面の合否別文言。書籍はもしも(Amazon/楽天)想定' },
]

const RESEARCH_SCHEMA = { type: 'object', properties: { items: { type: 'array', items: { type: 'object', properties: {
  topic: { type: 'string' }, exam: { type: 'string' }, advertiser: { type: 'string' }, asp: { type: 'string' },
  program_or_offer: { type: 'string' }, course_exists_evidence: { type: 'string' }, reward: { type: 'string' },
  free_offer: { type: 'string' }, notes: { type: 'string' }, confidence: { type: 'number' },
  source_urls: { type: 'array', items: { type: 'string' } } },
  required: ['topic','exam','advertiser','asp','program_or_offer','course_exists_evidence','notes','confidence','source_urls'] } },
  summary: { type: 'string' } }, required: ['items','summary'] }

const RESEARCH = [
  { key: 'asp-tokyo-cci',     prompt: '福祉住環境2級・ビジマネ・eco検定の講座/テキストを扱う広告主とASP・報酬・成果地点・審査傾向' },
  { key: 'asp-realestate-it', prompt: '賃管士・管業・ITパスポート・ビジ法2級の代替/追加広告主。無料会員登録・資料請求で報酬が出る低摩擦オファー優先' },
  { key: 'asp-sisters',       prompt: '筋トレ系資格・衛生管理者/設備系資格の広告主(SAT以外)' },
  { key: 'book-affiliate',    prompt: 'もしも(Amazon/楽天)とAmazonアソシエイト直の比較、静的サイトでの貼り方、ステマ規制の表示要件、対象資格の定番テキスト書名' },
]

const MERGED_SCHEMA = { type: 'object', properties: { findings: { type: 'array', items: { type: 'object', properties: {
  id: { type: 'string' }, title: { type: 'string' }, severity: { type: 'string', enum: ['high','medium','low'] },
  evidence: { type: 'array', items: { type: 'object', properties: { file: { type: 'string' }, line: { type: 'integer' }, note: { type: 'string' } }, required: ['file','note'] } },
  why_revenue: { type: 'string' }, fix: { type: 'string' }, fix_type: { type: 'string', enum: ['code','user_action','both'] },
  effort: { type: 'string', enum: ['S','M','L'] }, site: { type: 'string' }, sources: { type: 'array', items: { type: 'string' } } },
  required: ['id','title','severity','evidence','why_revenue','fix','fix_type','effort','site','sources'] } } }, required: ['findings'] }

const VERDICT_SCHEMA = { type: 'object', properties: { real: { type: 'boolean' }, confidence: { type: 'number' },
  reasoning: { type: 'string' }, corrected_fix: { type: 'string' }, severity_adjust: { type: 'string', enum: ['up','down','keep'] } },
  required: ['real','confidence','reasoning','corrected_fix','severity_adjust'] }

const [foundRaw, researchRaw] = await Promise.all([
  parallel(LENSES.map((l) => () => agent(`${CONTEXT}\n\n# 担当\n${l.prompt}\n\n# 出力\n所見を売上に効く順に。file:line 根拠・売上への効き方・修正案・fix_type・effort・confidence。既知は再報告しない。`,
    { label: `find:${l.key}`, phase: 'Find', schema: FINDINGS_SCHEMA, effort: 'high' }))),
  parallel(RESEARCH.map((r) => () => agent(`${CONTEXT}\n\n# 担当(外部リサーチ・読み取り専用)\n${r.prompt}\n\nWebSearch 主体。WebFetch は公式ドメインがブロックされることがある。根拠URL必須。summary に「今すぐ申請すべき順」を3行。`,
    { label: `research:${r.key}`, phase: 'Research', schema: RESEARCH_SCHEMA, effort: 'medium' }))),
])
const finders = foundRaw.filter(Boolean)
const all = finders.flatMap((r, i) => r.findings.map((f) => ({ ...f, lens: LENSES[i].key })))
phase('Merge')
const merged = await agent(`同じ問題を指す所見を統合し(根拠は合算、severity は高い方)、id F01.. を severity 順に付けて返す。\n\n${JSON.stringify(all)}`,
  { label: 'merge', phase: 'Merge', schema: MERGED_SCHEMA, effort: 'medium' })
const findings = merged ? merged.findings : all
const toVerify = findings.filter((f) => f.severity !== 'low')
const verified = await pipeline(toVerify, (f) => agent(
  `${CONTEXT}\n\n# 役割: 反証者\n根拠 file:line を実際に開き、コード上で成立するか・修正案が売上に効き規約と設計言語に反しないかを検証。迷ったら real=false。\n\n所見: ${JSON.stringify(f)}`,
  { label: `verify:${f.id}`, phase: 'Verify', schema: VERDICT_SCHEMA, effort: 'medium' }
).then((v) => ({ ...f, verdict: v, confirmed: Boolean(v && v.real) })))
return {
  confirmed: verified.filter(Boolean).filter((v) => v.confirmed),
  rejected: verified.filter(Boolean).filter((v) => !v.confirmed).map((v) => ({ id: v.id, title: v.title, reason: v.verdict && v.verdict.reasoning })),
  lowUnverified: findings.filter((f) => f.severity === 'low'),
  knownCorrections: finders.flatMap((r) => r.known_corrections || []),
  research: researchRaw.map((r, i) => ({ key: RESEARCH[i].key, result: r })),
}
```

### 報告の形式

- 冒頭に「今すぐ効く順」で上位3つ(何を直したか / 何をユーザーに頼むか)。
- 修正は file:line で示す。数字は表に。派手な提案や推測の効果額は書かない。
- ユーザー宿題(A8/afb/もしもの提携申請、GA4 のカスタム定義登録、Search Console の sitemap 再送信)は
  「やること・所要時間・効く理由」の3列で。

### やらないこと

- 広告を目立たせる方向の変更(色・アニメ・固定バナー・ポップアップ)。
- 広告主が扱っていない講座への誘導、別サイトの a8mat の流用、ユーキャンの資料請求リンク。
- 合格率の数値を出しているページへのユーキャン広告(`canShowUcanAd` を通さない設置)。
- GA4 や A8 の管理画面が要る作業をやったことにすること(宿題として渡す)。
