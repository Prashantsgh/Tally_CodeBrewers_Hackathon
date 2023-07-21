const fs = require('fs');
let words;

fs.readFile('./Public/words.txt','utf8', function(err,data) {
    words = data.toString().split(' ');
});

module.exports.getString = function getString(){
    let sentence = "", cnt=0;
    while(cnt<60){
        let val = parseInt(Math.random()*words.length);
        sentence += " "+ words[val].toLowerCase();
        cnt++;
    }

    return sentence.trim();
}

module.exports.generateString = function generateString(req,res){
    let sentence = module.exports.getString();
    res.send({
        "Data": sentence
    });
}


