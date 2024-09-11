const id_container = document.getElementById('container');
const id_testPage = document.getElementById('testPage');
const id_l1 = document.getElementById('l1');
const id_l2 = document.getElementById('l2');
const id_l3 = document.getElementById('l3');
const id_l4 = document.getElementById('l4');
const id_f1 = document.getElementById('f1');
const id_f2 = document.getElementById('f2');
const id_f3 = document.getElementById('f3');
const id_f4 = document.getElementById('f4');
const id_hL1 = document.getElementById('hL1');
const id_hL2 = document.getElementById('hL2');
const id_hL3 = document.getElementById('hL3');
const id_hL4 = document.getElementById('hL4');
const id_footerBtn = document.getElementsByClassName('footerBtn');
const id_mainCounter = document.getElementById('mainCounter');
const id_mainComboNumber = document.getElementById('mainComboNumber');
const id_mainComboText = document.getElementById('mainComboText');
const id_mainEnding = document.getElementById('mainEnding');
const id_mainFooterRate = document.getElementById('mainFooterRate');
const id_mainFooterText = document.getElementById('mainFooterText');
const id_mainFooterTextDetail = document.getElementById('mainFooterTextDetail');
const id_noteSpeed = document.getElementById('noteSpeed');
const id_myHP = document.getElementById('myHP');
const id_songTitle = document.getElementById('songTitle');

const id_escContainer = document.getElementById('escContainer');
const id_escConnectBtn = document.getElementById('escConnectBtn');
const id_escReplayBtn = document.getElementById('escReplayBtn');
const id_escSettingBtn = document.getElementById('escSettingBtn');
const id_escLobbyBtn = document.getElementById('escLobbyBtn');
const id_overContainer = document.getElementById('overContainer');
const id_gameOverReplay = document.getElementById('gameOverReplay');

const theme = document.querySelector(':root');
const styles = window.getComputedStyle(theme);

styles.getPropertyValue('--degCD');
styles.getPropertyValue('--myHPpercent');

let timer;
let timerCounter;
let noteList = [[], [], [], []];//현재 필드에 존재하는 노트(0부터)
let notelndex = [0, 0, 0, 0];//필드에 존재했던 노트 개수(0부터)
let noteCount = 0; //필드에 만들어진 노트 개수(1이 1개)
let timeCount = 10;
let comboCount = 0;
let perfectCount = 0;
let goodCount = 0;
let badCount = 0;
let missCount = 0;
let passCount = 0;
let myHP = 1000;
let esc = false;
let escMenu = 1;
let startCount = false;
let gameOver = false;
let prevLongNoteYN = [false, false, false, false]; //롱노트 존재여부
let pressLongNoteYN = [false, false, false, false]; //롱노트 진입여부
let longNoteTerm = [0, 0, 0, 0]; //롱노트 남은 박자
let longNoteTermRecode = [0, 0, 0, 0]; //롱노트 남은 박자 기록용
let longNotePanjung = ['', '', '', ''];
let longNoteStartEnd = [0, 0, 0, 0];

//////////게임 기본 설정//////
let passCountAll = 100; //전체 노트 개수
let makeSpeed = 150; //노트 생성 속도(ms)
if (sessionStorage.getItem('songNum') == 3) {
    makeSpeed = 100;
} else if (sessionStorage.getItem('songNum') == 4) {
    makeSpeed = 80;
} else if (sessionStorage.getItem('songNum') == 5) {
    makeSpeed = 60;
} else if (sessionStorage.getItem('songNum') == 6) {
    makeSpeed = 40;
}
let gameTime = makeSpeed * passCountAll;
let mujuk = false; //무적여부
let longNoteTermList = [1, 2, 4, 4]; //롱노트 기간 개수
////////////////////////////////

let noteSpeed;
if (localStorage.getItem('noteSpeed') == null) {
    localStorage.setItem('noteSpeed', 50);
    noteSpeed = localStorage.getItem('noteSpeed');
} else {
    noteSpeed = localStorage.getItem('noteSpeed');
}

class Note {
    constructor(index, line, type) {
        this.index = index;
        this.line = line;
        this.type = type;
        this.top = 0;
        this.longh;
        this.sequence = noteList[line - 1].length;
        if (line == 1 || line == 4) {
            if (type == 'sn') {
                this.color = 'whiteNote';
            } else {
                this.color = 'whiteLongNote';
            }
        } else {
            if (type == 'sn') {
                this.color = 'blueNote';
            } else {
                this.color = 'blueLongNote';
            }
        }
        //this.div = `<div class="note ${this.color}" id="${type}-${String(line)}-${String(index)}"></div>`
    }

    spanNote() {
        let temp = document.createElement('div');
        if (this.type == 'sn') {
            temp.classList.add('note');
            temp.classList.add(this.color);
        } else {
            temp.classList.add('longnote');
            temp.classList.add(this.color);
            if (this.type == 'lns') {
                temp.classList.add('start');
            } else if (this.type == 'lne') {
                temp.classList.add('end');
            }
        }

        //temp.innerHTML
        document.getElementById(`l${this.line}`).append(temp);
    }

    fallNote(speed) {
        let thisNote = document.getElementById(`l${this.line}`).children[this.sequence + 1];
        //document.getElementById("${this.type)-${String(this.line)}-${String(this.index)}');
        let dpt = 0.12 * (speed * 2 * 0.1); //10ms(단위)당 이동거리
        //thisNote.innerHTML

        //높이 설정(매 초 발동)

        this.top = this.top + dpt;
        thisNote.style.top = `${this.top}%`;

        if (this.type == 'lnm') {
            //롱노트 모양 구현
            thisNote.style.height = `${(dpt * 0.1 * makeSpeed) * 2}%`; //노트이동거리(1ms당) X 노트생성속도 = 노트가 생성될 때마다 이동한거리
            if (gameOver == false && this.sequence == 0 && check[this.line - 1] == false && pressLongNoteYN[this.line - 1] == true) {
                //롱노트가 있는데 누르지 않는 경우
                longNotePanjung[this.line - 1] = ''; '실패';
            }
        } else if (this.type == 'lns' || this.type == 'lne') {
            //롱노트 모양 구현
            thisNote.style.height = `calc(${(dpt * 0.1 * makeSpeed) * (this.term)}% +20px)`;
        }

        //실패 판정
        if (this.top > 92 + dpt * 15) {//실패(나쁨 판정 이상으로 넘어감)판정일 경우
            comboCounter('실패', '', this.type, this.line);
            this.deleteNote();
            if (this.type == 'lnm') {
                longNotePanjung[this.line - 1] = '실패';
            }
        }

        //클릭 판정
        if (gameOver == false && this.sequence == 0 && check[this.line - 1] == true) {
            //클릭 판정은 게임 중 + 우선순위 0 + 키보드 눌러질 때만 작동
            if (92 - dpt * 5 <= this.top && this.top <= 92 + dpt * 5) {//50ms
                if ((this.type == 'lns' || this.type == 'sn') || ((this.type == 'lnm' || this.type == 'lne') && longNotePanjung[this.line - 1] == '완벽')) {
                    comboCounter('완벽', '', this.type, this.line);
                    this.deleteNote();
                }
            } else if (92 - dpt * 10 <= this.top && this.top <= 92 + dpt * 10) {//100ms
                if (this.top < 95) {
                    if ((this.type == 'lns' || this.type == 'sn') || ((this.type == 'lnm' || this.type == 'lne') && longNotePanjung[this.line - 1] == '성공빠름')) {
                        comboCounter('성공', '빠름', this.type, this.line);
                        this.deleteNote();
                    }
                } else {
                    if ((this.type == 'lns' || this.type == 'sn') || ((this.type == 'lnm' || this.type == 'lne') && longNotePanjung[this.line - 1] == '성공느림')) {
                        comboCounter('성공', '느림', this.type, this.line);
                        this.deleteNote();
                    }
                }
            } else if (92 - dpt * 15 <= this.top && this.top <= 92 + dpt * 15) {//150ms
                if (this.top < 95) {
                    if ((this.type == 'lns' || this.type == 'sn') || ((this.type == 'lnm' || this.type == 'lne') && longNotePanjung[this.line - 1] == '나쁨빠름')) {
                        comboCounter('나쁨', '빠름', this.type, this.line);
                        this.deleteNote();
                    }
                } else {
                    if ((this.type == 'lns' || this.type == 'sn') || ((this.type == 'lnm' || this.type == 'lne') && longNotePanjung[this.line - 1] == '나쁨느림')) {
                        comboCounter('나쁨', '느림', this.type, this.line);
                        this.deleteNote();
                    }
                }
            }
        }
    }

    deleteNote() {
        noteList[this.line - 1].shift();//노트 리스트에서 자신 삭제
        document.getElementById(`l${this.line}`).children[1].remove();//라인 요소에서 자신 삭제(0은 빛)
        if (noteList[this.line - 1].length > 0) {//노트가 하나라도 존재하면
            for (let ii = 0; ii < noteList[this.line - 1].length; ii++) {
                noteList[this.line - 1][ii].sequence--;
            }
        }
        //document.getElementById(${this.type+String(this.index)}).style.display = 'none';
    }

    setNoteTerm(term) {
        this.term = term;
    }
}

//랜덤변수
let ranLine = 0;
let ranLine_prev = 0;
let ranLine_prevprev = 0;
/**
*setRandomLine()
*무작위로 노트가 생성될 라인을 정해주는 함수입니다.
*/;
function setRandomLine() {
    let longLine;
    if (prevLongNoteYN.includes(true)) {
        longLine = prevLongNoteYN.findIndex(yn => yn == true) + 1;//롱노트가 있는 줄
    } else {
        longLine = 0;
    }
    ranLine = Math.floor(Math.random() * (4)) + 1;

    if (sessionStorage.getItem('songNum') == 3) {
        while (ranLine == ranLine_prev || ranLine == ranLine_prevprev) {//선택될 라인은 전 라인이나 전전 라인과 같으면 안된다.
            ranLine = Math.floor(Math.random() * (4)) + 1;
        }
        //&& ranLine==ranLine_prevprev && ranLine_prev == ranLine_prevprev
        ranLine_prevprev = ranLine_prev;
        ranLine_prev = ranLine;
    }
    else if (sessionStorage.getItem('songNum') == 7) {
        while (ranLine == longLine) {//현재 선택될 라인은 전 라인과 같거나 롱노트 라인과 같으면 안된다.
            ranLine = Math.floor(Math.random() * (4)) + 1;
        }
        //억까
    }
    else {
        while (ranLine == ranLine_prev || ranLine == longLine) {//현재 선택될 라인은 전 라인과 같거나 롱노트 라인과 같으면 안된다.
            ranLine = Math.floor(Math.random() * (4)) + 1;
        }
        ranLine_prev = ranLine;
    }
    return ranLine;
}
/**
* comboCounter(panjung, fastslow,type,line)
* 콤보를 세고, 레이트를 계산해주는 함수입니다.
* 파라메터
* panjung: '완벽', '성공','나쁨', '실패'
* fastslow: '', '
*/
function comboCounter(panjung, fastslow, type, line) {
    let text = '';
    let textDetail = '';
    let color = '';
    let colorDetail = '';

    if (panjung == '완벽') {
        text = '완벽';
        color = 'rgb(238, 192, 39)';
        comboCount++;
        perfectCount++;
        myHP = myHP + 5;
    } else if (panjung == '성공') {
        text = '성공';
        color = 'rgb(39, 238, 172)';
        comboCount++;
        goodCount++;
        myHP = myHP + 1;
    } else if (panjung == '나쁨') {
        text = '나쁨';
        color = 'rgb(143, 86, 197)';
        comboCount = 0;
        badCount++;
        if (mujuk == true) {
            //무적
        } else if (type == 'sn') {
            myHP = myHP - 40;
        } else {
            myHP = myHP - 10;
        }
    } else if (panjung == '실패') {
        text = '실패';
        color = 'rgb(158, 158, 158)';
        comboCount = 0;
        missCount++;

        if (mujuk == true) {
            //무적
        } else if (type == 'sn') {
            myHP = myHP - 80;
        } else {
            myHP = myHP - 20;
        }
    }

    if (fastslow == '빠름') {
        textDetail = '빠름!';
        colorDetail = 'rgb(140, 161, 255)';
    } else if (fastslow == '느림') {
        textDetail = '느림';
        colorDetail = 'rgb(255, 140, 140)';
    }

    passCount++;

    if (type == 'lns') {
        longNotePanjung[line - 1] = panjung + fastslow;
        pressLongNoteYN[line - 1] = true;
        //noteList[line 1][0].con= true;//첫번째 lnn 활성화
    } else if (type == 'lne') {
        longNotePanjung[line - 1] = '';
        pressLongNoteYN[line - 1] = false;
        check[line - 1] = false;
    } else if (type == 'lnm') {
        //추가 효과 없음
    } else {
        check[line - 1] = false;
    }

    //COMBO
    id_mainComboNumber.style.animation = 'none';
    id_mainComboNumber.offsetWidth;
    if (comboCount != 0) {
        id_mainComboNumber.style.animation = 'entryCombo 0.2s';
        id_mainComboNumber.innerHTML = comboCount;
        id_mainComboText.innerHTML = 'COMBO';
    } else {
        id_mainComboNumber.innerHTML = '';
        id_mainComboText.innerHTML = '';
    }
    //RATE
    let rate = (((perfectCount + goodCount * 0.6 + badCount * 0.2) / passCount) * 100).toFixed(2);
    id_mainFooterRate.innerHTML = `RATE ${rate}%`
    //판정 텍스트
    id_mainFooterText.style.animation = 'none';
    id_mainFooterText.offsetWidth;
    id_mainFooterText.style.animation = 'entryFooterText 0.2s'
    id_mainFooterText.innerHTML = text;
    id_mainFooterTextDetail.innerHTML = textDetail;
    //판정 텍스트 색깔 설정
    id_mainFooterText.style.color = color;
    if (colorDetail != '') {
        id_mainFooterTextDetail.style.color = colorDetail;
    }
}

/**
* startGame()
* 3초 뒤에 메인 동작을 시작시키는 함수입니다.
*/
function startGame() {
    id_noteSpeed.innerHTML = `x${(noteSpeed * 0.1).toFixed(1)}`;// 련재 스피드 표시
    let timerCount = 100;
    id_mainCounter.innerHTML = '3';

    timerCounter = setInterval(function () {
        startCount = true;
        if (timerCount >= 3000) {
            id_mainCounter.innerHTML = '';
            startCount = false;
            startTimer();
            clearInterval(timerCounter);
        } else if (timerCount >= 2000) {
            id_mainCounter.innerHTML = '1';
        } else if (timerCount >= 1000) {
            id_mainCounter.innerHTML = '2';
        }

        timerCount = timerCount + 100;
    }, 100);//1초에 10번
}

/**
* pauseGame()
*상황에 따라 메인 동작을 중지시키는 함수입니다.
*/
function pauseGame() {
    if (startCount == true) {//카운트 중인 경우
        id_mainCounter.innerHTML = '';
        clearInterval(timerCounter);
        startCount = false;
    }
    else if (startCount == false) {//게임 중인 경우
        clearInterval(timer);
    }
}

/**
* makeNote(line, type, term)
* 노트를 파라매터로 정한 라인에 생성합니다.
*/
function makeNote(line, type, term) {
    let note = new Note(notelndex[line - 1], line, type);
    noteList[line - 1].push(note);
    note.spanNote();

    if (type == 'lns' || type == 'lne') {
        note.setNoteTerm(term);
        longNoteStartEnd[line - 1] = notelndex[line - 1]++;//롱노트 작동 방식
    }

    notelndex[line - 1];
    noteCount++;
}

/**
* startTimer()
* 메인 동작입니다.
* 노트를 만들고, 노트를 이동시킵니다.
* 체력을 계산하여 오버되었는지 검사합니다.
* 최종판단으로 점수를 산출합니다.
*/
function startTimer() {
    gameOver = false;

    timer = setInterval(function () {
        if (noteCount < passCountAll) {//정해진 개수만 생성
            if (timeCount % makeSpeed == 0) {//생성 간격마다
                let line = setRandomLine();
                if (sessionStorage.getItem('songNum') != 1 && sessionStorage.getItem('songNum') != 7) {
                    makeNote(line, 'sn');
                }
                else {
                    if (prevLongNoteYN.includes(true)) {//롱노트가 화면 내에 존재한다면
                        let line_longnote = prevLongNoteYN.findIndex(yn => yn == true) + 1;// 롱노트가 있는 라인
                        //longNoteTerm[line_longnote-1]--;
                        if (longNoteTerm[line_longnote - 1] == 0) {//롱노트가 끝나면
                            makeNote(line_longnote, 'lne', longNoteTermRecode[line_longnote - 1]);//롱노트 끝 노트 생성
                            longNoteTermRecode[line_longnote - 1] = 0;
                            prevLongNoteYN[line_longnote - 1] = false;

                            //50%확률로 롱노트 끝에 다른 줄의 노트 추가
                            let ran = Math.floor(Math.random() * (2));//0~1
                            if (ran == 1) {
                                makeNote(line, 'sn');
                            }
                        } else {
                            makeNote(line, 'sn');
                            makeNote(line_longnote, 'Inm');//롱노트 중간 노트 생성
                            longNoteTerm[line_longnote - 1]--;
                        }
                    }
                    else if (timeCount % (makeSpeed * 10) == 0 && noteCount < passCountAll - 8) {// 롱노트 생성
                        let ranTerm = Math.floor(Math.random() * (4));//0~3
                        ranTerm = longNoteTermList[ranTerm];
                        longNoteTerm[line - 1] = ranTerm; //롱노트 텀
                        longNoteTermRecode[line - 1] = ranTerm; //롱노트 텀 기록
                        prevLongNoteYN[line - 1] = true; //롱노트 존재여부
                        makeNote(line, 'Ins', ranTerm);
                    }
                    else {
                        makeNote(line, 'sn');
                    }
                }
            }
        }
        //노트 떨어트리기
        let noteListFlat = noteList.flat();
        for (let i = 0; i < noteListFlat.length; i++) {
            noteListFlat[i].fallNote(noteSpeed);
        }

        //체력세팅
        if (myHP < 0) {
            myHP = 0;
        } else if (myHP > 1000) {
            myHP = 1000;
        }
        let myHPpercent = ((myHP / 1000) * 100).toFixed(2);
        theme.style.setProperty('--myHPpercent', myHPpercent);
        if (30 < myHPpercent) {
            id_myHP.style.background = "white";
        } else if (0 < myHPpercent && myHPpercent <= 30) {
            id_myHP.style.background = "rgb(255, 36, 54)";
        } else if (myHPpercent <= 0) {
            if (gameOver == false) {//한 번만 실행
                gameOver = true;
                id_overContainer.style.transition = 'opacity 3s';
                id_overContainer.style.opacity = '1';
                setTimeout(function () {//다시하기는 나중에 뜬다
                    clearTimer();
                    id_gameOverReplay.style.opacity = '1';
                    id_overContainer.style.pointerEvents = 'all';
                }, 3000);
            }
        }

        //최종 판단
        if (passCountAll == passCount) {
            pauseGame();
            if (passCount == perfectCount) {
                id_mainEnding.innerHTML = 'PERFECT <br>COMBO';
            } else
                if (passCount == (perfectCount + goodCount)) {
                    id_mainEnding.innerHTML = "ALL<br>COMBO";
                } else {
                    id_mainEnding.innerHTML = 'CLEAR';
                }
            //alert('${passCountAll)/S{passCount)’);
            setTimeout(function () {
                id_mainEnding.style.opacity = '1';
                id_mainEnding.style.animation = 'none';
                id_mainEnding.offsetWidth;
                id_mainEnding.style.animation = 'entryEnding 0.2 s ';
                setTimeout(function () {
                    id_container.style.animation = 'none';
                    id_container.offsetWidth;
                    id_container.style.animation = 'stageClearAnimation 0.25';
                }, 200); id_mainFooterText.innerHTML = ''; id_mainFooterTextDetail.innerHTML = ''; id_mainComboNumber.innerHTML = '';
                id_mainComboText.innerHTML = '';
            }, 1500);

        }
        //1카운트 = 10ms
        timeCount = timeCount + 10;
    }, 10);
}
//게임 시작
startGame();

function clearTimer() {
    if (timer != null) {
        clearInterval(timer);
    }
    for (i = 0; i < 4; i++) {
        document.getElementById(`l${i + 1}`).innerHTML = `<div class="hitLight" id = "hL${i + 1}"></div>`;
    }
    noteList = [[], [], [], []];
    notelndex = [0, 0, 0, 0];
    noteCount = 0;
    timeCount = 10;
    comboCount = 0;
    perfectCount = 0;
    goodCount = 0;
    badCount = 0;
    missCount = 0;
    passCount = 0;
    esc = false;
    escMenu = 1;
    startCount = false;
    gameOver = false;
    prevLongNoteYN = [false, false, false, false]; //S =& ZEX|0{£
    pressLongNoteYN = [false, false, false, false]; // 2= & Q05
    longNoteTerm = [0, 0, 0, 0]; //2-E H& &xt
    longNoteTermRecode = [0, 0, 0, 0]; //8=E &g &Xt 7|28
    longNotePanjung = ['', '', '', ''];
    longNoteStartend = [0, 0, 0, 0];


    //체력 원상복구
    myHP = 1000;
    theme.style.setProperty('--myHPpercent', 100);
    id_myHP.style.background = "white";
    id_mainFooterText.innerHTML = '';
    id_mainFooterTextDetail.innerHTML = '';
    id_mainComboNumber.innerHTML = '';
    id_mainComboText.innerHTML = '';
    id_mainFooterRate.innerHTML = 'RATE 0.00%';
    id_mainEnding.style.opacity = '0';
}

//이벤트
let check = [false, false, false, false];//
let press = [false, false, false, false];//71 +20)
window.addEventListener('keydown', function (e) {
    //alert(e.keyCode); //78
    let index = 0;
    if (e.keyCode == 68) {//D
        index = 1;
    } else if (e.keyCode == 70) {//F
        index = 2;
    } else if (e.keyCode == 74) {//J
        index = 3;
    } else if (e.keyCode == 75) {//K
        index = 4;
    } else if (e.keyCode == 27) {//ESC
        if (esc == false) {
            esc = true;
            pauseGame();
            id_escContainer.style.opacity = '1';
            id_escContainer.style.pointerEvents = 'all';
            escMenu = 1;
        } else {//esc 상태에서 esc 한 번 더 누르면
            esc = false;
            id_escConnectBtn.click();
        }
    } else if (e.keyCode == 49) {//1 속도 감소
        noteSpeed--;
        if (noteSpeed < 10) {
            noteSpeed = 10;
        }
        localStorage.setItem('noteSpeed', noteSpeed);
        id_noteSpeed.innerHTML = `x${(noteSpeed * 0.1).toFixed(1)}`;
    } else if (e.keyCode == 50) {//2 속도 증가
        noteSpeed++;
        if (noteSpeed > 99) {
        }
        noteSpeed = 99;
        localStorage.setItem('noteSpeed', noteSpeed);
        id_noteSpeed.innerHTML = `x${(noteSpeed * 0.1).toFixed(1)}`;
    }

    if (index != 0) {//DFJK
        let indexArray = index - 1;
        if (check[indexArray] == false && press[indexArray] == false) {
            check[indexArray] = true;
            press[indexArray] = true;
            if (pressLongNoteYN[indexArray] != true) {//롱노트 누르는게 아니면 누르기 해제
                /*
                setTimeout(function(){
                    checkfindexArray] = false;
                },100); */
            }
            let id_line_temp = document.getElementById(`l${index}`);
            let id_footer_temp = document.getElementById(`f${index}`);
            let id_hitLight_temp = document.getElementById(`hL${index}`);
            id_line_temp.style.background = 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, rgba(238, 152, 39, 0.7))';
            id_footer_temp.style = 'border-top: solid 7px rgb(1, 54, 68); background: rgb(238, 152, 39)';
            id_hitlight_temp.style.opacity = '1';
            id_hitLight_temp.style.width = '100px'
            id_hitLight_temp.style.height = '100px';
        }
    }
    //esc
    if (esc == true) {
        if (e.keyCode == 13) { //Enter
            document.getElementById('escBtnBox').children[escMenu - 1].classList.toggle('escBtnSelect');//현재 메뉴 스타일 삭제
            document.getElementById('escBtnBox').children[0].classListadd('escBtnSelect');//첫번째 선택으로 초기화
            if (escMenu == 1) { //이어하기
                id_escConnectBtn.click();
            } else if (escMenu == 2) { //재시작
                id_escReplayBtn.click();
            } else if (escMenu == 3) { //환경설정
                id_escSettingBtn.click()
            } else if (escMenu == 4) { //메인화면으로
                id_escLobbyBtn.click();
            }
        } else if (e.keyCode == 40) { //아래
            let escMenuDown = escMenu + 1; //아래 자식 요소로
            if (escMenuDown > 4) {
                escMenuDown = 1; //넘으면 초기화
            }
            document.getElementById('escBtnBox').children[escMenu - 1].classList.toggle('escBtnSelect');//이전 메뉴 삭제
            document.getElementById('escBtnBox').children[escMenuDown - 1].classList.toggle('escBtnSelect');//다음 메뉴 획득
            escMenu = escMenuDown;
        } else if (e.keyCode == 38) { //9
            let escMenuDown = escMenu - 1; //아래 자식 요소로
            if (escMenuDown < 1) {
                escMenuDown = 4; //넘으면 초기화
            }
            document.getElementById('escBtnBox').children[escMenu - 1].classList.toggle('escBtnSelect');//이전 메뉴 삭제
            document.getElementById('escBtnBox').children[escMenuDown - 1].classList.toggle('escBtnSelect');//다음 메뉴 획득
            escMenu = escMenuDown;
        }

    } if (gameOver == true && id_gameOverReplay.style.opacity == '1') {
        if (e.keyCode == 13) { //Enter
            id_gameOverReplay.click();
        }
    }
});
window.addEventListener('keyup', function (e) {
    let index = 0;
    if (e.keyCode == 68) { //D
        index = 1;
    } else if (e.keyCode == 70) { //F
        index = 2;
    } else if (e.keyCode == 74) { //)
        index = 3;
    } else if (e.keyCode == 75) { //K
        index = 4;
    }
    if (index != 0) {
        check[index - 1] = false;
        press[index - 1] = false;
        let id_line_temp = document.getElementById(`l${index}`);
        let id_footer_temp = document.getElementById(`f${index}`);
        let id_hitLight_temp = document.getElementById(`hL${index}`);
        id_line_temp.style.background = 'rgb(0,0,0,0)';
        id_footer_temp.style = 'border-top: solid 3px rgb(51, 54, 68); background: rgb(197, 197, 207);';
        id_hitLight_temp.style.opacity = '0'
        id_hitLight_temp.style.width = '50px';
        id_hitLight_temp.style.height = '50px';
    }
});
//ESC 이어하기
id_escConnectBtn.addEventListener('click', function () {
    id_escContainer.style.opacity = '0'
    id_escContainer.style.pointerEvents = 'none';
    esc = false;

    startGame();
});
//ESC 재시작
id_escReplayBtn.addEventListener('click', function () {
    id_escContainer.style.opacity = '0';
    id_escContainer.style.pointerEvents = 'none';
    esc = false;

    clearTimer();
    startGame();
});
//ESC 환경설정
id_escSettingBtn.addEventListener('click', function () {
    id_escContainer.style.opacity = '0'
    id_escContainer.style.pointerEvents = 'none';
    esc = false;

    clearTimer();
    startGame();
});
// ESC 메인화면으로
id_escLobbyBtn.addEventListener('click', function () {
    id_escContainer.style.opacity = '0';
    id_escContainer.style.pointerEvents = 'none';
    esc = false;

    clearTimer();
    location.href = "../html/lobby.html";
});
//게임오버 다시하기
id_gameOverReplay.addEventListener('click',
    function () {
        id_overContainer.style.transition = 'none';
        id_overContainer.style.opacity = '0'
        id_gameOverReplay.style.opacity = '0'
        id_overContainer.style.pointerEvents = 'none';

        startGame();
    });
//CD돌리기
let degCD = 0;
let timerCD = setInterval(function () {
    degCD = degCD + 2;
    if(degCD >= 360){
        degCD = 0;
    }
    theme.style.setProperty('--degCD',degCD);
}, 100);

//id_songTilte.innerHTML = songList[sessionStorage.getItem('songNum')-1][3];