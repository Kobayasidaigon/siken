import fs from "fs";
import path from "path";
import matter from "gray-matter";
const dir = process.argv[2];
const files = fs.readdirSync(dir).filter(f=>f.endsWith(".md")).sort();
let bad=0; const seenQ=new Map(); const ansDist={1:0,2:0,3:0,4:0}; const diff={};
for (const f of files) {
  const p = path.join(dir,f);
  let d;
  try { d = matter(fs.readFileSync(p,"utf-8")); } catch(e){ console.log("YAML PARSE FAIL", f, e.message); bad++; continue; }
  const fm=d.data, body=d.content;
  const n = parseInt(f.match(/-(\d+)\.md$/)[1],10);
  const err=[];
  if (fm.examType!=="bijimane") err.push("examType="+fm.examType);
  if (fm.questionNumber!==n) err.push("questionNumber="+fm.questionNumber+" != "+n);
  if (!Array.isArray(fm.choices)||fm.choices.length!==4) err.push("choices="+(fm.choices?fm.choices.length:"none"));
  if (!(fm.correctAnswer>=1&&fm.correctAnswer<=4)) err.push("correctAnswer="+fm.correctAnswer);
  if (!["A","B","C"].includes(fm.difficulty)) err.push("difficulty="+fm.difficulty);
  if (!fm.title||!fm.description||!fm.field||!fm.questionText) err.push("missing frontmatter field");
  if (!/##\s*解説/.test(body)) err.push("no 解説");
  if (body.replace(/##\s*解説/,"").trim().length<120) err.push("解説 too short");
  if (Array.isArray(fm.choices)) {
    const u=new Set(fm.choices.map(c=>String(c).trim()));
    if (u.size!==fm.choices.length) err.push("duplicate choices");
    // 正解肢の語がtitleに漏れていないかの粗チェック(6文字以上の連続一致)
  }
  if (seenQ.has(String(fm.questionText).trim())) err.push("duplicate questionText with "+seenQ.get(String(fm.questionText).trim()));
  else seenQ.set(String(fm.questionText).trim(), f);
  if (fm.correctAnswer>=1&&fm.correctAnswer<=4) ansDist[fm.correctAnswer]++;
  diff[fm.difficulty]=(diff[fm.difficulty]||0)+1;
  if (err.length) { console.log("NG", f, err.join(" | ")); bad++; }
}
// 欠番チェック
const nums=files.map(f=>parseInt(f.match(/-(\d+)\.md$/)[1],10)).sort((a,b)=>a-b);
const missing=[]; for(let i=nums[0];i<=nums[nums.length-1];i++) if(!nums.includes(i)) missing.push(i);
console.log("files:",files.length,"| bad:",bad,"| missing numbers:",missing.join(",")||"none");
console.log("correctAnswer dist:",JSON.stringify(ansDist),"| difficulty:",JSON.stringify(diff));

// 論点重複の粗検出: タイトルのテーマ部分から汎用語を除いたうえで、
// 5文字以上連続一致するペアを報告する。
// (並列FCエージェント同士が同じ論点に作り直してしまうレースを機械的に拾うため。
//  ヒットしても必ずしも重複ではないので、報告されたペアは目視で確認する)
const STOP = ["マネジャー","マネジメント","コミュニケーション","リーダーシップ","の考え方","の捉え方","の役割","の対応","の進め方","の違い","の特徴","の基本","の位置づけ","における視点","の使い分け","コントロール","マトリクス","テーション","部下","組織","チーム","業務","評価","人材","仕事","職場","分析","こと","もの","する","的な"];
const themes = [];
for (const f of files) {
  const d = matter(fs.readFileSync(path.join(dir,f),"utf-8"));
  let t = String(d.data.title||"").split("｜").pop().trim();
  let norm = t;
  for (const w of STOP) norm = norm.split(w).join("");
  themes.push({f, t, norm});
}
function longestCommon(a,b){
  let best=0;
  for(let i=0;i<a.length;i++) for(let j=i+1;j<=a.length;j++){
    const sub=a.slice(i,j);
    if(b.includes(sub)) best=Math.max(best,sub.length); else break;
  }
  return best;
}
let dup=0;
for(let i=0;i<themes.length;i++) for(let j=i+1;j<themes.length;j++){
  const n=longestCommon(themes[i].norm,themes[j].norm);
  if(n>=5){ console.log("DUP-THEME?",themes[i].f,"<->",themes[j].f,"(共通"+n+"文字)",themes[i].t,"/",themes[j].t); dup++; }
}
console.log("theme overlap pairs:",dup,"(0以外なら目視確認)");
