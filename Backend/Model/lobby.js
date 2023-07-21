const mongoose = require('mongoose');
// GJi4bOzMHd2bny24
const database_url = "mongodb+srv://07prashantsgh:GJi4bOzMHd2bny24@cluster0.fwlkr11.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(database_url)
    .then(()=>{
        console.log("Lobby Database Successfully Connected");
    })
    .catch((err)=>{
        console.log(err);
    });