const fs = require('fs');
let words;

fs.readFile('./Public/words.txt', 'utf8', function (err, data) {
    words = data.toString().split(' ');
});

module.exports.getString = function getString(diff = "easy") {
    let sentence = "", cnt = 0;
    while (cnt < 60) {
        let val = parseInt(Math.random() * words.length);
        let word = words[val];
        if (diff === 'medium') {
            // randomly insert numbers between the characters
            let temp = "";
            for (let i = 0; i < word.length; i++) {
                temp += word[i];
                if (Math.random() < 0.5) {
                    temp += parseInt(Math.random() * 10).toString();
                }
            }
            word = temp;
        } else if (diff === 'hard') {
            // randomly insert numbers + special characters between the characters
            let temp = "";
            let special = "!@#$%^&*()_+{}|:<>?~`";
            for (let i = 0; i < word.length; i++) {
                temp += word[i];
                let rand = Math.random();
                console.log(rand);
                if (rand < 0.1) {
                    temp += parseInt(Math.random() * 10).toString();
                } else if (rand < 0.6) {
                    temp += special[parseInt(Math.random() * special.length)];
                }
            }
            word = temp;
        }
        
        sentence += " " + word;
        cnt++;
    }
    return sentence.trim();
}

module.exports.generateString = function generateString(req, res) {
    let sentence = module.exports.getString(req.params.mode);
    res.send({
        "Data": sentence
    });
}