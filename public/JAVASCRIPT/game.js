let timer = document.getElementById('timer'); // select the input
let counter = document.getElementById('counter'); // show the timer
let type = document.getElementById('type'); // show the text
let showScore = document.getElementsByClassName('showScore');
let selectedTimer = 10 // timer selected by user default is 60
let startTimer = false; // true after starting time
let id; // for setInterval
let text;
let userText = [""];
let stopeTheGame = false; // true when the timer is finished
let stop;


let words = 0;

// runs when the timer is finished
function showResult() {
    let score = 0, total = 0;
    for (let i = 0; i < userText.length; i++) {
        if (i < text.length) {
            total += text[i].length;
        }
        else break;

        for (let j = 0; j < userText[i].length; j++) {
            if (j < text[i].length && userText[i][j] === text[i][j]) {
                score++;
            }
        }
    }

    score = ((score / total) * 100);

    setTimeout(()=>{
        socket.emit("Result", lobbyDetails.lobbyid , playerid , words * (60 / selectedTimer) , score);
    }, 11000);

    showScore[0].innerText = words * (60 / selectedTimer) + " WPM";
    showScore[1].innerText = score.toFixed(2) + "%";
}


// starts the timer
function start() {
    timer = document.getElementById('timer'); // select the input
    counter = document.getElementById('counter'); // show the timer
    type = document.getElementById('type'); // show the text
    showScore = document.getElementsByClassName('showScore');

    if (!startTimer) {
        startTimer = true;
        stop = selectedTimer;
        id = setInterval(() => {
            counter.innerHTML = `<div class="number"> <p>${--stop}s</p></div>`
            $(".showScore")[0].innerText = Math.floor(60 * words/ (selectedTimer-stop)) + " WPM";
        }, 1000);

        setTimeout(() => {
            stopeTheGame = true;
            showResult();
            clearInterval(id);
        }, selectedTimer * 1000);
    }
}


// when the user types
document.addEventListener('keydown', function (e) {
    if (stopeTheGame) return;
    e.preventDefault();

    if (e.key >= 'a' && e.key <= 'z' || e.key === ' ' || e.key === 'Backspace') {
        start(); // called only once

        if (e.key === ' ') {
            // Increasing Count of word typed for every Space Pressed
            if(userText.length-1<text.length){
                if(userText[userText.length-1]==text[userText.length-1]){
                    words++;
                    socket.emit("WordCount", lobbyDetails.lobbyid, playerid, words);
                }
            }
            userText.push("");
        }
        else if (e.key === 'Backspace') {
            if (userText[userText.length - 1] !== "") {
                userText[userText.length - 1] = userText[userText.length - 1].slice(0, -1);
            }
        }
        else{
            userText[userText.length - 1] += e.key;
        }

        type.innerHTML = ``
        for (let i = 0; i < userText.length; i++) {
            for (let j = 0; j < userText[i].length; j++) {
                if (j < text[i].length && userText[i][j] === text[i][j]) {
                    type.innerHTML += `<span class="word green">
                                ${userText[i][j]}
                        </span>`
                } else {
                    type.innerHTML += `<span class="word red">
                                ${text[i][j] || userText[i][j]}
                        </span>`
                }
            }
            if (i === userText.length - 1)
                type.innerHTML += `<span class="caret"></span>`
            for (let j = userText[i].length; j < text[i].length; j++) {
                type.innerHTML += `<span class="word ${i === userText.length - 1 ? "gray" : "red"}">
                                ${text[i][j]}
                        </span>`
            }
            type.innerHTML += `<span> &nbsp; </span>`
        }
        for (let i = userText.length; i < text.length; i++) {
            for (let j = 0; j < text[i].length; j++) {
                type.innerHTML += `<span class="word gray">${text[i][j]}</span>`
            }
            type.innerHTML += `<span> &nbsp; </span>`
        }
    }
})