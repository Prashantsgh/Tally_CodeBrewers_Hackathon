let timer = document.getElementById('timer'); // select the input
let counter = document.getElementById('counter'); // show the timer
let type = document.getElementById('type'); // show the text
let showScore = document.getElementById('showScore');
let selectedTimer = 60 // timer selected by user default is 60
let startTimer = false; // true after starting time
let id; // for setInterval
let text = ["abc", "def", "ghi", "jkl", "mno", "pqr", "stu", "vwx", "yz"];
let userText = [""];


timer.onchange = function (e) {
    selectedTimer = e.target.value;
    counter.innerHTML = `<div class="number">
                            <p>${e.target.value}s</p>
                        </div>
                        `
};
document.addEventListener("DOMContentLoaded", async function () {
    type.innerHTML = `<div class="caret"></div>`
    for (let i = 0; i < text.length; i++) {
        for (let j = 0; j < text[i].length; j++) {
            type.innerHTML += `<span class="word gray">
                                ${text[i][j]}
                        </span>`
        }
        type.innerHTML += `<span> &nbsp; </span>`
    }
});

function start() {
    if (!startTimer) {
        timer.disabled = true;
        startTimer = true;
        let stop = selectedTimer;
        id = setInterval(() => {
            counter.innerHTML = `<div class="number">
                            <p>${--selectedTimer}s</p>
                        </div>
                        `
        }, 1000);

        setTimeout(() => {
            let score = 0, total = 0;
            for (let i = 0; i < text.length; i++) {
                total += text[i].length;
            }
            for (let i = 0; i < userText.length; i++) {
                for (let j = 0; j < userText[i].length; j++) {
                    if (j < text[i].length && userText[i][j] === text[i][j]) {
                        score++;
                    }
                }
            }
            score = ((score / total) * 100).toString();
            showScore.innerText = parseFloat(score).toFixed(2) + "%";
            clearInterval(id);
        }, stop * 1000);
    }
}

document.addEventListener('keydown', function (e) {
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
        console.log(userText)
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

function restart() {
    location.reload();
}

