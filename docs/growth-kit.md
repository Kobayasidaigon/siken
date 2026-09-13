# growth-kit — 本体(shikakumon.com)側の実装と、Studio・姉妹サイトへの契約

2026-09-13 作成。方針の出典は `docs/direction-2026-09.md`（シカクモン系列の方向性）と
`docs/studio-direction-2026-09.md`（Studio の有料転換・継続率）。この2つが「決まっていること」で、
本書はそれを本体リポジトリ（`siken`）でどう実装したか、Studio と姉妹3サイトに何を求めるかの控え。

数字の出典・目的・5つの堀は方針書に書いてあるので繰り返さない。ここに書くのは **コードの側の事実** だけ。

## 1. 3本柱と、本体で入れたもの

| 柱 | 方針 | 本体の実装 | 状態 |
|---|---|---|---|
| ① 決める瞬間に CTA | 模試・本番形式の結果画面を「講座（アフィ）／弱点だけ復習（Studio）」の分岐点に。得点帯で出し分け、文言はその人の数字 | `components/growth/ResultDecisionPanel.tsx`、`lib/growth/score-band.ts`、`studioResultHref()`（`lib/studio-cta.ts`）。`MockExam` / `MoshiExam` の結果面を差し替え。`result_view` を送り、`affiliate_click` / `studio_click` に `band` | 済 |
| ② リピートの仕組み | 試験日ワンタップ設定 → 毎朝3問プッシュ／メール（＝Studio登録）→ 履歴同期 | `lib/growth/exam-date.ts` + `components/growth/ExamDateChip.tsx`（17資格トップの日程カード内）、`lib/growth/daily.ts` + `DailyThreeCard`（資格トップ・/study/・`/today/`）、`StudioConnectCard`（/study/）、`studioConnectHref()` | 本体側は済。**Studio の `/connect` が無いので接続リンクはフラグで非表示**（§4） |
| ③ 利用データをコンテンツに | 全サイトの回答ログを Studio に集め、正答率・TOP10 を表示。収集は表示より先 | `lib/growth/anon-id.ts` + `answer-log.ts`（問題ページ・本番形式・模試・ドリル・今日の3問・コラム内1問から送信）、`/api/answer-log/`（検証して Studio へ転送）、`/api/question-stats/`（n≥30 の代理）、`AccuracyBadge`（問題ページ）、`HardQuestionsSection`（資格トップ） | 収集は **転送先の環境変数を入れた時点で開始**。表示はデータが溜まるまで自動で非表示 |
| §6 その場で1問 | 試験日・合格率・勉強時間コラムに1問 | `components/growth/InlineQuestion.tsx`、`lib/question-registry.ts`。対象は `-goukakuritsu / -nittei / -benkyou-jikan / -toha / -nanido` と貸金の旧スラッグ4本 | 済 |

### 共通ルール（方針 §7）のコード上の置き場所

| ルール | どこで守っているか |
|---|---|
| GA4 イベント名を全サイト共通に | `docs/ga4-events.md`（`result_view` `exam_date_set` `daily_complete` `history_sync` を追加。`push_subscribed` は Studio 側） |
| 共通問題ID `{site}:{cert}:{qid}` | `questionId()`（`lib/growth/answer-log.ts`）。本体は `site="main"`。サーバー側でも同じ式で照合して不一致は捨てる |
| Studio への遷移は `utm_content={placement}_{cert}_{band}` | `studioResultHref()`。接続リンクは `{placement}_{cert}`（帯が無い面） |
| アフィリは「広告」明記 + `rel="nofollow sponsored"` | 既存の `AffiliateLink`。分岐パネルもそれを使う |
| 案件が無い資格には出さない | `hasCourseOffer()`（`ResultDecisionPanel.tsx`）。A8 の計測付きリンクを持つ資格だけ講座行を出す。**fukushi2（ユーキャン提携待ち）・bijimane・eco は結果画面に講座行が出ない**。提携が取れて `affiliate-links.ts` の href が a8.net になれば自動で出る。問題ページの答え合わせ直後CTA（`AnswerReveal`）は従来どおり fukushi2 も出す |
| 結果画面の文言は煽らない。事実 → 弱点 → 選択肢。合格保証めいた表現は禁止 | `ResultDecisionPanel` の構成そのもの。文言は `BAND_NOTE` と各行の1文だけ |
| 統計は n≥30 まで表示しない | `/api/question-stats/route.ts` の `MIN_SAMPLE`。Studio が返しても本体側でもう一度落とす |
| 回答ログは匿名IDのみ、個人情報は送らない | `anon-id.ts`（端末内の乱数）。`/api/answer-log/` は IP・UA・Cookie を転送しない。`/privacy/` に項目を追加 |
| 「出題予想」は書かない。「正答率が低い＝本番で差がつく論点」と言う | `AccuracyBadge` と `HardQuestionsSection` の文言 |

## 2. 回答ログの設計

```
問題ページ / 本番形式 / 模試 / ドリル / 今日の3問 / コラム内1問
  → logAnswer()  … 端末内キューに積む（2秒・10件・離脱で送る）
  → sendBeacon POST /api/answer-log/   （同一オリジン）
  → 検証（資格ID・slug・mode・時刻の範囲・qid の一致）
  → fetch POST {STUDIO_INGEST_URL}  Authorization: Bearer {STUDIO_INGEST_SECRET}
```

- 送るもの: `{ v:1, site:"main", anon, sentAt, events:[{ qid, exam, slug, correct, mode, ts }] }`
- `mode`: `question` / `mock` / `moshi` / `drill` / `daily` / `column`
- 送らない人: `/study/` で止めた人、Global Privacy Control を送るブラウザ、localStorage が使えない環境
- 再送しない（統計用。1件の欠けは体験に影響しない）
- 偽装への備え: 本人確認はできない（GA と同じ）。`/api/answer-log/` は同一IPの受け付け件数を 10 分 400 件で止め、
  `Sec-Fetch-Site` が cross-site の要求を捨てる。集計側は匿名IDごとに最初の解答だけを数える（§3.2）
- 学習履歴（`study-progress.ts`: メダル・ブックマーク・正誤一覧）は **従来どおり端末の外に出ない**。
  「サーバには送信されません」の文言は、その区別が付くように各所で書き分けた（/study/ 見出し、`ProgressBackup`、`/privacy/`）

## 3. Studio 側の契約（Studio リポジトリで実装するもの）

本体は以下の3つの受け口を前提にしている。URL は本体の環境変数で差し替えられる。

### 3.1 取り込み `POST {STUDIO_INGEST_URL}`

- ヘッダ `Authorization: Bearer {共有鍵}`、本文は §2 の JSON（`events` は最大50件）
- `site` は `main` / `setsubi` / `eisei` / `kintore`。`qid` は `{site}:{cert}:{qid}`
- 202 を返す。重複（同じ anon・qid・ts）は Studio 側で捨ててよい
- 保存は `answer_logs(site, anon_id, qid, exam, slug, correct, mode, answered_at)` 程度。個人情報の列は作らない

### 3.2 集計 `GET {STUDIO_STATS_URL}`

- `?site=main&exam=fukushi2&slugs=a,b,c`（最大20） → `{ stats: { [slug]: { n, rate } } }`（rate は 0–100 の整数）
- `?site=main&exam=fukushi2&top=10` → `{ top: [ { slug, n, rate } ] }`（正答率が低い順。n≥30 のみ）
- 匿名IDごとに **最初の解答だけ** を数える（同じ人が復習で何度も解くと正答率が上がる）
- 本体側の代理（`/api/question-stats/`）が n<30 を落とし、TOP10 には問題の論点・分野を付けて返す

### 3.3 接続画面 `GET https://studio.shikakumon.com/connect`

本体の `studioConnectHref()` が付ける引数:

| 引数 | 意味 |
|---|---|
| `utm_source=shikakumon&utm_medium=referral&utm_content={placement}_{cert}` | placement は `reminder`（試験日設定後の案内）/ `sync`（/study/ の同期）/ `daily` |
| `exam` | 資格の正式名称（既存の `?exam=` と同じ。`EXAM_FULL_NAMES`） |
| `exam_date` | 本体で設定した試験日 `YYYY-MM-DD`（無ければ付かない） |
| `anon` | 本体の匿名ID。**placement=sync のときだけ**付く（リマインド案内には付けない。プライバシーポリシー「本人が履歴を引き継ぐ操作をしたときだけ結びつける」） |

Studio 側でやること: 登録／ログイン → `anon` があればアカウントに紐づける（＝履歴同期。`history_sync` は本体で送信済み）→
`exam_date` を Studio の試験日に入れる → 毎朝3問のメール／プッシュを申し込ませる（`push_subscribed`）→
リンク先は本体の `/today/?exam={cert}`。`anon` は読んだら `history.replaceState` で URL から消す。

**この画面ができるまで、本体の接続リンクは出ない**（`NEXT_PUBLIC_STUDIO_CONNECT=1` で点灯）。

## 4. 環境変数と段階導入

| 変数 | 既定 | 効き方 |
|---|---|---|
| `STUDIO_INGEST_URL` / `STUDIO_INGEST_SECRET` | 未設定 | 未設定なら `/api/answer-log/` は受け取って捨てる。**入れた時点で収集開始** |
| `STUDIO_STATS_URL` | 未設定 | 未設定なら `/api/question-stats/` は空を返し、正答率バッジ・TOP10 は出ない |
| `NEXT_PUBLIC_STUDIO_CONNECT` | `0` | `1` で Studio 接続リンク（リマインド案内・履歴同期カード）を表示。ビルド時に焼き込み |

順番: ① 取り込みAPI（Studio）→ `STUDIO_INGEST_URL` 投入 → ② 集計API → `STUDIO_STATS_URL` → ③ `/connect` → フラグ ON。
①だけなら今週中に入る。②③は溜まってから。

## 5. 姉妹サイトへの横展開（設備 → 衛生 → 筋トレ）

移植するのは次の5ファイル相当。設計は変えず `site` 名だけ変える。

1. `lib/growth/anon-id.ts`（そのまま）
2. `lib/growth/answer-log.ts`（`ANSWER_LOG_SITE` を `setsubi` / `eisei` / `kintore` に）
3. `app/api/answer-log/route.ts`（`site` の検証値と資格IDの母集団をそのサイトのものに。静的書き出しのサイトは
   API ルートを持てないので、その場合は本体の `/api/answer-log/` に CORS を開けて `site` を受ける形にする）
4. `lib/growth/exam-date.ts` + `ExamDateChip`（資格トップ）
5. `ResultDecisionPanel`（模試結果面。講座オファーの有無はそのサイトのアフィリ表で判定）

GA4 のイベント名・パラメータ名は本体と同じにする（`docs/ga4-events.md`）。姉妹サイトの `course_click` は
`affiliate_click` に揃える（監査 F18）。設備は GA4 の設置と同時に入れる（方針 §6）。

## 6. 運営側の作業（コードでは直せない）

- GA4: `band` / `source` をカスタムディメンション（イベント）に登録。`result_view` `exam_date_set` `daily_complete` `history_sync` を確認
- Studio: §3 の3つを実装し、`STUDIO_INGEST_SECRET` を両側に入れる
- Search Console / Bing: 全サブドメインの登録、Studio の Bing 登録を `studio.shikakumon.com` に修正、IndexNow（方針 §6）
- 週1で見る数字: 方針書 §9。本体で新しく読めるようになるのは `result_view` → `affiliate_click` / `studio_click` の帯別の転換、
  `exam_date_set` の件数、`daily_start` → `daily_complete` の完了率

## 7. 次にやること（本書の範囲外で、方針 §6 に残っているもの）

| 施策 | 種別 | 備考 |
|---|---|---|
| 試験ガイド記事（福祉住環境2級・個人情報保護士・知財3級・貸金）と貸金／管業コラムのメタディスクリプション | 記事・文面 | 一次情報の確認が要る。既存コラムの書式に合わせる |
| 「試験日・合格率・勉強時間」コラムの表 + FAQ 構造化データ、コラム冒頭にサイト名＋問題数 | 記事・JSON-LD | Copilot の引用に固有名詞を乗せる |
| Studio LP の TRY IT サンプルを本体の主要資格に差し替え、`/pricing` は登録後に | Studio | Studio 方針書 §3 の実装順（計測 → 料金 → Free枠・復習・PWA → 味見）と一緒に |
| 「社内で使う」ページ（貸金＝金融、個情保＝総務、衛生管理者＝人事） | 記事 | Teams・ACOM 流入の受け皿 |
| 毎朝3問のプッシュ通知 | Studio | 本体には push の基盤（購読の保存・配信）が無い。Studio の push を流用する前提 |
