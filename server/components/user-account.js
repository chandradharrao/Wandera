const express = require('express');
const router = express.Router();
const path = require("path");
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const CONSTS = require('./constants');
const login_authorize = require('../middleware/login-authorize');

//importing the user model as User
const User = require('../models/wanderer');
const mongoose = require('mongoose');

//router for accessing proteted resource like his feed
router.get('/protected',login_authorize,(req,res)=>{//this route has to pass through the middle wear
    res.json({message:"Hi user!This is your home page!"});
})

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

router.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,"../client","/common/login.html"))
});

router.post("/signup-info", (req, res) => {
    var firstname = req.body.fname;
    var lastname = req.body.lname;
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body.confirm_password;
    var username = req.body.username;

    if (!firstname || !lastname || !email || !username) {
        res.status(422).json({error : "Please fill in all the details."});
    }
    else if(password!=confirmPassword){
        res.status(422).json({error : "Passwords Do not match."});
    } 
    else {
        //check if email already exists
        User.findOne({email:email},(err,data)=>{
            if(err){
                return res.json({error:err});
            }
            if(!data){
                console.log("No user with this email till now");

                //check if user name aleady exists
                User.findOne({username:username},(err,foundUser)=>{
                    if(err){
                        return res.json({error:err});
                    }
                    if(!foundUser){
                        console.log("No user with this username till now");
                        //hashing the password before saving
                        bcrypt.hash(password,12).then(hashedPassword=>{
                            //create the new user obj and save it simultaneously to the WandereCollection and returns a promise since its async
                            User.create({
                                email:email,
                                password:hashedPassword,
                                username:username,
                                last_name:lastname,
                                first_name:firstname
                            }).then((savedData)=>{//once its saved,the saved data is returned back
                                console.log("Data saved");
                                res.json({message : savedData});
                            }).catch(err=>{
                                console.log(err);
                            });
                        }).catch(err=>{
                            console.log(err);
                        })
                    }
                    else{
                        console.log("User with this username exists!!");
                        res.json({err:'user with this username already exists'});
                    }
                })
            }
            else{
                console.log("User with this email exists!!");
                res.json({err:'user already exists'});
                //redirect to the login page
            }
        })
    }
});

router.post('/login-info',(req,res)=>{
    const uName = req.body.username;
    const password = req.body.password;

    //check if user has entered all field
    if(!uName && password){
        return res.status(422).json({error:"Enter a username"});
    }
    else if(uName && !password){
        return res.status(422).json({error:"Enter a Password"});
    }
    else if(!uName && ! password){
        return res.status(422).json({error:"Enter both Username and password"});
    }

    //if he as then create the the query obj
    const loginDetails = {
        username:uName,
        password:password
    };

    console.log(`I am tryina find ${loginDetails.username} in the db`);

    User.findOne({username:loginDetails.username}).then((foundData)=>{//this promise returns the found data
        if(foundData){//if the found data is not empty means user already present,now we need to compare the password already in db and the password he is entering
            console.log("User with this email exists in db!");
            bcrypt.compare(loginDetails.password,foundData.password).then((doesMatch)=>{//this promise waits for getting the compare boolean and then executes async
                if(doesMatch){//if the passwords are the same
                    console.log("Redirecting to homepage...!!");
                    /* JWT will be used to verify/authenticate users and identify them.JWT have the details unlike session ids that would have the reference to the detaisls tored in the server reducing the load.They are signed to prevent users from manipulating.We use jwt so that users can access only their feed or posts(protected resources) and not others. */
                    const token = JWT.sign({_id:foundData._id},CONSTS.JWT_SECRET);//replace the id of db with the signed token
                    res.json({token : token});//this is the token gievn to the user upon logging in successfully,this will be used to keep track of the user and allow him to access protected resources
                }
                else{
                    console.log("Your username and password didnt match!");
                    return res.status(422).json({message:'Your username and password didnt match'})
                }
            }).catch((err)=>{
                console.log(err);
            })
        }
        else{
            res.json({error:'Please signup as you dont have an account yet!'});
            //signu page rediection
        }
    }).catch((err)=>{
        console.log(err);
    })
})

router.post('/logout',(req,res)=>{
    req.user = '';
    if(!req.user){
        return res.status(200).json({message:"You have been logged out!"});
    }
    return res.status(422).json({error:"Not able to log out"});
})
module.exports = router;