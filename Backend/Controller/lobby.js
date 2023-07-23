const globalRanking = require('../Model/globalRanking');
const lobbyModel = require('../Model/lobby');
const statsModel = require('../Model/stats');
const {getString} = require('./getString');

const lobbies = {};                                     // To Store Details of all the Lobbies.
let active= {};                                         // To Store ID of active Lobbies.


module.exports.lobbies = lobbies;

// Function to add to a Lobby
module.exports.newLobby = async function newLobby(req, res) {
    const playerid = req.query.id;
    const mode = req.query.mode.toString().toLowerCase();
    let lobbyid = active[mode];

    if (lobbyid) {
        lobbies[lobbyid].players.push(playerid);
    }
    else {
        lobbyid = Math.floor((Math.random() * 100000)).toString();
        while(lobbies[lobbyid]){
            lobbyid = Math.floor((Math.random() * 100000)).toString();
        }

        active[mode] = lobbyid;         // Set the Lobby as Active

        lobbies[lobbyid] = {
            lobbyid,
            mode,
            status: "active",
            sentence : getString(mode),
            players: [playerid],
            scores: {},
            time: Math.floor(Date.now() / 1000)
        };

        setTimeout(() => {
            active[mode]=undefined;
            lobbies[lobbyid].status = "running";
        }, 30000);

        setTimeout(()=>{
            closeLobby(lobbyid);
        }, 120000);
    }

    res.send(lobbies[lobbyid]);
}

async function closeLobby(lobbyid){

    // Update Global Rankings
    let temp = await globalRanking.find();
    temp = temp.map((item)=>{
        return {username:item.username, wordCount:item.wordCount};
    });

    let scores = lobbies[lobbyid].scores;
    let newWords=0, newGame=0, players=0,accuracy=0;        // For Platform Stats
    for (let item in scores) {
        if(scores[item].words){
            newGame = 1;
            newWords+=scores[item].words;
            players++;
            accuracy+=scores[item].score;

            // Check if Player is already in Global Rankings then just update it
            // Else, Create a New Entry
            let flag=1;
            for(let i = 0;i<temp.length; i++){
                if(temp[i].username==item){
                    temp[i].wordCount = Math.max(temp[i].wordCount, scores[item].words);
                    flag=0;
                    break;
                }
            }
            if(flag){
                temp[temp.length] = {username: item, wordCount: scores[item].words};
            }
        }
    }

    temp = temp.sort(function (a, b) {
        return b.wordCount - a.wordCount;
    }).slice(0,10);

    await globalRanking.deleteMany({});
    await globalRanking.create(temp);

    // Updating Game Stats
    let stats = await statsModel.find();
    stats=stats[0];
    if(newGame==1){
        stats.gamesPlayed += newGame;
        stats.wordCount += newWords;
        stats.avgAccuracy = ((stats.avgAccuracy*stats.playersCount)+accuracy)/(stats.playersCount+players);
        stats.avgSpeed = ((stats.avgSpeed*stats.playersCount)+newWords)/(stats.playersCount+players);
        stats.playersCount += players;

        stats = await stats.save();
    }

    delete lobbies[lobbyid];        // Removing the Details of Lobby
    console.log(lobbies);
}