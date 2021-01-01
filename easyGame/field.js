'use strict'; //외부 파일에서 보일 수 있도록 설정

export default class Field{
    constructor(carrotCount, bugCount){
        this.carrotCount = carrotCount;
        this.bugCount = bugCount;
        this.field = document.querySelector('.game__field');
        this.fieldRect = field.getBoundingClientRect();

    }
}