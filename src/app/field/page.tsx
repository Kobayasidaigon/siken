import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "分野別 過去問一覧",
  description: "貸金業務取扱主任者試験の過去問を分野別に整理。貸金業法・利息制限法・民法・資金需要者保護。",
};

const fields = [
  { name: "貸金業法", slug: "kashikingyouhou", desc: "試験の中心分野。登録制度、業務規制、帳簿管理、取立て行為の規制などが出題される。全50問中20問以上を占める最重要分野。", icon: "📜" },
  { name: "利息制限法・出資法", slug: "risoku", desc: "上限金利、みなし利息、グレーゾーン金利、遅延損害金の計算など。数字の暗記が重要な分野。", icon: "💰" },
  { name: "民法・民事訴訟法", slug: "minpou", desc: "契約の成立と効力、保証、時効、強制執行、担保物権など。法律の基礎知識が問われる。", icon: "⚖️" },
  { name: "資金需要者等の保護", slug: "hogo", desc: "個人情報保護法、消費者契約法、不当景品類及び不当表示防止法に関する問題。", icon: "🛡️" },
];

export default function FieldIndexPage() {
  return (
    <div className="pb-16">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">分野別 過去問一覧</h1>
      <div className="space-y-4">
        {fields.map((f) => (
          <a key={f.slug} href={`/field/${f.slug}/`} className="card p-5 hover:shadow-md transition-shadow no-underline group flex gap-4 items-start">
            <span className="text-3xl">{f.icon}</span>
            <div>
              <p className="text-base font-bold text-slate-800 group-hover:text-blue-600">{f.name}</p>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">{f.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
