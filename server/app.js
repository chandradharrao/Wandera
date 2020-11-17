// Instantiate express module
const express = require('express');
const app = express();

// Instantiate mongoose module
const mongoose = require('mongoose');

// Import required constant values
const CONSTS = require("./constants");

mongoose.connect()
app.get('/', (req, res) => {
    res.send("<h1>Hello World!</h1>");
})

app.listen(CONSTS.PORT, () => {
    console.log(`Listening at port ${CONSTS.PORT}`);
})