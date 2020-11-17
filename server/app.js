// Instantiate express module
const express = require('express');
const app = express();
// Instantiate mongoose module
const mongoose = require('mongoose');
// Import required constant values
const CONSTS = require("./constants");


/* Handling connecting to Mongoose */
// Check error in the initial connection
mongoose.connect(CONSTS.DB_URI, CONSTS.MONGO_OPTIONS).
    catch(error => handleError(error));
// Check error after opening a connection
mongoose.connection.on('connected', () => {
    console.log("Successfully connected to Mongoose.");
})
mongoose.connection.on('error', (err) => {
    console.log(`Error in connecting to Mongoose. Error: ${err}`);
})

app.get('/', (req, res) => {
    res.send("<h1>Hello World!</h1>");
})

app.listen(CONSTS.PORT, () => {
    console.log(`Listening at port ${CONSTS.PORT}`);
})