const express = require('express');
const cors = require('cors');
const PORT = 3000;
const {generateString} = require('./Controller/getString')

const app = express();
app.use(cors());

app.get('/:mode', generateString);

app.listen(PORT, () => {
    console.log("Server Listening On Port: " + PORT);
})