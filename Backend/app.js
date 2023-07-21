const express = require('express');
const cors = require('cors');
const PORT = 3000;
const {generateString} = require('./Controller/getString');
const {newLobby, lobbies} = require('./Controller/lobby');
const {addUser} = require('./Controller/addUser');
const app = express();
app.use(cors());
app.use(express.json());
app.get('/lobby', newLobby);
app.post('/create', addUser);
app.get('/:mode', generateString);


const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket) => {
    console.log('Client connected...');
    socket.on('Join', function (lobbyid) {
        socket.join(lobbyid);
        io.to(lobbyid).emit("players", lobbies[lobbyid].players);
    });

    socket.on('WordCount', function (lobbyid, playerid, words) {
        lobbies[lobbyid].scores[playerid] = words;
        io.to(lobbyid).emit("ranking", lobbies[lobbyid].scores);
    });

    socket.on('Result', function (lobbyid, playerid, words, score) {
        lobbies[lobbyid].scores[playerid] = {words, score};
        io.to(lobbyid).emit("Result", lobbies[lobbyid].scores);
    });
});


server.listen(PORT, () => {
    console.log("Server Listening On Port: " + PORT);
})