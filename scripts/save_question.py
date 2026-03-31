"""
AI出力のMarkdownを問題ファイルとして保存するヘルパー

使い方:
  1. AIに問題を生成してもらう
  2. 出力をテキストファイルにコピペ（例: output.txt）
  3. python scripts/save_question.py output.txt

  または、複数問が1ファイルに入っている場合:
  python scripts/save_question.py output.txt --split

  手動で1問ずつ保存する場合:
  python scripts/save_question.py --interactive
"""

import re
import sys
import os
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent.parent / "src" / "content" / "questions"


def extract_questions(text):
    """テキストから---で区切られた複数の問題を抽出"""
    # ---で始まるフロントマターを見つける
    parts = re.split(r'\n(?=---\n(?:examNumber|questionNumber))', text)

    questions = []
    for part in parts:
        part = part.strip()
        if part.startswith('---') and 'questionNumber' in part:
            questions.append(part)
        elif '---' in part:
            # ---で囲まれたフロントマターを探す
            match = re.search(r'(---\n.*?---\n.*)', part, re.DOTALL)
            if match and 'questionNumber' in match.group(1):
                questions.append(match.group(1))

    return questions if questions else [text]


def get_slug_from_content(content):
    """フロントマターからslugを生成"""
    q_match = re.search(r'questionNumber:\s*(\d+)', content)
    if q_match:
        q_num = int(q_match.group(1))
        return f"0-{str(q_num).zfill(3)}"
    return None


def save_question(content, slug=None):
    """1問分のMarkdownを保存"""
    if slug is None:
        slug = get_slug_from_content(content)

    if slug is None:
        print("Error: questionNumber not found in content")
        return False

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    filepath = OUTPUT_DIR / f"{slug}.md"

    if filepath.exists():
        print(f"  Warning: {filepath.name} already exists, overwriting")

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

    print(f"  Saved: {filepath.name}")
    return True


def process_file(filepath, split=False):
    """ファイルを読み込んで保存"""
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()

    if split:
        questions = extract_questions(text)
        print(f"Found {len(questions)} questions in file")
        for q in questions:
            save_question(q)
    else:
        save_question(text)


def interactive_mode():
    """対話モード: 1問ずつ貼り付けて保存"""
    print("=== Interactive Mode ===")
    print("AIの出力をペーストしてください。")
    print("終了する場合は空行の後に 'done' と入力してください。")
    print("")

    while True:
        print(f"\n--- 問題を貼り付けてください（'done'で終了）---")
        lines = []
        while True:
            try:
                line = input()
            except EOFError:
                break
            if line.strip() == "done":
                break
            lines.append(line)

        if not lines:
            break

        content = "\n".join(lines)
        if content.strip():
            questions = extract_questions(content)
            for q in questions:
                save_question(q)

    # 保存済みファイル数を表示
    if OUTPUT_DIR.exists():
        count = len(list(OUTPUT_DIR.glob("*.md")))
        print(f"\nTotal files: {count}")


if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] == "--interactive":
        interactive_mode()
    else:
        filepath = sys.argv[1]
        split = "--split" in sys.argv
        process_file(filepath, split)
