const mongoose = require('mongoose');

const database_link = "mongodb+srv://07prashantsgh:GJi4bOzMHd2bny24@cluster0.fwlkr11.mongodb.net/?retryWrites=true&w=majority";

// Connect to mongodb database
mongoose.connect(database_link)
    .then(async function (db) {
        console.log('Stats Database Successfully Connected');
    })
    .catch(function (err) {
        console.log('Stats Database Connection Error: ', err);
    })


const statsSchema = mongoose.Schema({
    gamesPlayed: {
        type: Number
    },
    wordCount: {
        type: Number,
    },
    avgAccuracy: {
        type: Number
    },
    avgSpeed: {
        type: Number
    },
    playersCount:{
        type: Number
    }
});

const statsModel = mongoose.model('statsModel', statsSchema);
module.exports = statsModel;

const temp = {
    gamesPlayed: 0,
    wordCount: 0,
    avgAccuracy: 0,
    avgSpeed: 0,
    playersCount:0
};

// statsModel.create(temp);