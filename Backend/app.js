const express = require('express');
const cors = require('cors');
const PORT = 3000;
const {generateString} = require('./Controller/getString');
const {newLobby, lobbies} = require('./Controller/lobby');
const {addUser} = require('./Controller/addUser');
const statsModel = require('./Model/stats');
const globalRanking = require('./Model/globalRanking');
const app = express();
app.use(cors());
app.use(express.json());
app.get('/lobby', newLobby);
app.post('/create', addUser);

// For Sending Stats of The Application
app.get('/stats', async (req,res)=>{
    let stats = await statsModel.find();
    res.send(stats[0]);
});

// For Sending Global Rankings
app.get('/globaldata', async (req,res)=>{
    let rankings = await globalRanking.find();
    res.send(rankings);
});

app.get('/:mode', generateString);


// Setting up Socket Communication
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => {

    // Joining the Socket and Updating Players in the Current Lobby
    socket.on('Join', function (lobbyid) {
        socket.join(lobbyid);
        io.to(lobbyid).emit("players", lobbies[lobbyid].players);
    });

    // Updating Word Count Progress in RealTime
    socket.on('WordCount', function (lobbyid, playerid, words) {
        lobbies[lobbyid].scores[playerid] = words;
        io.to(lobbyid).emit("ranking", lobbies[lobbyid].scores);
    });

    // Updating the Results of current Lobby
    socket.on('Result', function (lobbyid, playerid, words, score) {
        lobbies[lobbyid].scores[playerid] = {words, score};
        io.to(lobbyid).emit("Result", lobbies[lobbyid].scores);

        setTimeout(()=>{
            socket.leave(lobbyid);
        }, 0);
    });

});


server.listen(PORT, () => {
    console.log("Server Listening On Port: " + PORT);
})