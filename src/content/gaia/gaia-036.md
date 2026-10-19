---
examType: "gaia"
questionNumber: 36
title: "【問36】生成AIアドバイザー 練習問題｜Transformerの自己注意と並列計算"
description: "生成AIアドバイザー認定試験対策。Transformerの自己注意と並列計算に関するオリジナル練習問題と詳細解説（○×・根拠つき）。"
field: "生成AIの基礎理解"
questionText: "次の記述は正しいか誤りか。「Transformerは自己注意（Attention）の仕組みで入力中のトークン同士の関連の強さを計算するが、RNNと同様に系列を先頭から一つずつ順に処理する必要があるため、並列計算がしにくい。」"
choices:
  - "○ 正しい"
  - "× 誤り"
correctAnswer: 2
difficulty: "B"
---

## 解説

正解は2。前半は正しく、自己注意によって入力中の各トークンが他のトークンとどれだけ関連するかを計算する。しかし後半が誤りである。RNNは前の時点の状態を使って順に処理するため並列化しにくいが、Transformerは系列全体を一括して計算でき、GPUなどで並列化しやすい。この性質が大規模な学習を可能にし、LLMの基盤となった（2017年の論文「Attention Is All You Need」）。1は誤り。前半だけを見て「正しい」と判断すると、後半の誤りを見落とす。
