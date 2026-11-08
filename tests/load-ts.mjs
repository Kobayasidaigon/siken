// テストから src/lib の TypeScript をそのまま読み込むための小さなローダー。
// typescript で CommonJS に変換して実行する。相対 import("./x")は同じ方法で辿る。
// "@/..." の別名 import を含むファイルは読めないので、テスト対象は相対 import だけのものにする。
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import ts from "typescript";

const nodeRequire = createRequire(import.meta.url);
const cache = new Map();

export function loadTs(file) {
  const abs = path.resolve(file);
  if (cache.has(abs)) return cache.get(abs).exports;
  const js = ts.transpileModule(readFileSync(abs, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const mod = { exports: {} };
  cache.set(abs, mod);
  const localRequire = (spec) => {
    if (spec.startsWith(".")) {
      const base = path.resolve(path.dirname(abs), spec);
      const hit = [".ts", ".tsx", "/index.ts"].map((ext) => base + ext).find(existsSync);
      if (hit) return loadTs(hit);
    }
    return nodeRequire(spec);
  };
  new Function("require", "module", "exports", js)(localRequire, mod, mod.exports);
  return mod.exports;
}
