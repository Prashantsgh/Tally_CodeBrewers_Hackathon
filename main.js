let timer = document.getElementById('timer'); // select the input
let counter = document.getElementById('counter'); // show the timer
let text = document.getElementById('text'); // show the text
let selectedTimer = 60 // timer selected by user default is 60
let startTimer = false; // true after starting time
let id; // for setInterval


timer.onchange = function (e) {
    selectedTimer = e.target.value;
    counter.innerHTML = `<div class="number">
                            <p>${e.target.value}s</p>
                        </div>
                        `
};

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
            console.log("completed");
            clearInterval(id);
        }, stop * 1000);
    }
}

text.onkeyup = function (e) {
    start(); // called only once
}



function restart() {
    clearInterval(id);
    startTimer = false;
    timer.disabled = false;
    selectedTimer = 60;
    timer.value = 60;
    counter.innerHTML = `<div class="number">
                            <p>60s</p>
                        </div>
                        `;
}

