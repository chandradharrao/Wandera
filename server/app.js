// Instantiate express module
const express = require('express');
const app = express();
// Instantiate MongoClient object
const MongoClient = require('mongodb').MongoClient;
// Import required constant values
const CONSTS = require("./constants");


/* Handling connecting to MongoClient */
// Check error in the initial connection
MongoClient.connect(CONSTS.DB_URI, CONSTS.MONGO_OPTIONS, (err, client) => {
    if (err) {
        console.log(`Error in connecting to the Mongo client. Error: ${err}`);
        return;
    } else {
        console.log(`Database created. Client: ${client}`);
    }
});

app.get('/', (req, res) => {
    res.send("<h1>Hello World!</h1>");
})

app.listen(CONSTS.PORT, () => {
    console.log(`Listening at port ${CONSTS.PORT}`);
})