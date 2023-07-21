const mongoose = require('mongoose');

const database_link = "mongodb+srv://07prashantsgh:GJi4bOzMHd2bny24@cluster0.fwlkr11.mongodb.net/?retryWrites=true&w=majority";

// Connect to mongodb database
mongoose.connect(database_link)
    .then(async function(db){
        await lobbyModel.deleteMany({});
        console.log('Lobby Database Successfully Connected');
    })
    .catch(function(err){
        console.log('Lobby Database Connection Error: ',err);
    })


const lobbySchema = mongoose.Schema({
    lobbyid: {
        type: String,
        required: true,
        unique: true
    },
    mode: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    sentence: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    players: {
        type: Array
    },
    time: {
        type: String,
        default: Date.now()
    }
});

const lobbyModel = mongoose.model('lobbyModel', lobbySchema);
module.exports = lobbyModel;

// const temp = {
//     lobbyid: "temp1",
//     mode: "easy",
//     status: "active",
//     owner: "prashant",
//     players: ["chirag", "prashant"]
// };

// lobbyModel.create(temp);
