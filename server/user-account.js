const express = require('express');
const router = express.Router();
const path = require("path");

//importing the user model
const User = require('./models/wanderer');
const mongoose = require('mongoose');

//connect to mongoose
mongoose.connect("mongodb://localhost:27017/usersdb",{ useUnifiedTopology: true, useNewUrlParser: true });

//since mongoose promise is deprecated,lets override it node js promise
mongoose.Promise = global.Promise;

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

        User.findOne({email:email},(err,data)=>{
            if(!data){
                console.log("No user with this email till now");
                //create the new user obj and save it simultaneously to the WandereCollection and returns a promise since its async
                User.create({
                    email:email,
                    password:password,
                    last_name:lastname,
                    first_name:firstname
                }).then((savedData)=>{//once its saved,the saved dayt is returned back
                    console.log("Data saved");
                    res.json({message : 'saved u successfully'});
                });
            }
            else{
                console.log("USer exists!!");
                res.json({err:'user already exists'});
                //redirect to the login page
            }
        })
    }
});

module.exports = router;