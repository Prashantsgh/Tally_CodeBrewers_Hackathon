let lobbyDetails;
let playerid = new URLSearchParams(window.location.search).get("username");
let showGlobalRanking = document.getElementById('showGlobalRanking');
let stats = document.getElementById('stats');
let socket = io("http://localhost:3000");

document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Fetching Global Data
        let res = await fetch("http://localhost:3000/globaldata", {
            method: "GET",
        });
        res = res.json();
        for (let i = 0; i < res.length; i++) {
            showGlobalRanking.innerHTML += `<p>${res[i].username}: ${res[i].score}</p>`
        }
        // Fetching Sites Stats
        res = await fetch("http://localhost:3000/stats", {
            method: "GET",
        });
        res = res.json();
        stats.innerHTML = `<p>Games Played: ${res.gamesPlayed}</p><p>Words Typed: ${res.wordsTyped}</p><p>Accuracy: ${res.accuracy}%</p><p>WPM: ${res.wpm}</p>`

    } catch (e) {
        console.error("Error in fetching global data: ", e);
    }
});

function singlePlayer() {
    window.open("/", "_target");
}

$("#join-lobby").click(() => {
    let mode = $('input[name="mode"]:checked').val();
    let url = `http://localhost:3000/lobby?id=${playerid}&mode=${mode}`;
    $.get(url, (data) => {
        lobbyDetails = data;
        $('body').load("lobby.html", () => {
            setupLobby();
        });
    });
});

function setupLobby() {
    socket.emit("Join", lobbyDetails.lobbyid);

    // Updating Players in Waiting Lobby
    socket.on("players", (players) => {
        lobbyDetails.players = players;
        $("#players").html("");
        for (let i = 0; i < players.length; i++) {
            $("#players").append(`<div class="player text-center">${players[i]}</div>`);
        }
    });

    socket.on("ranking", (rankings) => {
        if ($("#ranking-heading").text() === "Final Leaderboard") {
            return;
        }
        let temp = [];
        for (let item in rankings) {
            temp[temp.length] = [item, rankings[item]];
        }

        temp = temp.sort(function (a, b) {
            return b[1] - a[1];
        });

        $("#players").html("");
        for (let i = 0; i < temp.length; i++) {
            $("#players").append(`<div class="player" style="display: flex; justify-content: space-between;"> <span>${temp[i][0]}</span>  <span>${temp[i][1]} Words</span> </div>`);
        }
    });

    socket.on("Result", (scores) => {
        $("#ranking-heading").text("Final Leaderboard");
        $("#players").html("");

        let temp = [];
        for (let item in scores) {
            temp[temp.length] = [item, scores[item].words, scores[item].score];
        }

        temp = temp.sort(function (a, b) {
            if (b[1] === a[1]) {
                return b[2] - a[2];
            }
            return b[1] - a[1];
        });

        for (let i = 0; i < temp.length; i++) {
            $("#players").append(`<div class="player text-center"> <span>${temp[i][0]}</span>  <span>${temp[i][1]}</span> <span>${temp[i][2]}</span></div>`);
        }
    });


    TIME_LIMIT = lobbyDetails.time - Math.floor(Date.now() / 1000) + 30;
    setupTimer();
}

function setupGame() {
    $("#loading").attr("hidden", true);
    $("#game").attr("hidden", false);

    $("#ranking-heading").text("Progress LeaderBoard");
    $("#players").html("");

    // Ending Session if No Player Has Joined the Lobby
    // if(lobbyDetails.players.length == 1){
    //     alert("No Players Found. Closing Lobby");
    //     window.open("multiplayer.html", "_self");
    //     return;
    // }

    type = document.getElementById("type");
    text = lobbyDetails.sentence.split(" ");
    type.innerHTML = `<div class="caret"></div>`
    for (let i = 0; i < text.length; i++) {
        for (let j = 0; j < text[i].length; j++) {
            type.innerHTML += `<span class="word gray"> ${text[i][j]} </span>`
        }

        type.innerHTML += `<span> &nbsp; </span>`
    }

    setTimeout(() => {
        start();
    }, 10000);
}
