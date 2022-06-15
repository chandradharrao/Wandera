const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require("path");
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

/* Import the user model as User */
const User = require("../models/user");
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

const createAccount = async (firstname,lastname,email,dob,username,password) => {   
    const user_by_email = await User.findOne({email});
    const user_by_password = await User.findOne({username});

    if (!user_by_email && !user_by_password){
        const hashedPassword = bcrypt.hashSync(password,12);
        const aUser = await User.create({
            dob:dob,
            email:email,
            password:hashedPassword,
            username:username,
            last_name:lastname,
            first_name:firstname
        });
        return aUser;
    }
    else{
        return null;
    }
}

router.post("/signup", (req, res) => {
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const {email} = req.body;
    const {dob} = req.body;
    const {username} = req.body;
    const {password} = req.body;
    console.log(firstname+" "+lastname+" "+email+" "+dob+" "+username+" "+password)

    if (!firstname || !lastname || !email || !username) {
        res.status(404).json({error : "Please fill in all the details."});
    } 
    else {
        createAccount(firstname,lastname,email,dob,username,password)
            .then((aUser)=>{
                if(aUser==null){
                    return res.status(400).json({message:"User with same email or username already found!"});
                }
                return res.status(200).json({message:aUser});
            })
            .catch(err=>{
                console.log(err);
                res.status(400).json({error:err});
            })
    }     
});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if the user has entered all given fields
    if (!username && password){
        return res.status(422).json({error:"Enter the username."});
    } else if (username && !password){
        return res.status(422).json({error:"Enter the password."});
    } else if (!username && ! password){
        return res.status(422).json({error:"Enter both the username and password."});
    }

    // If so, create the query object
    const loginDetails = {
        username:username,
        password:password
    };

    /* This promise returns the user with the entered username, if found (data not empty) */
    User.findOne({username: loginDetails.username})
    .then((foundData) => {
        console.log(`Looking for the user, ${loginDetails.username} in database...`);
        // Compare the password entered with that in the database
        if (foundData) {
            console.log("User with this email exists in the database.");

            /* This promise waits to get the result of 
            the compare boolean and then executes async */
            bcrypt.compare(loginDetails.password, foundData.password)
            .then((doesMatch) => {
                
                // If the password entered matches the one in the database
                if(doesMatch) {
                    console.log("Success! Redirecting to user dashboard...");
                    
                    /* JWT used to verify/authenticate users and identify them.
                    Has details unlike session IDs that would have the reference
                    to the details stored in the server reducing the load.
                    They are signed to prevent users from manipulating.
                    We use JWT so that users can access only their feed 
                    or posts(protected resources) and not others. */

                    // Replace the id of the database with the signed token
                    const token = JWT.sign({_id: foundData._id}, CONSTS.JWT_SECRET);    

                    /* This is the token given to the user upon logging in successfully,
                    this will be used to keep track of the user and allow him to access protected resources */
                    res.json({token : token, user : {
                        name: foundData.first_name + ' ' + foundData.last_name,
                        email: foundData.email,
                        _id: foundData._id,
                        followers: foundData.followers,
                        following: foundData.following,
                        username: foundData.username,
                        pic: foundData.profile_pic
                    }});
                    return; 
                } else {
                    console.log("Your username and password didn't match!");
                    return res.status(422).json({message: "Your username and password didn't match"})
                }
            })
            .catch((err) => {
                console.log(err);
            })
        } else {
            console.log("User login information not found in the database.");
            res.status(404).json({
                error: 'This account does not exist. Please sign up to create an account.'
            });
        }
    })
    .catch((err)=>{
        console.log(err);
    })
});

router.put('/updatepic', login_authorize, (req,res)=>{
    User.findByIdAndUpdate(req.user._id,
        {$set: {profile_pic: req.body.photo}}, {new:true},
        (err,result) => {
         if(err) {
             return res.status(422).json({error:"Profile picture could not be posted."})
         }
         res.json(result)
    })
})

router.post('/logout',(req,res)=>{
    req.user = '';
    if(!req.user){
        return res.status(200).json({message:"You have been logged out!"});
    }
    return res.status(422).json({error:"Not able to log out"});
});

module.exports = router;