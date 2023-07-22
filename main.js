let timer = document.getElementById('timer'); // select the input
let diff = document.getElementById('diff'); // select the difficulty
let counter = document.getElementById('counter'); // show the timer
let type = document.getElementById('type'); // show the text
let showScore = document.getElementsByClassName('showScore');
let selectedTimer = 60 // timer selected by user default is 60
let startTimer = false; // true after starting time
let id; // for setInterval
let text = ["abc", "def", "ghi", "jkl", "mno", "pqr", "stu", "vwx", "yz"];
let userText = [""];
let stopeTheGame = false; // true when the timer is finished


// when the timer is changed
timer.onchange = function (e) {
    selectedTimer = e.target.value;
    counter.innerHTML = `<div class="number">
                            <p>${e.target.value}s</p>
                        </div>
                        `
};

// start the game
async function singlePlayer() {
    document.getElementById('single').disabled = true;
    document.getElementById('multi').disabled = true;
    timer.disabled = true;
    diff.disabled = true;
    let res = await fetch(`http://localhost:3000/${diff.value}`, {
        method: "GET",
    });
    text = (await res.json()).Data.split(" ");
    type.innerHTML = `<div class="caret"></div>`
    for (let i = 0; i < text.length; i++) {
        for (let j = 0; j < text[i].length; j++) {
            type.innerHTML += `<span class="word gray">
                                ${text[i][j]}
                        </span>`
        }
        type.innerHTML += `<span> &nbsp; </span>`
    }
}

// runs when the timer is finished
function calculateScore() {
    let score = 0, total = 0, wpm = 0;
    for (let i = 0; i < userText.length; i++) {
        if (i < text.length) {
            if (userText[i] === text[i]) {
                wpm++;
            }
            total += text[i].length;
        } else break;
        
        for (let j = 0; j < userText[i].length; j++) {
            if (j < text[i].length && userText[i][j] === text[i][j]) {
                score++;
            }
        }
    }
    score = ((score / total) * 100).toString();
    showScore[0].innerText = wpm * (60 / selectedTimer) + " WPM";
    showScore[1].innerText = parseFloat(score).toFixed(2) + "%";
}


// starts the timer
function start() {
    if (!startTimer) {
        startTimer = true;
        let stop = selectedTimer;
        id = setInterval(() => {
            counter.innerHTML = `<div class="number">
                            <p>${--stop}s</p>
                        </div>
                        `
        }, 1000);
        setTimeout(() => {
            stopeTheGame = true;
            calculateScore();
            clearInterval(id);
        }, selectedTimer * 1000);
    }
}


// when the user types
document.addEventListener('keydown', function (e) {
    if (stopeTheGame) return;
    if (e.key >= 'a' && e.key <= 'z' || e.key === ' ' || e.key === 'Backspace') {
        start(); // called only once
        if (e.key === ' ') {
            userText.push("");
        } else if (e.key === 'Backspace') {
            if (userText[userText.length - 1] !== "") {
                userText[userText.length - 1] = userText[userText.length - 1].slice(0, -1);
            }
        } else
            userText[userText.length - 1] += e.key;
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
                type.innerHTML += `<span class="word gray">
                                ${text[i][j]}
                        </span>`
            }
            type.innerHTML += `<span> &nbsp; </span>`
        }
    }
})


// restart the game
function restart() {
    location.reload();
}


function multiplayer() {
    window.open("http://localhost:5173/HTML/login.html", "_target");
}

