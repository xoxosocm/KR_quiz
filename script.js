function startpage() {
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = ""; // 초기화

    let startMessage1 = document.createElement("h3"); 
    startMessage1.textContent = "韓国語クイズ";
    quizContainer.appendChild(startMessage1);

    let startMessage2 = document.createElement("p");
    startMessage2.textContent = "簡単なクイズで、自分の韓国語力を　　確認することができます。下のSTART　ボタンを押すとクイズが始まります。";
    quizContainer.appendChild(startMessage2);

    // 시작 버튼 생성
    const startButton = document.createElement("button");

    startButton.textContent = "START";
    startButton.id = "start_button"
    startButton.onclick = loadQuiz; // 버튼 클릭 시 loadQuiz 실행
    quizContainer.appendChild(startButton); // 시작 버튼을 quizContainer에 추가
}

document.addEventListener("DOMContentLoaded", function() {
    startpage(); // DOM이 로드된 후 startpage 실행
});

const quizData = [
    { // 1
        question: '問題１ ____の言葉の意味として最も近いものは？',
        audioText: '여기서는 <u>조용히</u> 해 주세요.',
        choices: ['少しだけ', 'ゆっくり', '静かに', '早めに'],
        answer: 2
    },
    { // 2
        question: '問題２ ____の言葉の意味として最も近いものは？',
        audioText: '숙제는 다음주<u>까지</u> 제출해 주세요.',
        choices: ['までに','に','から','には'],
        answer: 0
    },
    { // 3
        question: '問題３ ____の言葉の意味として最も近いものは？',
        audioText: '어제 감기에 걸려서 <u>학교</u>를 못 갔어.',
        choices: ['病院','薬局','学校','約束'],
        answer: 2
    },
    { // 4
        question: '問題４ ____の言葉の意味として最も近いものは？',
        audioText: '일본어는 <u>어디서</u> 배웠어요？',
        choices: ['どのぐらい','どこから','独学で','どこで'],
        answer: 3
    }
];


let currentQuiz = 0; // 현재 퀴즈 번호
let score = 0; //  맞힌 문제 수

// 텍스트를 음성으로 재생하는 함수
function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR'; // 한국어로 설정
    utterance.rate = 0.3; // 말하는 속도 조절
    speechSynthesis.speak(utterance); // 음성 재생
}

function loadQuiz(){
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = ""; // 초기화

    const currentQuizData = quizData[currentQuiz];

    // 질문 생성
    const h4 = document.createElement("h4"); 
    h4.textContent = currentQuizData.question; 
    quizContainer.appendChild(h4); 

    // 음성 재생 이미지를 추가
    const img = document.createElement("img");
    img.src = "play_icon.png";
    img.alt = "오디오 아이콘";
    img.id = "audio-icon";
    img.style.cursor = "pointer";
    quizContainer.appendChild(img); // 이미지를 퀴즈 컨테이너에 추가

    // 이미지 클릭 시 음성 재생
    img.onclick = function() {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = currentQuizData.audioText; // HTML로 변환
        const textOnly = tempDiv.textContent; // 태그 없이 텍스트만 가져오기
        speakText(textOnly); // 음성 재생
    };

    const p = document.createElement("p");
    p.id = "quiz_p";
    p.innerHTML = currentQuizData.audioText; 
    quizContainer.appendChild(p);

    
    // 선택지를 동적으로 생성
    currentQuizData.choices.forEach((choice, index) => { // choice는 현재 배열 요소
        const button = document.createElement("button"); // 버튼 생성
        button.textContent = choice; // 생성한 버튼에 하나의 배열 요소 전달
        button.classList.add("choice") // classList.add는 클래스 추가하는 메소드, choice라는 클래스 부여
        button.onclick = () => checkAnswer(index); // 버튼을 클릭하면 함수가 실행됨
        quizContainer.appendChild(button); // 만든 버튼을 퀴즈 컨테이너에 넣기
        
    });

    // subtext 요소를 생성하고 추가하는 코드는 선택지 버튼들이 생성된 후에 위치하도록 수정
    const subtext = document.createElement("div"); 
    subtext.textContent = "質問の左のアイコンをタッチして音を聞いてください。"; 
    subtext.classList.add("subtext"); // 필요한 경우 스타일을 위해 클래스 추가
    quizContainer.appendChild(subtext); // subtext를 가장 마지막에 추가
    
}
function checkAnswer(selectedIndex) {
    const indicator = document.getElementById('correct-indicator');
    const currentQuizData = quizData[currentQuiz]; // 현재 문제 가져오기

    if (selectedIndex === currentQuizData.answer) {
        score++; // 정답을 맞췄을 때 점수 증가
        indicator.textContent = 'o'; // o 표시
        indicator.style.color = '#647eda'; // 정답 시 색상
        indicator.style.fontSize = '15rem'; // 글자 크기 설정 (예: 3rem)

    } else {
        indicator.textContent = 'x'; // x 표시
        indicator.style.color = 'red'; // 오답 시 색상
        indicator.style.fontSize = '15rem'; // 글자 크기 설정 (예: 3rem)
    }

    // 애니메이션을 추가하기 위해 클래스 토글 사용
    indicator.classList.add('show');

    setTimeout(() => {
        // 애니메이션 종료 후 클래스 제거
        indicator.classList.remove('show');
        nextQuiz(); // 다음 문제로 이동
    }, 1500); // 1.5초 후 사라짐
}

    function nextQuiz() {
        currentQuiz++; // 다음 퀴즈로 이동

        if (currentQuiz < quizData.length) {
            document.getElementById("result").textContent = ""; 
            loadQuiz(); // 다음 퀴즈 로드
        } else {
            showResult(); // 결과 표시
        }
    }    

    function showResult() {
        const quizContainer = document.getElementById("quiz-container");
        const totalQuestions = quizData.length;
        const correctAnswers = score;

        let resultMessage = `<h3>あなたの韓国語力は…</h3>`;
        if (correctAnswers === totalQuestions) {
            resultMessage += `<p>100点です！素晴らしい！</p>`;
        } else {
            resultMessage += `<p>もっと頑張りましょう。</p>`;
        }
        quizContainer.innerHTML = resultMessage;
    }
loadQuiz();