// Instantiate express module
const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
// Instantiate MongoClient object
const MongoClient = require('mongodb').MongoClient;
// Import required constant values
const CONSTS = require("./constants");

//regestering the model
require("./models/wanderer.js");

app.use(bodyParser.urlencoded({
    extended:true
}));

/* Handling connecting to MongoClient */
// Check error in the initial connection
MongoClient.connect(CONSTS.DB_URL, CONSTS.MONGO_OPTIONS, (err, client) => {
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

app.get('/signup.html',(req,res)=>{
    res.sendFile(path.join(__dirname+"/signup.html"));
});

app.post("/signup-details",(req,res)=>{
    //console.log(req.body.fname);
    //console.log(req.body.lname);
    //console.log(req.body.email);
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;

    if(!firstname || !lastname || !email){
        res.json({error:"Please fill in all your details"});
    }
    res.json({message:"Successfully posted"});
})

app.listen(CONSTS.PORT, () => {
    console.log(`Listening at port ${CONSTS.PORT}.....`);
})
