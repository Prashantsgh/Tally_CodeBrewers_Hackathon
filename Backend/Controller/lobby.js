const lobbyModel = require('../Model/lobby');
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
    } else {
        let lobbyid = Math.floor((Math.random() * 100000)).toString();
        let sentence = getString();
        let tempLobby = {
            lobbyid,
            mode,
            status: "active",
            sentence,
            owner: playerid,
            players: [playerid],
            time: Math.floor(Date.now() / 1000)
        };

        tempLobby = await lobbyModel.create(tempLobby);
        setTimeout(() => {
            tempLobby.status = "running";
            tempLobby.save();
        }, 30000);

        lobbies[lobbyid] = tempLobby;
        lobbies[lobbyid].scores = {};
        res.send(tempLobby);
    }
}