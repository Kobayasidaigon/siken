import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { SELLER, isSellerConfigured } from "@/lib/seller";
import { MOSHI2_PRODUCTS } from "@/lib/moshi2-products";

/**
 * 特定商取引法に基づく表記。2026-09-09 新設。
 *
 * 第2回模試(moshi2)を有料販売しているのに、このページが存在しなかった。
 * 通信販売の広告表示義務にかかるため、決済導線のあるサイトには必須。
 *
 * 事業者情報は src/lib/seller.ts の1か所に集約してある。氏名・住所・電話番号が
 * 未設定のあいだは「準備中」と断り、noindex にする(事実と違う表記を出すより害が小さい)。
 */

const configured = isSellerConfigured();

export const metadata: Metadata = pageMetadata({
  path: "/tokushoho/",
  title: "特定商取引法に基づく表記",
  description:
    "シカクモンで販売する有料コンテンツ（模擬試験 第2回）について、特定商取引法に基づく表記を掲載しています。販売価格、支払方法、提供時期、返品・キャンセルの取扱いなど。",
  // 未設定のうちは検索結果に出さない。埋まれば自動で index に戻る。
  noindex: !configured,
});

/** 価格の幅を商品定義から出す。個別に書くと値上げ時に食い違うため */
function priceRange(): string {
  const prices = Object.values(MOSHI2_PRODUCTS)
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => p.priceJpy);
  if (prices.length === 0) return "各商品ページに表示します";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const yen = (n: number) => `${n.toLocaleString()}円`;
  return min === max ? `${yen(min)}（税込）` : `${yen(min)}〜${yen(max)}（税込）`;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-[color:var(--c-border)] py-4 sm:grid sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-sm font-bold text-[color:var(--c-ink)] mb-1 sm:mb-0">{label}</dt>
      <dd className="text-sm text-[color:var(--c-text)] leading-relaxed">{children}</dd>
    </div>
  );
}

/** 未設定の必須項目はここで断る。空欄やダミーを出さない */
function Required({ value, note }: { value: string; note: string }) {
  if (value) return <>{value}</>;
  return (
    <span className="text-[color:var(--c-text-sub)]">
      準備中（{note}）。お手数ですが、それまでは
      <a href="/contact/" className="underline hover:no-underline">
        お問い合わせフォーム
      </a>
      よりご請求ください。遅滞なく書面または電子メールでお伝えします。
    </span>
  );
}

export default function TokushohoPage() {
  return (
    <div className="pb-16">
      <nav className="text-xs text-[color:var(--c-text-sub)] mb-4">
        <a href="/" className="no-underline hover:underline">
          ホーム
        </a>{" "}
        / <span>特定商取引法に基づく表記</span>
      </nav>

      <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--c-ink)] mb-2 font-serif">
        特定商取引法に基づく表記
      </h1>
      <div className="w-12 h-1 mb-5" style={{ background: "var(--c-accent)" }}></div>

      <p className="text-sm text-[color:var(--c-text-sub)] leading-relaxed mb-6 max-w-2xl">
        このページは、シカクモンで販売する有料コンテンツについての表記です。練習問題・模擬試験 第1回・コラムなど、
        サイトの大部分は無料で公開しており、これらのご利用に費用はかかりません。
      </p>

      {!configured && (
        <div
          className="mb-6 p-4 rounded-lg border text-sm leading-relaxed"
          style={{ borderColor: "var(--c-border)", background: "var(--c-bg-alt)" }}
        >
          <p className="font-bold text-[color:var(--c-ink)] mb-1">この表記は現在準備中の項目があります</p>
          <p className="text-[color:var(--c-text-sub)]">
            事業者の氏名・住所・電話番号について、記載の準備を進めています。
            記載が整うまでの間は、
            <a href="/contact/" className="underline hover:no-underline">
              お問い合わせフォーム
            </a>
            よりご請求いただければ、遅滞なく書面または電子メールでお伝えします。
          </p>
        </div>
      )}

      <dl className="border-t border-[color:var(--c-border)]">
        <Row label="販売業者">
          <Required value={SELLER.name} note="記載準備中" />
        </Row>
        <Row label="運営統括責任者">
          {SELLER.manager || <Required value={SELLER.name} note="記載準備中" />}
        </Row>
        <Row label="所在地">
          <Required value={SELLER.address} note="記載準備中" />
        </Row>
        <Row label="電話番号">
          <Required value={SELLER.phone} note="記載準備中" />
          {SELLER.phone && SELLER.phoneHours && (
            <span className="text-[color:var(--c-text-sub)]">（{SELLER.phoneHours}）</span>
          )}
        </Row>
        <Row label="お問い合わせ">
          {SELLER.email ? (
            <>
              {SELLER.email} ／{" "}
              <a href="/contact/" className="underline hover:no-underline">
                お問い合わせフォーム
              </a>
            </>
          ) : (
            <a href="/contact/" className="underline hover:no-underline">
              お問い合わせフォーム
            </a>
          )}
        </Row>
        <Row label="販売価格">
          {priceRange()}
          <br />
          商品ごとの価格は、各商品ページおよび決済画面に表示します。
        </Row>
        <Row label="商品代金以外の必要料金">
          ありません。インターネット接続に必要な通信料はお客様のご負担となります。
        </Row>
        <Row label="支払方法">
          クレジットカード決済（Stripe を利用します）。カード情報は当サイトを経由せず、Stripe が直接処理します。
        </Row>
        <Row label="支払時期">ご注文時にお支払いが確定します。</Row>
        <Row label="商品の引渡時期">
          決済の完了後、ただちにご利用いただけます。ダウンロード商品ではなく、購入されたブラウザで受験ページが解錠される形でご提供します。
        </Row>
        <Row label="動作環境">
          JavaScript と Cookie を有効にした最新版のブラウザ（Chrome / Safari / Edge / Firefox）。
          シークレットウィンドウ（プライベートモード）でのご購入はお控えください。ウィンドウを閉じた時点で受験権が失われます。
        </Row>
        <Row label="返品・キャンセルについて">
          <span className="font-bold text-[color:var(--c-ink)]">
            商品の性質上、決済完了後のお客様のご都合による返品・返金はお受けできません。
          </span>
          <br />
          購入した内容が表示されない、解錠できないなど、当サイト側の不具合により受験いただけない場合は、
          <a href="/contact/" className="underline hover:no-underline">
            お問い合わせフォーム
          </a>
          よりご連絡ください。確認のうえ、全額を返金します。
          <br />
          <span className="text-[color:var(--c-text-sub)]">
            ご購入前に、同じ形式・同じ合格基準の第1回模擬試験を無料でお試しいただけます。相性を確かめてからご判断ください。
          </span>
        </Row>
        <Row label="販売数量の制限">
          1つの商品につきお一人1回のご購入で、期間の制限なくご利用いただけます。買い切りで、継続課金はありません。
        </Row>
        <Row label="端末を変えるとき">
          購入時にお送りするメールのリンクから開き直してください（30日で5回まで。それを超えた場合も翌月には回復します）。
        </Row>
      </dl>

      <p className="text-xs text-[color:var(--c-text-sub)] mt-8 leading-relaxed max-w-2xl">
        シカクモン Studio（外部サービス）のご利用については、Studio 側の表記をご確認ください。
        本ページはシカクモン（{`shikakumon.com`}）で販売する有料コンテンツについての表記です。
      </p>
    </div>
  );
}
