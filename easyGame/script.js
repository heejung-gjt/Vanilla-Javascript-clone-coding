'use strict';
const CARROT_SIZE = 80;  
const CARROT_COUNT=10;  //당근과 벌레의 개수 변수로 설정
const BUG_COUNT = 10;
const GAME_DURATION_SEC = 15; //게임 타이머

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();/*필드의 전체적인 사이즈와 포지션까지 알 수 있다*/ 
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popUp =document.querySelector('.pop-up');
const popUpRefresh = document.querySelector('.pop-up__refresh');
const popUpText = document.querySelector('.pop-up__message');

const carrotSound = new Audio('./sound/carrot_pull.mp3');
const alertSound = new Audio('./sound/alert.wav');
const bgSound = new Audio('./sound/bg.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const winSound = new Audio('./sound/game_win.mp3');

let started = false;  //게임이 시작되었는지 아닌지 확인하는 변수
let score =0 ; //최종적인 점수
let timer = undefined; //총 얼마만의 시간이 쓰였는지


function hidePopUp(){
    popUp.classList.add('pop-up--hide');
}

//리프레쉬 버튼을 누르면 게임 다시 시작
popUpRefresh.addEventListener('click',()=>{
    startGame();
    hidePopUp();
    stopSound(winSound);
});



function updateTimerText(time){
    const minutes = Math.floor(time / 60) //정수형으로 만들어줌  ex) 65/60 = 1 , 1분이 남았다는 소리
    const seconds = time % 60; //초를 생성 ex) 5%60 = 5 , 5초가 남았다는 소리
    gameTimer.innerText=`${minutes}:${seconds}`;
}

function updateScore(){
    gameScore.innerText = CARROT_COUNT - score;
}

//filed에 있는 아이템 눌렀을때 실행되는 기능
function onFiledClick(){
    if(!started){
        return;
    }
    const target = event.target;
    if(target.matches('.carrot')){
        playSound(carrotSound);
        target.remove();
        score++;
        updateScore();
        if(score === CARROT_COUNT){
            // stopGameTimer(); finishGame에서 종료하는 것이 더 좋을 것 같음
            finishGame(true);
        }
    }else if(target.matches('.bug')){
        // stopGameTimer();  finishGame에서 종료하는 것이 더 좋을 것 같음
        finishGame(false);
    }
}
function playSound(sound){
    sound.currentTime=0;
    sound.play();
}
function stopSound(sound){
    sound.pause();
}


//field에 있는 bug와 carrot를 눌렀다면 
field.addEventListener('click',onFiledClick);

function stopGameTimer(){
    clearInterval(timer);
    hideGameButton();
}

//게임 타이머 함수
function startGameTimer(){
    let remainingTimeSec = GAME_DURATION_SEC;  //GAME_DURATION_SEC 동안 타이머 초 감소
    updateTimerText(remainingTimeSec);  //GAME_DURATION_SEC 감소시키는 함수
    timer = setInterval(()=>{      // 1초동안 진행
        if(remainingTimeSec <=0){
            clearInterval(timer);
            finishGame(CARROT_COUNT===score);
            return; //더이상 밑으로 진행되지 않게 return
        }
        updateTimerText(--remainingTimeSec); //초감소시킴
    },1000)
}

function showTimerAndScore(){
    gameTimer.style.visibility='visible';
    gameScore.style.visibility='visible';
}
function showStartButton(){
    const icon = gameBtn.querySelector('.fas');
    icon.classList.remove('fa-stop');
    icon.classList.add('fa-play'); 
    // gameTimer.style.visibility='hidden';
    // gameScore.style.visibility='hidden'; 
    // field.innerHTML='';

}

//게임 시작과 중지시 버튼의  다른 아이콘 모양 
function showStopButton(){
    const icon = gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    gameBtn.style.visibility='visible';     
}

function hideGameButton(){
    gameBtn.style.visibility='hidden'; 
}

function showPopUpWithText(text){
    popUpText.innerText=text;
    popUp.classList.remove('pop-up--hide');
    stopSound(bgSound);
}

//시작 버튼 눌렀을때 게임시작과 게임중지 함수
function startGame(){
    started=true;//started에 true -> false, false->true 로 반대로 할당되어 게임 시작 , 정지를 제어
    initGame();
    showStopButton(); // 버튼이 stop으로 보여야 한다
    showTimerAndScore(); //score와 타이머가 보여야 한다
    startGameTimer(); //게임 타이머
    playSound(bgSound);
}
function stopGame(){
    started=false;//started에 true -> false, false->true 로 반대로 할당되어 게임 시작 , 정지를 제어
    showStartButton();
    stopGameTimer();
    hideGameButton();
    showPopUpWithText('REPLAY?');
    playSound(alertSound);
    stopSound(bgSound);

}
function finishGame(win){
    started = false;
    stopGameTimer();   //당근을 전부 가져 클릭했을때 남은 시간 멈추게 한다
    hideGameButton();
    if(win){
        playSound(winSound);
    }else{
        playSound(bugSound);
    }
    showPopUpWithText(win ? 'YOU WIN !': 'YOU LOST !')

}



//시작버튼 눌렀을때
gameBtn.addEventListener('click',()=>{

    //게임이 시작되있을때 버튼누르면 게임 중지
    //게임이 시작되지 않았으면 게임 시작
    if(started){
        stopGame();
    }else{
        startGame();
    }
    // started=!started;  //started에 true -> false, false->true 로 반대로 할당되어 게임 시작 , 정지를 제어
});

//아이템 배치 랜덤으로 하기
function randomNumber(min, max){
    return Math.random() *(max - min) + min;
}

function addItem(className, count, imgPath){
    //포지션 랜덤으로 생성해서 필드에다 추가해줄것이다
    const x1 =0;
    const y1 =0;
    const x2 = fieldRect.width-CARROT_SIZE;
    const y2 = fieldRect.height-CARROT_SIZE;  //x1 ~ x2  y1~ y2 각각의 범위 안에서 랜덤한 숫자를 만들면 된다
    for (let i =0 ;i<count; i++){
        const item = document.createElement('img');  // img 태그를 이용해서 
        item.setAttribute('class',className);  // class이름이 className인 img 태그를 count개수만큼 만들것이다
        item.setAttribute('src',imgPath);
        item.style.position='absolute';
        const x = randomNumber(x1, x2);
        const y = randomNumber(y1, y2);
        item.style.left=`${x}px`;
        item.style.top=`${y}px`;
        field.appendChild(item);
    }
}

//게임 시작 initGame() 아이템 생성함수 호출
function initGame(){
    score=0;
    //벌레와 당근을 생성한 뒤 field에 추가해준다
    field.innerHTML=''; //아이템들이 생성되는 field를 호출시 항상 먼저 비어주고 시작 (새로운 시작)
    gameScore.innerText = CARROT_COUNT; //score에는 당근의 남은 개수가 나와야 한다
    addItem('carrot',CARROT_COUNT,'img/carrot.png');
    addItem('bug',BUG_COUNT,'img/bug.png');
}