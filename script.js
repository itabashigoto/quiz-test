console.log("script.js 読み込みOK");

const quizzes = [
  { question: "JavaScriptはどこで動く？", choices: ["冷蔵庫","ブラウザ","洗濯機"], correct:1 },
  { question: "HTMLは何の略？", choices:["Hyper Text Markup Language","High Text Machine Language","Hyper Tool Multi Language"], correct:0 },
  { question: "CSSで文字色を変えるのは？", choices:["font-color","text-color","color"], correct:2 },
  { question: "JavaScriptの配列は？", choices:["{}","[]","()"], correct:1 },
  { question: "最初のインデックス番号は？", choices:["1","0","-1"], correct:1 }
];

let shuffledQuizzes=[], currentQuiz=0, score=0;
let selectedChoice=null, answered=false;

const titleScreen=document.getElementById("titleScreen");
const charScreen=document.getElementById("charScreen"); // キャラクター画面
const quizScreen=document.getElementById("quizScreen");
const resultScreen=document.getElementById("resultScreen");

const progress=document.getElementById("progress");
const question=document.getElementById("question");
const resultText=document.getElementById("result");

const confirmBtn=document.getElementById("confirmBtn");
const nextBtn=document.getElementById("nextBtn");

const bgmQuiz=document.getElementById("bgmQuiz");
const bgmResult=document.getElementById("bgmResult");
const seCorrect=document.getElementById("se-correct");
const seWrong=document.getElementById("se-wrong");

const bgmVolume=document.getElementById("bgmVolume");
const seVolume=document.getElementById("seVolume");

/* 初期化 */
function init(){
  titleScreen.style.display="flex";
  if(charScreen) charScreen.style.display="none";
  quizScreen.style.display="none";
  resultScreen.style.display="none";
  confirmBtn.style.display="none";
  nextBtn.style.display="none";
  bgmQuiz.volume=bgmVolume.value;
  bgmResult.volume=bgmVolume.value;
  seCorrect.volume=seVolume.value;
  seWrong.volume=seVolume.value;
}
init();

/* 音量スライダー連動 */
bgmVolume.addEventListener("input", ()=>{ bgmQuiz.volume=bgmVolume.value; bgmResult.volume=bgmVolume.value; });
seVolume.addEventListener("input", ()=>{ seCorrect.volume=seVolume.value; seWrong.volume=seVolume.value; });

function shuffle(array){ return array.sort(()=>Math.random()-0.5); }

function resetUI(){
  confirmBtn.style.display="none";
  nextBtn.style.display="none";
  resultText.textContent="";
  selectedChoice=null;
  answered=false;
  for(let i=0;i<3;i++){ document.getElementById(`btn${i}`).className=""; }
}

/* ゲーム開始 */
function startGame(){
  resetUI();
  bgmResult.pause(); bgmResult.currentTime=0;
  bgmQuiz.currentTime=0; bgmQuiz.play();
  shuffledQuizzes=shuffle([...quizzes]);
  currentQuiz=0; score=0;
  titleScreen.classList.add("fade-out");

  setTimeout(()=>{
    titleScreen.style.display="none";

    // キャラクター画面を2秒表示
    if(charScreen){
      charScreen.style.display="flex";
      setTimeout(()=>{
        charScreen.style.display="none";
        quizScreen.style.display="block";
        quizScreen.classList.add("fade-in");
        showQuiz();
      },2000);
    } else {
      quizScreen.style.display="block";
      quizScreen.classList.add("fade-in");
      showQuiz();
    }
  },800);
}

/* 問題表示 */
function showQuiz(){
  resetUI();
  const quiz=shuffledQuizzes[currentQuiz];
  const labels=["A","B","C"];
  progress.textContent=`問題 ${currentQuiz+1} / ${shuffledQuizzes.length}`;
  question.textContent=quiz.question;
  quiz.choices.forEach((choice,i)=>{ 
    const btn = document.getElementById(`btn${i}`);
    btn.textContent=`${labels[i]}. ${choice}`;
    btn.onclick = ()=> selectChoice(i);
  });
}

/* 選択 */
function selectChoice(choiceNumber){
  if(answered) return;
  selectedChoice = choiceNumber;
  for(let i=0;i<3;i++){ document.getElementById(`btn${i}`).classList.remove("selected"); }
  document.getElementById(`btn${choiceNumber}`).classList.add("selected");
  confirmBtn.style.display="inline"; // 確認ボタンを表示
}

/* 判定（確認ボタンで呼ぶ） */
function confirmAnswer(){
  if(selectedChoice===null || answered) return;
  judgeAnswer();
}

function judgeAnswer(){
  answered=true;
  const quiz=shuffledQuizzes[currentQuiz];
  quiz.choices.forEach((_,i)=>{
    const btn=document.getElementById(`btn${i}`);
    if(i===quiz.correct) btn.classList.add("correct");
    if(i===selectedChoice && i!==quiz.correct) btn.classList.add("wrong");
  });
  if(selectedChoice===quiz.correct){
    resultText.textContent="正解！🎉"; seCorrect.currentTime=0; seCorrect.play(); score++;
  } else {
    resultText.textContent="不正解…"; seWrong.currentTime=0; seWrong.play();
  }
  confirmBtn.style.display="none"; 
  nextBtn.style.display="inline"; // 判定後に次へ
}

/* 次へ */
function nextQuiz(){
  currentQuiz++;
  if(currentQuiz<shuffledQuizzes.length){ showQuiz(); }else{ showResult(); }
}

/* 結果表示 */
function showResult(){
  quizScreen.style.display="none";
  resultScreen.style.display="block";
  bgmQuiz.pause(); bgmResult.currentTime=0; bgmResult.play();
  document.getElementById("finalScore").textContent=`${shuffledQuizzes.length}問中 ${score}問正解！`;
  let comment="";
  if(score===5) comment="完璧！プロレベル 🎉";
  else if(score>=3) comment="なかなか良いですね 👍";
  else comment="もう一度挑戦してみよう 💪";
  document.getElementById("comment").textContent=comment;
}

/* リトライ */
function retryQuiz(){
  bgmResult.pause(); bgmResult.currentTime=0;
  titleScreen.style.display="flex"; titleScreen.classList.remove("fade-out");
  quizScreen.style.display="none"; resultScreen.style.display="none";
  resetUI();
}

