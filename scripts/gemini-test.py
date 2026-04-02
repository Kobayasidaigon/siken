import os
import re
import json
import time
import glob
import sys

# pip install google-generativeai
try:
    import google.generativeai as genai
except ImportError:
    print("Installing google-generativeai...")
    os.system(f"{sys.executable} -m pip install google-generativeai")
    import google.generativeai as genai

API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not API_KEY:
    print("Error: GEMINI_API_KEY not set")
    sys.exit(1)

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash-lite")

QUESTIONS_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "content", "questions")

def parse_question(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Parse frontmatter
    match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
    if not match:
        return None

    fm = match.group(1)

    def get_val(key):
        m = re.search(rf'^{key}:\s*(.+)$', fm, re.MULTILINE)
        return m.group(1).strip().strip('"') if m else ""

    # Parse choices
    choices = re.findall(r'^\s+-\s+"(.+)"', fm, re.MULTILINE)

    correct = int(get_val("correctAnswer"))
    qnum = int(get_val("questionNumber"))
    qtext = get_val("questionText")

    return {
        "number": qnum,
        "questionText": qtext,
        "choices": choices,
        "correctAnswer": correct,
        "filepath": filepath,
    }

def ask_gemini(q):
    prompt = f"""You are taking a Japanese qualification exam (貸金業務取扱主任者試験).
Read the question and choices below, then answer with ONLY the number (1, 2, 3, or 4) of the correct choice. No explanation needed.

Question: {q['questionText']}

1. {q['choices'][0]}
2. {q['choices'][1]}
3. {q['choices'][2]}
4. {q['choices'][3]}

Answer (number only):"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Extract just the number
        nums = re.findall(r'[1-4]', text)
        if nums:
            return int(nums[0])
        return None
    except Exception as e:
        return f"ERROR: {e}"

def main():
    files = sorted(glob.glob(os.path.join(QUESTIONS_DIR, "0-*.md")))
    print(f"Found {len(files)} question files")

    results = []
    mismatches = []
    errors = []

    for i, filepath in enumerate(files):
        q = parse_question(filepath)
        if not q:
            errors.append(f"Parse error: {filepath}")
            continue

        answer = ask_gemini(q)

        if isinstance(answer, str) and answer.startswith("ERROR"):
            errors.append(f"Q{q['number']}: {answer}")
            # Rate limit - wait and retry
            if "429" in answer or "quota" in answer.lower():
                print(f"  Rate limited. Waiting 60s...")
                time.sleep(60)
                answer = ask_gemini(q)
                if isinstance(answer, str) and answer.startswith("ERROR"):
                    errors.append(f"Q{q['number']}: {answer} (retry)")
                    continue
            else:
                continue

        match = answer == q['correctAnswer']
        status = "OK" if match else "MISMATCH"

        if not match:
            mismatches.append({
                "question": q['number'],
                "gemini_answer": answer,
                "correct_answer": q['correctAnswer'],
                "text": q['questionText'][:50],
            })

        results.append({"q": q['number'], "gemini": answer, "correct": q['correctAnswer'], "match": match})

        # Progress
        if (i + 1) % 20 == 0:
            print(f"  Progress: {i+1}/{len(files)} ({len(mismatches)} mismatches so far)")

        # Small delay to avoid rate limits
        time.sleep(0.5)

    # Summary
    total = len(results)
    matched = sum(1 for r in results if r['match'])

    print(f"\n{'='*50}")
    print(f"Gemini Test Results")
    print(f"{'='*50}")
    print(f"Total tested: {total}")
    print(f"Matched: {matched}")
    print(f"Mismatched: {len(mismatches)}")
    print(f"Errors: {len(errors)}")
    print(f"Accuracy: {matched/total*100:.1f}%" if total > 0 else "N/A")

    if mismatches:
        print(f"\nMismatched questions:")
        for m in mismatches:
            print(f"  Q{m['question']}: Gemini={m['gemini_answer']}, Correct={m['correct_answer']} - {m['text']}...")

    if errors:
        print(f"\nErrors:")
        for e in errors:
            print(f"  {e}")

    # Save results
    output_path = os.path.join(os.path.dirname(__file__), "gemini-results.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({"total": total, "matched": matched, "mismatches": mismatches, "errors": errors}, f, ensure_ascii=False, indent=2)
    print(f"\nResults saved to: {output_path}")

if __name__ == "__main__":
    main()
