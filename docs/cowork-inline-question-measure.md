# Cowork に渡すプロンプト（1問カードの効果測定と、試験前の10問の途中経過）

2026-11-11 作成。`/column/fukushi2-goukakuritsu/` の「その場で解ける1問」（`lib/inline-questions.ts`、2026-10-24 設置・PR #27 で本番反映）の
効果を、導入前の数字と比べる。あわせて、11/8 に窓が開いた賃管士の「試験前の10問」の途中の数字も見る。下の枠の中をそのまま Cowork に貼る。

導入前（9/26〜10/23、28日）: このページを入口にしたセッション 217、そのうち問題を解き始めた割合 14%、アフィリエイトのクリック 2件。

```
シカクモン（https://shikakumon.com）の GA4（プロパティ 537254382）で、数字を出してください。

## 守ること
- 見るだけ。設定は何も変えない。
- 探索レポートは使ってよいが、使い終わったら削除する（探索の一覧を元の数に戻す）。
- 見つからない・読み取れないときは推測で埋めず「未取得（理由）」と書く。
- 報告はすべて日本語で書く。

## A. 合格率コラムの1問カード
対象ページ: /column/fukushi2-goukakuritsu/
期間は2つ: 導入後 2026-10-25〜2026-11-10（17日）と、比較用の導入前 2026-09-26〜2026-10-23（28日）。

1. このページを入口（ランディングページ）にしたセッション数と、そのうち question_answered イベントがあったセッションの数と割合。
2. question_answered のうち、placement が column_inline_q のものの件数（導入後だけ）。
3. practice_link_click のうち、placement が column_inline_q のものの件数を、kind 別（next_question / explanation）に（導入後だけ）。
   kind はカスタムディメンションに未登録なので、出せなければ合計だけでよい。
4. このページを入口にしたセッションでの affiliate_click と studio_click の件数（2つの期間とも）。
5. 参考: 同じ期間・同じ指標（1 と 4）を、/column/fukushi2-nittei/ と /column/eco-nanido/ でも（カードを置いていないページの比較用）。

## B. 試験前の10問の途中経過（賃管士、窓は 2026-11-08〜11-15）
期間: 2026-11-08〜2026-11-10。
1. イベントの件数を、exam 別（chintai・kangyo・chizai）に: shikenmae_view（placement 別: event / shared / archive）、
   shikenmae_start、shikenmae_complete、shikenmae_entry_click（placement 別）。
2. share_click のうち placement が shikenmae_result のものの件数を、channel 別・with_score 別に。
3. セッションのキャンペーン（utm_campaign）が shikenmae のセッション数を、参照元（utm_source: x / line / share / copy）別に。

## 報告の形
A と B の見出しごとに表で。最後に、取れなかったものだけを箇条書きで。
```

## 結果が届いたら（開発側）
- A-1 の割合が導入前の 14% より上がり、A-5 の比較ページで同じほど上がっていなければ、カードが効いたとみる。
  効いていれば `lib/inline-questions.ts` に eco-nanido → jitsumu-iminai を1件ずつ足す（1ページにつき変更は1つ、足した日を記録）。
- A-4 のアフィリエイトのクリックが減っていないかも見る。
- B は窓の途中の数字。続けるかの判断は、管業の窓が閉じたあと（12/7 ごろ）に2回分で行う（`docs/share-campaign-design.md`）。
