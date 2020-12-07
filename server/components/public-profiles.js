const express = require('express');
const router = express.Router();
const path = require("path");
const url = require('url');

// Importing the user model as User
const User = require('../models/wanderer');
const Post = require('../models/post');
const mongoose = require('mongoose');

// Connect to mongoose
mongoose.connect("mongodb://localhost:27017/usersdb",{ useUnifiedTopology: true, useNewUrlParser: true });

// Since mongoose promise is deprecated, override it with NodeJS promises
mongoose.Promise = global.Promise;

//Remove deprication warnings
mongoose.set('useFindAndModify',false);

// Click on the icon in the front end
/*router.get('/viewprofile',(req, res) => {
    console.log("Called viewProfile Route" + req.params.username.toString());
    // Find the user recieved from the front end in the user db
    User.findOne({username:req.params.username}).then((foundUser)=>{
        // If user found, fetch all the posts of the user from backend and send to the front end
        Post.find({postedByID:foundUser._id,postedByUName:foundUser.username}).exec((err,postsFound)=>{
            if (err) {
                return res.status(422).json({error:err})
            }
            res.status(200).json({postedBy:foundUser,posts:postsFound});
        })
    }).catch((err) => {
        console.log(err);
        return res.status(404).json({error:"User not found"});
    })
})*/

router.get('/viewprofile',(req, res) => {
    // Find the user recieved from the front end in the user db
    User.findOne({username:req.query.username}).then((foundUser)=>{
        // If user found, fetch all the posts of the user from backend and send to the front end
        Post.find({postedByUName:foundUser.username}).exec((err,postsFound)=>{
            if (err) {
                return res.status(422).json({error:err})
            }
            res.status(200).json({postedBy:foundUser,posts:postsFound});
        })
    }).catch((err) => {
        console.log(err);
        return res.status(404).json({error:"User not found"});
    })
})

module.exports = router;