const lobbyModel = require('../Model/lobby');
const {getString} = require('./getString');

module.exports.newLobby = async function newLobby(req,res){
    const playerid = req.query.id;
    const mode = req.query.mode.toString();
    let lobby = await lobbyModel.findOne({mode , status:"active"});
    
    if(lobby){
        lobby.players.push(playerid);
        await lobby.save();
        res.send(lobby);
    }
    else{
        let lobbyid = (Math.random()*1000).toString();
        let sentence = getString();
        let tempLobby = {
            lobbyid,
            mode,
            status: "active",
            sentence,
            owner: playerid,
            players: [playerid],
            time: Date.now()
        };

        tempLobby = await lobbyModel.create(tempLobby);
        setTimeout(()=>{
            tempLobby.status = "running";
            tempLobby.save();
        },30000);

        res.send(tempLobby);
    }
}