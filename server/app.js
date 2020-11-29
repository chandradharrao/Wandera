const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require("body-parser");
const CONSTS = require("./constants");


require("./models/wanderer.js");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(require("./user-account"));

/* Handling connecting to MongoClient */
MongoClient.connect(CONSTS.DB_URL, CONSTS.MONGO_OPTIONS, (err, client) => {
    if (err) {
        console.log(`Error in connecting to the Mongo client. Error: ${err}`);
        return;
    } else {
        console.log(`Database created. Client: ${client}`);
    }
});

const port = process.env.PORT || CONSTS.PORT;
app.listen(port, () => {
    console.log(`Listening at port ${port}...`);
});
