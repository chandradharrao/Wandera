const express = require('express');
const router = express.Router();
const path = require("path");

// Importing the user model as User
const User = require('../models/wanderer');
const Post = require('../models/post');
const mongoose = require('mongoose');

const CONSTS = require('./constants');

// Connect to mongoose
mongoose.connect("mongodb://localhost:27017/usersdb", CONSTS.MONGO_OPTIONS);

// Since mongoose promise is deprecated, override it with NodeJS promises
mongoose.Promise = global.Promise;

//Remove deprication warnings
mongoose.set('useFindAndModify',false);

// Click on the icon in the front end
router.get('/viewprofile/:username',(req, res) => {
    console.log("Called viewProfile Route");
    
    // Find the user received from the front end in the user db
    User.findOne({username: req.params.username})
    .then((foundUser) => {
        
        // If user found, fetch all the posts of the user from backend and send to the front end
        Post.find({
            postedByUName:foundUser.username
        })
        .then((postsFound) => {
            console.log(`Posts found: ${postsFound}`);
            res.status(200).json({
                userInfo: {
                    name: foundUser.first_name + ' ' + foundUser.last_name, 
                    profilePicture : foundUser.profile_pic,
                    username: foundUser.username,
                    followers: foundUser.followers,
                    following: foundUser.following,
                    about_me: foundUser.about_me
                },
                posts: postsFound
            })
        })
        .catch((err) => {
            return res.status(422).json({error:err});
        })
    })
    .catch((err) => {
        console.log(err);
        return res.status(404).json({error:"User not found"});
    })
})

module.exports = router;