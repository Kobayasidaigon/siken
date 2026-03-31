"""
500問一括生成スクリプト（Claude Code内で実行）

このスクリプトは、themes_500.jsonからテーマを読み取り、
Claude/ChatGPTに渡すプロンプトをバッチファイルとして出力します。
各バッチをAIに貼り付けて生成→保存する流れです。

使い方:
  python scripts/batch_generate.py                  # 全バッチのプロンプトを生成
  python scripts/batch_generate.py --batch 1         # バッチ1だけ出力
  python scripts/batch_generate.py --status           # 生成状況を確認
"""

import json
import os
import sys
import argparse
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
THEMES_FILE = SCRIPT_DIR / "themes_500.json"
OUTPUT_DIR = SCRIPT_DIR.parent / "src" / "content" / "questions"
PROMPTS_DIR = SCRIPT_DIR / "prompts"
BATCH_SIZE = 10


def load_themes():
    with open(THEMES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def get_existing():
    if not OUTPUT_DIR.exists():
        return set()
    return set(f.stem for f in OUTPUT_DIR.glob("0-*.md"))


def build_batch_prompt(questions):
    """バッチ用のプロンプトを生成"""
    q_list = "\n".join([
        f"問{q['number']}: {q['field']} / {q['theme']} / 難易度{q['difficulty']}"
        for q in questions
    ])

    return f"""あなたは貸金業務取扱主任者試験に精通したベテラン講師です。
以下の{len(questions)}問について、オリジナルの練習問題と解説を作成してください。

※ 既存の過去問をコピーしないこと。問題文・選択肢は完全オリジナルで作成。
※ 各問題は必ず以下のMarkdownフロントマター形式で出力。
※ 問題間は空行で区切ってください。

【各問題の出力形式】
---
examNumber: 0
questionNumber: （番号）
year: "オリジナル問題"
field: "（分野名）"
title: "【問（番号）】貸金業務取扱主任者 練習問題｜（テーマ）"
description: "（120文字以内）"
questionText: "（四肢択一の問題文）"
choices:
  - "（選択肢1）"
  - "（選択肢2）"
  - "（選択肢3）"
  - "（選択肢4）"
correctAnswer: （1〜4）
difficulty: "（A/B/C）"
---

## 解説

### 正解
正解は**選択肢○**です。（結論1〜2行）

### 各選択肢の解説
#### 選択肢1「要約」→ ✅ or ❌
（理由2〜3文、根拠法令）
#### 選択肢2「要約」→ ✅ or ❌
（同様）
#### 選択肢3「要約」→ ✅ or ❌
（同様）
#### 選択肢4「要約」→ ✅ or ❌
（同様）

### 背景知識
（200〜300文字、表や箇条書き活用）

### 学習アドバイス
（100〜150文字）

### まとめ
- ポイント1
- ポイント2
- ポイント3

===

【作成する{len(questions)}問】
{q_list}

全{len(questions)}問を上記の形式で出力してください。"""


def show_status():
    """生成状況を表示"""
    themes = load_themes()
    existing = get_existing()

    total = len(themes)
    done = sum(1 for t in themes if t["slug"] in existing)
    remaining = total - done

    print(f"=== 生成状況 ===")
    print(f"総問題数:   {total}")
    print(f"生成済み:   {done}")
    print(f"未生成:     {remaining}")
    print(f"進捗:       {done/total*100:.1f}%")
    print()

    # 分野別
    field_stats = {}
    for t in themes:
        f = t["field"]
        if f not in field_stats:
            field_stats[f] = {"total": 0, "done": 0}
        field_stats[f]["total"] += 1
        if t["slug"] in existing:
            field_stats[f]["done"] += 1

    for field, stats in field_stats.items():
        done_bars = stats["done"] * 20 // stats["total"]
        remaining_bars = 20 - done_bars
        bar = "#" * done_bars + "-" * remaining_bars
        print(f"  {field}: [{bar}] {stats['done']}/{stats['total']}")


def generate_prompts(batch_num=None):
    """バッチプロンプトを生成"""
    themes = load_themes()
    existing = get_existing()

    # 未生成のものだけ
    remaining = [t for t in themes if t["slug"] not in existing]

    if not remaining:
        print("All questions already generated!")
        return

    # バッチに分割
    batches = []
    for i in range(0, len(remaining), BATCH_SIZE):
        batches.append(remaining[i:i + BATCH_SIZE])

    if batch_num is not None:
        if batch_num < 1 or batch_num > len(batches):
            print(f"Error: batch number must be 1-{len(batches)}")
            return
        batches = [batches[batch_num - 1]]
        print(f"Batch {batch_num} ({len(batches[0])} questions):")
    else:
        print(f"Total batches: {len(batches)} ({len(remaining)} questions)")

    PROMPTS_DIR.mkdir(exist_ok=True)

    for i, batch in enumerate(batches):
        actual_batch_num = batch_num if batch_num else i + 1
        prompt = build_batch_prompt(batch)

        filepath = PROMPTS_DIR / f"batch_{str(actual_batch_num).zfill(3)}.txt"
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(prompt)

        print(f"  Saved: {filepath.name} (Q{batch[0]['number']}-Q{batch[-1]['number']})")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--batch", type=int, help="Specific batch number")
    parser.add_argument("--status", action="store_true", help="Show status")
    args = parser.parse_args()

    if args.status:
        show_status()
    else:
        generate_prompts(args.batch)
