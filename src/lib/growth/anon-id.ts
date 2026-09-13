/**
 * 匿名ID と、回答ログ送信の可否。2026-09-13 追加(方針: docs/direction-2026-09.md §5-3)。
 *
 * 「利用データをコンテンツにする」ために、解答の正誤を Studio に集める。
 * 送るのは匿名ID・共通問題ID・正誤・解いた面・時刻だけで、氏名・メール・IP は
 * 送らない(§7 共通ルール)。匿名IDは端末内で生成した乱数で、アカウントや
 * 個人情報とは結びつかない。Studio 側で「履歴同期」をした人だけ、本人の操作で
 * 匿名IDが Studio のアカウントに紐づく。
 *
 * 学習履歴(study-progress.ts)そのものは従来どおり端末内だけに置く。
 * 「サーバには送信されません」と書いてきたのはあの履歴の話で、ここで送るのは
 * 統計用の正誤ログ。プライバシーポリシー(/privacy/)にその旨を分けて書いてある。
 *
 * 送らない人:
 *   - /study/ で「解答の記録を送らない」を選んだ人(端末内フラグ)
 *   - ブラウザが Global Privacy Control(GPC)を送っている人(同意なしのシグナルとして扱う)
 *   - localStorage が使えない環境(匿名IDが保てず、統計として意味を持たないため)
 */

const ANON_KEY = "shikakumon-anon-v1";
const OPTOUT_KEY = "shikakumon-answer-log-optout-v1";

function randomId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
      const b = new Uint8Array(16);
      crypto.getRandomValues(b);
      return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
    }
  } catch {
    /* 下の fallback へ */
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * 端末の匿名ID。無ければ作って保存する。保存できない環境では null
 * (その場かぎりのIDを返すと、同じ人が別人として数えられ統計を汚す)。
 */
export function getAnonId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const cur = localStorage.getItem(ANON_KEY);
    if (cur && /^[a-zA-Z0-9-]{8,64}$/.test(cur)) return cur;
    const id = randomId();
    localStorage.setItem(ANON_KEY, id);
    return localStorage.getItem(ANON_KEY) === id ? id : null;
  } catch {
    return null;
  }
}

/** 利用者が明示的に送信を止めているか(端末内フラグ) */
export function isAnswerLogOptedOut(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(OPTOUT_KEY) === "1";
  } catch {
    return true;
  }
}

export function setAnswerLogOptedOut(optOut: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (optOut) localStorage.setItem(OPTOUT_KEY, "1");
    else localStorage.removeItem(OPTOUT_KEY);
    window.dispatchEvent(new Event("shikakumon-answer-log-setting"));
  } catch {
    /* 保存できない環境では既定(送る)のまま。isAnswerLogEnabled が匿名IDの有無で止める */
  }
}

/** ブラウザの Global Privacy Control。送っている人には統計ログも送らない */
function hasGlobalPrivacyControl(): boolean {
  if (typeof navigator === "undefined") return false;
  return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

/** 回答ログを送ってよい状態か。匿名IDが保てる・オプトアウトしていない・GPC なし */
export function isAnswerLogEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (isAnswerLogOptedOut()) return false;
  if (hasGlobalPrivacyControl()) return false;
  return getAnonId() !== null;
}

/** 匿名IDを作り直す(＝これまでの記録と切り離す)。/study/ の設定から呼ぶ */
export function resetAnonId(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ANON_KEY);
  } catch {
    /* 消せなければそのまま */
  }
}
