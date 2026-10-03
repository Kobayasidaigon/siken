# 変更履歴

## 2026-10-03 本番形式テスト・模試の結果画面の Studio 枠の文言を点数に連動

本番形式テスト(`/<資格>/mock/`、`placement=mock_result`)と模擬試験(`/<資格>/moshi/`、`moshi_result`)の結果画面の
Studio 枠は、最弱分野だけで文言が決まり、合格ラインに届いたか・全問正解かに関係なく「◯◯を、いま10問だけ解く」だった
(本番形式テストは全問正解でも正答率 100% の分野をそのまま差し込んでいた)。点数を見た直後の人に向けて、
合格ライン未達 / 到達 / 全問正解の 3 通りに出し分け、合格ラインとの差(問別配点の模試は点)・間違えた数・最弱分野の正答数を入れた
(`studio-cta.ts` の `studioResultCopy`。両画面で共有)。
文言は行き先で本当にできることに合わせた。本体で間違えた問題は Studio に取り込まれないので「間違えた問題を Studio で復習」とは書かない。
問題を作るには無料登録が要ることを本文とリンクに書く。資格別 LP は `?theme=` を登録後に引き継がないので「分野が入った状態で開く」とは書かない。
「登録なしの1問」は資格別 LP のある資格だけ(LP の無い賃管士・管業・情報セキュリティ管理士・教員採用・社会福祉士では出さない)。
枠の位置・大きさ・色・リンク先(`studioMoshiHref`)・`placement`・講座広告・`StudioLink`・イベントは変えていない。
ヘッダー・フッターの Studio リンク(下の項目)もこの画面に出るので、効果は `studio_click` / `studio_cta_impression` の
`placement=mock_result` / `moshi_result` に絞って見る。Studio 側の計画は shikakumon-studio の `docs/growth/phase0.md` §5 の 2-9。

## 2026-10-03 ヘッダー・フッター・コラム末尾の Studio リンクを資格別の行き先に

ヘッダー(PC 表示の「Studio AI」)とフッターの Studio リンクはどのページでも Studio のトップ `/` 行きで、
資格のページの上でも資格を引き継いでいなかった(28日で header 23・footer 33 クリック)。資格のページ
(`/<資格>/…`、貸金の `/q/`・`/field/`・`/exam/`・`/topic/`、資格のコラム)では、問題結果の枠と同じ `studioCtaFor` の
行き先(資格別 LP。LP の無い資格はトップに `?exam=<正式名>`)にした。layout はパスを知らないので、リンクだけを
`usePathname` で読むクライアント部品 `StudioNavLink` に切り出した(判定は `studio-cta.ts` の `certFromPath`)。
見た目・文言・`placement`・`utm_content`(header / footer)は従来のまま。`studio_click` / `studio_cta_impression` に `exam` が入る。
資格でないページ(トップ・コラム一覧・学習履歴・about など)は従来どおりトップ。
コラム末尾(column_footer)も、LP の無い資格(賃管士・管業)と接頭辞の無い旧形式の貸金コラム 7 本で資格を取るようにした
(賃管士・管業はトップに `?exam=`、旧形式の貸金コラムは貸金の LP と貸金の文言)。スマホのナビと about 本文のリンクは変えていない。
Studio 側の計画は shikakumon-studio の `docs/growth/phase0.md` §5 の 2-4。

## 2026-10-03 Studio 送客リンクの表示計測(studio_cta_impression)

Studio への送客(`studio_click`)は 9/8 から測っているが、表示回数が無く「押されない」のか「見られていない」のかを
分けられなかった(問題ページの枠は「次の問題へ」より下にある)。`StudioLink` に A8 の `cta_impression` と同じ作りの
表示計測を足した(アンカー自身が 50% 以上見えたら 1 回だけ。DOM は増やしていない)。
パラメータは `studio_click` と同じ `placement` / `exam`。見た目・リンク先・広告枠は変えていない。
Studio 側の計画と判定は shikakumon-studio の `docs/growth/`。

## 2026-09-25 AdSense 再申請の準備(問題ページの noindex・サイトの紐付け・運営者ページ)

5月に審査NG、6月に広告0枚のままスクリプトが表示を遅くしていたため AdSense を撤去していた(`ccc09b4`)。
再申請に向けて次を入れた。

- **問題ページ(`/q/`・`/<資格>/q/`、17資格 3,970URL)を noindex(follow は維持)にし、sitemap から外した**。
  検索クリックの実測(`seo-report/probe-adsense-noindex-0925.mjs`)で、Google は28日 2,447 クリック中 54(2.2%)、
  Bing は本体のみ約2ヶ月 1,178 クリック中 0。流入はコラム(Google 55%・Bing 82%)と資格トップ(39%・16%)でほぼ全部だった。
  同じ型のページ4千枚は、サイト全体の評価(AdSense の審査を含む)を下げる側に働くと判断した。
  ページ自体は残るので、サイト内の導線・講座枠・計測は変わらない。sitemap は 4,328→358URL。
  `generate-sitemap.js` は `/q/` を含むURLを自動で除外するので、資格を増やしても戻らない。
- **AdSense とサイトの紐付け**: `NEXT_PUBLIC_ADSENSE_PID` があるときだけ `<meta name="google-adsense-account">` と
  `/ads.txt` を出す(`src/lib/adsense.ts`・`src/app/ads.txt/route.ts`)。広告スクリプト(adsbygoogle.js)は承認後に入れる。
- **プライバシーポリシー**: 同じ条件で「広告配信について」(Google AdSense・第三者配信の Cookie・無効化の方法)を出す。
- **運営者ページ**: 「条文番号を引きながら一から書き起こす」を実際の作り方に合わせて書き直した
  (AI で下書き → 別工程で1問ずつ条文・公式資料と照合 → 正解位置・選択肢の長さの偏りを機械検査 → 公開済みの点検し直し)。
- 未実施: AdSense 画面での再審査リクエスト(ユーザー)。承認後に広告スクリプトと広告枠を入れる(置き場所は「広告は控えめに」の方針に合わせて決める)。
  効果の観測は `seo-report/watchlist.json` の `shikakumon-question-noindex-0925`(再確認 2026-10-23)。

## 2026-09-21 第2回模試(有料)の購入導線を改修

GA4 直近28日(2026-08-23〜09-19)で、第1回模試の完了者→第2回オファーのクリックが約1〜5%、
販売ページ到達者の平均エンゲージメント13秒、`moshi2_checkout_start` 0・購入 0 だったため、
訴求を「2回目の実力測定」から「本番前の最終確認・弱点が埋まったかの確認」に変えた。

- **結果画面のオファー(`Moshi2Offer`)**: 判定別(未達/あと一歩/合格圏)に見出し・本文を出し分け。
  得点差・最弱分野・正答率・試験日までの日数(日程がある資格のみ)を差し込む。
  ボタンから価格を外し(「第2回模試の内容を見る →」)、価格は注記へ。「サンプル問題を見る」を追加。
  イベントに `verdict` / `days_to_exam` を追加。位置は変えていない。
- **資格トップの CTA(`Moshi2TopCard` / `Moshi2TopLink`)**: 「第2回模試(本番前の最終確認)→」+小さく価格。
  遷移に `?src=landing`(結果画面からは `?src=result`)。
- **販売ページ(`/<cert>/moshi2/`)**: 仕様表を廃し、H1+リード / こんな方 / 含まれるもの /
  サンプル問題(`#sample`) / 作問方針 / 価格ボックス / FAQ / 第1回への戻し口(1か所) の順に。
  赤字の警告(シークレットウィンドウ・30日5回・返金不可)を購入ボックスから FAQ へ移し、
  ボタン直下は肯定形の安心3行だけにした。title は「{資格名} 第2回模擬試験（本番形式・全問解説・弱点診断）」。
  価値の節はサーバー側で組んで `Moshi2Gate` に `pitch` として渡し、購入済みの人には出さない。
- **計測**: `moshi2_page_view{src}` / `moshi2_sample_open` / `moshi2_price_view` を追加。
  `moshi2_checkout_start` は `transport_type: beacon`。`purchase`(GA4 標準 e コマース)を
  `transaction_id` つきで送り、Stripe テストモードの決済では送らない。
- 判定の閾値・残り日数・送信は `src/lib/moshi2-funnel.ts` に集約。
- 未実施: GA4 カスタム定義(`src` / `days_to_exam` / 本体の `place`)の登録
  (`seo-report/register-ga4-dims.mjs --apply`)。価格変更・返金保証・メール獲得は次フェーズ。
