# GA4 のイベント台帳

シカクモン本体が送っているイベントの一覧と、管理画面側でやらないと数字が見えないことの控え。
2026-09-07 作成。

**イベントを足したら、この表にも足すこと。** どこで何を測っているかの一覧がどこにも無いと、
同じものを別の名前で二重に測ったり、逆に「測っているつもり」で測れていなかったりする。
実際、Studio への送客は6箇所すべてで1件も測れておらず、「問題を解いた」という中核行動も
無計測のまま数か月動いていた（`docs/affiliate-growth-audit.md` §5.2 の E・F）。

## 先に済ませること（コードでは直せない）

パラメータは、GA4 側でカスタムディメンションとして登録しないとレポートに出ない。
**登録した時点より前のデータは遡って見られない**ので、増やしたら早めに登録する。

| 登録するもの | 範囲 | なぜ |
|---|---|---|
| `course` | イベント | どの資格の広告が成果を出しているかの分解。A8 の管理画面とは別に本体側でも要る |
| `placement` | イベント | 面ごとの比較。この台帳のいちばんの用途 |
| `exam` | イベント | 資格別の分解。`course` と値域はほぼ同じだが別のパラメータ |
| `result` | イベント | 正解／不正解の比 |
| `kind` | イベント | 模試・本番形式テストなど、リンク先の種類 |
| `mode` / `round` | イベント | 模試の第1回と第2回（有料）の区別 |

キーイベント（旧コンバージョン）にすると良いもの：`affiliate_click` / `studio_click` / `purchase` /
`pass_report_submit`。

## 収益

GA4 の「収益」は **`purchase` イベントの `value` と `currency` からしか積まれない**。
独自名のイベントに金額を載せてもレポートの売上にはならない。
有料模試はこれを知らずに独自名だけで送っていたため、売上がずっと 0 円だった（2026-09-07 に修正）。

`moshi2_purchase_complete`（従来の独自名、過去データとの連続性のために残す）と
`purchase`（標準イベント、収益に積まれる）を両方送っている。二重計上にはならない。
`purchase` の `transaction_id` には Stripe の決済セッションIDを入れているので、
購入直後にリロードされても売上が二重に積まれない。

## イベント一覧

### 学習

| イベント | 発火する場所 | パラメータ |
|---|---|---|
| `question_answered` | 問題ページで答え合わせ | `exam`, `result`(correct/wrong/revealed) |
| `next_q_click` | 「次の問題へ」 | `exam` |
| `practice_link_click` | 問題ページから模試・本番形式テスト・コラムへ | `exam`, `kind`(mock/moshi/column), `placement`(question_mid/question_end) |
| `mock_start` | 本番形式テストの開始（全14資格が共有） | `exam`, `size` |
| `mock_complete` | 同 採点 | `exam`, `size`, `correct`, `score_bucket`, `passed` |
| `moshi_start` / `moshi_complete` | 模擬試験。`round` で第1回（無料）と第2回（有料）を区別する | `exam`, `round`, `mode`, `score`, `size`, `score_bucket`, `passed`, `timeout`, `minutes` |
| `drill_start` | 復習ドリルの開始 | `exam`, `size`, `bronze`, `silver` |
| `drill_next` | ドリルの次の問題へ | `exam` |
| `drill_complete` | ドリルを解き終えた | `exam`, `size` |
| `progress_export` / `progress_import` | 学習履歴の書き出し・読み込み | `mode`(merge/replace) |
| `share_click` | 模試結果の共有 | `exam`, `channel`, `place` |

`place` と `placement` が別名で併存している。`place` は模試の共有ボタンだけが使う古い名前で、
収集済みデータとの連続性のために残してある。新しいイベントでは `placement` を使うこと。

### 広告・送客

| イベント | 発火する場所 | パラメータ |
|---|---|---|
| `cta_impression` | A8 の広告リンクが画面に入ったとき | `course`, `placement` |
| `affiliate_click` | A8 の広告リンクのクリック | `course`, `placement` |
| `studio_click` | シカクモン Studio への送客（全9箇所） | `placement`, `exam` |
| `countdown_view` | 試験日・申込締切のカウントダウンの表示 | `mode`(apply/exam), `days_left`, `path` |
| `calendar_add` | 試験日・締切をカレンダーに追加 | `kind`(apply/exam), `target`(google/ics), `placement` |
| `column_scroll_75` | コラムを 75% まで読んだ | `article` |

`studio_click` の `placement` は **`affiliate_click` と同じ語彙**（`question_result` /
`moshi_result` / `mock_result` / `column_footer` など）にしてある。
同じ面の A8 と Studio を並べて比べるためで、`utm_content` とは別物。
答え合わせ直後の枠は `utm_content` が `quiz_<資格>` だが `placement` は `question_result`。
`utm_content` は Studio 側の仕様に固定されているので動かせない。

`course` の値域は資格IDとほぼ同じだが、コラムでは `agaroot-*` のような広告主別の値も渡している。

資料請求・無料体験などの低摩擦オファー（`FreeLeadCTA`）は独自イベントを持たない。
`AffiliateLink` をそのまま使い、`placement` に `_free` を付けた
`affiliate_click`（例 `question_result_free`）として記録される。
有料講座への導線と同じイベントで並ぶので、比べるときは `placement` の接尾辞で分ける。

### 有料模試

| イベント | 発火する場所 | パラメータ |
|---|---|---|
| `moshi2_offer_impression` / `moshi2_offer_click` | 第1回模試の結果画面に出す第2回の案内 | `cert` |
| `moshi2_checkout_start` | 購入ボタン | `cert` |
| `begin_checkout` | 同上（GA4 標準） | `currency`, `value`, `items` |
| `moshi2_purchase_complete` | 決済からの復帰 | `cert` |
| `purchase` | 同上（GA4 標準。**収益に積まれるのはこちら**） | `transaction_id`, `currency`, `value`, `items` |
| `moshi2_restore` | 受験用リンクからの復元 | `cert` |

### 合格報告

| イベント | 発火する場所 | パラメータ |
|---|---|---|
| `pass_report_cta_click` | 資格トップの報告のお願い | `exam` |
| `pass_report_submit` | 投稿フォームの送信 | `exam`, `result` |

### その他

`moshi_format_feedback`（模試の形式が本試験に近かったか）、
`moshi_round2_interest`（第2回への関心）。どちらも `exam`, `round`, `verdict`。

## 書き方の決まり

- 送信は必ず `try/catch` で囲む。GA が読み込まれていなくても、学習・採点・遷移を妨げない。
  とくに `MoshiExam` の採点処理は、例外が出ると**答案が失われたうえ採点ボタンも二度と効かない**
  位置に送信があるので、素の `sendGAEvent` を直接呼ばないこと（`track()` を使う）。
- **カーディナリティの高い値をパラメータに入れない。** 問題のスラッグは 3,370 通りあるので送らない。
  資格・分野くらいまでに抑える。
- 得点は素点だけでなく、分母（`size`）と5点刻みに丸めた得点率（`score_bucket`）を併せて送る。
  出題数が資格ごとに違うので、素点だけでは資格をまたいだ比較ができない。
- イベント名は動詞を含むスネークケース（`affiliate_click`, `question_answered`）。
- 既存イベントの名前とパラメータ名は、収集済みデータが切れるので変えない。足すのはよい。
