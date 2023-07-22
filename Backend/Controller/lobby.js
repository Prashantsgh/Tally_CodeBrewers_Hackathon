const globalRanking = require('../Model/globalRanking');
const lobbyModel = require('../Model/lobby');
const statsModel = require('../Model/stats');
const {getString} = require('./getString');

const lobbies = [];

module.exports.lobbies = lobbies;
module.exports.newLobby = async function newLobby(req, res) {

    const playerid = req.query.id;
    const mode = req.query.mode.toString();
    let lobby = await lobbyModel.findOne({mode, status: "active"});

    if (lobby) {
        lobby.players.push(playerid);
        await lobby.save();

        lobbies[lobby.lobbyid].players.push(playerid);
        res.send(lobby);
    }
    else {
        let lobbyid = Math.floor((Math.random() * 100000)).toString();
        while(true){
            if(lobbies[lobbyid]){
                lobbyid = Math.floor((Math.random() * 100000)).toString();
            }
            else{
                break;
            }
        }

        let sentence = getString(mode.toLowerCase());
        let tempLobby = {
            lobbyid,
            mode,
            status: "active",
            sentence,
            owner: playerid,
            players: [playerid],
            time: Math.floor(Date.now() / 1000)
        };

        lobbies[lobbyid] = tempLobby;
        lobbies[lobbyid].scores = {};

        tempLobby = await lobbyModel.create(tempLobby);
        setTimeout(() => {
            tempLobby.status = "running";
            tempLobby.save();
        }, 30000);

        setTimeout(()=>{
            closeLobby(tempLobby.lobbyid);
        }, 150000);
        res.send(tempLobby);
    }
}

async function closeLobby(lobbyid){
    let temp = await globalRanking.find();

    temp = temp.map((item)=>{
        return {username:item.username, wordCount:item.wordCount};
    });

    let scores = lobbies[lobbyid].scores;

    let newWords=0, newGame=0, players=0,accuracy=0;
    for (let item in scores) {
        if(scores[item].words){
            newGame = 1;
            newWords+=scores[item].words;
            players++;
            accuracy+=scores[item].score;

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
    stats.gamesPlayed+=newGame;
    stats.wordCount+=newWords;
    stats.avgAccuracy = ((stats.avgAccuracy*stats.playersCount)+accuracy)/(stats.playersCount+players);
    stats.avgSpeed = ((stats.avgSpeed*stats.playersCount)+newWords)/(stats.playersCount+players);
    stats.playersCount +=players;

    // await stats.save();

    lobbies[lobbyid]=undefined;
}