const express = require('express');
const router = express.Router();
const path = require("path");
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/USERSCOLLECTION",{ useUnifiedTopology: true, useNewUrlParser: true });

//const CONSTS = require("./constants");
const wanderer = require('./models/wanderer');//importing the Wanderer model

//db.once("open",()=>{//called first time when db is opened
    //console.log("Connection established with mongoDB successfully!!");
//})

router.get('/', (req, res) => {
    res.send("<h1>Wandera HomePage</h1>");
})

router.get('/signup',(req, res) => {
    res.sendFile(path.join(__dirname, "../client", "/common/signup.html"));
});

router.post("/signup-info", (req, res) => {
    var firstname = req.body.fname;
    var lastname = req.body.lname;
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body.confirm_password;

    if (!firstname || !lastname || !email) {
        res.status(422).json({error : "Please fill in all the details."});
    }
    else if(password!=confirmPassword){
        res.status(422).json({error : "Passwords Do not match."});
    } 
    else {
        const db = mongoose.connection;//ref to db
         db.once("open",(err,resp)=>{
                console.log("Connection successfull!!" + resp);
                //query db with the email recieved
                wanderer.findOne({email:email},(err,data)=>{
                    if(err){
                        res.status(422).json({error:'Not able to search the db'});
                        throw err;
                    }
                    else if(!data){//if no wanderer found with that email
                        const newWanderer = new wanderer({
                            email:email,
                            password:password,
                            last_name:lastname,
                            first_name:firstname
                        });
                        //insert the data
                        wanderer.insertMany([newWanderer],(err,res)=>{
                            if(err){
                                res.status(422).json({error:err});
                            }
                            else{
                                res.status(200).json({result:"Saved successfully to mongodb"});
                            }
                        });
                    }
                    else{
                        res.status(422).json({error: "wanderer with that email already exists"});
                        //redirect to the login page
                    }
            })
         })
         console.log("Skipped")
         res.json({message:"Successfully posted", 
                  'Name' : (firstname + ' ' + lastname), 
         'Email Address' : email});
    }
});

module.exports = router;