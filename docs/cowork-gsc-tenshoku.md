# Cowork に渡すプロンプト（転職エージェント比較ページの Search Console 登録）

2026-11-14 作成。`/chintai/tenshoku/`（賃貸不動産経営管理士を活かせる仕事と転職エージェント比較）を本番に出したあとに使う。
開発環境からは Search Console が見えないので、Cowork に頼む。下の枠の中をそのまま Cowork に貼り、結果を開発側に貼る。
資格を足したら、URL の行を足して同じように使う。

```
シカクモン（https://shikakumon.com）に新しく公開したページを、Google Search Console に登録してください。

## 守ること
- 押してよいのは、下に書いた URL の「インデックス登録をリクエスト」と、サイトマップの「送信」だけ。ほかの設定は変えない。
- ID・パスワード・メールアドレス・氏名・電話番号・住所・支払い情報を報告に書かない。
- 見つからない・読み取れないときは推測で埋めず「未取得（理由）」と書いて次へ進む。

## A. 本番での見え方（パソコンの Chrome で）
1. https://shikakumon.com/chintai/tenshoku/ を開き、開けたか、見出し「賃貸不動産経営管理士を活かせる仕事と転職エージェント比較」があるか、
   比較表に「宅建Jobエージェント」が1行あるかを書く。
2. ページを右クリック →「ページのソースを表示」で `name="robots"` を検索し、`noindex` があるかを書く（無いはず）。
3. https://shikakumon.com/sitemap.xml を開き、`https://shikakumon.com/chintai/tenshoku/` が含まれているかを書く。
4. https://shikakumon.com/chintai/ の下のほうに「合格したあとに」の欄があり、押すと 1. のページに移るかを書く。

## B. Search Console（https://search.google.com/search-console 、プロパティは shikakumon.com）
1. 左の「サイトマップ」で `sitemap.xml` を送信し直す。送信後の「ステータス」と「検出されたページ数」を書く。
2. 上の「URL 検査」に https://shikakumon.com/chintai/tenshoku/ を入れ、「公開 URL をテスト」を押す。
   「URL は Google に登録できます」かどうか、ページの取得・インデックス登録の可否の表示をそのまま書く。
3. 2. で登録できると出たら「インデックス登録をリクエスト」を押し、「リクエスト済み」の表示が出たかを書く。
   登録できないと出たら押さずに、理由の表示をそのまま書く。

## 報告の形
A の4項目と B の3項目を、番号ごとに1〜2行で。
```
