# Cowork に渡すプロンプト（AdSense 再審査の前の確認）

2026-11-10 作成。AdSense が「有用性の低いコンテンツ」で不承認になった件の直し（薄いページの noindex・広告外し・説明文・メニュー）を
本番に出したあとに使う。開発環境からは Search Console・AdSense・Vercel の管理画面が見えないので、Cowork に見てもらう。
下の枠の中をそのまま Cowork に貼る。結果を開発側に貼れば、残りの直しと再申請の時期を決める。

再審査の申込（AdSense の「審査をリクエスト」）は、ユーザーが自分で押す。Cowork には押させない。
申し込んだ日と結果が届いた日は、CHANGELOG.md の「AdSense 再審査の記録」に書き足す。

```
シカクモン（https://shikakumon.com）の、AdSense 再審査の前の確認をお願いします。

## 守ること
- すべて見るだけ。設定は変えない。AdSense の「審査をリクエスト」「修正済み」などのボタンは押さない。
  Search Console の「インデックス登録をリクエスト」も押さない（押すかどうかは運営者が決めます）。
- ID・パスワード・メールアドレス・氏名・電話番号・住所・支払い情報を報告に書かない。
- 見つからない・読み取れないときは推測で埋めず「未取得（理由）」と書いて次へ進む。

## A. 本番での見え方（パソコンの Chrome で）
次の URL を開き、表の形で報告してください: URL／開けたか（HTTP の状態が分かれば）／noindex か／気づいたこと。
noindex かどうかは、ページを右クリック →「ページのソースを表示」で `name="robots"` を検索し、
`content="noindex, follow"` があれば noindex、無ければ「index」と書く。
1. https://shikakumon.com/ （「このサイトでできること」の欄があるか。数字の欄に「記事の最終更新」と日付が出ているか）
2. https://shikakumon.com/about/ （「問題と解説の作り方」に、資格ごとの確認の範囲が書いてあるか）
3. https://shikakumon.com/hajimete/ （開けるか。index のはず）
4. https://shikakumon.com/fukushi2/ （index のはず。「試験の概要」の下に公式サイトへのリンクがあるか）
5. https://shikakumon.com/fukushi2/field/society/ （分野ページ。要点の本文が無い間は noindex。本文が入ったあとは index で、講座の広告が無いこと）
6. https://shikakumon.com/fukushi2/mock/ （本番形式テスト。noindex のはず）
7. https://shikakumon.com/topic/kinshi-koui/ （論点まとめ。noindex のはず。講座の広告が無いこと）
8. https://shikakumon.com/exam/0/ （noindex のはず）
9. https://shikakumon.com/exam/5/ （ページが無い＝404 になるはず）
10. https://shikakumon.com/calendar/2026-10/ （終わった月。noindex のはず）
11. https://shikakumon.com/sitemap.xml （`<loc>` の数。300件前後のはず。/mock/・/topic/・/exam/ を含む URL が無いか）
12. どのページでもよいので一番下のフッター: 「合格報告」が無く、「はじめての方へ」「試験日程」「免責事項」があるか。
    ヘッダー（パソコンの幅）の「資格一覧」を押すと、トップの資格の一覧に移るか。

## B. Search Console（https://search.google.com/search-console 、プロパティは shikakumon.com）
1. 「URL 検査」で次の5つを1つずつ調べ、「公開 URL をテスト」（ライブテスト）を押して結果を書く:
   https://shikakumon.com/ ・ https://shikakumon.com/about/ ・ https://shikakumon.com/hajimete/ ・
   https://shikakumon.com/fukushi2/ ・ https://shikakumon.com/column/fukushi2-goukakuritsu/
   報告: URL／「URL は Google に登録できます」などの判定／ページの取得（成功・失敗）／インデックス登録の許可（はい・いいえ）／
   Google が最後にクロールした日（「Google インデックスに登録済みのページ」側の日付）。
2. 「ページ」（インデックス作成 → ページ）: 登録済みのページ数と、未登録の理由の上位5つ（理由と件数）。
   「noindex タグによって除外されました」の件数が分かれば書く。
3. 「サイトマップ」: 送信済みのサイトマップの URL、最終読み込み日、ステータス、検出された URL の数。
4. 「手動による対策」「セキュリティの問題」: 問題があるかどうか（あれば見出しだけ）。

## C. AdSense（https://adsense.google.com/）
1. 「サイト」でのシカクモンの状態（例: 要確認・準備中・承認済み）と、表示されている理由の文言（短く）。
2. 前回の不承認の通知の日付と、再審査を申し込んだ日（どちらも画面やメールの一覧で分かる範囲で）。
3. 「ポリシー センター」に出ている問題（あれば見出しだけ）。
4. ads.txt の状態（「承認済み」「見つかりません」「不明」など）。

## D. Vercel（https://vercel.com/ のプロジェクト。プロジェクト名は siken または shikakumon のはず）
1. 「Settings → Deployment Protection」: Vercel Authentication などの保護が、本番・プレビューのどちらに付いているか（付いている／付いていない）。
2. 「Settings → Domains」: shikakumon.com のほかに、*.vercel.app のアドレスで本番が見られる設定になっているか（ドメインの一覧を書き取る。リダイレクトの有無も）。
3. 「Firewall」: ボット対策（Bot Protection・Attack Challenge Mode など）が有効になっているか。有効なら、その名前だけ。

## 報告の形
A〜D をそれぞれ表か箇条書きで。最後に「気になったこと」を3行以内で。
```

## 結果を受け取ったら（開発側）

- A で noindex・404・sitemap が想定と違えば、デプロイが反映されているか（Vercel の本番のコミット）から確かめる。
- B のライブテストで「ページの取得: 失敗」や「インデックス登録の許可: いいえ」が主なページに出たら、再審査の前に直す。
- C の日付を CHANGELOG.md に書く。不承認の理由が「有用性の低いコンテンツ」以外に変わっていたら、報告書の該当する節から見直す。
- D で Vercel Authentication が本番に付いている、または Bot Protection が Google のロボットを止めうる設定なら、運営者と相談して外す。
- 再審査の申込は、主なページが新しい版で読まれたこと（B の1）を確かめてから、数週間（目安。公式の決まりは無い）おいて行う。
