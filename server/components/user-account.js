const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require("path");
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

/* Import the user model as User */
const User = require('../models/wanderer');
const login_authorize = require('../middleware/login-authorize');
const CONSTS = require('./constants');

/* Connect to mongoose, override depracated
 Promise with the global one */
mongoose.connect("mongodb://localhost:27017/usersdb", CONSTS.MONGO_OPTIONS);
mongoose.Promise = global.Promise;

/* Router for accessing protected resources like the main feed */
/* Requests pass through the middleware via this route */
router.get('/protected', login_authorize, (req, res) => {
    res.json({message: "Welcom back! This is your home page!"});
});

router.get('/', (req, res) => {
    res.send("<h1>Wandera HomePage</h1>");
})

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/public/index.html"));
});

router.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,"../../client/public/index.html"));
});

router.post("/signup", (req, res) => {
    var firstname = req.body.fname;
    var lastname = req.body.lname;
    var email = req.body.email;
    var dob = req.body.dob;
    var username = req.body.username;
    var password = req.body.password;

    if (!firstname || !lastname || !email || !username) {
        res.status(422).json({error : "Please fill in all the details."});
    } 
    else {
        /* Check if email is already in use */
        User.findOne({email:email},(err,data)=>{
            if(err){
                return res.json({error:err});
            }
            if(!data){
                console.log("No user with this email exists yet.");
                /* Check if user name is already in use */
                User.findOne({username:username},(err,foundUser)=>{
                    if(err){
                        return res.json({error:err});
                    }
                    if(!foundUser){
                        console.log("No user with this username till now");
                        /* Hashing the password before saving */
                        bcrypt.hash(password, 12).then(hashedPassword => {
                            /* Create the new user object, save it simultaneously to the 
                            WandererCollection and return a promise, since it's async */
                            User.create({
                                dob:dob,
                                email:email,
                                password:hashedPassword,
                                username:username,
                                last_name:lastname,
                                first_name:firstname
                            }).then((savedData) => {            // Once it's saved, the saved data is returned
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
                        console.log("Username is already in use.");
                        res.json({err:'Username is already in use.'});
                    }
                })
            }
            else{
                console.log("This email is already in use.");
                res.json({err:'Email already in use.'});
            }
            // TODO : redirect to the login page
        })
    }
});

router.post('/login',(req,res)=>{
    const uName = req.body.username;
    const password = req.body.password;

    // Check if user has entered all field
    if(!uName && password){
        return res.status(422).json({error:"Enter a username"});
    }
    else if(uName && !password){
        return res.status(422).json({error:"Enter a Password"});
    }
    else if(!uName && ! password){
        return res.status(422).json({error:"Enter both Username and password"});
    }

    // If so, create the query object
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
});

router.post('/logout',(req,res)=>{
    req.user = '';
    if(!req.user){
        return res.status(200).json({message:"You have been logged out!"});
    }
    return res.status(422).json({error:"Not able to log out"});
});

module.exports = router;