"""
貸金業務取扱主任者 オリジナル問題 自動生成スクリプト

使い方:
  1. 環境変数にAPIキーを設定
     export ANTHROPIC_API_KEY=sk-ant-...   (Claude API)
     または
     export OPENAI_API_KEY=sk-...          (OpenAI API)

  2. 実行
     python scripts/generate.py                    # 全問生成
     python scripts/generate.py --count 10         # 10問だけ生成
     python scripts/generate.py --field 貸金業法     # 特定分野のみ
     python scripts/generate.py --dry-run           # プロンプト確認のみ
     python scripts/generate.py --parallel 5        # 5並列で生成

  3. 生成されたファイルは src/content/questions/ に保存されます
"""

import json
import os
import sys
import time
import argparse
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

# ============================================================
# 設定
# ============================================================
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
THEMES_FILE = SCRIPT_DIR / "themes.json"
OUTPUT_DIR = PROJECT_DIR / "src" / "content" / "questions"

SYSTEM_PROMPT = """あなたは貸金業務取扱主任者試験に精通したベテラン講師であり、
試験対策の問題作成の専門家です。

以下のルールを必ず守ってください:
1. 問題文・選択肢は完全にオリジナルで作成する（既存の過去問をコピーしない）
2. 実際の試験と同レベルの法律用語・形式を使う
3. 選択肢には「もっともらしい誤り」を含め、単純すぎないようにする
4. 解説は正確な法令知識に基づく
5. 出力は指定されたMarkdown形式に厳密に従う"""


def build_prompt(question_number, field, theme, difficulty):
    """1問分の生成プロンプトを組み立てる"""
    diff_label = {"A": "易しい", "B": "標準", "C": "難しい"}[difficulty]

    return f"""以下の条件で、オリジナルの練習問題と詳細な解説記事を作成してください。

【条件】
- 問題番号: 問{question_number}
- 分野: {field}
- テーマ: {theme}
- 難易度: {difficulty}（{diff_label}）

【出力形式】
以下のフォーマットで出力してください。---で囲まれたフロントマターと、その後の解説本文です。
余計な説明は不要です。フォーマット通りに出力してください。

---
examNumber: 0
questionNumber: {question_number}
year: "オリジナル問題"
field: "{field}"
title: "【問{question_number}】貸金業務取扱主任者 練習問題｜{theme}"
description: "貸金業務取扱主任者試験対策。{theme}に関するオリジナル練習問題と詳細解説。"
questionText: "（ここに四肢択一の問題文を書く）"
choices:
  - "（選択肢1）"
  - "（選択肢2）"
  - "（選択肢3）"
  - "（選択肢4）"
correctAnswer: （正解番号を1〜4で）
difficulty: "{difficulty}"
---

## 解説

（ここから解説をMarkdownで書く。以下の構成に従うこと）

### 正解
正解は**選択肢○**です。（1〜2行で結論）

### 各選択肢の解説

#### 選択肢1「選択肢の要約」→ ✅正解 or ❌誤り
（理由を2〜3文で。根拠となる法令も記載）

#### 選択肢2「選択肢の要約」→ ✅正解 or ❌誤り
（同様）

#### 選択肢3「選択肢の要約」→ ✅正解 or ❌誤り
（同様）

#### 選択肢4「選択肢の要約」→ ✅正解 or ❌誤り
（同様）

### 背景知識
（この問題を理解するのに必要な基礎知識。表や箇条書きを活用。200〜400文字程度）

### 学習アドバイス
（この分野の重要度、効率的な覚え方、関連テーマ。100〜200文字程度）

### まとめ
- ポイント1
- ポイント2
- ポイント3
"""


# ============================================================
# API呼び出し
# ============================================================
def call_claude(prompt, system=SYSTEM_PROMPT):
    """Anthropic Claude APIを呼び出す"""
    try:
        import anthropic
    except ImportError:
        print("Error: pip install anthropic")
        sys.exit(1)

    client = anthropic.Anthropic()
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=4000,
        system=system,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text


def call_openai(prompt, system=SYSTEM_PROMPT):
    """OpenAI APIを呼び出す"""
    try:
        from openai import OpenAI
    except ImportError:
        print("Error: pip install openai")
        sys.exit(1)

    client = OpenAI()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        max_tokens=4000,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0].message.content


def get_api_func():
    """利用可能なAPIを自動検出"""
    if os.environ.get("ANTHROPIC_API_KEY"):
        print("Using: Claude API (Haiku)")
        return call_claude
    elif os.environ.get("OPENAI_API_KEY"):
        print("Using: OpenAI API (GPT-4o-mini)")
        return call_openai
    else:
        print("Error: ANTHROPIC_API_KEY or OPENAI_API_KEY を環境変数に設定してください")
        print("")
        print("  export ANTHROPIC_API_KEY=sk-ant-...")
        print("  または")
        print("  export OPENAI_API_KEY=sk-...")
        sys.exit(1)


# ============================================================
# テーマ一覧の読み込みと問題リスト生成
# ============================================================
def load_themes():
    with open(THEMES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def build_question_list(themes_data, field_filter=None):
    """テーマ一覧から全問題リストを生成"""
    questions = []
    q_num = 1

    for field in themes_data["fields"]:
        if field_filter and field["name"] != field_filter:
            continue
        for theme_info in field["themes"]:
            for i in range(theme_info["count"]):
                diff = theme_info["difficulty"][i] if i < len(theme_info["difficulty"]) else "B"
                questions.append({
                    "number": q_num,
                    "field": field["name"],
                    "theme": theme_info["theme"],
                    "difficulty": diff,
                    "slug": f"0-{str(q_num).zfill(3)}",
                })
                q_num += 1

    return questions


# ============================================================
# 生成と保存
# ============================================================
def generate_one(q, api_func, dry_run=False):
    """1問を生成してファイルに保存"""
    filepath = OUTPUT_DIR / f"{q['slug']}.md"

    # 既に存在する場合はスキップ
    if filepath.exists():
        return f"Skip (exists): {q['slug']}"

    prompt = build_prompt(q["number"], q["field"], q["theme"], q["difficulty"])

    if dry_run:
        return f"DryRun: {q['slug']} | {q['field']} / {q['theme']} / {q['difficulty']}"

    try:
        result = call_api_with_retry(api_func, prompt)

        # ファイル保存
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(result)

        return f"OK: {q['slug']} | {q['field']} / {q['theme']}"

    except Exception as e:
        return f"ERROR: {q['slug']} | {e}"


def call_api_with_retry(api_func, prompt, max_retries=3):
    """リトライ付きAPI呼び出し"""
    for attempt in range(max_retries):
        try:
            return api_func(prompt)
        except Exception as e:
            if attempt < max_retries - 1:
                wait = 2 ** (attempt + 1)
                print(f"  Retry in {wait}s... ({e})")
                time.sleep(wait)
            else:
                raise


def run(args):
    """メイン実行"""
    themes_data = load_themes()
    questions = build_question_list(themes_data, field_filter=args.field)

    print(f"Total questions: {len(questions)}")

    if args.count:
        questions = questions[:args.count]
        print(f"Generating first {args.count} questions")

    if args.dry_run:
        for q in questions:
            print(f"  {q['slug']} | {q['field']} / {q['theme']} / {q['difficulty']}")
        print(f"\nTotal: {len(questions)} questions (dry run)")
        return

    api_func = get_api_func()

    # 既存ファイルをスキップ
    existing = set(f.stem for f in OUTPUT_DIR.glob("*.md")) if OUTPUT_DIR.exists() else set()
    to_generate = [q for q in questions if q["slug"] not in existing]

    if not to_generate:
        print("All questions already generated!")
        return

    print(f"To generate: {len(to_generate)} (skipping {len(questions) - len(to_generate)} existing)")
    print(f"Parallel: {args.parallel}")
    print("")

    completed = 0
    errors = 0
    start_time = time.time()

    with ThreadPoolExecutor(max_workers=args.parallel) as executor:
        futures = {
            executor.submit(generate_one, q, api_func): q
            for q in to_generate
        }
        for future in as_completed(futures):
            result = future.result()
            completed += 1
            if "ERROR" in result:
                errors += 1

            elapsed = time.time() - start_time
            rate = completed / elapsed * 60 if elapsed > 0 else 0
            remaining = (len(to_generate) - completed) / rate if rate > 0 else 0

            print(f"[{completed}/{len(to_generate)}] {result}  ({rate:.0f}/min, ~{remaining:.0f}min left)")

    elapsed = time.time() - start_time
    print(f"\nDone! {completed} generated, {errors} errors, {elapsed:.0f}s elapsed")


# ============================================================
# CLI
# ============================================================
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="貸金業務取扱主任者 オリジナル問題自動生成")
    parser.add_argument("--count", type=int, help="生成する問題数（デフォルト: 全問）")
    parser.add_argument("--field", type=str, help="特定の分野のみ生成（例: 貸金業法）")
    parser.add_argument("--parallel", type=int, default=3, help="並列数（デフォルト: 3）")
    parser.add_argument("--dry-run", action="store_true", help="プロンプト確認のみ（API呼び出しなし）")
    args = parser.parse_args()
    run(args)
