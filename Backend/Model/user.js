const mongoose = require('mongoose');

const database_link = "mongodb+srv://07prashantsgh:GJi4bOzMHd2bny24@cluster0.fwlkr11.mongodb.net/?retryWrites=true&w=majority";

// Connect to mongodb database
mongoose.connect(database_link)
    .then(async function (db) {
        console.log('User Database Successfully Connected');
    })
    .catch(function (err) {
        console.log('User Database Connection Error: ', err);
    })


const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    wordCount: {
        type: Number,
    }
});

const Users = mongoose.model('users', userSchema);
module.exports = Users;
