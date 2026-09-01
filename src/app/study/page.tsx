import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import StudyClient, { type QuestionMeta } from "./StudyClient";
import { getAllQuestions } from "@/lib/questions";
import { getAllPiiQuestions } from "@/lib/pii-questions";
import { getAllChizaiQuestions } from "@/lib/chizai-questions";
import { getAllChizai2Questions } from "@/lib/chizai2-questions";
import { getAllMynumberQuestions } from "@/lib/mynumber-questions";
import { getAllJitsumuQuestions } from "@/lib/jitsumu-questions";
import { getAllBijihouQuestions } from "@/lib/bijihou-questions";
import { getAllFukushi2Questions } from "@/lib/fukushi2-questions";
import { getAllBijimaneQuestions } from "@/lib/bijimane-questions";
import { getAllEcoQuestions } from "@/lib/eco-questions";
import { getAllBijihou2Questions } from "@/lib/bijihou2-questions";
import { getAllItpassQuestions } from "@/lib/itpass-questions";
import { getAllChintaiQuestions } from "@/lib/chintai-questions";
import type { ExamSlug } from "@/lib/study-progress";

export const metadata: Metadata = pageMetadata({
  path: "/study/",
  title: "学習履歴｜ブックマーク・間違えた問題の見直し",
  description: "シカクモンで解いた問題の正誤履歴とブックマークを表示します。間違えた問題から再挑戦したり、後で見直したい問題を整理できます。",
  // localStorage依存の個人ページ。クローラには空に見えるため index させない
  noindex: true,
});

function extractTopic(title: string): string {
  // タイトルは "【問1】貸金業務取扱主任者 練習問題｜登録の基本" のような形式
  // "｜" で区切って後半（トピック部分）を取り出す
  const parts = title.split("｜");
  if (parts.length >= 2) return parts[parts.length - 1].trim();
  return title;
}

export default async function StudyPage() {
  const [kashikin, pii, chizai, chizai2, mynumber, jitsumu, bijihou, fukushi2, bijimane, eco, bijihou2, itpass, chintai] = await Promise.all([
    getAllQuestions(),
    getAllPiiQuestions(),
    getAllChizaiQuestions(),
    getAllChizai2Questions(),
    getAllMynumberQuestions(),
    getAllJitsumuQuestions(),
    getAllBijihouQuestions(),
    getAllFukushi2Questions(),
    getAllBijimaneQuestions(),
    getAllEcoQuestions(),
    getAllBijihou2Questions(),
    getAllItpassQuestions(),
    getAllChintaiQuestions(),
  ]);

  const buildMap = (questions: { slug: string; questionNumber: number; field: string; title: string }[]): Record<string, QuestionMeta> => {
    const map: Record<string, QuestionMeta> = {};
    for (const q of questions) {
      map[q.slug] = {
        questionNumber: q.questionNumber,
        field: q.field,
        topic: extractTopic(q.title),
      };
    }
    return map;
  };

  const questionMeta: Record<ExamSlug, Record<string, QuestionMeta>> = {
    kashikin: buildMap(kashikin),
    pii: buildMap(pii),
    chizai: buildMap(chizai),
    chizai2: buildMap(chizai2),
    mynumber: buildMap(mynumber),
    jitsumu: buildMap(jitsumu),
    bijihou: buildMap(bijihou),
    fukushi2: buildMap(fukushi2),
    bijimane: buildMap(bijimane),
    eco: buildMap(eco),
    bijihou2: buildMap(bijihou2),
    itpass: buildMap(itpass),
    chintai: buildMap(chintai),
  };

  return <StudyClient questionMeta={questionMeta} />;
}
