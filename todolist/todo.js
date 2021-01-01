const toDoForm = document.querySelector('.js-toDoForm');
const toDoInput = toDoForm.querySelector('input');
const toDoList = document.querySelector('.js-toDoList');
const TODO_LS ='toDos';
let toDos = [];



//todo 리스트 html 삭제
function deleteToDo(event){
    const btn = event.target;
    const li =btn.parentNode;
    toDoList.removeChild(li);
//todo 리스트 localstorage삭제
    const cleanToDos = toDos.filter(function(toDo){
        return toDo.id !==parseInt(li.id); //모든 toDos가 li의 id와 같지 않을때
    }); //filter는 array의 모든 아이템을 통해 함수를 실행하고 그리고 true인 아이템들만 가지고 새로운 array를 만든다
    //cleanToDos와 filter가 하는것은 filterFn이 체크가 된 아이템들의 array를 준다
    toDos = cleanToDos;
    saveToDos();
}


//만약 localstorage에 내용이 있으면 
function loadToDos(){
    const loadedToDos = localStorage.getItem(TODO_LS);
    if(loadedToDos !== null){
        const parsedToDos = JSON.parse(loadedToDos); // string -> object로 변환해준다
        parsedToDos.forEach(function (toDo) {
            paintToDo(toDo.text);
            
        })
    }
}

//form의 내용을 엔터로 submit 하는 경우, toDoInput에 작성한 value를 paintToDo에 보내준다
function handleSubmit(event){
    event.preventDefault();
    const currentValue = toDoInput.value;
    paintToDo(currentValue);
}
//받은 내용을 li > button > span 으로 새롭게 화면에 출력해준다
function paintToDo(text){
    const li = document.createElement('li');
    const delbtn = document.createElement('button');
    const span = document.createElement('span');
    const newId = toDos.length+1;
    delbtn.innerText='❌';  //이모지 안나올 경우 html에서 <meta charset="utf-8"> 작성
    delbtn.addEventListener('click',deleteToDo);
    span.innerText=text;
    li.appendChild(delbtn);
    li.appendChild(span);
    li.id = newId;
    toDoList.appendChild(li); 
    toDoInput.value='';
    const toDoObj={
        text : text,
        id : newId
    };
    toDos.push(toDoObj);
    saveToDos();
}

function saveToDos(){
    localStorage.setItem(TODO_LS, JSON.stringify(toDos));
}


function init(){
    loadToDos();
    toDoForm.addEventListener('submit',handleSubmit);
}

init();