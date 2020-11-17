// Instantiate express module
const express = require('express');
const app = express();
// Instantiate mongoose module
const mongoose = require('mongoose');
// Import required constant values
const CONSTS = require("./constants");


// Connect to Mongoose
mongoose.connect(CONSTS.DB_URI);
mongoose.connection.on('connected', () => {
    console.log("Successfully connected to Mongoose.");
})
mongoose.connection.on('error', () => {
    console.log("Error in connecting to Mongoose.");
})

app.get('/', (req, res) => {
    res.send("<h1>Hello World!</h1>");
})

app.listen(CONSTS.PORT, () => {
    console.log(`Listening at port ${CONSTS.PORT}`);
})