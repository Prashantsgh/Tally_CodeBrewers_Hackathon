let lobbyDetails;
let playerid = new URLSearchParams(window.location.search).get("username");
let showGlobalRanking = document.getElementById('showGlobalRanking');
let stats = document.getElementById('stats');
let socket = io("http://localhost:3000");

console.log(playerid);

// For Loading Leaderboard and Site Data
document.addEventListener("DOMContentLoaded", function () {
    try {
        // Fetching Global Data
        fetch("http://localhost:3000/globaldata", {
            method: "GET",
        })
        .then((res)=>{
            return res.json();
        })
        .then((res)=>{
            res = res.sort(function (a, b) {
                return b.wordCount - a.wordCount;
            });
            for (let i = 0; i < res.length; i++) {
                showGlobalRanking.innerHTML += `<p style="border-radius: 10px; padding: 5px; margin: 5px; color:white; background-color: #394344;">${res[i].username}: &nbsp;&nbsp;&nbsp;&nbsp;${res[i].wordCount} wpm</p>`
            }
        });

        // Fetching Sites Stats
        fetch("http://localhost:3000/stats", {
            method: "GET",
        })
        .then((res)=>{
            return res.json();
        })
        .then((res)=>{
            stats.innerHTML = `<p>Games Played: ${res.gamesPlayed}</p><p>Words Typed: ${res.wordCount}</p><p>Accuracy: ${res.avgAccuracy}%</p><p>WPM: ${res.avgSpeed}</p>`;
        });

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

    // Showing Live Rankings
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

    // Showing Final Leaderboard
    socket.on("Result", (scores) => {
        $("#ranking-heading").text("Final Leaderboard");
        $("#players").html("");

        let temp = [];
        for (let item in scores) {
            if(scores[item].words){
                temp[temp.length] = [item, scores[item].words, scores[item].score];
            }
        }

        temp = temp.sort(function (a, b) {
            if (b[1] === a[1]) {
                return b[2] - a[2];
            }
            return b[1] - a[1];
        });

        for (let i = 0; i < temp.length; i++) {
            $("#players").append(`<div class="player text-center"><span>${temp[i][0]} &nbsp;&nbsp;</span>  <span>&nbsp;&nbsp;${temp[i][1]} wpm&nbsp;&nbsp;</span> <span>&nbsp;&nbsp;${temp[i][2]}%</span></div>`);
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
