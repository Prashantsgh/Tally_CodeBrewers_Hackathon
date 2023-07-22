const mongoose = require('mongoose');

const database_link = "mongodb+srv://07prashantsgh:GJi4bOzMHd2bny24@cluster0.fwlkr11.mongodb.net/?retryWrites=true&w=majority";

// Connect to mongodb database
mongoose.connect(database_link)
    .then(async function (db) {
        console.log('Global Ranking Database Successfully Connected');
        // await globalRanking.deleteMany({});
    })
    .catch(function (err) {
        console.log('Global Ranking Database Connection Error: ', err);
    })


const globalSchema = mongoose.Schema({
    username: {
        type: String
    },
    wordCount: {
        type: Number,
    }
});

const globalRanking = mongoose.model('globalRanking', globalSchema);
module.exports = globalRanking;

let global = [
    {
        username: "player1",
        wordCount: 90
    },
    {
        username: "player2",
        wordCount: 80
    },
    {
        username: "player3",
        wordCount: 85
    },
    {
        username: "player4",
        wordCount: 77
    },
    {
        username: "player5",
        wordCount: 65
    },
    {
        username: "player6",
        wordCount: 54
    },
    {
        username: "player7",
        wordCount: 50
    },
    {
        username: "player8",
        wordCount: 45
    },
    {
        username: "player9",
        wordCount: 40
    },
    {
        username: "player10",
        wordCount: 52
    }
];

// globalRanking.create(global);
