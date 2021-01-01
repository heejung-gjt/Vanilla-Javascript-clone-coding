const form = document.querySelector('.js-form');
const input = form.querySelector('input');
const greeting = document.querySelector('.js-greetings');
const USER_LS = 'currentUser'
const SHOWING_CN ='showing';


//localStorage에 내용이 있는지 없는지 확인
function loadName(){
    const currentUser = localStorage.getItem(USER_LS);
    if(currentUser === null){
        // is here
        askForName();


    }else{
            //is not here
            paintGreeting(currentUser);
    }
}
//localStorage 내용이 없을때
function askForName(){
    form.classList.add(SHOWING_CN);
    form.addEventListener('submit',handleSubmit);

}
//localStorage 내용이 없을때 event 기본 동작 막아준다
function handleSubmit(event){
    event.preventDefault();
    const currentValue = input.value;
    paintGreeting(currentValue);
    saveName(currentValue);

}

//localStorage 내용이 있을때
function paintGreeting(text){
    form.classList.remove(SHOWING_CN);
    greeting.classList.add(SHOWING_CN);
    greeting.innerText = `Hello ${text}`;
}
//setItem을 이용하여 localStorage에 저장한다
function saveName(text){
    localStorage.setItem(USER_LS, text);
}




function init() {
    loadName();
    
}

init();