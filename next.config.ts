import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export" は外してある。第2回模試(有料)の決済・受験権の検証・配信に
  // APIルートが必要で、静的書き出しではサーバー側の処理を持てないため。
  // ページは引き続きビルド時に静的生成される(Vercel上のSSG)ので、表示と速度は
  // 変わらない。静的ホスティングへ移す場合はこの前提が崩れる点に注意。
  trailingSlash: true,
};

export default nextConfig;
