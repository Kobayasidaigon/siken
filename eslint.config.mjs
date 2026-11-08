import next from "eslint-config-next/core-web-vitals";

export default [
  ...next,
  {
    ignores: [".next/**", "node_modules/**", "public/**", "scripts/**", "next-env.d.ts"],
  },
  {
    rules: {
      // localStorage の学習履歴をマウント後に読んで state に入れる書き方をサイト全体で使っている
      // (サーバーで描いた HTML と食い違わせないため)。React Compiler 向けのこの規則は
      // その書き方も一律にエラーにするので、警告にとどめる。
      "react-hooks/set-state-in-effect": "warn",
      // 模試の残り時間表示で Date.now() を描画中に読んでいる。表示用で、ずれても次の描画で直る
      "react-hooks/purity": "warn",
      // 問題文の図や広告バナーは外部・静的な画像で、next/image の最適化を通す必要がない
      "@next/next/no-img-element": "off",
    },
  },
];
