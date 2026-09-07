/**
 * トピック別のまとめページ(トピックハブ)の定義。2026-09-07 追加。
 *
 * 背景: 同じ論点の問題が3〜10問ずつ並んでいる論点があり、その問題ページの
 * タイトルが「<論点>｜<資格> 練習問題 問N」で、問番号しか違わない状態だった。
 * 実測で個人情報保護士は110枚、貸金業務取扱主任者は129枚がこれに当たる。
 * 同じ検索語に対して自サイトのページどうしが並び、互いに順位を食い合う。
 *
 * 対策として、論点ごとに1枚だけ「その論点の問題を全部集めた面」を作る。
 * 「匿名加工情報 練習問題」のような検索語に答えるのはこのページで、
 * 個々の問題ページはそこから辿る構造にする。既存の /field/ は分野(3〜4個)の
 * 粒度で、論点(11〜24個)より一段粗いため、この面は重複ではない。
 *
 * 対象は3問以上ある論点だけ。1〜2問の論点でページを作ると、
 * リンクが数本あるだけの薄いページを200枚増やすことになる。
 *
 * スラッグは手で決める(既存の fieldSlugMap と同じ流儀)。論点名は日本語なので
 * 自動変換すると読めない URL になる。ここに無い論点はページを作らない。
 */
import type { ExamSlug } from "./study-progress";

export interface TopicHub {
  /** URL に使う。既存の分野スラッグと同じヘボン式ローマ字 */
  slug: string;
  /** 問題の title の「｜」より後ろと完全に一致させること。ここが照合キー */
  topic: string;
  /** 属する分野。パンくずと分野ページへの導線に使う */
  field: string;
}

/** 個人情報保護士。/pii/topic/<slug>/ */
export const PII_TOPIC_HUBS: TopicHub[] = [
  { slug: "jigyousha", topic: "個人情報取扱事業者の定義と義務の概要", field: "個人情報保護法" },
  { slug: "riyou-mokuteki", topic: "利用目的の特定・通知・公表", field: "個人情報保護法" },
  { slug: "tekisei-shutoku", topic: "適正な取得・利用目的の制限", field: "個人情報保護法" },
  { slug: "daisansha-teikyou", topic: "第三者提供の制限・オプトアウト", field: "個人情報保護法" },
  { slug: "gaikoku-teikyou", topic: "外国にある第三者への提供", field: "個人情報保護法" },
  { slug: "teikyou-kiroku", topic: "第三者提供の記録義務", field: "個人情報保護法" },
  { slug: "kamei-kakou", topic: "仮名加工情報", field: "個人情報保護法" },
  { slug: "tokumei-kakou", topic: "匿名加工情報", field: "個人情報保護法" },
  { slug: "mynumber-kiso", topic: "マイナンバー法の基礎", field: "マイナンバー法" },
  { slug: "security-kyoui", topic: "情報セキュリティの脅威の概要", field: "情報セキュリティ" },
  { slug: "cyber-kougeki", topic: "不正アクセス・サイバー攻撃の種類と対策", field: "情報セキュリティ" },
];

/** 貸金業務取扱主任者。問題ページが /q/ 直下なので、ハブも /topic/<slug>/ に置く */
export const KASHIKIN_TOPIC_HUBS: TopicHub[] = [
  { slug: "kinshi-koui", topic: "貸金業者の禁止行為", field: "貸金業法" },
  { slug: "haigyou-todokede", topic: "廃業等の届出", field: "貸金業法" },
  { slug: "riyousha-hogo", topic: "利用者の利益の保護", field: "貸金業法" },
  { slug: "seimei-hoken", topic: "生命保険契約の締結の制限", field: "貸金業法" },
  { slug: "kousei-shousho", topic: "公正証書作成の制限", field: "貸金業法" },
  { slug: "hakushi-ininjou", topic: "白紙委任状の取得制限", field: "貸金業法" },
  { slug: "meigi-gashi", topic: "名義貸しの禁止", field: "貸金業法" },
  { slug: "shoumeisho-keitai", topic: "証明書の携帯", field: "貸金業法" },
  { slug: "hyoushiki-keiji", topic: "標識の掲示", field: "貸金業法" },
  { slug: "shuninsha-secchi", topic: "貸金業務取扱主任者の設置義務", field: "貸金業法" },
  { slug: "jougen-kinri", topic: "利息の上限金利", field: "利息制限法・出資法" },
  { slug: "shoumetsu-jikou", topic: "消滅時効", field: "民法・民事訴訟法" },
  { slug: "hoshou-keiyaku", topic: "保証契約", field: "民法・民事訴訟法" },
  { slug: "rentai-hoshou", topic: "連帯保証", field: "民法・民事訴訟法" },
  { slug: "bensai", topic: "弁済・弁済の提供", field: "民法・民事訴訟法" },
  { slug: "fuhou-koui", topic: "不法行為", field: "民法・民事訴訟法" },
  { slug: "teitouken", topic: "抵当権", field: "民法・民事訴訟法" },
  { slug: "shichiken", topic: "質権", field: "民法・民事訴訟法" },
  { slug: "souzoku", topic: "相続", field: "民法・民事訴訟法" },
  { slug: "seigen-kouiryoku", topic: "制限行為能力者", field: "民法・民事訴訟法" },
  { slug: "kinshou-hou", topic: "金融商品取引法の基礎", field: "資金需要者等の保護" },
  { slug: "keihyou-hou", topic: "景品表示法の具体例", field: "資金需要者等の保護" },
  { slug: "tajuu-saimu", topic: "多重債務者対策", field: "資金需要者等の保護" },
  { slug: "shouhisha-kihonhou", topic: "消費者基本法", field: "資金需要者等の保護" },
];

const BY_EXAM: Partial<Record<ExamSlug, TopicHub[]>> = {
  pii: PII_TOPIC_HUBS,
  kashikin: KASHIKIN_TOPIC_HUBS,
};

/** 資格ごとのハブ一覧。無い資格は空配列 */
export function topicHubsFor(exam: ExamSlug): TopicHub[] {
  return BY_EXAM[exam] ?? [];
}

/** 問題の title から論点(「｜」の後ろ)を取り出す。問題ページとハブで同じ規則を使う */
export function topicOfTitle(title: string): string {
  const parts = title.split("｜");
  return parts[parts.length - 1].trim();
}

/** その問題が属するハブ。無ければ null(3問未満の論点はハブを作っていない) */
export function hubForQuestion(exam: ExamSlug, title: string): TopicHub | null {
  const topic = topicOfTitle(title);
  return topicHubsFor(exam).find((h) => h.topic === topic) ?? null;
}

/** ハブページのパス。貸金だけ問題ページと同じくルート直下に置く */
export function topicHubPath(exam: ExamSlug, slug: string): string {
  return exam === "kashikin" ? `/topic/${slug}/` : `/${exam}/topic/${slug}/`;
}
